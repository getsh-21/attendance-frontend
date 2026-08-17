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

  const chartData = {
    labels: ["Present", "Late", "Absent"],
    datasets: [
      {
        label: "Today's Attendance",
        data: [stats.presentToday, stats.lateToday, stats.absentToday],
        backgroundColor: ["#16a34a", "#ca8a04", "#dc2626"],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  const StatCard = ({ label, value, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <p className="text-xs sm:text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          label="Total Employees"
          value={stats.totalEmployees}
          color="text-gray-800"
        />
        <StatCard
          label="Present Today"
          value={stats.presentToday}
          color="text-green-600"
        />
        <StatCard
          label="Late Today"
          value={stats.lateToday}
          color="text-yellow-600"
        />
        <StatCard
          label="Absent Today"
          value={stats.absentToday}
          color="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            Today's Attendance Overview
          </h2>
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            Permission Requests
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Pending</span>
              <span className="font-semibold text-yellow-600">
                {stats.pendingPermissions}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Approved</span>
              <span className="font-semibold text-green-600">
                {stats.approvedPermissions}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Rejected</span>
              <span className="font-semibold text-red-600">
                {stats.rejectedPermissions}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
