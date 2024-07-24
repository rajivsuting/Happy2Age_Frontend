import React, { useEffect, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import axios from "axios";
import { serverUrl } from "../api";
import { toastConfig } from "../App";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";

const EditCASP = ({ isOpen, onClose, singleCASP, getAllCASP, editOrView }) => {
  const [questionData, setQuestionData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    if (singleCASP) {
      setQuestionData(singleCASP);
      const { totalScore } = calculateTotalScore(singleCASP.questions);
      setTotalScore(totalScore);
    }
  }, [singleCASP]);

  const handleChange = (index, e) => {
    const { value } = e.target;
    const updatedQuestions = [...questionData.questions];
    updatedQuestions[index].score = value;
    setQuestionData({ ...questionData, questions: updatedQuestions });
    const { totalScore } = calculateTotalScore(updatedQuestions);
    setTotalScore(totalScore);
  };

  const calculateTotalScore = (questions) => {
    let totalScore = 0;
    const updatedQuestions = questions?.map((question) => {
      const scoreValue =
        question.score === "Often"
          ? 3
          : question.score === "Sometimes"
          ? 2
          : question.score === "Not often"
          ? 1
          : 0;

      // Adjust score for negative items
      const negativeItems = ["C1", "C2", "C4", "A2", "A4", "A5"];

      totalScore += negativeItems.includes(question.code)
        ? 3 - scoreValue
        : scoreValue;

      return question;
    });

    return { updatedQuestions, totalScore };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { updatedQuestions, totalScore } = calculateTotalScore(questionData.questions);
    const updatedData = {
      ...questionData,
      questions: updatedQuestions,
      totalScore,
    };

    axios
      .patch(`${serverUrl}/casp/edit/${singleCASP._id}`, updatedData)
      .then((res) => {
        toast.success(res.data.message, toastConfig);
        getAllCASP(); // Refresh the list
        onClose(); // Close the modal
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "An error occurred.",
          toastConfig
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!isOpen || !singleCASP) return null;
  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative m-4 w-[60%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl px-4">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 py-8 font-sans text-2xl font-semibold text-blue-gray-900 bg-white">
          {editOrView === "View"
            ? `CASP-19 Questionnaire Score details - Total Score: ${totalScore}`
            : `Edit CASP-19 Questionnaire Scores`}
          <AiOutlineClose
            className="cursor-pointer"
            size={24}
            onClick={onClose}
          />
        </div>
        <div className="px-4 mt-5">
          <form onSubmit={handleSubmit}>
            {questionData?.questions?.map((question, index) => (
              <div
                key={index}
                className="mb-4 flex justify-between items-center"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal mb-2"
                >
                  {question.question}
                </Typography>
                <div className="flex gap-4">
                  {["Often", "Sometimes", "Not often", "Never"].map(
                    (option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name={`score${index}`}
                          value={option}
                          disabled={editOrView === "View"}
                          checked={question.score === option}
                          onChange={(e) => handleChange(index, e)}
                          className="mr-2 p-2 text-center"
                        />
                        {option}
                      </label>
                    )
                  )}
                </div>
              </div>
            ))}
            {editOrView === "View" ? null : (
              <div className="text-center sticky bottom-0 z-10 pb-5">
                <Button
                  type="submit"
                  className="bg-maincolor"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CgSpinner size={18} className="m-auto animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCASP;
