const AUTH_NOT_IMPLEMENTED = "Authentication endpoints are not present in the current backend.";

function missingAuthRoute(route) {
  return Promise.reject(new Error(`${AUTH_NOT_IMPLEMENTED} Missing route: ${route}`));
}

export function login(payload) {
  return missingAuthRoute("POST /auth/login");
}

export function signup(payload) {
  return missingAuthRoute("POST /auth/signup");
}

export function getCurrentUser() {
  return missingAuthRoute("GET /auth/me");
}

export function updateProfile(payload) {
  return missingAuthRoute("PATCH /auth/profile");
}

export function logout() {
  return Promise.resolve({ success: true });
}
