import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";

const NewSession = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showCohortDropdown, setShowCohortDropdown] = useState(false);
  const [showActivitiesDropdown, setShowActivitiesDropdown] = useState(false);
  const [cohortSearchTerm, setCohortSearchTerm] = useState("");
  const [activitySearchTerm, setActivitySearchTerm] = useState("");
  const cohortDropdownRef = useRef(null);
  const activitiesDropdownRef = useRef(null);
  const [session, setSession] = useState({
    name: "",
    cohort: "",
    activity: [],
    participants: [],
    numberOfMins: "",
    activityFacilitator: "",
    date: "",
  });
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  useEffect(() => {
    fetchCohorts();
    fetchActivities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cohortDropdownRef.current &&
        !cohortDropdownRef.current.contains(event.target)
      ) {
        setShowCohortDropdown(false);
      }
      if (
        activitiesDropdownRef.current &&
        !activitiesDropdownRef.current.contains(event.target)
      ) {
        setShowActivitiesDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchCohorts = async () => {
    try {
      const response = await axiosInstance.get("/cohort/all");
      if (response.data.success) {
        setCohorts(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching cohorts:", error);
      setError("Failed to fetch cohorts");
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axiosInstance.get("/activity/export");
      if (response.data.success) {
        setActivities(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Failed to fetch activities");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSession((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCohortSelect = async (cohortId, cohortName) => {
    setSession((prev) => ({
      ...prev,
      cohort: cohortId,
    }));
    setCohortSearchTerm(cohortName);
    setShowCohortDropdown(false);
    // Fetch participants for the selected cohort
    try {
      const response = await axiosInstance.get(`/cohort/${cohortId}`);
      if (response.data.success) {
        setParticipants(response.data.data.participants || []);
        setSelectedParticipants([]); // Reset selection
      }
    } catch (error) {
      setParticipants([]);
    }
  };

  const handleActivitySelect = (activityId, activityName) => {
    setSession((prev) => {
      const newActivities = prev.activity.includes(activityId)
        ? prev.activity.filter((id) => id !== activityId)
        : [...prev.activity, activityId];

      return {
        ...prev,
        activity: newActivities,
      };
    });
    setShowActivitiesDropdown(false);
    setActivitySearchTerm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSaving(true);
      setError(null);
      const sessionData = {
        ...session,
        numberOfMins: Number(session.numberOfMins),
        participants: selectedParticipants.map((id) => ({
          participantId: id,
          cohortId: session.cohort,
        })),
      };
      const response = await axiosInstance.post("/session/create", sessionData);
      // Accept either a 201 status or a response with an _id as success
      if (response.status === 201 || (response.data && response.data._id)) {
        navigate("/sessions/list");
      } else {
        setError(response.data.message || "Failed to create session");
      }
    } catch (error) {
      console.error("Error creating session:", error);
      setError(error.response?.data?.message || "Failed to create session");
    } finally {
      setSaving(false);
    }
  };

  const validateForm = () => {
    if (
      !session.name ||
      !session.cohort ||
      !session.activity.length ||
      !session.numberOfMins ||
      !session.activityFacilitator ||
      !session.date
    ) {
      setError("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const filteredCohorts = cohorts.filter((cohort) =>
    cohort.name.toLowerCase().includes(cohortSearchTerm.toLowerCase())
  );

  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(activitySearchTerm.toLowerCase())
  );

  const selectedActivities = activities.filter((activity) =>
    session.activity.includes(activity._id)
  );

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">New Session</h1>
              <p className="mt-1 text-sm text-gray-500">
                Create a new session for your cohort
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
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
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            {/* Basic Information Section */}
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  {/* Session Name */}
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Session Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={session.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200"
                    placeholder="Enter session name"
                    required
                  />
                </div>
                <div className="flex-1 relative" ref={cohortDropdownRef}>
                  {/* Cohort */}
                  <label
                    htmlFor="cohort"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cohort
                  </label>
                  <input
                    type="text"
                    value={cohortSearchTerm}
                    onChange={(e) => {
                      setCohortSearchTerm(e.target.value);
                      setShowCohortDropdown(true);
                    }}
                    onFocus={() => setShowCohortDropdown(true)}
                    placeholder="Select cohort"
                    className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200"
                  />
                  {showCohortDropdown && (
                    <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto border border-gray-200 rounded-md z-10 bg-white shadow-lg">
                      {filteredCohorts.length > 0 ? (
                        filteredCohorts.map((cohort) => (
                          <div
                            key={cohort._id}
                            onClick={() =>
                              handleCohortSelect(cohort._id, cohort.name)
                            }
                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                          >
                            {cohort.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No cohorts found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Activities and Duration Section */}
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Activities & Duration
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative" ref={activitiesDropdownRef}>
                  {/* Activities */}
                  <label
                    htmlFor="activity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Activities
                  </label>
                  <input
                    type="text"
                    value={activitySearchTerm}
                    onChange={(e) => {
                      setActivitySearchTerm(e.target.value);
                      setShowActivitiesDropdown(true);
                    }}
                    onFocus={() => setShowActivitiesDropdown(true)}
                    placeholder="Select activities"
                    className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200"
                  />
                  {showActivitiesDropdown && (
                    <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto border border-gray-200 rounded-md z-10 bg-white shadow-lg">
                      {filteredActivities.length > 0 ? (
                        filteredActivities.map((activity) => (
                          <div
                            key={activity._id}
                            onClick={() =>
                              handleActivitySelect(activity._id, activity.name)
                            }
                            className={`px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm ${
                              session.activity.includes(activity._id)
                                ? "bg-[#239d62]/10"
                                : ""
                            }`}
                          >
                            {activity.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No activities found
                        </div>
                      )}
                    </div>
                  )}
                  {/* Selected Activities as tags/chips */}
                  {selectedActivities.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedActivities.map((activity) => (
                        <span
                          key={activity._id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#239d62]/10 text-[#239d62]"
                        >
                          {activity.name}
                          <button
                            type="button"
                            onClick={() => handleActivitySelect(activity._id)}
                            className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-[#239d62]/20"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  {/* Duration */}
                  <label
                    htmlFor="numberOfMins"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Duration
                  </label>
                  <input
                    type="number"
                    name="numberOfMins"
                    id="numberOfMins"
                    min="0"
                    value={session.numberOfMins}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200"
                    placeholder="Enter duration in minutes"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Additional Details
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  {/* Activity Facilitator */}
                  <label
                    htmlFor="activityFacilitator"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Activity Facilitator
                  </label>
                  <input
                    type="text"
                    name="activityFacilitator"
                    id="activityFacilitator"
                    value={session.activityFacilitator}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200"
                    placeholder="Enter facilitator name"
                    required
                  />
                </div>
                <div className="flex-1">
                  {/* Date */}
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Session Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={session.date}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Participant Selection Section */}
            {participants.length > 0 && (
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Participant Selection
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Participants Who Attended
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {participants.map((p) => (
                        <label key={p._id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedParticipants.includes(p._id)}
                            onChange={() => {
                              setSelectedParticipants((prev) =>
                                prev.includes(p._id)
                                  ? prev.filter((id) => id !== p._id)
                                  : [...prev, p._id]
                              );
                            }}
                          />
                          {p.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="px-4 py-5 sm:p-6 bg-gray-50 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/sessions")}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#239d62] hover:bg-[#239d62]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {saving ? "Saving..." : "Create Session"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewSession;
