import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import axiosInstance from "../utils/axios";

const EditDomain = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subTopics: [],
    happinessParameter: [],
  });
  const [activities, setActivities] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const happinessOptions = [
    "Positive Emotions",
    "Social Belonging",
    "Engagement & Purpose",
    "Satisfaction with the program",
  ];

  useEffect(() => {
    fetchDomain();
    fetchActivities();
  }, [id]);

  const fetchDomain = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/domain/${id}`);

      if (response.data.success) {
        const subTopics =
          response.data.data.subTopics?.map((subTopic) =>
            typeof subTopic === "string" ? subTopic : subTopic.content || ""
          ) || [];

        setFormData({
          name: response.data.data.name || "",
          category: response.data.data.category || "",
          subTopics: subTopics,
          happinessParameter: response.data.data.happinessParameter || [],
        });
      } else {
        setError("Domain not found");
      }
    } catch (error) {
      console.error("Error fetching domain:", error);
      setError(error.response?.data?.message || "Failed to fetch domain");
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axiosInstance.get("/activity/all");
      if (response.data.success) {
        setActivities(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubTopicChange = (index, value) => {
    setFormData((prev) => {
      const newSubTopics = [...prev.subTopics];
      newSubTopics[index] = value;
      return {
        ...prev,
        subTopics: newSubTopics,
      };
    });
  };

  const addSubTopic = () => {
    setFormData((prev) => ({
      ...prev,
      subTopics: [...prev.subTopics, ""],
    }));
  };

  const removeSubTopic = (index) => {
    setFormData((prev) => ({
      ...prev,
      subTopics: prev.subTopics.filter((_, i) => i !== index),
    }));
  };

  const handleAddHappinessParameter = (e) => {
    const value = e.target.value;
    if (value && !formData.happinessParameter.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        happinessParameter: [...prev.happinessParameter, value],
      }));
    }
  };
  const handleRemoveHappinessParameter = (param) => {
    setFormData((prev) => ({
      ...prev,
      happinessParameter: prev.happinessParameter.filter((p) => p !== param),
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.category) errors.category = "Category is required";
    if (formData.subTopics.length === 0)
      errors.subTopics = "At least one subtopic is required";
    if (
      !formData.happinessParameter ||
      formData.happinessParameter.length === 0
    )
      errors.happinessParameter =
        "At least one happiness parameter is required";
    formData.subTopics.forEach((subTopic, index) => {
      if (!subTopic.trim())
        errors[`subTopic-${index}`] = "Subtopic cannot be empty";
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError(null);

      const dataToSend = {
        ...formData,
        subTopics: formData.subTopics.map((content) => ({
          content: content,
        })),
      };

      const response = await axiosInstance.patch(
        `/domain/edit/${id}`,
        dataToSend
      );

      if (response.data.success) {
        navigate(`/evaluation-master/${id}`);
      } else {
        setError(response.data.message || "Failed to update domain");
      }
    } catch (error) {
      console.error("Error updating domain:", error);
      setError(error.response?.data?.message || "Failed to update domain");
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-full bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Domain</h1>
              <p className="mt-2 text-base text-gray-500">
                Update domain information
              </p>
            </div>
            <button
              onClick={() => navigate(`/evaluation-master/${id}`)}
              className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2 h-5 w-5" />
              Back to Details
            </button>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Domain Information */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Domain Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200`}
                    placeholder="Enter domain name"
                  />
                  {formErrors.name && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200`}
                  >
                    <option value="">Select category</option>
                    <option value="General">General</option>
                    <option value="Special Need">Special Need</option>
                  </select>
                  {formErrors.category && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.category}
                    </p>
                  )}
                </div>

                {/* Happiness Parameter Multi-Select */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Happiness Parameter <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.happinessParameter.map((param) => (
                      <span
                        key={param}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#239d62]/10 text-[#239d62]"
                      >
                        {param}
                        <button
                          type="button"
                          className="ml-2 text-[#239d62] hover:text-[#239d62]/80 focus:outline-none"
                          onClick={() => handleRemoveHappinessParameter(param)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <select
                    value=""
                    onChange={handleAddHappinessParameter}
                    className={`block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200`}
                  >
                    <option value="">Select a parameter</option>
                    {happinessOptions
                      .filter(
                        (opt) => !formData.happinessParameter.includes(opt)
                      )
                      .map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                  </select>
                  {formErrors.happinessParameter && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.happinessParameter}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Subtopics */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Subtopics</h3>
                <button
                  type="button"
                  onClick={addSubTopic}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-[#239d62] hover:bg-[#239d62]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62]"
                >
                  Add Subtopic
                </button>
              </div>
              {formErrors.subTopics && (
                <p className="mb-4 text-sm text-red-600">
                  {formErrors.subTopics}
                </p>
              )}
              <div className="space-y-4">
                {formData.subTopics.map((subTopic, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={subTopic}
                        onChange={(e) =>
                          handleSubTopicChange(index, e.target.value)
                        }
                        className={`block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200`}
                        placeholder={`Subtopic ${index + 1}`}
                      />
                      {formErrors[`subTopic-${index}`] && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrors[`subTopic-${index}`]}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSubTopic(index)}
                      className="inline-flex items-center justify-center p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/evaluation-master/${id}`)}
              className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#239d62] hover:bg-[#239d62]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  Updating...
                </>
              ) : (
                "Update Domain"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDomain;
