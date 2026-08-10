// This page shows and lets the employee update their profile info,
// including uploading a profile picture.

import { useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

// Your backend serves uploaded files from /uploads, and your API base URL
// already ends in /api — we strip that off to build the correct image URL.
const SERVER_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    department: user?.department || "",
    position: user?.position || "",
  });

  // Holds the actual file object selected by the user (not yet uploaded)
  const [selectedFile, setSelectedFile] = useState(null);
  // Holds a temporary local preview URL so the user sees the image before saving
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Runs when the user picks a file in the file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic client-side check before even trying to upload
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, or WEBP images are allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // creates a temporary local preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // FormData is required here (instead of plain JSON) because we're
      // sending a file — this matches what Multer expects on the backend.
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("department", formData.department);
      data.append("position", formData.position);
      if (selectedFile) {
        data.append("profileImage", selectedFile); // field name must match upload.single("profileImage")
      }

      const response = await api.put("/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update the global user state so the navbar/sidebar refresh immediately
      updateUser(response.data.user);
      toast.success("Profile updated successfully");

      // Clear the temporary local preview now that the real image is saved
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Decide what image to show: new preview > saved image on server > fallback initial
  const displayImage = previewUrl
    ? previewUrl
    : user?.profileImage
    ? `${SERVER_URL}/${user.profileImage.replace(/\\/g, "/")}`
    : null;

  return (
    <DashboardLayout title="Profile">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-lg">
        {/* Profile picture section */}
        <div className="flex items-center gap-4 mb-6">
          {displayImage ? (
            <img
              src={displayImage}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-purple-800 text-white flex items-center justify-center text-2xl font-semibold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <p className="font-semibold text-gray-800">{user?.fullName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <label className="mt-1 inline-block text-xs text-purple-800 font-medium cursor-pointer hover:underline">
              Change Photo
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Read-only info shown for confirmation after saving */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-1">
            <p><span className="font-medium text-gray-700">Email:</span> {user?.email}</p>
            <p><span className="font-medium text-gray-700">Role:</span> <span className="capitalize">{user?.role}</span></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-800 hover:bg-purple-900 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;