// This page lets the admin search, view, promote/demote, disable/enable, and delete employees.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";
import adminService from "../../services/adminService";
import { useAuth } from "../../hooks/useAuth";

const EmployeeManagement = () => {
  const { user: currentUser } = useAuth(); // used to hide self-actions
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async (searchTerm = "") => {
    setLoading(true);
    try {
      const data = await adminService.getUsers({ search: searchTerm });
      setEmployees(data.users);
    } catch (error) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => fetchEmployees(search), 400);
    return () => clearTimeout(delay);
  }, [search]);

  const toggleActive = async (employee) => {
    try {
      await adminService.updateUser(employee._id, { isActive: !employee.isActive });
      toast.success(`Employee ${employee.isActive ? "disabled" : "enabled"}`);
      fetchEmployees(search);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update employee");
    }
  };

  // NEW: promotes an employee to admin, or demotes an admin back to employee
  const toggleRole = async (employee) => {
    const newRole = employee.role === "admin" ? "employee" : "admin";
    const confirmMessage =
      newRole === "admin"
        ? `Promote ${employee.fullName} to Admin? They will gain full system access.`
        : `Remove admin access from ${employee.fullName}?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      await adminService.updateUser(employee._id, { role: newRole });
      toast.success(`${employee.fullName} is now ${newRole === "admin" ? "an Admin" : "an Employee"}`);
      fetchEmployees(search);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async (employee) => {
    if (!window.confirm(`Delete ${employee.fullName}? This cannot be undone.`)) return;

    try {
      await adminService.deleteUser(employee._id);
      toast.success("Employee deleted");
      fetchEmployees(search);
    } catch (error) {
      toast.error("Failed to delete employee");
    }
  };

  return (
    <DashboardLayout title="Employee Management">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
          />
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">Loading...</p>
        ) : employees.length === 0 ? (
          <p className="p-6 text-gray-500">No employees found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Name</th>
                <th className="text-left px-6 py-3 font-medium">Department</th>
                <th className="text-left px-6 py-3 font-medium">Position</th>
                <th className="text-left px-6 py-3 font-medium">Role</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const isSelf = emp._id === currentUser?.id;
                return (
                  <tr key={emp._id} className="border-t border-gray-100">
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-800">
                        {emp.fullName} {isSelf && <span className="text-xs text-gray-400">(You)</span>}
                      </p>
                      <p className="text-xs text-gray-400">{emp.email}</p>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{emp.department}</td>
                    <td className="px-6 py-3 text-gray-600">{emp.position}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                          emp.role === "admin" ? "text-purple-700 bg-purple-50" : "text-blue-700 bg-blue-50"
                        }`}
                      >
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          emp.isActive ? "text-green-700 bg-green-50" : "text-gray-500 bg-gray-100"
                        }`}
                      >
                        {emp.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right space-x-3">
                      {/* Hide role/status actions for the admin's own account to prevent lockout */}
                      {!isSelf && (
                        <>
                          <button
                            onClick={() => toggleRole(emp)}
                            className="text-indigo-700 hover:underline text-xs font-medium"
                          >
                            {emp.role === "admin" ? "Remove Admin" : "Make Admin"}
                          </button>
                          <button
                            onClick={() => toggleActive(emp)}
                            className="text-purple-800 hover:underline text-xs font-medium"
                          >
                            {emp.isActive ? "Disable" : "Enable"}
                          </button>
                          <button
                            onClick={() => handleDelete(emp)}
                            className="text-red-600 hover:underline text-xs font-medium"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployeeManagement;