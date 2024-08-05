import React, { useEffect, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import axios from "axios";
import { serverUrl } from "../api";
import { toastConfig } from "../App";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";
import usePreventScrollOnNumberInput from "./CustomHook";

const EditMoCA = ({ isOpen, onClose, singleMOCA, getAllMoca, editOrView }) => {
  usePreventScrollOnNumberInput();
  const [questionData, setQuestionData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setQuestionData(singleMOCA);
  }, [singleMOCA]);

  const handleChange = (index, e) => {
    const { value } = e.target;
    const updatedQuestions = [...questionData?.questions];
    updatedQuestions[index].score = value;
    setQuestionData({ ...questionData, questions: updatedQuestions });
  };

  const calculateTotalScore = () => {
    const updatedQuestions = questionData?.questions?.map((question) => {
      const scoreValue = parseInt(question.score) || 0;
      return {
        ...question,
        score: scoreValue,
      };
    });

    let totalScore = updatedQuestions?.reduce((total, question) => {
      return total + question.score;
    }, 0);

    return { updatedQuestions, totalScore };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { updatedQuestions, totalScore } = calculateTotalScore();
    const updatedData = { ...questionData, questions: updatedQuestions, totalScore };
    
    axios
      .patch(`${serverUrl}/moca/edit/${singleMOCA._id}`, updatedData)
      .then((res) => {
        toast.success("MOCA edited successfully", toastConfig);
        getAllMoca(); // Refresh the list
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

  if (!isOpen || !singleMOCA) return null;
  
  const { totalScore } = calculateTotalScore(); // Get the total score for display
  
  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative m-4 w-[60%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl px-4">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 py-8 font-sans text-2xl font-semibold text-blue-gray-900 bg-white">
          {editOrView === "View" ? "MOCA score details" : "Edit MoCA Scores"}  
          {editOrView === "View" && (
            <Typography variant="small" className="text-lg font-bold">
              Total Score: {totalScore}
            </Typography>
          )}
          <AiOutlineClose
            className="cursor-pointer"
            size={24}
            onClick={onClose}
          />
        </div>
        <div className="px-4 mt-5">
          <form onSubmit={handleSubmit}>
            {questionData?.questions?.map((question, index) => (
              <div key={index} className="mb-4 flex justify-between gap-10 items-center">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="w-[70%] font-normal mb-2"
                >
                  {question.section}{" "}-{" "}{question.subtopic}{" "}-{" "}{question.name}
                </Typography>
                {
                    question.section === "MEMORY" ? null :
                    <input
                      type="number"
                      
                      min="0"
                      max="3"
                      disabled={editOrView === "View"}
                      value={question.score}
                      onChange={(e) => handleChange(index, e)}
                      className="noscroll border w-[25%] px-2 py-1 rounded-md text-gray-600 border border-gray-600"
                    />
                }
              </div>
            ))}
            {editOrView === "View" ? null :
            <div className="text-center sticky bottom-0 z-10 pb-5">
              <Button type="submit" className="bg-maincolor" disabled={isLoading}>
                {isLoading ? <CgSpinner size={18} className="m-auto animate-spin" /> : "Save"}
              </Button>
            </div>
            }
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMoCA;
