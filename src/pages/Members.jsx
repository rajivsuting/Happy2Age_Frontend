import React, { useState, useEffect, useCallback } from "react";
import { FiSearch, FiTrash2, FiEdit2, FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import axiosInstance from "../utils/axios";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalMembers: 0,
  });
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [actionType, setActionType] = useState("");
  const navigate = useNavigate();

  // Debounce the search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch members when debounced search or page changes
  useEffect(() => {
    fetchMembers();
  }, [debouncedSearch, pagination.currentPage]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
      });

      const response = await axiosInstance.get(
        `/participant/all?${queryParams}`
      );

      if (response.data.success) {
        setMembers(response.data.data || []);
        setPagination({
          ...pagination,
          totalPages: response.data.totalPages,
          totalMembers: response.data.totalParticipants,
        });
      } else {
        setMembers([]);
        setError(response.data.message || "Failed to fetch members");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setError(error.response?.data?.message || "Failed to fetch members");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    setSelectedMember(id);
    setActionType("archive");
    setShowArchiveModal(true);
  };

  const handleUnarchive = async (id, e) => {
    e.stopPropagation();
    setSelectedMember(id);
    setActionType("unarchive");
    setShowUnarchiveModal(true);
  };

  const handleArchiveConfirm = async () => {
    try {
      const response = await axiosInstance.patch(
        `/participant/${selectedMember}/archive`
      );
      if (response.data.success) {
        fetchMembers();
      } else {
        setError(response.data.message || "Failed to archive member");
      }
    } catch (error) {
      console.error("Error archiving member:", error);
      setError(error.response?.data?.message || "Failed to archive member");
    } finally {
      setShowArchiveModal(false);
      setSelectedMember(null);
      setActionType("");
    }
  };

  const handleUnarchiveConfirm = async () => {
    try {
      const response = await axiosInstance.patch(
        `/participant/${selectedMember}/unarchive`
      );
      if (response.data.success) {
        fetchMembers();
      } else {
        setError(response.data.message || "Failed to unarchive member");
      }
    } catch (error) {
      console.error("Error unarchiving member:", error);
      setError(error.response?.data?.message || "Failed to unarchive member");
    } finally {
      setShowUnarchiveModal(false);
      setSelectedMember(null);
      setActionType("");
    }
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const exportMembersToCSV = async () => {
    try {
      // Show loading state
      setLoading(true);

      // Fetch all members for export
      const response = await axiosInstance.get("/participant/export");

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch members for export"
        );
      }

      const members = response.data.data;

      // Create CSV header
      const headers = [
        "Name",
        "Email",
        "Phone",
        "Gender",
        "Date of Birth",
        "Center",
        "Status",
      ];
      const csvContent = [headers.join(",")];

      // Add member data
      members.forEach((member) => {
        const row = [
          `"${member.name}"`,
          `"${member.email}"`,
          `"${member.phone || ""}"`,
          `"${member.gender || ""}"`,
          `"${member.dob ? new Date(member.dob).toLocaleDateString() : ""}"`,
          `"${member.cohort?.name || ""}"`,
          `"${member.archived ? "Archived" : "Active"}"`,
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
        `members_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting members:", error);
      setError(error.message || "Failed to export members");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">Members</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and organize all your members
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
                onClick={exportMembersToCSV}
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                className="inline-flex items-center px-4 py-2 bg-[#239d62] text-white text-sm font-medium rounded-md shadow-sm hover:bg-[#239d62]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
                onClick={() => navigate("/members/new")}
              >
                <span className="mr-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </span>
                New Member
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
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62] focus:border-[#239d62] sm:text-sm"
              />
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
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phone
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
                    <td colSpan="4" className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#239d62]"></div>
                      </div>
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
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
                          No members found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {error || "Try adjusting your search"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr
                      key={member._id}
                      onClick={() => navigate(`/members/${member._id}`)}
                      className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer h-12"
                    >
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm text-gray-500">
                          {truncateText(member.email)}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm text-gray-500">
                          {member.phone || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/members/edit/${member._id}`);
                          }}
                          className="text-[#239d62] hover:text-[#239d62]/80 mr-3 p-1 hover:bg-[#239d62]/10 rounded-full transition-colors duration-200"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        {member.archived ? (
                          <button
                            onClick={(e) => handleUnarchive(member._id, e)}
                            className="inline-flex items-center text-green-600 hover:text-green-800 px-2 py-1 hover:bg-green-50 rounded-md transition-colors duration-200"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            Unarchive
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleDelete(member._id, e)}
                            className="inline-flex items-center text-yellow-600 hover:text-yellow-800 px-2 py-1 hover:bg-yellow-50 rounded-md transition-colors duration-200"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                              />
                            </svg>
                            Archive
                          </button>
                        )}
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
                    {(pagination.currentPage - 1) * pagination.pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.currentPage * pagination.pageSize,
                      pagination.totalMembers
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{pagination.totalMembers}</span>{" "}
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

        <ConfirmationModal
          isOpen={showArchiveModal}
          onClose={() => {
            setShowArchiveModal(false);
            setSelectedMember(null);
            setActionType("");
          }}
          onConfirm={handleArchiveConfirm}
          title="Archive Member"
          message="Are you sure you want to archive this member? This action can be undone later."
          confirmText="Archive"
          cancelText="Cancel"
        />

        <ConfirmationModal
          isOpen={showUnarchiveModal}
          onClose={() => {
            setShowUnarchiveModal(false);
            setSelectedMember(null);
            setActionType("");
          }}
          onConfirm={handleUnarchiveConfirm}
          title="Unarchive Member"
          message="Are you sure you want to unarchive this member?"
          confirmText="Unarchive"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default Members;
