import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import axiosInstance from "../utils/axios";

const EditOxfordHappiness = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({
    participant: "",
    date: new Date().toISOString().split("T")[0],
    questions: [],
  });

  // Oxford Happiness Inventory questions
  const oxfordQuestions = [
    "I feel that life is very rewarding",
    "I have warm feelings towards almost everyone",
    "I have a sense of direction and purpose in life",
    "I feel that I have a great deal of energy",
    "I feel that I am in control of my life",
    "I feel that I am a person of worth",
    "I feel that I have a number of good qualities",
    "I feel optimistic about my future",
    "I feel that I am a useful person",
    "I feel that I am a confident person",
    "I feel that I am a cheerful person",
    "I feel that I am a friendly person",
    "I feel that I am a generous person",
    "I feel that I am a kind person",
    "I feel that I am a helpful person",
    "I feel that I am a cooperative person",
    "I feel that I am a trustworthy person",
    "I feel that I am a honest person",
    "I feel that I am a reliable person",
    "I feel that I am a dependable person",
    "I feel that I am a responsible person",
    "I feel that I am a conscientious person",
    "I feel that I am a careful person",
    "I feel that I am a thorough person",
    "I feel that I am a systematic person",
    "I feel that I am a organized person",
    "I feel that I am a efficient person",
    "I feel that I am a productive person",
  ];

  useEffect(() => {
    fetchParticipants();
    fetchEvaluation();
  }, [id]);

  const fetchParticipants = async () => {
    try {
      const response = await axiosInstance.get("/participant/all");
      if (response.data.success) {
        setParticipants(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
      setError("Failed to fetch participants");
    }
  };

  const fetchEvaluation = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/oxford-happiness/${id}`);

      if (response.data.success) {
        const evaluation = response.data.message;
        setFormData({
          participant: evaluation.participant._id || evaluation.participant,
          date: evaluation.date
            ? new Date(evaluation.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          questions: evaluation.questions || [],
        });
      } else {
        setError("Failed to fetch evaluation");
      }
    } catch (error) {
      console.error("Error fetching evaluation:", error);
      setError(error.response?.data?.message || "Failed to fetch evaluation");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  };

  const validateForm = () => {
    if (!formData.participant) {
      setError("Please select a participant");
      return false;
    }
    if (!formData.date) {
      setError("Please select a date");
      return false;
    }
    if (formData.questions.some((q) => q.score === 0)) {
      setError("Please answer all questions");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError(null);

      const response = await axiosInstance.put(
        `/oxford-happiness/edit/${id}`,
        formData
      );

      if (response.data.success) {
        navigate("/oxford-happiness");
      } else {
        setError(response.data.message || "Failed to update evaluation");
      }
    } catch (error) {
      console.error("Error updating evaluation:", error);
      setError(error.response?.data?.message || "Failed to update evaluation");
    } finally {
      setSaving(false);
    }
  };

  const getHappinessLevel = (score) => {
    if (score >= 5.5)
      return {
        level: "Very High",
        color: "text-green-600",
        bgColor: "bg-green-100",
      };
    if (score >= 4.5)
      return { level: "High", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (score >= 3.5)
      return {
        level: "Moderate",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      };
    if (score >= 2.5)
      return {
        level: "Low",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      };
    return { level: "Very Low", color: "text-red-600", bgColor: "bg-red-100" };
  };

  const calculateScore = () => {
    const totalScore = formData.questions.reduce((total, question) => {
      let score = question.score;
      if (question.isReverse) {
        score = 7 - score;
      }
      return total + score;
    }, 0);
    return totalScore / 29;
  };

  const currentScore = calculateScore();
  const happinessLevel = getHappinessLevel(currentScore);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#239d62]"></div>
          <p className="mt-2 text-gray-600">Loading evaluation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/oxford-happiness")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">
          Edit Oxford Happiness Evaluation
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participant *
                  </label>
                  <select
                    name="participant"
                    value={formData.participant}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#239d62] focus:border-[#239d62] transition-colors"
                  >
                    <option value="">Select Participant</option>
                    {participants.map((participant) => (
                      <option key={participant._id} value={participant._id}>
                        {participant.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#239d62] focus:border-[#239d62] transition-colors"
                  />
                </div>
              </div>

              {/* Questions */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Oxford Happiness Inventory Questions
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {formData.questions.map((question, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <p className="text-sm font-medium text-gray-800 mb-3">
                        {index + 1}. {question.question}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">
                            Score (1-6)
                          </label>
                          <select
                            value={question.score}
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                "score",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#239d62] focus:border-[#239d62] transition-colors"
                          >
                            <option value={0}>Select Score</option>
                            <option value={1}>1 - Strongly Disagree</option>
                            <option value={2}>2 - Disagree</option>
                            <option value={3}>3 - Slightly Disagree</option>
                            <option value={4}>4 - Slightly Agree</option>
                            <option value={5}>5 - Agree</option>
                            <option value={6}>6 - Strongly Agree</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`reverse-${index}`}
                            checked={question.isReverse}
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                "isReverse",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-[#239d62] focus:ring-[#239d62] border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`reverse-${index}`}
                            className="text-xs text-gray-600"
                          >
                            Reverse Score
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#239d62] hover:bg-[#1f8a55] disabled:opacity-50 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                >
                  <FiSave className="h-4 w-4" />
                  {saving ? "Saving..." : "Update Evaluation"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Score Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Happiness Score Preview
            </h3>

            <div className="space-y-4">
              <div className="text-center">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${happinessLevel.bgColor} ${happinessLevel.color}`}
                >
                  {happinessLevel.level}
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">
                  {currentScore.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Happiness Score</div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-800 mb-2">
                  Score Ranges:
                </h4>
                <div className="text-xs space-y-1 text-gray-600">
                  <div>5.5-6.0: Very High</div>
                  <div>4.5-5.4: High</div>
                  <div>3.5-4.4: Moderate</div>
                  <div>2.5-3.4: Low</div>
                  <div>1.0-2.4: Very Low</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-800 mb-2">
                  Progress:
                </h4>
                <div className="text-xs text-gray-600">
                  {formData.questions.filter((q) => q.score > 0).length} of{" "}
                  {formData.questions.length} questions answered
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-[#239d62] h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (formData.questions.filter((q) => q.score > 0).length /
                          formData.questions.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOxfordHappiness;
