import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import employeeService from "../../services/employeeService";
import { toast } from "react-toastify";

const EmployeeDashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await employeeService.getHistory({ limit: 5 });
        setHistory(data.records);
      } catch (error) {
        toast.error("Failed to load attendance data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayRecord = history.find((r) => r.date === today);

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Morning Check-In Status</p>
          <p className="text-2xl font-bold text-gray-800">
            {todayRecord?.morningCheckInStatus || "Pending"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">
            Afternoon Check-In Status
          </p>
          <p className="text-2xl font-bold text-gray-800">
            {todayRecord?.afternoonCheckInStatus || "Pending"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Records</p>
          <p className="text-2xl font-bold text-gray-800">{history.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Attendance</h2>
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">Loading...</p>
        ) : history.length === 0 ? (
          <p className="p-6 text-gray-500">No attendance records yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Date</th>
                <th className="text-left px-6 py-3 font-medium">Morning</th>
                <th className="text-left px-6 py-3 font-medium">Afternoon</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record._id} className="border-t border-gray-100">
                  <td className="px-6 py-3 text-gray-700">{record.date}</td>
                  <td className="px-6 py-3 text-gray-700">
                    {record.morningCheckInStatus}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {record.afternoonCheckInStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
