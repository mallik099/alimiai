from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import uvicorn
from typing import Dict, Any, Optional
import socket
import re

from agent_router import BrandAgentRouter
from text_model import TextGenerationModel
from image_model import ImageGenerationModel
from intent_detector import IntentDetector
from auth_service import AuthService

app = FastAPI(title="AI Brand Agent", version="1.0.0")

cors_origins_raw = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
cors_origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (generated images)
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")
else:
    os.makedirs("static", exist_ok=True)
    app.mount("/static", StaticFiles(directory="static"), name="static")

# Request/Response models
class ChatRequest(BaseModel):
    message: str
    use_groq: Optional[bool] = False

class ChatResponse(BaseModel):
    response: str
    type: str  # "text" or "image"
    image_url: Optional[str] = None


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class GoogleLoginRequest(BaseModel):
    token: str

# Initialize components
intent_detector = IntentDetector()
text_model = TextGenerationModel()
image_model = ImageGenerationModel()
agent_router = BrandAgentRouter(intent_detector, text_model, image_model)
auth_service = AuthService()

@app.get("/")
async def root():
    return {"message": "AI Brand Agent API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "models": {"text": "ready", "image": "ready"}}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Route the request based on intent
        result = await agent_router.process_request(
            message=request.message,
            use_groq=request.use_groq
        )
        
        return ChatResponse(
            response=result["content"],
            type=result["type"],
            image_url=result.get("image_url")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models/status")
async def get_model_status():
    return {
        "text_generation": "connected" if text_model.is_configured() else "not_configured",
        "image_generation": "ready" if image_model.is_ready() else "not_ready",
        "groq_available": text_model.groq_available if hasattr(text_model, 'groq_available') else False
    }


@app.post("/auth/register")
async def register(payload: RegisterRequest):
    try:
        return auth_service.register(payload.name, payload.email, payload.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Unable to register user.")


@app.post("/auth/login")
async def login(payload: LoginRequest):
    try:
        return auth_service.login(payload.email, payload.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Unable to login.")


@app.post("/auth/google")
async def google_login(payload: GoogleLoginRequest):
    try:
        return auth_service.login_with_google(payload.token)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Google authentication failed.")


@app.get("/auth/me")
async def auth_me(authorization: Optional[str] = Header(default=None)):
    try:
        user = auth_service.get_user_from_bearer(authorization or "")
        return {"user": user}
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Unable to fetch current user.")


@app.get("/domain/check")
async def domain_check(name: str):
    try:
        domain = name.strip().lower()
        if not re.match(r"^[a-z0-9-]+(\.[a-z0-9-]+)+$", domain):
            raise HTTPException(status_code=400, detail="Invalid domain format.")

        try:
            socket.gethostbyname(domain)
            status = "taken"
        except socket.gaierror:
            status = "available"

        return {"name": domain, "status": status}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Unable to check domain availability.")

if __name__ == "__main__":
    # Create static directory if it doesn't exist
    os.makedirs("static", exist_ok=True)
    
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
