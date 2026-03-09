import { GoogleLogin } from "@react-oauth/google";

export default function GoogleButton({ onSuccess, onError, disabled = false }) {
  const runtimeGoogleClientId =
    typeof window !== "undefined" ? window.localStorage.getItem("brandcraft_google_client_id") : "";
  const configuredGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || runtimeGoogleClientId;

  if (!configuredGoogleClientId) {
    return (
      <button className="btn-secondary w-full" type="button" disabled>
        Google client ID missing
      </button>
    );
  }

  return (
    <div className={disabled ? "pointer-events-none opacity-50" : ""}>
      <GoogleLogin
        onSuccess={(response) => {
          if (response?.credential) {
            onSuccess(response.credential);
          } else {
            onError(new Error("Google credential not returned."));
          }
        }}
        onError={() => onError(new Error("Google sign-in failed."))}
        useOneTap={false}
        shape="pill"
        text="continue_with"
      />
    </div>
  );
}
