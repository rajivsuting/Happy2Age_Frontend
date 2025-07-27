import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit2, FiTrash2, FiArrowLeft, FiDownload } from "react-icons/fi";
import axiosInstance from "../utils/axios";
import { toast } from "react-toastify";

const EvaluationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchEvaluation();
  }, [id]);

  const fetchEvaluation = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/evaluation/${id}`);
      console.log(response.data);

      if (response.data.success) {
        setEvaluation(response.data.data);
      } else {
        setError("Evaluation not found");
      }
    } catch (error) {
      console.error("Error fetching evaluation:", error);
      setError(error.response?.data?.message || "Failed to fetch evaluation");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this evaluation?")) {
      return;
    }

    try {
      setDeleting(true);
      const response = await axiosInstance.delete(`/evaluation/${id}`);

      if (response.data.success) {
        toast.success("Evaluation deleted successfully");
        navigate("/evaluations");
      } else {
        setError(response.data.message || "Failed to delete evaluation");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete evaluation");
    } finally {
      setDeleting(false);
    }
  };

  const exportEvaluationToCSV = () => {
    if (!evaluation) return;

    // Create CSV header
    const headers = [
      "Participant",
      "Session",
      "Cohort",
      "Activity",
      "Created At",
      "Updated At",
      "Domain",
      "Category",
      "Average",
      "Sub Topics",
      "Observations",
    ];
    const csvContent = [headers.join(",")];

    // Add evaluation data
    evaluation.domain?.forEach((domain) => {
      const subTopics = domain.subTopics
        ?.map((st) => `${st.content}: ${st.score}`)
        .join("; ");
      const row = [
        `"${evaluation.participant?.name || ""}"`,
        `"${evaluation.session?.name || ""}"`,
        `"${evaluation.cohort?.name || ""}"`,
        `"${evaluation.activity?.name || ""}"`,
        `"${new Date(evaluation.createdAt).toLocaleDateString()}"`,
        `"${new Date(evaluation.updatedAt).toLocaleDateString()}"`,
        `"${domain.name}"`,
        `"${domain.category}"`,
        `"${domain.average}"`,
        `"${subTopics || ""}"`,
        `"${domain.observation || ""}"`,
      ];
      csvContent.push(row.join(","));
    });

    // Create and download file
    const blob = new Blob([csvContent.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `evaluation_${evaluation.participant?.name}_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#239d62]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="min-h-full bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Evaluation not found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The evaluation you're looking for doesn't exist or has been
              deleted.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/evaluations")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62]"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back to Evaluations
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
                Evaluation Details
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View and manage evaluation information
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportEvaluationToCSV}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62]"
              >
                <FiDownload className="mr-2 h-4 w-4" />
                Export
              </button>
              <button
                onClick={() => navigate(`/evaluations/edit/${id}`)}
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
                <FiTrash2 className="mr-2 h-4 w-4" />
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
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
        )}

        {/* Basic Information */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Basic Information
            </h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Participant
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {evaluation.participant?.name || "N/A"}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Session</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {evaluation.session?.name || "N/A"}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Cohort</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {evaluation.cohort?.name || "N/A"}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Activity</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {evaluation.activity?.name || "N/A"}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Created At
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(evaluation.createdAt).toLocaleDateString()}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Updated At
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(evaluation.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Domain Details */}
        {evaluation.domain?.length > 0 && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Domain Details
              </h3>
              <div className="space-y-6">
                {evaluation.domain.map((domain, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-base font-medium text-gray-900">
                        {domain.name}
                      </h4>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Average: {domain.average}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {domain.subTopics?.map((subTopic, subIndex) => (
                        <div
                          key={subIndex}
                          className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-200"
                        >
                          <p className="text-sm text-gray-700">
                            {subTopic.content}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            Score: {subTopic.score || "N/A"}
                          </p>
                        </div>
                      ))}
                      {domain.observation && (
                        <div className="mt-4 bg-white p-3 rounded-md border border-gray-200">
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Observation
                          </p>
                          <p className="text-sm text-gray-700">
                            {domain.observation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-medium text-green-900">
                      Grand Average
                    </h4>
                    <span className="text-2xl font-bold text-green-800">
                      {evaluation.grandAverage}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationDetails;
