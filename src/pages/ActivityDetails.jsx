import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit2, FiTrash2, FiArrowLeft } from "react-icons/fi";
import axiosInstance from "../utils/axios";

const ActivityDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchActivity();
  }, [id]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/activity/${id}`);

      if (response.data.success) {
        setActivity(response.data.data);
      } else {
        setError("Activity not found");
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
      setError(error.response?.data?.message || "Failed to fetch activity");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this activity?")) {
      return;
    }

    try {
      setDeleting(true);
      const response = await axiosInstance.delete(`/activity/${id}`);

      if (response.data.success) {
        navigate("/activities");
      } else {
        setError(response.data.message || "Failed to delete activity");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete activity");
    } finally {
      setDeleting(false);
    }
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

  if (!activity) {
    return (
      <div className="min-h-full bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Activity not found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The activity you're looking for doesn't exist or has been deleted.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/activities")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62]"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back to Activities
              </button>
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
                {activity.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">Activity Details</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/activities/edit/${id}`)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62]"
              >
                <FiEdit2 className="mr-2 h-4 w-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
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
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <div className="mt-1">
                  <span className="text-sm text-gray-900">{activity.name}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Description
                </h3>
                <div className="mt-1">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {activity?.description || "No description available"}
                  </p>
                </div>
              </div>

              {/* References */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  References
                </h3>
                <div className="mt-1">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {activity?.references ? (
                      /^(https?:\/\/|www\.)/.test(
                        activity.references.trim()
                      ) ? (
                        <a
                          href={
                            activity.references.startsWith("http")
                              ? activity.references
                              : `https://${activity.references}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {activity.references}
                        </a>
                      ) : (
                        activity.references
                      )
                    ) : (
                      "No references provided"
                    )}
                  </p>
                </div>
              </div>

              {/* Primary Domain */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Primary Domain
                </h3>
                <div className="mt-1">
                  <span className="text-sm text-gray-900">
                    {activity.primaryDomain?.name || "-"}
                  </span>
                </div>
              </div>

              {/* Secondary Domain */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Secondary Domain
                </h3>
                <div className="mt-1">
                  <span className="text-sm text-gray-900">
                    {activity.secondaryDomain?.name || "-"}
                  </span>
                </div>
              </div>

              {/* Created At */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Created At
                </h3>
                <div className="mt-1">
                  <p className="text-sm text-gray-900">
                    {activity?.createdAt
                      ? new Date(activity.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "Date not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
