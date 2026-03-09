import axios from "axios";

export const API_URL_KEY = "alkmiai_api_base_url";

export function getApiBaseUrl() {
  return localStorage.getItem(API_URL_KEY) || import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
}

const apiClient = axios.create({
  timeout: 30000
});

apiClient.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  return config;
});

export default apiClient;
