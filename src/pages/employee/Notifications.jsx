// This page shows all notifications sent to the employee
// (e.g. permission approved/rejected).

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";
import employeeService from "../../services/employeeService";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await employeeService.getNotifications();
        setNotifications(data.notifications);
      } catch (error) {
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <DashboardLayout title="Notifications">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {loading ? (
          <p className="p-6 text-gray-500">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="p-6 text-gray-500">No notifications yet.</p>
        ) : (
          notifications.map((note) => (
            <div key={note._id} className="p-4 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{note.type}</p>
                <p className="text-sm text-gray-500">{note.message}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;