# Split Deployment (Render + Vercel)

This repository is prepared as two independent apps:

- Backend: `backend/` (deploy to Render)
- Frontend: `frontend/` (deploy to Vercel)

## 1) Backend -> Render

Use either `render.yaml` blueprint or manual setup:

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

Required env vars on Render:

- `HUGGINGFACE_API_TOKEN`
- `GOOGLE_CLIENT_ID`

Optional:

- `GROQ_API_KEY`
- `SESSION_TTL_SECONDS` (default `604800`)
- `CORS_ORIGINS` (set to your Vercel URL)

## 2) Frontend -> Vercel

Project root: `frontend`

Set env vars on Vercel:

- `VITE_API_BASE_URL=https://<your-render-service>.onrender.com`
- `VITE_GOOGLE_CLIENT_ID=<same google client id as backend>`

`frontend/vercel.json` already includes SPA rewrite support.

## 3) CORS

Set backend `CORS_ORIGINS` to include your deployed frontend URL, for example:

`https://alkimi-ai.vercel.app`

If needed, add localhost values for development too.
