// This file wraps the auth API calls: register, login, forgot password, reset password.

import api from "./api";

// Calls POST /api/auth/register
const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Calls POST /api/auth/login
const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// Calls POST /api/auth/forgot-password
const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

// Calls POST /api/auth/reset-password/:token
const resetPassword = async (token, newPassword) => {
  const response = await api.post(`/auth/reset-password/${token}`, { newPassword });
  return response.data;
};

export default { register, login, forgotPassword, resetPassword };