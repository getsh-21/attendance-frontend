// This page shows the admin all 4 check-in/check-out events per employee.
// Desktop: table. Mobile: stacked cards.

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
      Completed: "text-blue-700 bg-blue-50",
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

  const Controls = () => (
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
  );

  return (
    <DashboardLayout title="Attendance Monitoring">
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <Controls />
          <p className="p-6 text-gray-500">Loading...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <Controls />
          <p className="p-6 text-gray-500">
            No attendance records for this date.
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE: stacked cards, one per employee */}
          <div className="md:hidden bg-white rounded-xl shadow-sm border border-gray-100">
            <Controls />
            <div className="divide-y divide-gray-100">
              {records.map((record) => (
                <div key={record._id} className="p-4">
                  <p className="text-sm font-semibold text-gray-800">
                    {record.employee?.fullName || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    {record.employee?.department || "-"}
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
          </div>

          {/* DESKTOP: table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <Controls />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">
                      Employee
                    </th>
                    <th className="text-left px-4 py-3 font-medium">
                      Department
                    </th>
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
                      <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap align-top">
                        {record.employee?.fullName || "Unknown"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap align-top">
                        {record.employee?.department || "-"}
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
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AttendanceMonitoring;
