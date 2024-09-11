import React, { useEffect, useState } from "react";
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { CgSpinner } from "react-icons/cg";
import axios from "axios";
axios.defaults.withCredentials = true;
import { serverUrl } from "../../api";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { getLocalData } from "../../Utils/localStorage";
import { useNavigate } from "react-router-dom";

const initialState = {
  participant: "",
  date: "",
  questions: [
    { question: "My age prevents me from doing the things I would like to do.", code: "C1", score: "" },
    { question: "I feel that what happens to me is out of my control.", code: "C2", score: "" },
    { question: "I feel free to plan for the future.", code: "C3", score: "" },
    { question: "I feel left out of things.", code: "C4", score: "" },
    { question: "I can do the things I want to do.", code: "A1", score: "" },
    { question: "Family responsibilities prevent me from doing the things I want to do", code: "A2", score: "" },
    { question: "I feel that I can please myself what I do", code: "A3", score: "" },
    { question: "My health stops me from doing the things I want to do.", code: "A4", score: "" },
    { question: "Shortage of money stops me from doing things I want to do.", code: "A5", score: "" },
    { question: "I look forward to each day.", code: "P1", score: "" },
    { question: "I feel that my life has meaning.", code: "P2", score: "" },
    { question: "I enjoy the things that I do.", code: "P3", score: "" },
    { question: "I enjoy being in the company of others.", code: "P4", score: "" },
    { question: "On balance, I look back on my life with a sense of happiness.", code: "P5", score: "" },
    { question: "I feel full of energy these days.", code: "SR1", score: "" },
    { question: "I choose to do things that I have never done before.", code: "SR2", score: "" },
    { question: "I feel satisfied with the way my life has turned out.", code: "SR3", score: "" },
    { question: "I feel that life is full of opportunities.", code: "SR4", score: "" },
    { question: "I feel that the future looks good for me.", code: "SR5", score: "" },
  ],
};

const scoreMapping = {
  Often: 3,
  Sometimes: 2,
  "Not often": 1,
  Never: 0,
};

export const CaspQuestions = () => {
  const [questionData, setQuestionData] = useState(initialState);
  const [allParticipants, setAllParticipants] = useState([]);
  const [isAddQuestionLoading, setIsAddQuestionLoading] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { participant, questions, date } = questionData;

  useEffect(() => {
    axios
      .get(`${serverUrl}/participant/all`, {
        // headers: {
        //   Authorization: `${getLocalData("token")}`,
        // },
      })
      .then((res) => {
        setAllParticipants(res.data.message);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.jwtExpired) {
          toast.error(err.response.data.message, toastConfig);
          setTimeout(() => {
            navigate("/auth/sign-in");
          }, 3000);
        } else if (err.response && err.response.data) {
          // toast.error(err.response.data.message, toastConfig);
        } else {
          toast.error("An unexpected error occurred.", toastConfig);
        }
      });
  }, []);

  const handleParticipantChange = (e) => {
    setQuestionData({ ...questionData, participant: e.target.value });
  };

  const handleDateChange = (e) => {
    setQuestionData({ ...questionData, date: e.target.value });
  };

  const handleRadioChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].score = value;
    setQuestionData({ ...questionData, questions: updatedQuestions });

    // Update the total score
    calculateTotalScore(updatedQuestions);
  };

  const calculateTotalScore = (questions) => {
    const negativeItems = ["C1", "C2", "C4", "A2", "A4", "A5"];

    const total = questions.reduce((acc, question) => {
      const scoreValue = scoreMapping[question.score] || 0;
      return acc + (negativeItems.includes(question.code) ? 3 - scoreValue : scoreValue);
    }, 0);

    setTotalScore(total);
  };

  const handleSubmitCohort = (e) => {
    e.preventDefault();

    // Check if all questions have been answered
    const allAnswered = questions.every(q => q.score !== "");

    if (!allAnswered) {
      toast.error("Please answer all questions before submitting.", toastConfig);
      return;
    }

    const finalData = { ...questionData, totalScore };

    axios
      .post(`${serverUrl}/casp/add`, finalData, {
        // headers: {
        //   Authorization: `${getLocalData("token")}`,
        // },
      })
      .then((res) => {
        toast.success(res.data.message, toastConfig);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.jwtExpired) {
          toast.error(err.response.data.message, toastConfig);
          setTimeout(() => {
            navigate("/auth/sign-in");
          }, 3000);
        } else if (err.response && err.response.data) {
          toast.error(err.response.data.message, toastConfig);
        } else {
          toast.error("An unexpected error occurred.", toastConfig);
        }
      });
  };

  return (
    <Card className="h-full w-full overflow-scroll mt-5 mb-24 p-8">
      <form onSubmit={handleSubmitCohort}>
        {/* Basic details */}
        <div className="w-[100%] m-auto mb-5 flex justify-center items-center">
          <div className="w-[25%]"> CASP-19 Questionnaire</div>
          <hr className="w-[75%] border" />
        </div>
        <div className="flex justify-start items-center m-auto gap-10 mt-5">
          <select
            className="border w-[30%] px-2 py-2 rounded-md text-gray-600 border border-gray-600"
            value={participant}
            onChange={handleParticipantChange}
            required
          >
            <option value="">Select member</option>
            {allParticipants?.map((el, index) => (
              <option key={index} value={el._id}>
                {el.name}
              </option>
            ))}
          </select>
          <div className="w-[20%] flex items-center gap-2">
            <Input
              type="date"
              label="Date"
              required
              name="date"
              value={date}
              onChange={handleDateChange}
            />
            {/* <Typography variant="small" color="blue-gray" className="font-normal">
              Total Score: {totalScore}
            </Typography> */}
          </div>
        </div>

        <div className="w-[95%] m-auto mt-5">
          <hr className="w-[100%] mt-3 mb-3 border" />
          <div className="">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      Items
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      Often
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      Sometimes
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      Not Often
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      Never
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {questions.map((el, index) => (
                  <tr key={index}>
                    <td className={`w-[700px] m-2`}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {index + 1}. {el.question || "NA"}
                      </Typography>
                    </td>
                    <td className={`p-2 text-center`}>
                      <input
                        type="radio"
                        value={"Often"}
                        name={`color${index}`}
                        checked={el.score === "Often"}
                        onChange={() => handleRadioChange(index, "Often")}
                      />
                    </td>
                    <td className={`p-2 text-center`}>
                      <input
                        type="radio"
                        value={"Sometimes"}
                        name={`color${index}`}
                        checked={el.score === "Sometimes"}
                        onChange={() => handleRadioChange(index, "Sometimes")}
                      />
                    </td>
                    <td className={`p-2 text-center`}>
                      <input
                        type="radio"
                        value={"Not often"}
                        name={`color${index}`}
                        checked={el.score === "Not often"}
                        onChange={() => handleRadioChange(index, "Not often")}
                      />
                    </td>
                    <td className={`p-2 text-center`}>
                      <input
                        type="radio"
                        value={"Never"}
                        name={`color${index}`}
                        checked={el.score === "Never"}
                        onChange={() => handleRadioChange(index, "Never")}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-[90%] text-center mt-5 m-auto">
          <Button
            className="bg-maincolor"
            type="submit"
            disabled={isAddQuestionLoading}
          >
            {isAddQuestionLoading ? (
              <CgSpinner size={18} className="m-auto animate-spin" />
            ) : (
              "Add"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CaspQuestions;
