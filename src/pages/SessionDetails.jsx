import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit2, FiArrowLeft, FiTrash2 } from "react-icons/fi";
import ConfirmationModal from "../components/ConfirmationModal";
import axiosInstance from "../utils/axios";

const SessionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [id]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/session/${id}`);

      console.log(response.data);
      if (response.data.success) {
        setSession(response.data.message);
      } else {
        setError("Session data not found");
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      setError(error.response?.data?.message || "Failed to fetch session");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.delete(`/session/${id}`);

      if (response.data.success) {
        navigate("/sessions/list");
      } else {
        setError(response.data.message || "Failed to delete session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      setError(error.response?.data?.message || "Failed to delete session");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  if (!session) {
    return (
      <div className="min-h-full bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Session not found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The session you're looking for doesn't exist.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/sessions/list")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62]"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back to Sessions
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
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Session Details
              </h1>
              <p className="mt-2 text-base text-gray-500">
                View and manage session information
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-5 py-2.5 border border-red-300 rounded-lg shadow-sm text-base font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <FiTrash2 className="mr-2 h-5 w-5" />
                Delete
              </button>
              <button
                onClick={() => navigate(`/sessions/edit/${id}`)}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
              >
                <FiEdit2 className="mr-2 h-5 w-5" />
                Edit
              </button>
              <button
                onClick={() => navigate("/sessions/list")}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
              >
                <FiArrowLeft className="mr-2 h-5 w-5" />
                Back to Sessions
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Session Name
                  </p>
                  <p className="mt-1 text-sm text-gray-900">{session.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(session.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {session.numberOfMins} minutes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cohort Information Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cohort Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Cohort Name
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {session.cohort?.name || "No cohort assigned"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activities Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Activities
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Activities
                  </p>
                  <ul className="mt-1 list-disc list-inside">
                    {session.activity?.length > 0 ? (
                      session.activity.map((act, index) => (
                        <li
                          key={`activity-${act._id || index}`}
                          className="text-sm text-gray-900"
                        >
                          {act.name}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500">No activities</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Participants Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Participants
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {session.participants?.length > 0 ? (
                      session.participants.map((participant, index) => (
                        <tr
                          key={`participant-${
                            participant.participantId?._id || index
                          }`}
                          onClick={() =>
                            navigate(
                              `/members/${participant.participantId?._id}`
                            )
                          }
                          className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        >
                          <td
                            key={`name-${
                              participant.participantId?._id || index
                            }`}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            <div className="text-sm font-medium text-gray-900">
                              {participant.participantId?.name || "N/A"}
                            </div>
                          </td>
                          <td
                            key={`email-${
                              participant.participantId?._id || index
                            }`}
                            className="px-6 py-4"
                          >
                            <div className="text-sm text-gray-500">
                              {participant.participantId?.email || "N/A"}
                            </div>
                          </td>
                          <td
                            key={`phone-${
                              participant.participantId?._id || index
                            }`}
                            className="px-6 py-4"
                          >
                            <div className="text-sm text-gray-500">
                              {participant.participantId?.phone || "N/A"}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No participants found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Session"
          message="Are you sure you want to delete this session? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default SessionDetails;
