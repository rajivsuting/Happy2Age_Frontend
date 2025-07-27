import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import axiosInstance from "../utils/axios";

const EditActivity = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [domains, setDomains] = useState([]);
  const [activity, setActivity] = useState({
    name: "",
    description: "",
    references: "",
    primaryDomain: "",
    secondaryDomain: "",
  });

  useEffect(() => {
    fetchActivity();
    fetchDomains();
  }, [id]);

  const fetchDomains = async () => {
    try {
      const response = await axiosInstance.get("/domain/all");
      if (response.data.success) {
        setDomains(response.data.data || []);
      }
    } catch (error) {
      setError("Failed to fetch domains");
    }
  };

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/activity/${id}`);
      if (response.data.success) {
        const data = response.data.data;
        setActivity({
          name: data.name || "",
          description: data.description || "",
          references: data.references || "",
          primaryDomain: data.primaryDomain?._id || data.primaryDomain || "",
          secondaryDomain:
            data.secondaryDomain?._id || data.secondaryDomain || "",
        });
      } else {
        setError("Activity not found");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch activity");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSaving(true);
      setError(null);
      const response = await axiosInstance.patch(
        `/activity/edit/${id}`,
        activity
      );
      if (response.data.success) {
        navigate("/activities");
      } else {
        setError(response.data.message || "Failed to update activity");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update activity");
    } finally {
      setSaving(false);
    }
  };

  const validateForm = () => {
    // Implement form validation logic here
    return true; // Placeholder return, actual implementation needed
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#239d62]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-red-50 p-4">
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
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Activity
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Update activity details
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/activities/${id}`)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62]"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#239d62] hover:bg-[#239d62]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={activity.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              {/* Primary Domain */}
              <div>
                <label
                  htmlFor="primaryDomain"
                  className="block text-sm font-medium text-gray-700"
                >
                  Primary Domain
                </label>
                <div className="mt-1">
                  <select
                    id="primaryDomain"
                    name="primaryDomain"
                    value={activity.primaryDomain}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200"
                    required
                  >
                    <option value="">Select a primary domain</option>
                    {domains.map((domain) => (
                      <option key={domain._id} value={domain._id}>
                        {domain.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Secondary Domain */}
              <div>
                <label
                  htmlFor="secondaryDomain"
                  className="block text-sm font-medium text-gray-700"
                >
                  Secondary Domain
                </label>
                <div className="mt-1">
                  <select
                    id="secondaryDomain"
                    name="secondaryDomain"
                    value={activity.secondaryDomain}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200"
                  >
                    <option value="">Select a secondary domain</option>
                    {domains.map((domain) => (
                      <option key={domain._id} value={domain._id}>
                        {domain.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={activity.description}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200"
                  />
                </div>
              </div>

              {/* References */}
              <div>
                <label
                  htmlFor="references"
                  className="block text-sm font-medium text-gray-700"
                >
                  References
                </label>
                <div className="mt-1">
                  <textarea
                    id="references"
                    name="references"
                    rows={4}
                    value={activity.references}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditActivity;
