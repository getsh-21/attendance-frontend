// This page shows the employee's full attendance history with pagination.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";
import employeeService from "../../services/employeeService";

const AttendanceHistory = () => {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Re-fetches whenever the page number changes
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

  return (
    <DashboardLayout title="Attendance History">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500">Loading...</p>
        ) : records.length === 0 ? (
          <p className="p-6 text-gray-500">No records found.</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Date</th>
                  <th className="text-left px-6 py-3 font-medium">Morning Status</th>
                  <th className="text-left px-6 py-3 font-medium">Afternoon Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record._id} className="border-t border-gray-100">
                    <td className="px-6 py-3 text-gray-700">{record.date}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={record.morningStatus} />
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={record.afternoonStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
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

// Small helper component: colors the status text based on its value
const StatusBadge = ({ status }) => {
  const colors = {
    "On Time": "text-green-700 bg-green-50",
    Late: "text-yellow-700 bg-yellow-50",
    Absent: "text-red-700 bg-red-50",
    Pending: "text-gray-500 bg-gray-100",
  };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors[status] || colors.Pending}`}>
      {status}
    </span>
  );
};

export default AttendanceHistory;