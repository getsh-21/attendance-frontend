// This is the top bar shown on every dashboard page. On mobile, it now
// includes a hamburger button to open the sidebar.

import { FiMenu } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

const Navbar = ({ title, onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Hamburger button - only visible on mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-800"
        >
          <FiMenu className="text-2xl" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-800">{user?.fullName}</p>
          <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
        </div>
        <div className="h-9 w-9 rounded-full bg-purple-800 text-white flex items-center justify-center font-semibold flex-shrink-0">
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
