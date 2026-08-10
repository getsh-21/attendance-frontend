// This is the left-side navigation menu. It shows different links
// depending on whether the logged-in user is an employee or admin.

import { NavLink } from "react-router-dom";
import {
  FiHome, FiLogIn, FiLogOut, FiFileText, FiClock,
  FiBell, FiUser, FiUsers, FiBarChart2, FiCheckSquare
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo.jpg";

const Sidebar = () => {
  const { user, logout } = useAuth();

  // Tailwind classes for links — active link gets a highlighted background
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
      isActive ? "bg-purple-800 text-white" : "text-gray-600 hover:bg-gray-100"
    }`;

  const employeeLinks = [
    { to: "/employee/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/employee/checkinout", label: "Check In/Out", icon: <FiLogIn /> },
    { to: "/employee/permission", label: "Permission", icon: <FiFileText /> },
    { to: "/employee/history", label: "Attendance History", icon: <FiClock /> },
    { to: "/employee/notifications", label: "Notifications", icon: <FiBell /> },
    { to: "/employee/profile", label: "Profile", icon: <FiUser /> },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <FiBarChart2 /> },
    { to: "/admin/employees", label: "Employees", icon: <FiUsers /> },
    { to: "/admin/attendance", label: "Attendance", icon: <FiClock /> },
    { to: "/admin/permissions", label: "Permissions", icon: <FiCheckSquare /> },
  ];

  const links = user?.role === "admin" ? adminLinks : employeeLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
      {/* Logo + company name */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <img src={logo} alt="Fana Youth Sacco" className="h-10 w-auto" />
        <div>
          <p className="font-bold text-gray-800 text-sm leading-tight">Fana Youth Sacco</p>
          <p className="text-xs text-gray-400">Attendance System</p>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClass}>
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout button pinned to the bottom */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition"
        >
          <FiLogOut className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;