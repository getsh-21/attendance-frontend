import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";
import adminService from "../../services/adminService";
import { formatDateTime24 } from "../../utils/formatDate";

const SERVER_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [remarksInput, setRemarksInput] = useState({});

  const fetchPermissions = async (statusFilter) => {
    setLoading(true);
    try {
      const params = statusFilter === "All" ? {} : { status: statusFilter };
      const data = await adminService.getAllPermissions(params);
      setPermissions(data.permissions);
    } catch (error) {
      toast.error("Failed to load permission requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions(filter);
  }, [filter]);

  const handleDecision = async (id, status) => {
    try {
      await adminService.updatePermissionStatus(id, {
        status,
        adminRemarks: remarksInput[id] || "",
      });
      toast.success(`Request ${status.toLowerCase()}`);
      fetchPermissions(filter);
    } catch (error) {
      toast.error("Failed to update request");
    }
  };

  return (
    <DashboardLayout title="Permission Management">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-2">
          {["Pending", "Approved", "Rejected", "All"].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${
                filter === option
                  ? "bg-purple-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">Loading...</p>
        ) : permissions.length === 0 ? (
          <p className="p-6 text-gray-500">
            No {filter.toLowerCase()} requests.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {permissions.map((perm) => {
              const hasFile = Boolean(perm.medicalFile);
              let fileUrl = "";
              if (hasFile) {
                const cleanPath = perm.medicalFile.split("\\").join("/");
                fileUrl = SERVER_URL + "/" + cleanPath;
              }

              let fileLink = null;
              if (hasFile) {
                fileLink = (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs text-purple-800 font-medium hover:underline mb-3"
                  >
                    View Supporting Document
                  </a>
                );
              }

              return (
                <div key={perm._id} className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                    <div>
                      <p className="font-medium text-gray-800">
                        {perm.employee?.fullName}{" "}
                        <span className="text-gray-400 font-normal">
                          - {perm.permissionType}
                        </span>
                      </p>
                      {/* Now shows the exact date AND time (EAT), not just the date */}
                      <p className="text-sm text-gray-500 font-mono">
                        {formatDateTime24(perm.startDate)} to{" "}
                        {formatDateTime24(perm.endDate)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        perm.status === "Approved"
                          ? "text-green-700 bg-green-50"
                          : perm.status === "Rejected"
                            ? "text-red-700 bg-red-50"
                            : "text-yellow-700 bg-yellow-50"
                      }`}
                    >
                      {perm.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{perm.reason}</p>

                  {fileLink}

                  {perm.status === "Pending" && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Remarks (optional)"
                        value={remarksInput[perm._id] || ""}
                        onChange={(e) =>
                          setRemarksInput({
                            ...remarksInput,
                            [perm._id]: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDecision(perm._id, "Approved")}
                          className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecision(perm._id, "Rejected")}
                          className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {perm.status !== "Pending" && perm.adminRemarks && (
                    <p className="text-xs text-gray-400 italic">
                      Remarks: {perm.adminRemarks}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PermissionManagement;
