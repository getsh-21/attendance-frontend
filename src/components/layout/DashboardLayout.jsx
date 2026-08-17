// This wraps every dashboard page with the Sidebar + Navbar, and now
// manages whether the mobile sidebar is open or closed.

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({ title, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* No left margin on mobile (sidebar is hidden/overlaid), ml-64 on desktop */}
      <div className="lg:ml-64 flex-1 min-h-screen bg-gray-50 w-full">
        <Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
