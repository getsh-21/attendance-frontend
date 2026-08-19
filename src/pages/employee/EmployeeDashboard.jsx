// This is the employee's home page — shows today's attendance status
// and a preview of recent records, each with real check-in/out times.
// Desktop: table. Mobile: stacked cards.

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import employeeService from "../../services/employeeService";
import { toast } from "react-toastify";
import { formatTime24 } from "../../utils/formatDate";

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

  const StatusBadge = ({ status }) => {
    const colors = {
      "On Time": "text-green-700 bg-green-50",
      Late: "text-yellow-700 bg-yellow-50",
      Absent: "text-red-700 bg-red-50",
      Completed: "text-blue-700 bg-blue-50",
      Pending: "text-gray-500 bg-gray-100",
      "Permission Allowed": "text-teal-700 bg-teal-50",
      "Permission Denied": "text-red-700 bg-red-50",
      "Permission Pending": "text-orange-700 bg-orange-50",
    };
    return (
      <span
        className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${colors[status] || colors.Pending}`}
      >
        {status}
      </span>
    );
  };

  const SessionCell = ({ time, status }) => (
    <div className="flex flex-col gap-1">
      <span
        className={`font-mono text-xs ${time ? "text-gray-800 font-semibold" : "text-gray-400"}`}
      >
        {formatTime24(time)}
      </span>
      <StatusBadge status={status} />
    </div>
  );

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">
            Morning Check-In
          </p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">
            {todayRecord?.morningCheckInStatus || "Pending"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">
            Morning Check-Out
          </p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">
            {todayRecord?.morningCheckOutStatus || "Pending"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">
            Afternoon Check-In
          </p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">
            {todayRecord?.afternoonCheckInStatus || "Pending"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">
            Afternoon Check-Out
          </p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">
            {todayRecord?.afternoonCheckOutStatus || "Pending"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Attendance</h2>
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">Loading...</p>
        ) : history.length === 0 ? (
          <p className="p-6 text-gray-500">No attendance records yet.</p>
        ) : (
          <>
            {/* MOBILE: stacked cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {history.map((record) => (
                <div key={record._id} className="p-4">
                  <p className="text-sm font-semibold text-gray-800 mb-3">
                    {record.date}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Morning In</p>
                      <SessionCell
                        time={record.morningCheckIn}
                        status={record.morningCheckInStatus}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Morning Out</p>
                      <SessionCell
                        time={record.morningCheckOut}
                        status={record.morningCheckOutStatus}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Afternoon In</p>
                      <SessionCell
                        time={record.afternoonCheckIn}
                        status={record.afternoonCheckInStatus}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Afternoon Out
                      </p>
                      <SessionCell
                        time={record.afternoonCheckOut}
                        status={record.afternoonCheckOutStatus}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Date</th>
                    <th className="text-left px-4 py-3 font-medium">
                      Morning In
                    </th>
                    <th className="text-left px-4 py-3 font-medium">
                      Morning Out
                    </th>
                    <th className="text-left px-4 py-3 font-medium">
                      Afternoon In
                    </th>
                    <th className="text-left px-4 py-3 font-medium">
                      Afternoon Out
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record._id} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap align-top">
                        {record.date}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <SessionCell
                          time={record.morningCheckIn}
                          status={record.morningCheckInStatus}
                        />
                      </td>
                      <td className="px-4 py-3 align-top">
                        <SessionCell
                          time={record.morningCheckOut}
                          status={record.morningCheckOutStatus}
                        />
                      </td>
                      <td className="px-4 py-3 align-top">
                        <SessionCell
                          time={record.afternoonCheckIn}
                          status={record.afternoonCheckInStatus}
                        />
                      </td>
                      <td className="px-4 py-3 align-top">
                        <SessionCell
                          time={record.afternoonCheckOut}
                          status={record.afternoonCheckOutStatus}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
