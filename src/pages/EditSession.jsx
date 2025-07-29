import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSave, FiSearch } from "react-icons/fi";
import axiosInstance from "../utils/axios";

const EditSession = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [participants, setParticipants] = useState([]); // Only participants of selected cohort
  const [selectedParticipants, setSelectedParticipants] = useState([]); // Only those who attended
  const cohortDropdownRef = useRef(null);
  const [searchFilters, setSearchFilters] = useState({
    activitySearch: "",
    participantSearch: "",
  });
  const [debouncedFilters, setDebouncedFilters] = useState({
    activitySearch: "",
    participantSearch: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    numberOfMins: "",
    cohort: "",
    activities: [],
    participants: [],
    activityFacilitator: "",
  });
  const [activitySearchTerm, setActivitySearchTerm] = useState("");
  const [showActivitiesDropdown, setShowActivitiesDropdown] = useState(false);
  const activitiesDropdownRef = useRef(null);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const selectedActivities = allActivities.filter((activity) =>
    formData.activities.includes(activity._id)
  );

  // Debug: Log the state to understand what's happening
  useEffect(() => {
    console.log("Debug - allActivities length:", allActivities.length);
    console.log("Debug - formData.activities:", formData.activities);
    console.log(
      "Debug - selectedActivities length:",
      selectedActivities.length
    );
    if (allActivities.length > 0 && formData.activities.length > 0) {
      console.log(
        "Debug - Sample activity from allActivities:",
        allActivities[0]
      );
      console.log(
        "Debug - Sample activity ID from formData:",
        formData.activities[0]
      );
      console.log(
        "Debug - Are they matching?",
        allActivities.some((a) => a._id === formData.activities[0])
      );
    }
  }, [allActivities, formData.activities, selectedActivities]);

  useEffect(() => {
    const loadData = async () => {
      await fetchActivities(); // Fetch activities first
      await fetchCohorts();
      await fetchSession(); // Then fetch session data
    };
    loadData();
  }, [id]);

  // Fetch participants for the selected cohort when cohort changes
  useEffect(() => {
    if (formData.cohort) {
      fetchParticipantsForCohort(formData.cohort);
    } else {
      setParticipants([]);
      setSelectedParticipants([]);
    }
  }, [formData.cohort]);

  // Fetch participants for the selected cohort (like NewSession)
  const fetchParticipantsForCohort = async (cohortId) => {
    try {
      const response = await axiosInstance.get(`/cohort/${cohortId}`);
      if (response.data.success) {
        setParticipants(response.data.data.participants || []);
        // If editing, only keep selected participants that are in this cohort
        setSelectedParticipants((prev) =>
          prev.filter((id) =>
            (response.data.data.participants || []).some((p) => p._id === id)
          )
        );
      } else {
        setParticipants([]);
      }
    } catch (error) {
      setParticipants([]);
    }
  };

  // When loading the session, set selectedParticipants to those who attended
  const fetchSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/session/${id}`);
      if (response.data.success) {
        const session = response.data.message;
        // Extract activities and participants
        // const activities = session.activity || [];
        // const participants = session.participants?.map((p) => p.participantId) || [];
        console.log("Debug - Session data:", session);
        console.log("Debug - Session activities:", session.activity);

        setFormData({
          name: session.name || "",
          date: session.date
            ? new Date(session.date).toISOString().split("T")[0]
            : "",
          numberOfMins: session.numberOfMins || "",
          cohort: session.cohort?._id || "",
          activities: (session.activity || []).map((act) => act._id) || [],
          participants: [], // not used anymore
          activityFacilitator: session.activityFacilitator || "",
        });
        setSelectedParticipants(
          (session.participants || []).map(
            (p) => p.participantId?._id || p.participantId
          )
        );
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

  // On cohort select change
  const handleCohortChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, cohort: value }));
  };

  // On participant checkbox change
  const handleParticipantCheckbox = (id) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // Debounce the search filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(searchFilters);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchFilters]);

  // Fetch filtered activities and participants when debounced filters change
  useEffect(() => {
    if (formData.cohort) {
      // fetchParticipants(); // No longer needed
    }
  }, [debouncedFilters, formData.cohort]);

  // Filter activities based on search term for dropdown
  useEffect(() => {
    const filtered = allActivities.filter((activity) => {
      if (!activitySearchTerm) return true;
      return activity.name
        .toLowerCase()
        .includes(activitySearchTerm.toLowerCase());
    });
    setFilteredActivities(filtered);
  }, [activitySearchTerm, allActivities]);

  // Filter the activities to display
  const displayedActivities = allActivities.filter((activity) => {
    // If there's no search, show all activities
    if (!searchFilters.activitySearch) return true;

    // If there's a search, show any activities that match OR are selected
    return (
      activity.name
        .toLowerCase()
        .includes(searchFilters.activitySearch.toLowerCase()) ||
      formData.activities.includes(activity._id)
    );
  });

  // Filter the participants to display
  const displayedParticipants = participants.filter((participant) => {
    // If there's no search, show all participants
    if (!searchFilters.participantSearch) return true;

    // If there's a search, show any participants that match OR are selected
    return (
      participant.name
        .toLowerCase()
        .includes(searchFilters.participantSearch.toLowerCase()) ||
      formData.participants.includes(participant._id)
    );
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleActivityChange = (activityId) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.includes(activityId)
        ? prev.activities.filter((id) => id !== activityId)
        : [...prev.activities, activityId],
    }));
  };

  const handleParticipantChange = (participantId) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.includes(participantId)
        ? prev.participants.filter((id) => id !== participantId)
        : [...prev.participants, participantId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      // Transform form data into the required structure
      const transformedData = {
        _id: id,
        name: formData.name,
        date: new Date(formData.date).toISOString(),
        numberOfMins: formData.numberOfMins,
        cohort: formData.cohort,
        activity: formData.activities,
        activityFacilitator: formData.activityFacilitator,
        participants: selectedParticipants.map((participantId) => ({
          participantId,
          cohortId: formData.cohort,
        })),
      };

      const response = await axiosInstance.patch(
        `/session/edit/${id}`,
        transformedData
      );

      // If we get a response with status 200, consider it a success
      // Accept either a 200 status or a response with an _id as success
      if (response.status === 200 || (response.data && response.data._id)) {
        navigate("/sessions/list");
      } else {
        setError(response.data.message || "Failed to update session");
      }
    } catch (error) {
      console.error("Error updating session:", error);
      setError(error.response?.data?.message || "Failed to update session");
    } finally {
      setSaving(false);
    }
  };

  const fetchCohorts = async () => {
    try {
      const response = await axiosInstance.get("/cohort/all");
      if (response.data.success) {
        setCohorts(response.data.data || []);
      }
      return response.data.success;
    } catch (error) {
      console.error("Error fetching cohorts:", error);
      return false;
    }
  };

  const fetchActivities = async () => {
    try {
      setActivitiesLoading(true);
      const response = await axiosInstance.get(`/activity/export`);
      if (response.data.success) {
        setAllActivities(response.data.data || []);
      }
      return response.data.success;
    } catch (error) {
      console.error("Error fetching activities:", error);
      return false;
    } finally {
      setActivitiesLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      // Include cohort filter to get relevant participants
      const queryParams = new URLSearchParams({
        cohort: formData.cohort,
      });

      const response = await axiosInstance.get(
        `/participant/all?${queryParams}`
      );
      if (response.data.success) {
        // Merge with existing participants to preserve selected ones
        const existingParticipantIds = participants.map((p) => p._id);
        const newParticipants = response.data.data || [];

        // Combine and deduplicate participants
        const combinedParticipants = [
          ...participants,
          ...newParticipants.filter(
            (p) => !existingParticipantIds.includes(p._id)
          ),
        ];

        setParticipants(combinedParticipants);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  // Handle click outside for activities dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
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

  // Activity select handler (toggle)
  const handleActivitySelect = (activityId) => {
    setFormData((prev) => {
      const newActivities = prev.activities.includes(activityId)
        ? prev.activities.filter((id) => id !== activityId)
        : [...prev.activities, activityId];
      return {
        ...prev,
        activities: newActivities,
      };
    });
    setShowActivitiesDropdown(false);
    setActivitySearchTerm("");
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

  return (
    <div className="min-h-full bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">Edit Session</h1>
              <p className="mt-1 text-sm text-gray-500">
                Update session information
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/sessions/${id}`)}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
              >
                <FiArrowLeft className="mr-2 h-5 w-5" />
                Back to Session
              </button>
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
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200"
                    placeholder="Enter session name"
                    required
                  />
                </div>
                <div className="flex-1">
                  {/* Cohort */}
                  <label
                    htmlFor="cohort"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cohort
                  </label>
                  <select
                    name="cohort"
                    id="cohort"
                    value={formData.cohort}
                    onChange={handleCohortChange}
                    className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200"
                    required
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
                            onClick={() => handleActivitySelect(activity._id)}
                            className={`px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm ${
                              formData.activities.includes(activity._id)
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
                  {/* Show loading state or activity IDs if activities haven't been loaded yet */}
                  {activitiesLoading && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-sm text-gray-500">
                        Loading activities...
                      </span>
                    </div>
                  )}
                  {!activitiesLoading &&
                    formData.activities.length > 0 &&
                    selectedActivities.length === 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-sm text-gray-500">
                          Loading activity details... (
                          {formData.activities.length} selected)
                        </span>
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
                    value={formData.numberOfMins}
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
                    value={formData.activityFacilitator || ""}
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
                    value={formData.date}
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
                <div className="flex flex-wrap gap-2">
                  {participants.map((p) => (
                    <label key={p._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(p._id)}
                        onChange={() => handleParticipantCheckbox(p._id)}
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="px-4 py-5 sm:p-6 bg-gray-50 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/sessions/list")}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#239d62] hover:bg-[#239d62]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSession;
