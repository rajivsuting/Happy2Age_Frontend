import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";

const NewDomain = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "General",
    subTopics: [],
    happinessParameter: [],
  });

  const [errors, setErrors] = useState({});
  const [currentSubTopic, setCurrentSubTopic] = useState("");

  useEffect(() => {
    // Fetch activities for the dropdown
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

    fetchActivities();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    // Subtopics validation
    if (formData.subTopics.length === 0) {
      newErrors.subTopics = "At least one subtopic is required";
    } else {
      formData.subTopics.forEach((subTopic, index) => {
        if (!subTopic.content || !subTopic.content.trim()) {
          newErrors[`subTopic${index}`] = "Subtopic content is required";
        }
      });
    }

    // Happiness Parameter validation
    if (
      !formData.happinessParameter ||
      formData.happinessParameter.length === 0
    ) {
      newErrors.happinessParameter =
        "At least one happiness parameter is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, options } = e.target;
    if (name === "happinessParameter") {
      const selected = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormData((prev) => ({
        ...prev,
        [name]: selected,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubTopicChange = (e) => {
    setCurrentSubTopic(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentSubTopic.trim() !== "") {
        setFormData((prev) => ({
          ...prev,
          subTopics: [
            ...prev.subTopics,
            {
              content: currentSubTopic.trim(),
              score: 0,
            },
          ],
        }));
        setCurrentSubTopic("");
      }
    }
  };

  const removeSubTopic = (index) => {
    setFormData((prev) => {
      const newSubTopics = prev.subTopics.filter((_, i) => i !== index);
      return {
        ...prev,
        subTopics: newSubTopics,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log(formData);

    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post("/domain/create", formData);
      if (response.data.success) {
        navigate("/evaluation-master");
      } else {
        setError(response.data.message || "Failed to create domain");
      }
    } catch (error) {
      console.error("Error creating domain:", error);
      setError(error.response?.data?.message || "Failed to create domain");
    } finally {
      setLoading(false);
    }
  };

  const happinessOptions = [
    "Positive Emotions",
    "Social Belonging",
    "Engagement & Purpose",
    "Satisfaction with the program",
  ];

  return (
    <div className="min-h-full bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">New Domain</h1>
              <p className="mt-2 text-base text-gray-500">
                Create a new evaluation domain by filling out the form below
              </p>
            </div>
            <button
              onClick={() => navigate("/evaluation-master")}
              className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
            >
              Cancel
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
        <div className="bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Basic Information
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
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200 ${
                          errors.name
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.name}
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
                        value={formData.category}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200 ${
                          errors.category
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      >
                        <option value="General">General</option>
                        <option value="Special Need">Special Need</option>
                      </select>
                      {errors.category && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="happinessParameter"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Happiness Parameter{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      {/* Show selected parameters as tags/chips */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.happinessParameter.map((param, idx) => (
                          <span
                            key={param}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#239d62]/10 text-[#239d62]"
                          >
                            {param}
                            <button
                              type="button"
                              className="ml-2 text-[#239d62] hover:text-[#239d62]/80 focus:outline-none"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  happinessParameter:
                                    prev.happinessParameter.filter(
                                      (p) => p !== param
                                    ),
                                }));
                              }}
                            >
                              <svg
                                className="h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                      <select
                        id="happinessParameter"
                        name="happinessParameter"
                        value=""
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            value &&
                            !formData.happinessParameter.includes(value)
                          ) {
                            setFormData((prev) => ({
                              ...prev,
                              happinessParameter: [
                                ...prev.happinessParameter,
                                value,
                              ],
                            }));
                          }
                        }}
                        className={`block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200 ${
                          errors.happinessParameter
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
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
                      {errors.happinessParameter && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.happinessParameter}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subtopics */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Subtopics
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Type a subtopic and press Enter to add it
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={currentSubTopic}
                        onChange={handleSubTopicChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a subtopic and press Enter..."
                        className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formData.subTopics.map((subTopic, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#239d62]/10 text-[#239d62]"
                        >
                          {subTopic.content}
                          {subTopic.content && (
                            <button
                              type="button"
                              onClick={() => removeSubTopic(index)}
                              className="ml-2 text-[#239d62] hover:text-[#239d62]/80 focus:outline-none"
                            >
                              <svg
                                className="h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {errors.subTopics && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600">{errors.subTopics}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/evaluation-master")}
                  className="mr-4 px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#239d62] hover:bg-[#239d62]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline"
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
                      Creating...
                    </>
                  ) : (
                    "Create Domain"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDomain;
