import { useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";
import employeeService from "../../services/employeeService";

const CheckInOut = () => {
  const [loadingAction, setLoadingAction] = useState(null);

  const handleCheckIn = async (session) => {
    setLoadingAction(`checkin-${session}`);
    try {
      const data = await employeeService.checkIn(session);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Check-in failed");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCheckOut = async (session) => {
    setLoadingAction(`checkout-${session}`);
    try {
      const data = await employeeService.checkOut(session);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Check-out failed");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <DashboardLayout title="Check In / Check Out">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="font-semibold text-gray-800 mb-1">Morning Session</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">
            On Time: 06:00-08:05 - Late: 08:06-09:00 - Checkout: from 11:05
            onward
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleCheckIn("morning")}
              disabled={loadingAction === "checkin-morning"}
              className="flex-1 bg-purple-800 hover:bg-purple-900 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loadingAction === "checkin-morning" ? "..." : "Check In"}
            </button>
            <button
              onClick={() => handleCheckOut("morning")}
              disabled={loadingAction === "checkout-morning"}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loadingAction === "checkout-morning" ? "..." : "Check Out"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="font-semibold text-gray-800 mb-1">
            Afternoon Session
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">
            On Time: within 1h05m of your morning checkout - Late: up to 2h30m -
            Checkout: from 17:00 onward
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleCheckIn("afternoon")}
              disabled={loadingAction === "checkin-afternoon"}
              className="flex-1 bg-purple-800 hover:bg-purple-900 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loadingAction === "checkin-afternoon" ? "..." : "Check In"}
            </button>
            <button
              onClick={() => handleCheckOut("afternoon")}
              disabled={loadingAction === "checkout-afternoon"}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loadingAction === "checkout-afternoon" ? "..." : "Check Out"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CheckInOut;
