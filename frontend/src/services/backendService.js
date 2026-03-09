import apiClient from "./apiClient";

function isRetryableError(error) {
  if (!error?.response) {
    return true;
  }
  const status = error.response.status;
  return status === 429 || status >= 500;
}

export async function getRootMessage() {
  const { data } = await apiClient.get("/");
  return data;
}

export async function getHealth() {
  const { data } = await apiClient.get("/health");
  return data;
}

export async function getModelsStatus() {
  const { data } = await apiClient.get("/models/status");
  return data;
}

export async function sendChat(message, useGroq = true, options = {}) {
  const retries = options.retries ?? 0;
  let attempt = 0;
  let lastError;

  while (attempt <= retries) {
    try {
      const { data } = await apiClient.post(
        "/chat",
        {
          message,
          use_groq: useGroq
        },
        {
          signal: options.signal
        }
      );
      return data;
    } catch (error) {
      lastError = error;
      if (options.signal?.aborted || !isRetryableError(error) || attempt === retries) {
        throw error;
      }
      attempt += 1;
      await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
    }
  }

  throw lastError;
}
