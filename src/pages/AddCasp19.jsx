import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import axiosInstance from "../utils/axios";

const AddCasp19 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [formData, setFormData] = useState({
    participant: "",
    date: new Date().toISOString().split("T")[0],
    questions: [],
  });

  // CASP-19 questions with exact questions and codes from the provided code
  const caspQuestions = [
    {
      question: "My age prevents me from doing the things I would like to do.",
      code: "C1",
      score: "",
    },
    {
      question: "I feel that what happens to me is out of my control.",
      code: "C2",
      score: "",
    },
    { question: "I feel free to plan for the future.", code: "C3", score: "" },
    { question: "I feel left out of things.", code: "C4", score: "" },
    { question: "I can do the things I want to do.", code: "A1", score: "" },
    {
      question:
        "Family responsibilities prevent me from doing the things I want to do",
      code: "A2",
      score: "",
    },
    {
      question: "I feel that I can please myself what I do",
      code: "A3",
      score: "",
    },
    {
      question: "My health stops me from doing the things I want to do.",
      code: "A4",
      score: "",
    },
    {
      question: "Shortage of money stops me from doing things I want to do.",
      code: "A5",
      score: "",
    },
    { question: "I look forward to each day.", code: "P1", score: "" },
    { question: "I feel that my life has meaning.", code: "P2", score: "" },
    { question: "I enjoy the things that I do.", code: "P3", score: "" },
    {
      question: "I enjoy being in the company of others.",
      code: "P4",
      score: "",
    },
    {
      question: "On balance, I look back on my life with a sense of happiness.",
      code: "P5",
      score: "",
    },
    { question: "I feel full of energy these days.", code: "SR1", score: "" },
    {
      question: "I choose to do things that I have never done before.",
      code: "SR2",
      score: "",
    },
    {
      question: "I feel satisfied with the way my life has turned out.",
      code: "SR3",
      score: "",
    },
    {
      question: "I feel that life is full of opportunities.",
      code: "SR4",
      score: "",
    },
    {
      question: "I feel that the future looks good for me.",
      code: "SR5",
      score: "",
    },
  ];

  // Score mapping from the provided code
  const scoreMapping = {
    Often: 3,
    Sometimes: 2,
    "Not often": 1,
    Never: 0,
  };

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
    setFormData((prev) => ({ ...prev, questions: caspQuestions }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (index, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index].score = value;
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));

    // Update the total score
    calculateTotalScore(updatedQuestions);
  };

  const calculateTotalScore = (questions) => {
    const negativeItems = ["C1", "C2", "C4", "A2", "A4", "A5"];

    const total = questions.reduce((acc, question) => {
      const scoreValue = scoreMapping[question.score] || 0;
      return (
        acc +
        (negativeItems.includes(question.code) ? 3 - scoreValue : scoreValue)
      );
    }, 0);

    setTotalScore(total);
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
    // Check if all questions have been answered
    const allAnswered = formData.questions.every((q) => q.score !== "");
    if (!allAnswered) {
      setError("Please answer all questions before submitting.");
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

      const finalData = { ...formData, totalScore };

      const response = await axiosInstance.post("/casp/add", finalData);

      if (response.data.success) {
        navigate("/casp-19");
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
                CASP-19 Questionnaire
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Add new CASP-19 evaluation
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/casp-19")}
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
            <div className="flex justify-start items-center gap-10">
              <div className="w-[30%]">
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

              <div className="w-[20%]">
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

            {/* Questions Table */}
            <div className="w-[95%] mx-auto">
              <hr className="w-full mt-3 mb-3 border" />
              <div>
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <span className="text-sm font-normal leading-none opacity-70">
                          Items
                        </span>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <span className="text-sm font-normal leading-none opacity-70">
                          Often
                        </span>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <span className="text-sm font-normal leading-none opacity-70">
                          Sometimes
                        </span>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <span className="text-sm font-normal leading-none opacity-70">
                          Not Often
                        </span>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <span className="text-sm font-normal leading-none opacity-70">
                          Never
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.questions.map((question, index) => (
                      <tr key={index}>
                        <td className="w-[700px] m-2">
                          <span className="text-sm font-normal">
                            {index + 1}. {question.question || "NA"}
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="radio"
                            value="Often"
                            name={`color${index}`}
                            checked={question.score === "Often"}
                            onChange={() => handleRadioChange(index, "Often")}
                            className="h-4 w-4 text-[#239d62] focus:ring-[#239d62] border-gray-300"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="radio"
                            value="Sometimes"
                            name={`color${index}`}
                            checked={question.score === "Sometimes"}
                            onChange={() =>
                              handleRadioChange(index, "Sometimes")
                            }
                            className="h-4 w-4 text-[#239d62] focus:ring-[#239d62] border-gray-300"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="radio"
                            value="Not often"
                            name={`color${index}`}
                            checked={question.score === "Not often"}
                            onChange={() =>
                              handleRadioChange(index, "Not often")
                            }
                            className="h-4 w-4 text-[#239d62] focus:ring-[#239d62] border-gray-300"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="radio"
                            value="Never"
                            name={`color${index}`}
                            checked={question.score === "Never"}
                            onChange={() => handleRadioChange(index, "Never")}
                            className="h-4 w-4 text-[#239d62] focus:ring-[#239d62] border-gray-300"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-[90%] text-center mt-5 mx-auto">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#239d62] hover:bg-[#1f8a55] disabled:opacity-50 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 text-lg font-medium mx-auto"
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

export default AddCasp19;
