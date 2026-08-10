import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import CheckInOut from "./pages/employee/CheckInOut";
import PermissionRequest from "./pages/employee/PermissionRequest";
import AttendanceHistory from "./pages/employee/AttendanceHistory";
import Notifications from "./pages/employee/Notifications";
import Profile from "./pages/employee/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeManagement from "./pages/admin/EmployeeManagement";
import AttendanceMonitoring from "./pages/admin/AttendanceMonitoring";
import PermissionManagement from "./pages/admin/PermissionManagement";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Employee routes */}
      <Route path="/employee/dashboard" element={<ProtectedRoute requiredRole="employee"><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/employee/checkinout" element={<ProtectedRoute requiredRole="employee"><CheckInOut /></ProtectedRoute>} />
      <Route path="/employee/permission" element={<ProtectedRoute requiredRole="employee"><PermissionRequest /></ProtectedRoute>} />
      <Route path="/employee/history" element={<ProtectedRoute requiredRole="employee"><AttendanceHistory /></ProtectedRoute>} />
      <Route path="/employee/notifications" element={<ProtectedRoute requiredRole="employee"><Notifications /></ProtectedRoute>} />
      <Route path="/employee/profile" element={<ProtectedRoute requiredRole="employee"><Profile /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/employees" element={<ProtectedRoute requiredRole="admin"><EmployeeManagement /></ProtectedRoute>} />
      <Route path="/admin/attendance" element={<ProtectedRoute requiredRole="admin"><AttendanceMonitoring /></ProtectedRoute>} />
      <Route path="/admin/permissions" element={<ProtectedRoute requiredRole="admin"><PermissionManagement /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;