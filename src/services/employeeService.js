import api from "./api";

const getProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};

const checkIn = async (session) => {
  const response = await api.post("/checkin", { session });
  return response.data;
};

const checkOut = async (session) => {
  const response = await api.post("/checkout", { session });
  return response.data;
};

const getHistory = async (params = {}) => {
  const response = await api.get("/history", { params });
  return response.data;
};

const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

// Now sends FormData since a medical file may be attached
const requestPermission = async (formData) => {
  const response = await api.post("/permission", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export default {
  getProfile,
  checkIn,
  checkOut,
  getHistory,
  getNotifications,
  requestPermission,
};
