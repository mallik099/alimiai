const VERIFY_NOT_IMPLEMENTED = "Brand verification routes are not present in the current backend.";

function missingVerifyRoute(route) {
  return Promise.reject(new Error(`${VERIFY_NOT_IMPLEMENTED} Missing route: ${route}`));
}

export function submitBrand(payload) {
  return missingVerifyRoute("POST /brand-verification/submissions");
}

export function getVerificationStatus() {
  return missingVerifyRoute("GET /brand-verification/status");
}

export function getBrandProfile() {
  return missingVerifyRoute("GET /brand/profile");
}

export function reportMisuse(payload) {
  return missingVerifyRoute("POST /brand/report-misuse");
}

export function getBrandAnalytics() {
  return missingVerifyRoute("GET /brand/analytics");
}
