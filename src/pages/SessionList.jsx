import React, { useState, useEffect, useCallback } from "react";
import { FiSearch, FiFilter, FiTrash2, FiEdit2, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    cohort: "",
  });
  const [debouncedName, setDebouncedName] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalSessions: 0,
  });
  const navigate = useNavigate();

  // Fetch cohorts on component mount
  useEffect(() => {
    fetchCohorts();
  }, []);

  const fetchCohorts = async () => {
    try {
      const response = await axiosInstance.get("/cohort/all");
      if (response.data.success) {
        setCohorts(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching cohorts:", error);
    }
  };

  // Debounce the name search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(filters.name);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.name]);

  // Fetch sessions when filters or pagination changes
  useEffect(() => {
    fetchSessions();
  }, [debouncedName, filters.cohort, pagination.currentPage]);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    if (name !== "name") {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
    setSuccessMessage(null);
    setError(null);
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        ...(debouncedName && { name: debouncedName }),
        ...(filters.cohort && { cohort: filters.cohort }),
      });

      const response = await axiosInstance.get(`/session/all?${queryParams}`);
      console.log(response.data);

      if (response.data.success) {
        setSessions(response.data.message || []);
        setPagination({
          ...pagination,
          totalPages: response.data.totalPages || 1,
          totalSessions: response.data.totalCount || 0,
        });
      } else {
        setSessions([]);
        setError(response.data.message || "Failed to fetch sessions");
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setError(error.response?.data?.message || "Failed to fetch sessions");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = useCallback(() => {
    setFilters({
      name: "",
      cohort: "",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setSuccessMessage(null);
    setError(null);
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/session/delete/${id}`);
      if (response.data.success) {
        setSuccessMessage("Session deleted successfully!");
        setError(null);
        fetchSessions();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.data.message || "Failed to delete session");
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      setError(error.response?.data?.message || "Failed to delete session");
      setSuccessMessage(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-full bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>
              <p className="mt-1 text-sm text-gray-500">Manage all sessions</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/session/new")}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#239d62] hover:bg-[#239d62]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62]"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                New Session
              </button>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 rounded-md bg-green-50 p-4 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

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

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  placeholder="Search by name..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62] focus:border-[#239d62] sm:text-sm"
                />
              </div>

              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFilter className="text-gray-400" />
                </div>
                <select
                  name="cohort"
                  value={filters.cohort}
                  onChange={handleFilterChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62] focus:border-[#239d62] sm:text-sm"
                >
                  <option value="">All Cohorts</option>
                  {cohorts.map((cohort) => (
                    <option key={cohort._id} value={cohort._id}>
                      {cohort.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62]"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cohort
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Activity
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Facilitator
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#239d62]"></div>
                      </div>
                    </td>
                  </tr>
                ) : sessions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No sessions found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {error || "Try adjusting your search or filters"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => (
                    <tr
                      key={`session-row-${session._id}`}
                      onClick={() => navigate(`/sessions/${session._id}`)}
                      className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer h-12"
                    >
                      <td
                        key={`session-name-${session._id}`}
                        className="px-4 py-2 whitespace-nowrap"
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {session.name}
                        </div>
                      </td>
                      <td
                        key={`session-cohort-${session._id}`}
                        className="px-4 py-2"
                      >
                        <div className="text-sm text-gray-500">
                          {session.cohort?.name || "No cohort"}
                        </div>
                      </td>
                      <td
                        key={`session-activity-${session._id}`}
                        className="px-4 py-2"
                      >
                        <div className="text-sm text-gray-500">
                          {session.activity?.length > 0 ? (
                            <ul className="list-disc list-inside">
                              {session.activity.map((act, activityIndex) => (
                                <li
                                  key={`session-${session._id}-activity-${activityIndex}-${act._id}`}
                                >
                                  {act.name}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "No activity"
                          )}
                        </div>
                      </td>
                      <td
                        key={`session-date-${session._id}`}
                        className="px-4 py-2"
                      >
                        <div className="text-sm text-gray-500">
                          {formatDate(session.date)}
                        </div>
                      </td>
                      <td
                        key={`session-duration-${session._id}`}
                        className="px-4 py-2"
                      >
                        <div className="text-sm text-gray-500">
                          {session.numberOfMins} mins
                        </div>
                      </td>
                      <td
                        key={`session-facilitator-${session._id}`}
                        className="px-4 py-2"
                      >
                        <div className="text-sm text-gray-500">
                          {session.activityFacilitator || "No facilitator"}
                        </div>
                      </td>
                      <td
                        key={`session-actions-${session._id}`}
                        className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/sessions/edit/${session._id}`);
                          }}
                          className="text-[#239d62] hover:text-[#239d62]/80 mr-3 p-1 hover:bg-[#239d62]/10 rounded-full transition-colors duration-200"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(session._id);
                          }}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded-full transition-colors duration-200"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage - 1,
                  }))
                }
                disabled={pagination.currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                  }))
                }
                disabled={pagination.currentPage === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(pagination.currentPage - 1) * pagination.pageSize + 1 ||
                      0}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.currentPage * pagination.pageSize,
                      pagination.totalSessions || 0
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {pagination.totalSessions || 0}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, currentPage: 1 }))
                    }
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <span className="sr-only">First</span>
                    ««
                  </button>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: prev.currentPage - 1,
                      }))
                    }
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <span className="sr-only">Previous</span>«
                  </button>
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === pagination.currentPage;

                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= pagination.currentPage - 2 &&
                        page <= pagination.currentPage + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() =>
                            setPagination((prev) => ({
                              ...prev,
                              currentPage: page,
                            }))
                          }
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            isCurrentPage
                              ? "z-10 bg-[#239d62] border-[#239d62] text-white"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }

                    if (
                      page === pagination.currentPage - 3 ||
                      page === pagination.currentPage + 3
                    ) {
                      return (
                        <span
                          key={page}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }

                    return null;
                  })}
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: prev.currentPage + 1,
                      }))
                    }
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <span className="sr-only">Next</span>»
                  </button>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: pagination.totalPages,
                      }))
                    }
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <span className="sr-only">Last</span>
                    »»
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionList;
