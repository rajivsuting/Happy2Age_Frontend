import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import axiosInstance from "../utils/axios";
import { toast } from "react-toastify";

const EditEvaluation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [evaluation, setEvaluation] = useState({
    participant: "",
    cohort: "",
    session: "",
    activity: "",
    grandAverage: "",
  });

  const [domainList, setDomainList] = useState([]);
  const [selectDomainByType, setSelectDomainByType] = useState([]);
  const [participantList, setParticipantList] = useState([]);
  const [cohortList, setCohortList] = useState([]);
  const [sessionList, setSessionList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [domainCategory, setDomainCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [filteredSessions, setFilteredSessions] = useState([]);

  useEffect(() => {
    fetchEvaluation();
    fetchDropdownData();
  }, [id]);

  const fetchEvaluation = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/evaluation/${id}`);
      if (response.data.success) {
        const evalData = response.data.data;
        setEvaluation({
          participant: evalData.participant?._id || evalData.participant || "",
          cohort: evalData.cohort?._id || evalData.cohort || "",
          session: evalData.session?._id || evalData.session || "",
          activity: evalData.activity?._id || evalData.activity || "",
          grandAverage: evalData.grandAverage || "",
        });
        setSelectDomainByType(evalData.domain || []);
      } else {
        setError("Evaluation not found");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch evaluation");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [
        participantsRes,
        cohortsRes,
        sessionsRes,
        activitiesRes,
        domainsRes,
      ] = await Promise.all([
        axiosInstance.get("/participant/all"),
        axiosInstance.get("/cohort/all"),
        axiosInstance.get("/session/all"), // <-- fix here
        axiosInstance.get("/activity/all"),
        axiosInstance.get("/domain/all"),
      ]);
      if (participantsRes.data.success)
        setParticipantList(participantsRes.data.data || []);
      if (cohortsRes.data.success) setCohortList(cohortsRes.data.data || []);
      if (sessionsRes.data.success)
        setSessionList(sessionsRes.data.message || []);
      if (activitiesRes.data.success)
        setActivityList(activitiesRes.data.data || []);
      if (domainsRes.data.success) setDomainList(domainsRes.data.data || []);
    } catch (error) {
      setError("Failed to fetch required data");
    }
  };

  // Update domain category when participant is selected
  useEffect(() => {
    if (evaluation.participant && participantList.length) {
      const selectedParticipant = participantList.find(
        (el) => el._id === evaluation.participant
      );
      setDomainCategory(selectedParticipant?.participantType || "");
    } else {
      setDomainCategory("");
    }
  }, [evaluation.participant, participantList]);

  // Update domains based on participant type (if needed)
  useEffect(() => {
    if (!selectDomainByType.length && domainCategory && domainList.length) {
      const filteredDomains = domainList.filter(
        (el) => el.category === domainCategory
      );
      // Only set if not already loaded from evaluation
      setSelectDomainByType(filteredDomains);
    }
  }, [domainCategory, domainList]);

  // Update filtered sessions when cohort or sessionList changes
  useEffect(() => {
    console.log("DEBUG: evaluation.cohort", evaluation.cohort);
    console.log("DEBUG: sessionList", sessionList);
    if (evaluation.cohort && sessionList.length) {
      setFilteredSessions(
        sessionList.filter((s) => {
          // s.cohort can be object or string
          if (!s.cohort) return false;
          if (typeof s.cohort === "object")
            return s.cohort._id === evaluation.cohort;
          return s.cohort === evaluation.cohort;
        })
      );
    } else {
      setFilteredSessions([]);
    }
  }, [evaluation.cohort, sessionList]);

  // On initial load or when evaluation changes, set selectDomainByType to evaluation.domain
  useEffect(() => {
    if (evaluation && evaluation.domain && evaluation.domain.length) {
      setSelectDomainByType(evaluation.domain);
    }
  }, [evaluation?._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvaluation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScoreChange = (domainIndex, questionIndex, newScore) => {
    const updatedDomains = [...selectDomainByType];
    updatedDomains[domainIndex].subTopics[questionIndex].score = newScore;
    setSelectDomainByType(updatedDomains);
  };

  const handleObservationChange = (domainIndex, newObservation) => {
    const updatedDomains = [...selectDomainByType];
    updatedDomains[domainIndex].observation = newObservation;
    setSelectDomainByType(updatedDomains);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!evaluation.cohort) newErrors.cohort = "Centre is required";
    if (!evaluation.session) newErrors.session = "Session is required";
    if (!evaluation.participant) newErrors.participant = "Member is required";
    if (!evaluation.activity) newErrors.activity = "Activity is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSaving(true);
      setError(null);
      // Clean domains/subtopics
      const cleanedDomains = selectDomainByType
        .map((domain) => {
          const cleanedSubTopics = (domain.subTopics || [])
            .filter(
              (sub) =>
                sub.score !== undefined &&
                sub.score !== "" &&
                sub.score !== null
            )
            .map((sub) => ({ ...sub, score: Number(sub.score) }));
          return {
            _id: domain._id,
            name: domain.name,
            subTopics: cleanedSubTopics,
            observation: domain.observation || "",
          };
        })
        .filter((domain) => domain.subTopics.length > 0);
      const patchObject = {
        cohort: evaluation.cohort,
        session: evaluation.session,
        activity: evaluation.activity,
        participant: evaluation.participant,
        domain: cleanedDomains,
      };
      if (!patchObject.domain.length) {
        setError("At least one domain with a scored subtopic is required.");
        setSaving(false);
        return;
      }
      const response = await axiosInstance.patch(
        `/evaluation/${id}`,
        patchObject
      );
      if (response.data.success) {
        toast.success("Evaluation updated successfully");
        navigate("/evaluations");
      } else {
        setError(response.data.message || "Failed to update evaluation");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update evaluation");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#239d62]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !evaluation) {
    return (
      <div className="min-h-full bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Evaluation not found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The evaluation you're looking for doesn't exist or has been
              deleted.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/evaluations")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62]"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back to Evaluations
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Evaluation
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Update evaluation details
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/evaluations/${id}`)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62]"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#239d62] hover:bg-[#239d62]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
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
                    <select
                      id="cohort"
                      name="cohort"
                      value={evaluation.cohort}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200 bg-white ${
                        errors.cohort
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : ""
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
                  {/* Session */}
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <label
                      htmlFor="session"
                      className="block text-lg font-semibold text-gray-800 mb-3"
                    >
                      Session <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="session"
                      name="session"
                      value={evaluation.session}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200 bg-white ${
                        errors.session
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    >
                      <option value="">Select a session</option>
                      {filteredSessions.map((session) => (
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
                    <select
                      id="participant"
                      name="participant"
                      value={evaluation.participant}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200 bg-white ${
                        errors.participant
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    >
                      <option value="">Select a member</option>
                      {participantList.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                    {errors.participant && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.participant}
                      </p>
                    )}
                  </div>
                  {/* Activity */}
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <label
                      htmlFor="activity"
                      className="block text-lg font-semibold text-gray-800 mb-3"
                    >
                      Activity <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="activity"
                      name="activity"
                      value={evaluation.activity}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] transition-colors duration-200 bg-white ${
                        errors.activity
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    >
                      <option value="">Select an activity</option>
                      {activityList.map((activity) => (
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
                {/* Domain Fields */}
                {selectDomainByType?.map((domain, domainIndex) => (
                  <div
                    key={domainIndex}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-8"
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
                                className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] bg-white"
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
                        value={domain.observation || ""}
                        onChange={(e) =>
                          handleObservationChange(domainIndex, e.target.value)
                        }
                        rows={3}
                        className="block w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-[#239d62] focus:ring-[#239d62] bg-white"
                        placeholder="Enter your observations here..."
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* Form Actions */}
              <div className="flex justify-end pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(`/evaluations/${id}`)}
                  className="mr-4 px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
                >
                  <FiArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#239d62] hover:bg-[#239d62]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <FiSave className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvaluation;
