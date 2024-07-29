import React, { useEffect, useState } from "react";
import { Button, Input, List, ListItem } from "@material-tailwind/react";
import axios from "axios";
import { serverUrl } from "../api";
import { toastConfig } from "../App";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import { AiOutlineClose } from "react-icons/ai";
import { getLocalData } from "../Utils/localStorage";

const EditOxford = ({
  isOpen,
  onClose,
  singleOxford,
  getAllOxfords,
  editOrView,
}) => {
  const [questionData, setQuestionData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setQuestionData(singleOxford);
  }, [singleOxford]);

  const handleScoreChange = (index, value) => {
    const newQuestions = questionData.questions.map((question, idx) =>
      idx === index ? { ...question, score: Number(value) } : question
    );
    setQuestionData({ ...questionData, questions: newQuestions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .put(`${serverUrl}/oxford/edit/${singleOxford._id}`, questionData)
      .then((res) => {
        toast.success("Oxford Happiness edited successfully", toastConfig);
        getAllOxfords(); // Refresh the list
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

  // dumyyy---------------------------------


 
  











  //dummy--------------------------------------------

  if (!isOpen || !singleOxford) return null;
  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative m-4 w-[60%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl px-4">
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 py-8 font-sans text-2xl font-semibold text-blue-gray-900 bg-white">
          {editOrView == "View"
            ?  `Oxford Happiness Score details - Total score: ${(questionData?.happinessScore)?.toFixed(2)}`
            : "Edit member Oxford Happiness Score"}
          <AiOutlineClose
            className="cursor-pointer"
            size={24}
            onClick={onClose}
          />
        </div>
        <div className="px-4">
          <form onSubmit={handleSubmit}>
            {/* <div className="w-[100%] m-auto mb-5 flex justify-center items-center">
          <div className="w-[25%]">Oxford Happiness Scores</div>
          <hr className="w-[75%] border" />
        </div> */}

            <div className="w-[95%] m-auto mt-5">
              <h3>Question list</h3>
              <hr className="w-[100%] mt-3 mb-3 border" />
              <div className="">
                {questionData?.questions?.map((el, index) => (
                  <div
                    className="flex justify-center items-center gap-10 mb-3"
                    key={index}
                  >
                    <div className="w-[75%]">
                      {index + 1}. {el.question}
                    </div>
                    <div className="w-[23%]">
                      <select
                        className="border px-2 py-2 rounded-md text-gray-600 border border-gray-600"
                        value={el.score}
                        disabled={editOrView == "View"}
                        onChange={(e) =>
                          handleScoreChange(index, e.target.value)
                        }
                        required
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
                  </div>
                ))}
              </div>
            </div>
 
            {editOrView == "View" ? null : (
              <div className="w-[90%] text-center mt-5 m-auto sticky bottom-0 z-10 pb-5">
                <Button
                  className="bg-maincolor"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CgSpinner size={18} className="m-auto animate-spin" />
                  ) : (
                    "Update"
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

export default EditOxford;
