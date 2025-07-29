import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { toast } from "react-toastify";

const NewEvaluation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    session: "",
    cohort: "",
    participant: "",
    activity: "",
    domain: [],
  });

  const [errors, setErrors] = useState({});
  const [cohortList, setCohortList] = useState([]);
  const [sessionList, setSessionList] = useState([]);
  const [participantList, setParticipantList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [domainList, setDomainList] = useState([]);
  const [sessionFromCohort, setSessionFromCohort] = useState([]);
  const [participantsFromSession, setParticipantsFromSession] = useState([]);
  const [activityFromSession, setActivityFromSession] = useState([]);
  const [domainCategory, setDomainCategory] = useState("");
  const [selectDomainByType, setSelectDomainByType] = useState([]);

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        const [cohortsRes, activitiesRes, participantsRes, domainsRes] =
          await Promise.all([
            axiosInstance.get("/cohort/all"),
            axiosInstance.get("/activity/all"),
            axiosInstance.get("/participant/all"),
            axiosInstance.get("/domain/all"),
          ]);

        if (cohortsRes.data.success) setCohortList(cohortsRes.data.data || []);
        if (activitiesRes.data.success)
          setActivityList(activitiesRes.data.data || []);
        if (participantsRes.data.success)
          setParticipantList(participantsRes.data.data || []);
        if (domainsRes.data.success) setDomainList(domainsRes.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch required data");
      }
    };

    fetchData();
  }, []);

  // Update sessions when cohort is selected
  useEffect(() => {
    if (formData.cohort) {
      const selectedCohort = cohortList.find(
        (el) => el._id === formData.cohort
      );
      setSessionFromCohort(selectedCohort?.sessions || []);
    } else {
      setSessionFromCohort([]);
    }
  }, [formData.cohort, cohortList]);

  // Update participants when session is selected
  useEffect(() => {
    if (formData.session) {
      const selectedSession = sessionFromCohort.find(
        (el) => el._id === formData.session
      );
      setParticipantsFromSession(selectedSession?.participants || []);
    } else {
      setParticipantsFromSession([]);
    }
  }, [formData.session, sessionFromCohort]);

  // Update activities when session is selected
  useEffect(() => {
    if (formData.session) {
      const selectedSession = sessionFromCohort.find(
        (el) => el._id === formData.session
      );
      setActivityFromSession(selectedSession?.activity || []);
    } else {
      setActivityFromSession([]);
    }
  }, [formData.session, sessionFromCohort]);

  // Update domain category when participant is selected
  useEffect(() => {
    if (formData.participant) {
      const selectedParticipant = participantList.find(
        (el) => el._id === formData.participant
      );
      setDomainCategory(selectedParticipant?.participantType || "");
    } else {
      setDomainCategory("");
    }
  }, [formData.participant, participantList]);

  // Update domains based on participant type
  useEffect(() => {
    if (domainCategory) {
      const filteredDomains = domainList.filter(
        (el) => el.category === domainCategory
      );
      setSelectDomainByType(filteredDomains);
    } else {
      setSelectDomainByType([]);
    }
  }, [domainCategory, domainList]);

  const handleScoreChange = (domainIndex, questionIndex, newScore) => {
    const updatedDomains = [...selectDomainByType];
    updatedDomains[domainIndex].subTopics[questionIndex].score = newScore;
    setFormData((prev) => ({
      ...prev,
      domain: updatedDomains,
    }));
  };

  const handleObservationChange = (domainIndex, newObservation) => {
    const updatedDomains = [...selectDomainByType];
    updatedDomains[domainIndex].observation = newObservation;
    setFormData((prev) => ({
      ...prev,
      domain: updatedDomains,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cohort) newErrors.cohort = "Centre is required";
    if (!formData.session) newErrors.session = "Session is required";
    if (!formData.participant) newErrors.participant = "Member is required";
    if (!formData.activity) newErrors.activity = "Activity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post("/evaluation/create", formData);

      if (response.data.success) {
        toast.success("Evaluation created successfully");
        navigate("/evaluations");
      } else {
        setError(response.data.message || "Failed to create evaluation");
      }
    } catch (error) {
      console.error("Error creating evaluation:", error);
      setError(error.response?.data?.message || "Failed to create evaluation");
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
              <h1 className="text-3xl font-bold text-gray-900">
                New Evaluation
              </h1>
              <p className="mt-2 text-base text-gray-500">
                Create a new evaluation by filling out the form below
              </p>
            </div>
            <button
              onClick={() => navigate("/evaluations")}
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
        <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-8">
                {/* Centre and Session in one line */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Centre */}
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <label
                      htmlFor="cohort"
                      className="block text-lg font-semibold text-gray-800 mb-3"
                    >
                      Centre <span className="text-red-500">*</span>
                    </label>
                    <div>
                      <select
                        id="cohort"
                        name="cohort"
                        value={formData.cohort}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 bg-white ${
                          errors.cohort
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                        }`}
                      >
                        <option value="">Select a centre</option>
                        {cohortList.map((cohort) => (
                          <option key={cohort._id} value={cohort._id}>
                            {cohort.name}
                          </option>
                        ))}
                      </select>
                      {errors.cohort && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.cohort}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Session */}
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <label
                      htmlFor="session"
                      className="block text-lg font-semibold text-gray-800 mb-3"
                    >
                      Session <span className="text-red-500">*</span>
                    </label>
                    <div>
                      <select
                        id="session"
                        name="session"
                        value={formData.session}
                        onChange={handleChange}
                        disabled={!formData.cohort}
                        className={`block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 bg-white ${
                          errors.session
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                        }`}
                      >
                        <option value="">Select a session</option>
                        {sessionFromCohort.map((session) => (
                          <option key={session._id} value={session._id}>
                            {session.name}
                          </option>
                        ))}
                      </select>
                      {errors.session && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.session}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Member and Activity in one line */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Member */}
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <label
                      htmlFor="participant"
                      className="block text-lg font-semibold text-gray-800 mb-3"
                    >
                      Member <span className="text-red-500">*</span>
                    </label>
                    <div>
                      <select
                        id="participant"
                        name="participant"
                        value={formData.participant}
                        onChange={handleChange}
                        disabled={!formData.session}
                        className={`block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 bg-white ${
                          errors.participant
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                        }`}
                      >
                        <option value="">Select a member</option>
                        {participantList?.map((pl) => {
                          return participantsFromSession?.map((el) => {
                            if (el.participantId === pl._id) {
                              return (
                                <option key={pl._id} value={pl._id}>
                                  {pl.name}
                                </option>
                              );
                            }
                            return null;
                          });
                        })}
                      </select>
                      {errors.participant && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.participant}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <label
                      htmlFor="activity"
                      className="block text-lg font-semibold text-gray-800 mb-3"
                    >
                      Activity <span className="text-red-500">*</span>
                    </label>
                    <div>
                      <select
                        id="activity"
                        name="activity"
                        value={formData.activity}
                        onChange={handleChange}
                        disabled={!formData.session}
                        className={`block w-full px-4 py-3 text-base rounded-lg shadow-sm transition-colors duration-200 bg-white ${
                          errors.activity
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#239d62] focus:ring-[#239d62]"
                        }`}
                      >
                        <option value="">Select an activity</option>
                        {activityFromSession.map((activity) => (
                          <option key={activity._id} value={activity._id}>
                            {activity.name}
                          </option>
                        ))}
                      </select>
                      {errors.activity && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.activity}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Domain Fields */}
                {selectDomainByType?.map((domain, domainIndex) => (
                  <div
                    key={domainIndex}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {domain.name}
                      </h3>
                    </div>

                    <div className="divide-y divide-gray-200">
                      {domain?.subTopics?.map((question, questionIndex) => (
                        <div key={questionIndex} className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="w-[60%]">
                              <p className="text-base text-gray-700 font-medium">
                                {questionIndex + 1}. {question.content}
                              </p>
                            </div>
                            <div className="w-[40%]">
                              <input
                                type="number"
                                value={question.score || ""}
                                onChange={(e) =>
                                  handleScoreChange(
                                    domainIndex,
                                    questionIndex,
                                    e.target.value
                                  )
                                }
                                className="block w-full px-4 py-2 text-base rounded-lg shadow-sm border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] bg-white"
                                placeholder="Enter score"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Observation
                      </label>
                      <textarea
                        value={domain.observation}
                        onChange={(e) =>
                          handleObservationChange(domainIndex, e.target.value)
                        }
                        rows={3}
                        className="block w-full px-4 py-2 text-base rounded-lg shadow-sm border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] bg-white"
                        placeholder="Enter your observations here..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/evaluations")}
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
                    "Create Evaluation"
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

export default NewEvaluation;
