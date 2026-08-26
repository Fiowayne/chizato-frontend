import axios from "axios";
import { getHttpErrorMessage } from "../utils/httpErrors";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    error.userMessage = getHttpErrorMessage(error);
    const hadAuth = Boolean(error.config?.headers?.Authorization);
    if (error.response?.status === 401 && hadAuth) {
      console.warn("Sesión no válida o expirada.");
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/api/users/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("/api/users/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error;
  }
};

export default apiClient;
