// This wraps every dashboard page with the Sidebar + Navbar,
// so we don't repeat that layout code on every single page.

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({ title, children }) => {
  return (
    <div className="flex">
      <Sidebar />
      {/* ml-64 pushes content right, since Sidebar is fixed-position with w-64 */}
      <div className="ml-64 flex-1 min-h-screen bg-gray-50">
        <Navbar title={title} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;