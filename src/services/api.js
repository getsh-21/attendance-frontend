// This file creates one shared Axios instance used by the whole app,
// so we don't repeat the base URL and auth logic in every file.

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // reads from .env
});

// This runs before EVERY request. If a token is saved in localStorage,
// attach it automatically as "Authorization: Bearer <token>".
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// This runs after EVERY response. If the server says the token is invalid
// (401), automatically log the user out and send them to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;