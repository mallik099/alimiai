import axios from "axios";

const TOKEN_KEY = "brandcraft_session_token";
const USER_KEY = "brandcraft_session_user";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 20000
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function persistSession(token, user) {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
  if (user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function loginWithEmail(payload) {
  const { data } = await api.post("/auth/login", payload);
  persistSession(data.token, data.user);
  return data;
}

export async function registerWithEmail(payload) {
  const { data } = await api.post("/auth/register", payload);
  persistSession(data.token, data.user);
  return data;
}

export async function loginWithGoogle(googleCredential) {
  const { data } = await api.post("/auth/google", {
    token: googleCredential
  });
  persistSession(data.token, data.user);
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get("/auth/me");
  if (data?.user) {
    persistSession(null, data.user);
  }
  return data;
}
