// This page shows the employee's full attendance history, with the actual
// check-in/check-out TIME (24-hour format, EAT) alongside the status for
// all four events: morning check-in, morning check-out, afternoon check-in,
// afternoon check-out.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";
import employeeService from "../../services/employeeService";
import { formatTime24 } from "../../utils/formatDate";

const AttendanceHistory = () => {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await employeeService.getHistory({ page, limit: 10 });
        setRecords(data.records);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [page]);

  const StatusBadge = ({ status }) => {
    const colors = {
      "On Time": "text-green-700 bg-green-50",
      Late: "text-yellow-700 bg-yellow-50",
      Absent: "text-red-700 bg-red-50",
      Completed: "text-blue-700 bg-blue-50",
      Pending: "text-gray-500 bg-gray-100",
    };
    return (
      <span
        className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${colors[status] || colors.Pending}`}
      >
        {status}
      </span>
    );
  };

  // Shows one event's time (24hr, EAT) stacked above its own status badge
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
    <DashboardLayout title="Attendance History">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500">Loading...</p>
        ) : records.length === 0 ? (
          <p className="p-6 text-gray-500">No records found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Date</th>
                    <th className="text-left px-4 py-3 font-medium">
                      Morning Check-In
                    </th>
                    <th className="text-left px-4 py-3 font-medium">
                      Morning Check-Out
                    </th>
                    <th className="text-left px-4 py-3 font-medium">
                      Afternoon Check-In
                    </th>
                    <th className="text-left px-4 py-3 font-medium">
                      Afternoon Check-Out
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
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

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AttendanceHistory;
