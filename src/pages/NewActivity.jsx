import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import axiosInstance from "../utils/axios";

const NewActivity = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [domains, setDomains] = useState([]);
  const [primarySearchTerm, setPrimarySearchTerm] = useState("");
  const [secondarySearchTerm, setSecondarySearchTerm] = useState("");
  const [showPrimaryDropdown, setShowPrimaryDropdown] = useState(false);
  const [showSecondaryDropdown, setShowSecondaryDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    references: "",
    primaryDomain: "",
    secondaryDomain: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    description: false,
    primaryDomain: false,
  });

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await axiosInstance.get("/domain/all");
      if (response.data.success) {
        setDomains(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching domains:", error);
      setError("Failed to fetch domains");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const getFieldError = (field) => {
    if (!touched[field]) return null;
    if (!formData[field]) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post("/activity/create", formData);

      if (response.data.success) {
        navigate("/activities");
      } else {
        setError(response.data.message || "Failed to create activity");
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      setError(error.response?.data?.message || "Failed to create activity");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    setTouched({
      name: true,
      description: true,
      primaryDomain: true,
    });

    if (!formData.name || !formData.description || !formData.primaryDomain) {
      setError("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const filteredPrimaryDomains = domains.filter((domain) =>
    domain.name.toLowerCase().includes(primarySearchTerm.toLowerCase())
  );

  const filteredSecondaryDomains = domains.filter((domain) =>
    domain.name.toLowerCase().includes(secondarySearchTerm.toLowerCase())
  );

  const getSelectedDomainName = (domainId) => {
    const domain = domains.find((d) => d._id === domainId);
    return domain ? domain.name : "";
  };

  return (
    <div className="min-h-full bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">New Activity</h1>
              <p className="mt-2 text-base text-gray-500">
                Create a new activity by filling out the form below
              </p>
            </div>
            <button
              onClick={() => navigate("/activities")}
              className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 rounded-lg bg-red-50 p-4 border border-red-100 shadow-sm">
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
                <p className="text-base font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-lg font-medium text-gray-700"
                  >
                    Activity Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200`}
                      placeholder="Activity name"
                    />
                    {getFieldError("name") && (
                      <p className="mt-2 text-sm text-red-600">
                        {getFieldError("name")}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="primaryDomain"
                    className="block text-lg font-medium text-gray-700"
                  >
                    Primary Domain <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={
                        formData.primaryDomain
                          ? getSelectedDomainName(formData.primaryDomain)
                          : primarySearchTerm
                      }
                      onChange={(e) => {
                        setPrimarySearchTerm(e.target.value);
                        setShowPrimaryDropdown(true);
                      }}
                      onFocus={() => setShowPrimaryDropdown(true)}
                      placeholder="Search and select primary domain..."
                      className={`block w-full pl-10 pr-3 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200`}
                    />
                    {showPrimaryDropdown && (
                      <div className="mt-1 max-h-60 overflow-y-auto border border-gray-200 rounded-md absolute z-10 w-full bg-white shadow-lg">
                        {filteredPrimaryDomains.length > 0 ? (
                          filteredPrimaryDomains.map((domain) => (
                            <div
                              key={domain._id}
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  primaryDomain: domain._id,
                                }));
                                setPrimarySearchTerm(domain.name);
                                setShowPrimaryDropdown(false);
                              }}
                              className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                            >
                              {domain.name}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            No domains found
                          </div>
                        )}
                      </div>
                    )}
                    {getFieldError("primaryDomain") && (
                      <p className="mt-2 text-sm text-red-600">
                        {getFieldError("primaryDomain")}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="secondaryDomain"
                    className="block text-lg font-medium text-gray-700"
                  >
                    Secondary Domain
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={
                        formData.secondaryDomain
                          ? getSelectedDomainName(formData.secondaryDomain)
                          : secondarySearchTerm
                      }
                      onChange={(e) => {
                        setSecondarySearchTerm(e.target.value);
                        setShowSecondaryDropdown(true);
                      }}
                      onFocus={() => setShowSecondaryDropdown(true)}
                      placeholder="Search and select secondary domain..."
                      className="block w-full pl-10 pr-3 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200"
                    />
                    {showSecondaryDropdown && (
                      <div className="mt-1 max-h-60 overflow-y-auto border border-gray-200 rounded-md absolute z-10 w-full bg-white shadow-lg">
                        {filteredSecondaryDomains.length > 0 ? (
                          filteredSecondaryDomains.map((domain) => (
                            <div
                              key={domain._id}
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  secondaryDomain: domain._id,
                                }));
                                setSecondarySearchTerm(domain.name);
                                setShowSecondaryDropdown(false);
                              }}
                              className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                            >
                              {domain.name}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            No domains found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-lg font-medium text-gray-700"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200`}
                      placeholder="Activity description"
                    />
                    {getFieldError("description") && (
                      <p className="mt-2 text-sm text-red-600">
                        {getFieldError("description")}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="references"
                    className="block text-lg font-medium text-gray-700"
                  >
                    References
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="references"
                      name="references"
                      rows={3}
                      value={formData.references}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200"
                      placeholder="References (optional)"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/activities")}
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
                    "Create Activity"
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

export default NewActivity;
