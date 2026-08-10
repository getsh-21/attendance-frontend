// This file wraps all admin-facing API calls in one place.

import api from "./api";

const getDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

const getUsers = async (params = {}) => {
  const response = await api.get("/admin/users", { params });
  return response.data;
};

const updateUser = async (id, data) => {
  const response = await api.put(`/admin/user/${id}`, data);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await api.delete(`/admin/user/${id}`);
  return response.data;
};

const getAllAttendance = async (params = {}) => {
  const response = await api.get("/admin/attendance", { params });
  return response.data;
};

const getAllPermissions = async (params = {}) => {
  const response = await api.get("/admin/permissions", { params });
  return response.data;
};

const updatePermissionStatus = async (id, data) => {
  const response = await api.put(`/admin/permission/${id}`, data);
  return response.data;
};

// Excel export needs special handling — it returns a raw file, not JSON
const exportExcel = async (params = {}) => {
  const response = await api.get("/admin/export/excel", {
    params,
    responseType: "blob", // tells axios to expect binary file data, not JSON
  });
  return response.data;
};

export default {
  getDashboard,
  getUsers,
  updateUser,
  deleteUser,
  getAllAttendance,
  getAllPermissions,
  updatePermissionStatus,
  exportExcel,
};