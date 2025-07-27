import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit2, FiArrowLeft, FiBarChart2 } from "react-icons/fi";
import ConfirmationModal from "../components/ConfirmationModal";
import axiosInstance from "../utils/axios";

const MemberDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/participant/${id}`);

      console.log("API Response:", response.data);

      if (response.data && response.data.success && response.data.data) {
        setMember(response.data.data);
      } else {
        setError("Member data not found");
      }
    } catch (error) {
      console.error("Error fetching member:", error);
      setError(error.response?.data?.message || "Failed to fetch member");
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = () => {
    setActionType("archive");
    setShowArchiveModal(true);
  };

  const handleUnarchive = () => {
    setActionType("unarchive");
    setShowUnarchiveModal(true);
  };

  const handleArchiveConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.patch(`/participant/${id}/archive`);

      if (response.data.success) {
        setMember((prev) => ({ ...prev, archived: true }));
      } else {
        setError(response.data.message || "Failed to archive member");
      }
    } catch (error) {
      console.error("Error archiving member:", error);
      setError(error.response?.data?.message || "Failed to archive member");
    } finally {
      setLoading(false);
      setShowArchiveModal(false);
      setActionType("");
    }
  };

  const handleUnarchiveConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.patch(
        `/participant/${id}/unarchive`
      );

      if (response.data.success) {
        setMember((prev) => ({ ...prev, archived: false }));
      } else {
        setError(response.data.message || "Failed to unarchive member");
      }
    } catch (error) {
      console.error("Error unarchiving member:", error);
      setError(error.response?.data?.message || "Failed to unarchive member");
    } finally {
      setLoading(false);
      setShowUnarchiveModal(false);
      setActionType("");
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

  if (!member) {
    return (
      <div className="min-h-full bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Member not found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The member you're looking for doesn't exist or has been archived.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/members")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62]"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back to Members
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
                Member Details
              </h1>
              <p className="mt-2 text-base text-gray-500">
                View and manage member information
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {!member.archived ? (
                <button
                  onClick={handleArchive}
                  className="inline-flex items-center px-5 py-2.5 border border-yellow-300 rounded-lg shadow-sm text-base font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Archive Member
                </button>
              ) : (
                <button
                  onClick={handleUnarchive}
                  className="inline-flex items-center px-5 py-2.5 border border-green-300 rounded-lg shadow-sm text-base font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Unarchive Member
                </button>
              )}
              <button
                onClick={() => navigate(`/members/edit/${id}`)}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
              >
                <FiEdit2 className="mr-2 h-5 w-5" />
                Edit
              </button>
              <button
                onClick={() => navigate(`/performance/${member._id}`)}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
              >
                <FiBarChart2 className="mr-2 h-5 w-5" />
                View Performance Trends
              </button>
              <button
                onClick={() => navigate("/members")}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
              >
                <FiArrowLeft className="mr-2 h-5 w-5" />
                Back to Members
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="mt-1 text-sm text-gray-900">{member.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="mt-1 text-sm text-gray-900">{member.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(member.dob).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Participant Type
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {member.participantType}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.archived
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {member.archived ? "Archived" : "Active"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Member Since
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(member.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Last Updated
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(member.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Email Address
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {member.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Phone Number
                  </p>
                  <p className="mt-1 text-sm text-gray-900">{member.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Address
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Address Line
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {member.address.addressLine}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">City</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {member.address.city}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">State</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {member.address.state}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pincode</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {member.address.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Contact Name
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {member.emergencyContact.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Relationship
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {member.emergencyContact.relationship}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Contact Number
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {member.emergencyContact.phone}
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
                    {member.cohort?.name || "Not assigned to a cohort"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Brief Background Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Brief Background
              </h3>
              <div className="mt-1">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {member.briefBackground}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Word count: {member.briefBackground.split(" ").length}/100
                </p>
              </div>
            </div>
          </div>
        </div>

        <ConfirmationModal
          isOpen={showArchiveModal}
          onClose={() => {
            setShowArchiveModal(false);
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

export default MemberDetails;
