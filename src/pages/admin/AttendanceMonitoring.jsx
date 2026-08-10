// This page lets the admin see everyone's attendance for a given date,
// including check-in/check-out times in 24-hour format, and export to Excel.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";
import adminService from "../../services/adminService";
import { formatTime24 } from "../../utils/formatDate";

const AttendanceMonitoring = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchAttendance = async (selectedDate) => {
    setLoading(true);
    try {
      const data = await adminService.getAllAttendance({ date: selectedDate });
      setRecords(data.records);
    } catch (error) {
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(date);
  }, [date]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await adminService.exportExcel({ date });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance-${date}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Excel file downloaded");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      "On Time": "text-green-700 bg-green-50",
      Late: "text-yellow-700 bg-yellow-50",
      Absent: "text-red-700 bg-red-50",
      Pending: "text-gray-500 bg-gray-100",
    };
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${colors[status] || colors.Pending}`}>
        {status}
      </span>
    );
  };

  // Combines check-in and check-out into one compact "HH:MM to HH:MM" string
  const TimeRange = ({ checkIn, checkOut }) => (
    <div className="font-mono text-xs whitespace-nowrap flex items-center gap-1.5">
      <span className={checkIn ? "text-gray-800 font-semibold" : "text-gray-400"}>
        {formatTime24(checkIn)}
      </span>
      <span className="text-gray-400">→</span>
      <span className={checkOut ? "text-gray-800 font-semibold" : "text-gray-400"}>
        {formatTime24(checkOut)}
      </span>
    </div>
  );

  return (
    <DashboardLayout title="Attendance Monitoring">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
          />
          <button
            onClick={handleExport}
            disabled={exporting}
            className="bg-purple-800 hover:bg-purple-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
          >
            {exporting ? "Exporting..." : "Export to Excel"}
          </button>
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">Loading...</p>
        ) : records.length === 0 ? (
          <p className="p-6 text-gray-500">No attendance records for this date.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Employee</th>
                  <th className="text-left px-4 py-3 font-medium">Department</th>
                  <th className="text-left px-4 py-3 font-medium">Morning (In→Out)</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Afternoon (In→Out)</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record._id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                      {record.employee?.fullName || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {record.employee?.department || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <TimeRange checkIn={record.morningCheckIn} checkOut={record.morningCheckOut} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={record.morningStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <TimeRange checkIn={record.afternoonCheckIn} checkOut={record.afternoonCheckOut} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={record.afternoonStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AttendanceMonitoring;