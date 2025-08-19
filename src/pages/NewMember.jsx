import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";

const NewMember = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "Male",
    participantType: "General",
    address: {
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
    },
    cohort: "",
    briefBackground: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCohorts();
  }, []);

  const fetchCohorts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/cohort/all");
      if (response.data.success) {
        setCohorts(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching cohorts:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    if (
      formData.email &&
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    // Date of Birth validation
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    }

    // Address validation
    if (!formData.address.addressLine.trim()) {
      newErrors["address.addressLine"] = "Address line is required";
    }
    if (!formData.address.city.trim()) {
      newErrors["address.city"] = "City is required";
    }
    if (!formData.address.state.trim()) {
      newErrors["address.state"] = "State is required";
    }
    if (!/^\d{6}$/.test(formData.address.pincode)) {
      newErrors["address.pincode"] = "Please enter a valid 6-digit PIN code";
    }

    // Emergency Contact validation
    if (!formData.emergencyContact.name.trim()) {
      newErrors["emergencyContact.name"] = "Emergency contact name is required";
    }
    if (!formData.emergencyContact.relationship.trim()) {
      newErrors["emergencyContact.relationship"] = "Relationship is required";
    }
    if (!/^\d{10}$/.test(formData.emergencyContact.phone)) {
      newErrors["emergencyContact.phone"] =
        "Please enter a valid 10-digit phone number";
    }

    // Brief Background validation
    if (!formData.briefBackground.trim()) {
      newErrors.briefBackground = "Brief background is required";
    } else if (formData.briefBackground.split(" ").length > 100) {
      newErrors.briefBackground = "Brief background must not exceed 100 words";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        "http://localhost:8000/participant/create",
        formData
      );
      if (response.data.success) {
        navigate("/members");
      } else {
        setError(response.data.message || "Failed to create member");
      }
    } catch (error) {
      console.error("Error creating member:", error);
      setError(error.response?.data?.message || "Failed to create member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">New Member</h1>
              <p className="mt-2 text-base text-gray-500">
                Create a new member by filling out the form below
              </p>
            </div>
            <button
              onClick={() => navigate("/members")}
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
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                          errors.name
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
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
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                          errors.email
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                          errors.phone
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="dob"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                          errors.dob
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                        }`}
                      />
                      {errors.dob && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.dob}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 text-base rounded-lg border-gray-300 shadow-sm focus:border-[#239d62] focus:ring-[#239d62]"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="participantType"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Participant Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="participantType"
                        name="participantType"
                        value={formData.participantType}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 text-base rounded-lg border-gray-300 shadow-sm focus:border-[#239d62] focus:ring-[#239d62]"
                      >
                        <option value="General">General</option>
                        <option value="Special Need">Special Need</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Address
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="address.addressLine"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address Line <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="address.addressLine"
                        name="address.addressLine"
                        value={formData.address.addressLine}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                          errors["address.addressLine"]
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                        }`}
                      />
                      {errors["address.addressLine"] && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors["address.addressLine"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="address.city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="address.city"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                          errors["address.city"]
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                        }`}
                      />
                      {errors["address.city"] && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors["address.city"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="address.state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="address.state"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                          errors["address.state"]
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                        }`}
                      />
                      {errors["address.state"] && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors["address.state"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="address.pincode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="address.pincode"
                        name="address.pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                          errors["address.pincode"]
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                        }`}
                      />
                      {errors["address.pincode"] && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors["address.pincode"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label
                        htmlFor="emergencyContact.name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Contact Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="emergencyContact.name"
                        name="emergencyContact.name"
                        value={formData.emergencyContact.name}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                          errors["emergencyContact.name"]
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                        }`}
                      />
                      {errors["emergencyContact.name"] && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors["emergencyContact.name"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="emergencyContact.relationship"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Relationship <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="emergencyContact.relationship"
                        name="emergencyContact.relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                          errors["emergencyContact.relationship"]
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                        }`}
                      />
                      {errors["emergencyContact.relationship"] && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors["emergencyContact.relationship"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="emergencyContact.phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="emergencyContact.phone"
                        name="emergencyContact.phone"
                        value={formData.emergencyContact.phone}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                          errors["emergencyContact.phone"]
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                        }`}
                      />
                      {errors["emergencyContact.phone"] && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors["emergencyContact.phone"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cohort Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Cohort Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        htmlFor="cohort"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Cohort
                      </label>
                      <select
                        id="cohort"
                        name="cohort"
                        value={formData.cohort}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 text-base rounded-lg border-gray-300 shadow-sm focus:border-[#239d62] focus:ring-[#239d62]"
                      >
                        <option value="">Select a cohort</option>
                        {cohorts.map((cohort) => (
                          <option key={cohort._id} value={cohort._id}>
                            {cohort.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Brief Background */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Brief Background
                  </h3>
                  <div>
                    <label
                      htmlFor="briefBackground"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Background Information{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="briefBackground"
                      name="briefBackground"
                      rows={4}
                      value={formData.briefBackground}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                        errors.briefBackground
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                      }`}
                    />
                    {errors.briefBackground && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.briefBackground}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Word count:{" "}
                      {
                        formData.briefBackground.split(" ").filter(Boolean)
                          .length
                      }
                      /100
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/members")}
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
                    "Create Member"
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

export default NewMember;
