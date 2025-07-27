import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiEye, FiEyeOff, FiHeart } from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect to the attempted URL or dashboard
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location, isLoading]);

  // Show loading spinner while checking initial authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show loading spinner while submitting login form
  if (loading) {
    return <LoadingSpinner />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2a8f66] flex-col justify-center items-center p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff2680]/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fdb804]/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff2680]/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-md mx-auto relative z-10">
          <div className="w-24 h-24 mx-auto bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg mb-8 border border-white/10">
            <h1 className="text-4xl font-bold text-white">H2A</h1>
          </div>
          {/* <h2 className="text-3xl font-bold mb-6 text-center">
            Happy2Age Admin Portal
          </h2> */}

          {/* Senior Citizen Quotes */}
          <div className="my-10">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 relative transform transition-all duration-300 hover:bg-white/10">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#ff2680] rounded-xl flex items-center justify-center shadow-lg">
                <FiHeart className="h-6 w-6" />
              </div>
              <p className="italic mb-4 text-lg">
                "Age is an issue of mind over matter. If you don't mind, it
                doesn't matter."
              </p>
              <p className="text-sm font-semibold text-right text-white/80">
                — Mark Twain
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-sm font-medium text-white/70">
              Empowering seniors to live their best lives
            </p>
            <p className="text-sm font-medium text-white/70 mt-1">
              © 2025 Happy2Age. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 py-12">
          {/* Mobile Logo - Only visible on mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-[#2a8f66] rounded-2xl flex items-center justify-center shadow-lg">
              <h1 className="text-3xl font-bold text-white">H2A</h1>
            </div>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to your admin account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-[#2a8f66]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2a8f66] focus:border-transparent shadow-sm transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-[#2a8f66]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2a8f66] focus:border-transparent shadow-sm transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-200"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-[#2a8f66]" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-[#2a8f66]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`relative w-full flex items-center justify-center px-4 py-4 border border-transparent text-sm font-medium rounded-xl text-white shadow-md transition-all duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#ff2680] hover:bg-[#ff2680]/90 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2680]"
                }`}
              >
                <span className="relative z-10">
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </span>
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Need help?{" "}
            <a
              href="#"
              className="font-medium text-[#2a8f66] hover:text-[#fdb804] transition-colors duration-200"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
