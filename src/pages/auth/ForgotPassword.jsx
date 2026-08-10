// This page lets a user request a password reset email.

import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../../services/authService";
import logo from "../../assets/logo.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); // shows a confirmation message after sending

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      // We always show success, since the backend intentionally doesn't reveal
      // whether the email exists (a security best practice)
      setSubmitted(true);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Fana Youth Sacco" className="h-20 w-auto mb-3" />
          <h1 className="text-xl font-bold text-gray-800">Forgot Password</h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {submitted ? (
          // Confirmation view shown after successfully submitting the form
          <div className="text-center">
            <div className="bg-green-50 text-green-700 text-sm rounded-lg p-4 mb-4">
              If an account exists for <strong>{email}</strong>, a password reset link has been sent.
              Please check your inbox (and spam folder).
            </div>
            <Link to="/login" className="text-purple-800 font-medium hover:underline text-sm">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-800 hover:bg-purple-900 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-center text-sm text-gray-600">
              <Link to="/login" className="text-purple-800 font-medium hover:underline">
                Back to Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;