import React, { useEffect, useState } from "react";
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { CgSpinner } from "react-icons/cg";
import axios from "axios";
import { serverUrl } from "../../api";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { getLocalData } from "../../Utils/localStorage";
import { useNavigate } from "react-router-dom";

const initialState = {
  participant: "",
  questions: [
    {
      question: "I don’t feel particularly pleased with the way I am.",
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
    { question: "I don’t think I look attractive.", isReverse: true, score: 0 },
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
      question: "I don’t find it easy to make decisions.",
      isReverse: true,
      score: 0,
    },
    {
      question:
        "I don’t have a particular sense of meaning and purpose in my life.",
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
      question: "I don’t have fun with other people.",
      isReverse: true,
      score: 0,
    },
    {
      question: "I don’t feel particularly healthy.",
      isReverse: true,
      score: 0,
    },
    {
      question: "I don’t have particularly happy memories of the past.",
      isReverse: true,
      score: 0,
    },
  ],
  totalScore: 0,
  date:""
};

export const OxfordHappiness = () => {
  const [questionData, setQuestionData] = useState(initialState);
  const [allParticipants, setAllParticipants] = useState([]);
  const [selectParticipant, setSelectParticipant] = useState("");
  const [participantResult, setParticipantResult] = useState({});
  const [isAddQuestionLoading, setIsAddQuestionLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { participant, questions, totalScore,date } = questionData;

  useEffect(() => {
    axios
      .get(`${serverUrl}/participant/all`,{
        
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
          toast.error(err.response.data.message, toastConfig);
        } else {
          toast.error("An unexpected error occurred.", toastConfig);
        }
      });
  }, []);

  const handleParticipantChange = (e) => {
    setQuestionData({ ...questionData, participant: e.target.value });
  };

  const handleDateChange = (e) => {
    setQuestionData({ ...questionData, date: e.target.value, });
  };

  const handleScoreChange = (index, value) => {
    const newQuestions = questions.map((question, idx) =>
      idx === index ? { ...question, score: Number(value) } : question
    );
    setQuestionData({ ...questionData, questions: newQuestions });
  };

  const handleSubmitCohort = (e) => {
    e.preventDefault();
    axios
      .post(`${serverUrl}/oxford/add`, questionData,{
        
      })
      .then((res) => {
        toast.success(res.data.message, toastConfig);
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

  const handleSubmitOxfordResult = (e) => {
    e.preventDefault();
    axios
      .get(`${serverUrl}/oxford/${selectParticipant}`,{
        
      })
      .then((res) => {
        console.log(res);
        setParticipantResult(res.data.message[res.data.message.length - 1]);
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
          <div className="w-[25%]">Oxford Happiness Questionnaire</div>
          <hr className="w-[75%] border" />
        </div>
        <div className="flex justify-start items-center m-auto gap-10 mt-5">
          <select
            className="border w-[30%] px-2 py-2 rounded-md text-gray-600 border border-gray-600"
            value={participant}
            onChange={handleParticipantChange}
            required
          >
            <option value="">Select Participant</option>
            {allParticipants?.map((el, index) => (
              <option key={index} value={el._id}>
                {el.name}
              </option>
            ))}
          </select>
          <div className="w-[20%]">
          <Input type="date" label="Date" required name="date" value={date} onChange={handleDateChange}/>
          </div>
        </div>

        <div className="w-[95%] m-auto mt-5">
          <h3>Question list</h3>
          <hr className="w-[100%] mt-3 mb-3 border" />
          <div className="">
            {questions.map((el, index) => (
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
                    onChange={(e) => handleScoreChange(index, e.target.value)}
                    required
                  >
                    <option value={0}>Select Score</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                  </select>
                </div>
              </div>
            ))}
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

export default OxfordHappiness;
