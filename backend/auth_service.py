import base64
import hashlib
import hmac
import json
import os
import secrets
import threading
import time
import uuid
from typing import Any, Dict, Optional

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token


class AuthService:
    def __init__(self) -> None:
        self.store_path = os.path.join("data", "auth_store.json")
        self.google_client_id = os.getenv("GOOGLE_CLIENT_ID", "")
        self.session_ttl_seconds = int(os.getenv("SESSION_TTL_SECONDS", "604800"))  # 7 days
        self._lock = threading.Lock()
        os.makedirs(os.path.dirname(self.store_path), exist_ok=True)
        self._ensure_store()

    def _ensure_store(self) -> None:
        if os.path.exists(self.store_path):
            return
        self._write_store({"users": [], "sessions": {}})

    def _read_store(self) -> Dict[str, Any]:
        with open(self.store_path, "r", encoding="utf-8") as handle:
            return json.load(handle)

    def _write_store(self, payload: Dict[str, Any]) -> None:
        with open(self.store_path, "w", encoding="utf-8") as handle:
            json.dump(payload, handle, indent=2)

    def _hash_password(self, password: str) -> str:
        salt = secrets.token_bytes(16)
        digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 200_000)
        return (
            "pbkdf2_sha256$200000$"
            + base64.b64encode(salt).decode("utf-8")
            + "$"
            + base64.b64encode(digest).decode("utf-8")
        )

    def _verify_password(self, password: str, encoded: str) -> bool:
        try:
            algorithm, iterations_str, salt_b64, digest_b64 = encoded.split("$")
            if algorithm != "pbkdf2_sha256":
                return False
            iterations = int(iterations_str)
            salt = base64.b64decode(salt_b64.encode("utf-8"))
            expected = base64.b64decode(digest_b64.encode("utf-8"))
            actual = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
            return hmac.compare_digest(actual, expected)
        except Exception:
            return False

    def _public_user(self, user: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "id": user["id"],
            "email": user["email"],
            "name": user.get("name", ""),
            "picture": user.get("picture", ""),
            "provider": user.get("provider", "email"),
            "created_at": user.get("created_at", 0),
        }

    def _find_user_by_email(self, users: list, email: str) -> Optional[Dict[str, Any]]:
        email_lc = email.strip().lower()
        for user in users:
            if user["email"] == email_lc:
                return user
        return None

    def _new_session(self, store: Dict[str, Any], user_id: str) -> str:
        token = secrets.token_urlsafe(48)
        store["sessions"][token] = {
            "user_id": user_id,
            "expires_at": int(time.time()) + self.session_ttl_seconds,
        }
        return token

    def register(self, name: str, email: str, password: str) -> Dict[str, Any]:
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long.")

        with self._lock:
            store = self._read_store()
            existing = self._find_user_by_email(store["users"], email)
            if existing:
                raise ValueError("Account already exists for this email.")

            user = {
                "id": str(uuid.uuid4()),
                "email": email.strip().lower(),
                "name": name.strip(),
                "password_hash": self._hash_password(password),
                "provider": "email",
                "created_at": int(time.time()),
            }
            store["users"].append(user)
            token = self._new_session(store, user["id"])
            self._write_store(store)

        return {"token": token, "user": self._public_user(user)}

    def login(self, email: str, password: str) -> Dict[str, Any]:
        with self._lock:
            store = self._read_store()
            user = self._find_user_by_email(store["users"], email)
            if not user or not self._verify_password(password, user.get("password_hash", "")):
                raise ValueError("Invalid email or password.")

            token = self._new_session(store, user["id"])
            self._write_store(store)

        return {"token": token, "user": self._public_user(user)}

    def login_with_google(self, credential_token: str) -> Dict[str, Any]:
        if not self.google_client_id:
            raise ValueError("GOOGLE_CLIENT_ID is not configured on backend.")

        id_info = id_token.verify_oauth2_token(
            credential_token,
            google_requests.Request(),
            self.google_client_id,
        )
        email = id_info.get("email", "").strip().lower()
        if not email:
            raise ValueError("Google token is missing email.")

        with self._lock:
            store = self._read_store()
            user = self._find_user_by_email(store["users"], email)
            if not user:
                user = {
                    "id": str(uuid.uuid4()),
                    "email": email,
                    "name": id_info.get("name", ""),
                    "picture": id_info.get("picture", ""),
                    "provider": "google",
                    "created_at": int(time.time()),
                }
                store["users"].append(user)
            else:
                user["name"] = id_info.get("name", user.get("name", ""))
                user["picture"] = id_info.get("picture", user.get("picture", ""))
                user["provider"] = "google"

            token = self._new_session(store, user["id"])
            self._write_store(store)

        return {"token": token, "user": self._public_user(user)}

    def get_user_from_bearer(self, authorization_header: str) -> Dict[str, Any]:
        if not authorization_header or not authorization_header.startswith("Bearer "):
            raise ValueError("Missing bearer token.")
        token = authorization_header.split(" ", 1)[1].strip()
        if not token:
            raise ValueError("Invalid bearer token.")

        with self._lock:
            store = self._read_store()
            session = store["sessions"].get(token)
            if not session:
                raise ValueError("Session not found.")
            if int(time.time()) > int(session.get("expires_at", 0)):
                del store["sessions"][token]
                self._write_store(store)
                raise ValueError("Session expired.")

            user_id = session["user_id"]
            user = next((entry for entry in store["users"] if entry["id"] == user_id), None)
            if not user:
                raise ValueError("User not found.")

        return self._public_user(user)
