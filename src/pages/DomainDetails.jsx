import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { FiEdit2, FiTrash2, FiArrowLeft } from "react-icons/fi";
import ConfirmationModal from "../components/ConfirmationModal";

const DomainDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/domain/${id}`);
        if (response.data.success) {
          setDomain(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch domain details");
        }
      } catch (error) {
        console.error("Error fetching domain:", error);
        setError(
          error.response?.data?.message || "Failed to fetch domain details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDomain();
  }, [id]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/domain/${id}`);
      if (response.data.success) {
        navigate("/evaluation-master");
      } else {
        setError(response.data.message || "Failed to delete domain");
      }
    } catch (error) {
      console.error("Error deleting domain:", error);
      setError(error.response?.data?.message || "Failed to delete domain");
    } finally {
      setLoading(false);
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

  if (!domain) {
    return (
      <div className="min-h-full bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Domain not found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The domain you're looking for doesn't exist.
            </p>
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
                Domain Details
              </h1>
              <p className="mt-2 text-base text-gray-500">
                View and manage domain information
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() =>
                  navigate(`/evaluation-master/edit/${domain._id}`)
                }
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
              >
                <FiEdit2 className="mr-2 h-5 w-5" />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <FiTrash2 className="mr-2 h-5 w-5" />
                Delete
              </button>
              <button
                onClick={() => navigate("/evaluation-master")}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
              >
                <FiArrowLeft className="mr-2 h-5 w-5" />
                Back to List
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Domain Information Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Domain Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="mt-1 text-sm text-gray-900">{domain.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {domain.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Happiness Parameters
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {domain.happinessParameter?.join(", ") || "None"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subtopics Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Subtopics ({domain.subTopics?.length || 0})
              </h3>
              <div className="space-y-4">
                {domain.subTopics?.map((subTopic, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <p className="text-sm text-gray-900">{subTopic.content}</p>
                  </div>
                ))}
                {(!domain.subTopics || domain.subTopics.length === 0) && (
                  <div className="text-center py-4 text-sm text-gray-500">
                    No subtopics added yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Delete Domain"
          message="Are you sure you want to delete this domain? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default DomainDetails;
