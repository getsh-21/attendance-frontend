// This is the admin's home page — shows key stats and a simple chart.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import DashboardLayout from "../../components/layout/DashboardLayout";
import adminService from "../../services/adminService";

// Chart.js requires us to "register" the pieces we're using before rendering
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await adminService.getDashboard();
        setStats(data.stats);
      } catch (error) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <p className="text-gray-500">Loading...</p>
      </DashboardLayout>
    );
  }

  // Data shape required by Chart.js for a bar chart
  const chartData = {
    labels: ["Present", "Late", "Absent"],
    datasets: [
      {
        label: "Today's Attendance",
        data: [stats.presentToday, stats.lateToday, stats.absentToday],
        backgroundColor: ["#16a34a", "#ca8a04", "#dc2626"], // green, yellow, red
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  // Small reusable card for each stat
  const StatCard = ({ label, value, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <DashboardLayout title="Dashboard">
      {/* Top stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Employees" value={stats.totalEmployees} color="text-gray-800" />
        <StatCard label="Present Today" value={stats.presentToday} color="text-green-600" />
        <StatCard label="Late Today" value={stats.lateToday} color="text-yellow-600" />
        <StatCard label="Absent Today" value={stats.absentToday} color="text-red-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Today's Attendance Overview</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Permission stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Permission Requests</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Pending</span>
              <span className="font-semibold text-yellow-600">{stats.pendingPermissions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Approved</span>
              <span className="font-semibold text-green-600">{stats.approvedPermissions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Rejected</span>
              <span className="font-semibold text-red-600">{stats.rejectedPermissions}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;