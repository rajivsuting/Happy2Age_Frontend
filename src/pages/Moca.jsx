import React, { useState, useEffect, useCallback } from "react";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import ConfirmationModal from "../components/ConfirmationModal";

const Moca = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    participant: "",
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalEvaluations: 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const navigate = useNavigate();

  // Debounce the search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch evaluations when filters or pagination changes
  useEffect(() => {
    fetchEvaluations();
  }, [
    debouncedSearch,
    filters.startDate,
    filters.endDate,
    filters.participant,
    pagination.currentPage,
  ]);

  // Fetch participants for filter dropdown
  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.participant && { participant: filters.participant }),
      });

      const response = await axiosInstance.get(`/moca/all?${queryParams}`);

      if (response.data.success) {
        setEvaluations(response.data.message || []);
        setPagination({
          ...pagination,
          totalPages: response.data.totalPages || 1,
          totalEvaluations: response.data.total || 0,
        });
      } else {
        setEvaluations([]);
        setError(response.data.message || "Failed to fetch evaluations");
      }
    } catch (error) {
      console.error("Error fetching evaluations:", error);
      setError(error.response?.data?.message || "Failed to fetch evaluations");
      setEvaluations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await axiosInstance.get("/participant/all");
      if (response.data.success) {
        setParticipants(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      startDate: "",
      endDate: "",
      participant: "",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  const handleDelete = async (evaluation) => {
    setSelectedEvaluation(evaluation);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axiosInstance.delete(
        `/moca/delete/${selectedEvaluation._id}`
      );
      if (response.data.success) {
        fetchEvaluations();
        setShowDeleteModal(false);
        setSelectedEvaluation(null);
      } else {
        setError(response.data.message || "Failed to delete evaluation");
      }
    } catch (error) {
      console.error("Error deleting evaluation:", error);
      setError(error.response?.data?.message || "Failed to delete evaluation");
    }
  };

  const handleView = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setShowViewModal(true);
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "N/A";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getParticipantName = (participantId) => {
    const participant = participants.find((p) => p._id === participantId);
    return participant ? participant.name : "Unknown";
  };

  const getMocaLevel = (score) => {
    if (score >= 26) return { level: "Normal", color: "text-green-600" };
    if (score >= 19) return { level: "Mild", color: "text-yellow-600" };
    if (score >= 11) return { level: "Moderate", color: "text-orange-600" };
    return { level: "Severe", color: "text-red-600" };
  };

  return (
    <div className="min-h-full bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">MOCA</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track MOCA evaluations
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/moca/add")}
                className="inline-flex items-center px-4 py-2 bg-[#239d62] text-white text-sm font-medium rounded-md shadow-sm hover:bg-[#239d62]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Evaluation
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 shadow-sm">
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

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search by participant name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#239d62] focus:border-[#239d62] transition-colors"
                  />
                </div>
              </div>

              <div className="min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participant
                </label>
                <select
                  name="participant"
                  value={filters.participant}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#239d62] focus:border-[#239d62] transition-colors"
                >
                  <option value="">All Participants</option>
                  {participants.map((participant) => (
                    <option key={participant._id} value={participant._id}>
                      {participant.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#239d62] focus:border-[#239d62] transition-colors"
                />
              </div>

              <div className="min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#239d62] focus:border-[#239d62] transition-colors"
                />
              </div>

              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Evaluations Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              MOCA Evaluations
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#239d62]"></div>
              <p className="mt-2 text-gray-600">Loading evaluations...</p>
            </div>
          ) : evaluations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No evaluations found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {evaluations.map((evaluation) => {
                    const mocaLevel = getMocaLevel(evaluation.totalScore);
                    return (
                      <tr key={evaluation._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {getParticipantName(evaluation.participant)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {evaluation.totalScore || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${mocaLevel.color} bg-opacity-10`}
                          >
                            {mocaLevel.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(evaluation.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleView(evaluation)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <FiEye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/moca/edit/${evaluation._id}`)
                              }
                              className="text-green-600 hover:text-green-800 transition-colors"
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(evaluation)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  {(pagination.currentPage - 1) * pagination.pageSize + 1} to{" "}
                  {Math.min(
                    pagination.currentPage * pagination.pageSize,
                    pagination.totalEvaluations
                  )}{" "}
                  of {pagination.totalEvaluations} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: prev.currentPage - 1,
                      }))
                    }
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: prev.currentPage + 1,
                      }))
                    }
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Evaluation"
          message="Are you sure you want to delete this MOCA evaluation? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="red"
        />

        {/* View Modal */}
        {showViewModal && selectedEvaluation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  MOCA Evaluation Details
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Participant
                  </label>
                  <p className="text-sm text-gray-900">
                    {getParticipantName(selectedEvaluation.participant)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Score
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedEvaluation.totalScore || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedEvaluation.date)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Questions
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {selectedEvaluation.questions?.map((question, index) => (
                      <div key={index} className="mb-2 last:mb-0">
                        <p className="text-sm text-gray-700 mb-1">
                          Question {index + 1}: {question.question}
                        </p>
                        <p className="text-xs text-gray-500">
                          Score: {question.score}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Moca;
