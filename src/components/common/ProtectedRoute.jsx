// This component "guards" a page. If nobody is logged in, it redirects to /login.
// If a specific role is required (e.g. "admin") and the user doesn't have it,
// it redirects them away instead of showing the page.

import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // Still checking localStorage on first load — show nothing yet to avoid a flash
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Not logged in at all
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but wrong role (e.g. employee trying to access /admin/...)
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  // All checks passed — show the actual page
  return children;
};

export default ProtectedRoute;