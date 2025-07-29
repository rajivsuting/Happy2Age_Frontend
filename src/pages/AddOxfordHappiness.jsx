import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import axiosInstance from "../utils/axios";

const AddOxfordHappiness = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({
    participant: "",
    date: new Date().toISOString().split("T")[0],
    questions: [],
    totalScore: 0,
  });

  // Oxford Happiness Inventory questions
  const oxfordQuestions = [
    {
      question: "I don't feel particularly pleased with the way I am.",
      isReverse: true,
      score: 0,
    },
    {
      question: "I am intensely interested in other people.",
      isReverse: false,
      score: 0,
    },
    {
      question: "I feel that life is very rewarding",
      isReverse: false,
      score: 0,
    },
    {
      question: "I have very warm feelings towards almost everyone",
      isReverse: false,
      score: 0,
    },
    { question: "I rarely wake up feeling rested.", isReverse: true, score: 0 },
    {
      question: "I am not particularly optimistic about the future.",
      isReverse: true,
      score: 0,
    },
    { question: "I find most things amusing.", isReverse: false, score: 0 },
    {
      question: "I am always committed and involved.",
      isReverse: false,
      score: 0,
    },
    { question: "Life is good.", isReverse: false, score: 0 },
    {
      question: "I do not think that the world is a good place.",
      isReverse: true,
      score: 0,
    },
    { question: "I laugh a lot.", isReverse: false, score: 0 },
    {
      question: "I am well satisfied about everything in my life.",
      isReverse: false,
      score: 0,
    },
    { question: "I don't think I look attractive.", isReverse: true, score: 0 },
    {
      question:
        "There is a gap between what I would like to do and what I have done.",
      isReverse: true,
      score: 0,
    },
    { question: "I am very happy.", isReverse: false, score: 0 },
    { question: "I find beauty in some things.", isReverse: false, score: 0 },
    {
      question: "I always have a cheerful effect on others.",
      isReverse: false,
      score: 0,
    },
    {
      question: "I can fit in (find time for) everything I want to.",
      isReverse: false,
      score: 0,
    },
    {
      question: "I feel that I am not especially in control of my life.",
      isReverse: true,
      score: 0,
    },
    {
      question: "I feel able to take anything on.",
      isReverse: false,
      score: 0,
    },
    { question: "I feel fully mentally alert.", isReverse: false, score: 0 },
    {
      question: "I often experience joy and elation",
      isReverse: false,
      score: 0,
    },
    {
      question: "I don't find it easy to make decisions.",
      isReverse: true,
      score: 0,
    },
    {
      question:
        "I don't have a particular sense of meaning and purpose in my life.",
      isReverse: true,
      score: 0,
    },
    {
      question: "I feel I have a great deal of energy.",
      isReverse: false,
      score: 0,
    },
    {
      question: "I usually have a good influence on events.",
      isReverse: false,
      score: 0,
    },
    {
      question: "I don't have fun with other people.",
      isReverse: true,
      score: 0,
    },
    {
      question: "I don't feel particularly healthy.",
      isReverse: true,
      score: 0,
    },
    {
      question: "I don't have particularly happy memories of the past.",
      isReverse: true,
      score: 0,
    },
  ];

  useEffect(() => {
    fetchParticipants();
    initializeQuestions();
  }, []);

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

  const initializeQuestions = () => {
    setFormData((prev) => ({ ...prev, questions: oxfordQuestions }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScoreChange = (index, value) => {
    const newQuestions = formData.questions.map((question, idx) =>
      idx === index ? { ...question, score: Number(value) } : question
    );

    // Calculate total score
    const totalScore = newQuestions.reduce((total, question) => {
      let score = question.score;
      if (question.isReverse) {
        score = 7 - score;
      }
      return total + score;
    }, 0);

    setFormData((prev) => ({
      ...prev,
      questions: newQuestions,
      totalScore: totalScore,
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
    // Check if all scores are filled
    const allScoresFilled = formData.questions.every(
      (question) => question.score !== 0
    );
    if (!allScoresFilled) {
      setError("Please fill all the scores before submitting.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post(
        "/oxford-happiness/add",
        formData
      );

      if (response.data.success) {
        navigate("/oxford-happiness");
      } else {
        setError(response.data.message || "Failed to add evaluation");
      }
    } catch (error) {
      console.error("Error adding evaluation:", error);
      setError(error.response?.data?.message || "Failed to add evaluation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">
                Oxford Happiness Questionnaire
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Add new Oxford Happiness evaluation
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/oxford-happiness")}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
              >
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            </div>
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
                Question List
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
                            handleScoreChange(index, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#239d62] focus:border-[#239d62] transition-colors"
                        >
                          <option value={0}>Select Score</option>
                          <option value={1}>1 (strongly disagree)</option>
                          <option value={2}>2 (moderately disagree)</option>
                          <option value={3}>3 (slightly disagree)</option>
                          <option value={4}>4 (slightly agree)</option>
                          <option value={5}>5 (moderately agree)</option>
                          <option value={6}>6 (strongly agree)</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`reverse-${index}`}
                          checked={question.isReverse}
                          disabled
                          className="h-4 w-4 text-[#239d62] focus:ring-[#239d62] border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`reverse-${index}`}
                          className="text-xs text-gray-600"
                        >
                          {question.isReverse
                            ? "Reverse Score"
                            : "Normal Score"}
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#239d62] hover:bg-[#1f8a55] disabled:opacity-50 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 text-lg font-medium"
              >
                <FiSave className="h-5 w-5" />
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOxfordHappiness;
