import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import axiosInstance from "../utils/axios";

const AddMoca = () => {
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

  // MOCA questions with exact structure from the provided code
  const mocaQuestions = [
    {
      section: "VISUOSPATIAL / EXECUTIVE",
      subtopic: "",
      name: "Alternating Trail Making",
      score: "",
    },
    {
      section: "VISUOSPATIAL / EXECUTIVE",
      subtopic: "",
      name: "Copy cube",
      score: "",
    },
    {
      section: "VISUOSPATIAL / EXECUTIVE",
      subtopic: "Draw CLOCK (Ten past eleven)",
      name: "Contour",
      score: "",
    },
    {
      section: "VISUOSPATIAL / EXECUTIVE",
      subtopic: "Draw CLOCK (Ten past eleven)",
      name: "Numbers",
      score: "",
    },
    {
      section: "VISUOSPATIAL / EXECUTIVE",
      subtopic: "Draw CLOCK (Ten past eleven)",
      name: "Hands",
      score: "",
    },
    { section: "NAMING", subtopic: "", name: "Lion", score: "" },
    { section: "NAMING", subtopic: "", name: "Rhino", score: "" },
    { section: "NAMING", subtopic: "", name: "Camel", score: "" },
    // Adding MEMORY questions
    {
      section: "MEMORY",
      subtopic: "Read list of words, subject has to recall them in two trials",
      name: "FACE",
    },
    {
      section: "MEMORY",
      subtopic: "Read list of words, subject has to recall them in two trials",
      name: "VELVET",
    },
    {
      section: "MEMORY",
      subtopic: "Read list of words, subject has to recall them in two trials",
      name: "CHURCH",
    },
    {
      section: "MEMORY",
      subtopic: "Read list of words, subject has to recall them in two trials",
      name: "DAISY",
    },
    {
      section: "MEMORY",
      subtopic: "Read list of words, subject has to recall them in two trials",
      name: "RED",
    },
    {
      section: "ATTENTION",
      subtopic: "Read list of digits (1 digit/ sec.).",
      name: "Subject has to repeat them in the forward order: 2 1 8 5 4",
      score: "",
    },
    {
      section: "ATTENTION",
      subtopic: "Read list of digits (1 digit/ sec.).",
      name: "Subject has to repeat them in the backward order 7 4 2",
      score: "",
    },
    {
      section: "ATTENTION",
      subtopic:
        "Read list of letters. The subject must tap with his hand at each letter A. No points if ≥ 2 errors",
      name: "F B A C M N A A J K L B A F A K D E A A A J A M O F A A B",
      score: "",
    },
    {
      section: "ATTENTION",
      subtopic: "Serial 7 subtraction starting at 100",
      name: "93",
      score: "",
    },
    {
      section: "ATTENTION",
      subtopic: "Serial 7 subtraction starting at 100",
      name: "86",
      score: "",
    },
    {
      section: "ATTENTION",
      subtopic: "Serial 7 subtraction starting at 100",
      name: "79",
      score: "",
    },
    {
      section: "ATTENTION",
      subtopic: "Serial 7 subtraction starting at 100",
      name: "72",
      score: "",
    },
    {
      section: "ATTENTION",
      subtopic: "Serial 7 subtraction starting at 100",
      name: "65",
      score: "",
    },
    {
      section: "LANGUAGE",
      subtopic: "Repeat",
      name: "I only know that John is the one to help today.",
      score: "",
    },
    {
      section: "LANGUAGE",
      subtopic: "Repeat",
      name: "The cat always hid under the couch when dogs were in the room",
      score: "",
    },
    {
      section: "LANGUAGE",
      subtopic: "",
      name: "Fluency / Name maximum number of words in one minute that begin with the letter F",
      score: "",
    },
    {
      section: "ABSTRACTION",
      subtopic: "Similarity between e.g. banana - orange = fruit",
      name: "train – bicycle",
      score: "",
    },
    {
      section: "ABSTRACTION",
      subtopic: "Similarity between e.g. banana - orange = fruit",
      name: "watch - ruler",
      score: "",
    },

    // Adding DELAYED RECALL questions
    {
      section: "DELAYED RECALL",
      subtopic: "Recall the words after 5 minutes",
      name: "FACE",
      score: "",
    },
    {
      section: "DELAYED RECALL",
      subtopic: "Recall the words after 5 minutes",
      name: "VELVET",
      score: "",
    },
    {
      section: "DELAYED RECALL",
      subtopic: "Recall the words after 5 minutes",
      name: "CHURCH",
      score: "",
    },
    {
      section: "DELAYED RECALL",
      subtopic: "Recall the words after 5 minutes",
      name: "DAISY",
      score: "",
    },
    {
      section: "DELAYED RECALL",
      subtopic: "Recall the words after 5 minutes",
      name: "RED",
      score: "",
    },

    { section: "ORIENTATION", subtopic: "", name: "Date", score: "" },
    { section: "ORIENTATION", subtopic: "", name: "Month", score: "" },
    { section: "ORIENTATION", subtopic: "", name: "Year", score: "" },
    { section: "ORIENTATION", subtopic: "", name: "Day", score: "" },
    { section: "ORIENTATION", subtopic: "", name: "Place", score: "" },
    { section: "ORIENTATION", subtopic: "", name: "City", score: "" },
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
    setFormData((prev) => ({ ...prev, questions: mocaQuestions }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScoreChange = (index, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index].score = value;

    // Calculate total score
    const totalScore = newQuestions.reduce(
      (acc, question) => acc + (question.score || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      questions: newQuestions,
    }));
    setTotalScore(totalScore);
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
    // Check if all questions have scores (except MEMORY section)
    const allQuestionsFilled = formData.questions.every(
      (q) => q.section === "MEMORY" || (q.score !== "" && q.score !== null)
    );
    if (!allQuestionsFilled) {
      setError("Please fill out all fields before submitting.");
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

      const response = await axiosInstance.post("/moca/create", finalData);

      if (response.data.success) {
        navigate("/moca");
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

  const renderSection = (section) => {
    const sectionQuestions = formData.questions.filter(
      (q) => q.section === section
    );
    return (
      <div key={section} className="mb-6">
        <h2 className="font-bold mt-10 mb-4">{section}</h2>
        {sectionQuestions.map((question, index) => (
          <div
            key={index}
            className="flex justify-between items-center gap-[50px] mb-4"
          >
            <div className="mb-2">
              {question.subtopic
                ? `${question.subtopic} - ${question.name}`
                : question.name}
            </div>
            {section === "MEMORY" ? null : (
              <div className="w-[200px]">
                <input
                  type="number"
                  placeholder="Score"
                  required
                  value={question.score}
                  onChange={(e) =>
                    handleScoreChange(
                      formData.questions.indexOf(question),
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-[#239d62] focus:border-[#239d62] transition-colors"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const uniqueSections = [...new Set(formData.questions.map((q) => q.section))];

  return (
    <div className="min-h-full bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">
                MOCA Questionnaire
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Add new MOCA evaluation
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/moca")}
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
            {/* Header */}
            <div className="w-[100%] m-auto mb-5 flex justify-center items-center">
              <div className="w-[45%] font-bold text-lg">
                MONTREAL COGNITIVE ASSESSMENT (MOCA)
              </div>
              <hr className="w-[75%] border" />
            </div>

            {/* Basic Information */}
            <div className="flex justify-start items-center m-auto gap-10 mt-5">
              <select
                name="participant"
                value={formData.participant}
                onChange={handleChange}
                required
                className="border w-[30%] px-2 py-2 rounded-md text-gray-600 border border-gray-600 focus:ring-2 focus:ring-[#239d62] focus:border-[#239d62] transition-colors"
              >
                <option value="">Select member</option>
                {participants.map((participant) => (
                  <option key={participant._id} value={participant._id}>
                    {participant.name}
                  </option>
                ))}
              </select>

              <div className="w-[20%]">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="border w-full px-2 py-2 rounded-md text-gray-600 border border-gray-600 focus:ring-2 focus:ring-[#239d62] focus:border-[#239d62] transition-colors"
                />
              </div>
            </div>

            {/* Questions by Section */}
            <div className="p-6">
              {uniqueSections.map((section) => renderSection(section))}
            </div>

            {/* Submit Button */}
            <div className="w-[90%] text-center mt-5 m-auto">
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

export default AddMoca;
