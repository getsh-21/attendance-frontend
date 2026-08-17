// This is the left-side navigation menu. On desktop it's always visible.
// On mobile, it's hidden by default and slides in when the hamburger
// button (in Navbar) is tapped, with a dark overlay behind it.

import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiLogIn,
  FiLogOut,
  FiFileText,
  FiClock,
  FiBell,
  FiUser,
  FiUsers,
  FiBarChart2,
  FiCheckSquare,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo.jpg";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

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
    <>
      {/* Dark overlay behind the sidebar on mobile - tapping it closes the menu */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-50
          transform transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Fana Youth Sacco" className="h-10 w-auto" />
            <div>
              <p className="font-bold text-gray-800 text-sm leading-tight">
                Fana Youth Sacco
              </p>
              <p className="text-xs text-gray-400">Attendance System</p>
            </div>
          </div>
          {/* Close button - only visible on mobile, since desktop sidebar is always open */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              onClick={onClose}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

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
    </>
  );
};

export default Sidebar;
