// This is the top bar shown on every dashboard page —
// displays a page title and the logged-in user's name.

import { useAuth } from "../../hooks/useAuth";

const Navbar = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">{user?.fullName}</p>
          <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
        </div>
        {/* Simple circular avatar with the user's first initial */}
        <div className="h-9 w-9 rounded-full bg-purple-800 text-white flex items-center justify-center font-semibold">
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Navbar;