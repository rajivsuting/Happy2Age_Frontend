import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";

const EditMember = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    participantType: "",
    address: {
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    cohort: "",
    briefBackground: "",
  });
  const [cohorts, setCohorts] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchMember();
    fetchCohorts();
  }, [id]);

  const fetchMember = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:8000/participant/${id}`
      );
      console.log("Member data:", response.data.data);
      console.log("Participant type:", response.data.data?.participantType);

      if (response.data.success && response.data.data) {
        const member = response.data.data;
        setFormData({
          name: member.name || "",
          email: member.email || "",
          phone: member.phone || "",
          dob: member.dob
            ? new Date(member.dob).toISOString().split("T")[0]
            : "",
          gender: member.gender || "",
          participantType: member.participantType || "",
          address: {
            addressLine: member.address?.addressLine || "",
            city: member.address?.city || "",
            state: member.address?.state || "",
            pincode: member.address?.pincode || "",
          },
          emergencyContact: {
            name: member.emergencyContact?.name || "",
            relationship: member.emergencyContact?.relationship || "",
            phone: member.emergencyContact?.phone || "",
          },
          cohort: member.cohort?._id || "",
          briefBackground: member.briefBackground || "",
        });
      } else {
        setError("Failed to fetch member details");
      }
    } catch (error) {
      console.error("Error fetching member:", error);
      setError(
        error.response?.data?.message || "Failed to fetch member details"
      );
    } finally {
      setLoading(false);
    }
  };

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
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.dob) errors.dob = "Date of birth is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.participantType)
      errors.participantType = "Participant type is required";
    if (!formData.address.addressLine.trim())
      errors.addressLine = "Address line is required";
    if (!formData.address.city.trim()) errors.city = "City is required";
    if (!formData.address.state.trim()) errors.state = "State is required";
    if (!formData.address.pincode.trim())
      errors.pincode = "PIN code is required";
    if (!formData.emergencyContact.name.trim())
      errors.emergencyName = "Emergency contact name is required";
    if (!formData.emergencyContact.relationship.trim())
      errors.emergencyRelationship =
        "Emergency contact relationship is required";
    if (!formData.emergencyContact.phone.trim())
      errors.emergencyPhone = "Emergency contact phone is required";
    if (!formData.briefBackground.trim())
      errors.briefBackground = "Brief background is required";
    if (formData.briefBackground.split(/\s+/).length > 100) {
      errors.briefBackground = "Brief background should not exceed 100 words";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
      const response = await axios.patch(
        `http://localhost:8000/participant/edit/${id}`,
        formData
      );

      if (response.data.success) {
        navigate(`/members/${id}`);
      } else {
        setError(response.data.message || "Failed to update member");
      }
    } catch (error) {
      console.error("Error updating member:", error);
      setError(error.response?.data?.message || "Failed to update member");
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

  return (
    <div className="min-h-full bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Member</h1>
              <p className="mt-2 text-base text-gray-500">
                Update member information
              </p>
            </div>
            <button
              onClick={() => navigate(`/members/${id}`)}
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
          {/* Personal Information */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
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
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                      formErrors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                    }`}
                    placeholder="Enter full name"
                  />
                  {formErrors.name && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.name}
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
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                      formErrors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                    }`}
                    placeholder="Enter email address"
                  />
                  {formErrors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.email}
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
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                      formErrors.phone
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                    }`}
                    placeholder="Enter phone number"
                  />
                  {formErrors.phone && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.phone}
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
                    required
                    value={formData.dob}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                      formErrors.dob
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                    }`}
                  />
                  {formErrors.dob && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.dob}
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
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                      formErrors.gender
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {formErrors.gender && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.gender}
                    </p>
                  )}
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
                    required
                    value={formData.participantType}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                      formErrors.participantType
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                    }`}
                  >
                    <option value="">Select type</option>
                    <option value="General">General</option>
                    <option value="Special Need">Special Need</option>
                  </select>
                  {formErrors.participantType && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.participantType}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
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
                    required
                    value={formData.address.addressLine}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                      formErrors["address.addressLine"]
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                    }`}
                    placeholder="Enter address line"
                  />
                  {formErrors["address.addressLine"] && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors["address.addressLine"]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      formErrors.city
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-[#239d62] focus:border-[#239d62]"
                    }`}
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.city}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      formErrors.state
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-[#239d62] focus:border-[#239d62]"
                    }`}
                  />
                  {formErrors.state && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.state}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      formErrors.pincode
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-[#239d62] focus:border-[#239d62]"
                    }`}
                  />
                  {formErrors.pincode && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.pincode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    required
                    value={formData.emergencyContact.name}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                      formErrors["emergencyContact.name"]
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                    }`}
                    placeholder="Enter emergency contact name"
                  />
                  {formErrors["emergencyContact.name"] && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors["emergencyContact.name"]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Relationship *
                  </label>
                  <input
                    type="text"
                    name="emergencyContact.relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      formErrors.emergencyRelationship
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-[#239d62] focus:border-[#239d62]"
                    }`}
                  />
                  {formErrors.emergencyRelationship && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.emergencyRelationship}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact.phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      formErrors.emergencyPhone
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-[#239d62] focus:border-[#239d62]"
                    }`}
                  />
                  {formErrors.emergencyPhone && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.emergencyPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cohort Information */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
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
                    className={`block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                      formErrors.cohort
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                    }`}
                  >
                    <option value="">Select a cohort</option>
                    {cohorts.map((cohort) => (
                      <option key={cohort._id} value={cohort._id}>
                        {cohort.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.cohort && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.cohort}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Brief Background */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Brief Background
              </h3>
              <div>
                <label
                  htmlFor="briefBackground"
                  className="block text-sm font-medium text-gray-700"
                >
                  Brief Background <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="briefBackground"
                  name="briefBackground"
                  required
                  rows={4}
                  value={formData.briefBackground}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 ${
                    formErrors.briefBackground
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                  }`}
                  placeholder="Enter brief background (max 100 words)"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Word count: {formData.briefBackground.split(/\s+/).length}/100
                </p>
                {formErrors.briefBackground && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.briefBackground}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/members/${id}`)}
              className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#239d62] hover:bg-[#239d62]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
            >
              {loading ? (
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
                "Update Member"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMember;
