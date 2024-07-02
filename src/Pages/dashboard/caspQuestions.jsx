import React, { useEffect, useState } from "react";
import { Button, Card, Input, Radio, Typography } from "@material-tailwind/react";
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
  date:"",
  questions: [
    {
      question: "My age prevents me from doing the things I would like to do.",
      score: "",
    },
    {
      question: "I feel that what happens to me is out of my control.",
      score: "",
    },
    {
      question: "I feel free to plan for the future.",
      score: "",
    },
    // { question: "I feel left out of things.", score: "" },
    {
      question: "I can do the things I want to do.",
      score: "",
    },
    {
      question: "I am not particularly optimistic about the future.",
      score: "",
    },
    {
      question:
        "Family responsibilities prevent me from doing the things I want to do.",
      score: "",
    },
    {
      question: "I feel that I can please myself what I do.",
      score: "",
    },
    {
      question: "My health stops me from doing the things I want to do.",
      score: "",
    },
    {
      question: "Shortage of money stops me from doing things I want to do.",
      score: "",
    },
    { question: "I look forward to each day.", score: "" },
    {
      question: "I feel that my life has meaning.",
      score: "",
    },
    { question: "I enjoy the things that I do.", score: "" },
    {
      question: "I enjoy being in the company of others.",
      score: "",
    },
    {
      question: "On balance, I look back on my life with a sense of happiness.",
      score: "",
    },
    {
      question: "I feel full of energy these days.",
      score: "",
    },
    {
      question: "I choose to do things that I have never done before.",
      score: "",
    },
    {
      question: "I feel satisfied with the way my life has turned out.",
      score: "",
    },
    {
      question: "I feel that life is full of opportunities.",
      score: "",
    },
    {
      question: "I feel that the future looks good for me.",
      score: "",
    },
  ],
};

export const CaspQuestions = () => {
  const [questionData, setQuestionData] = useState(initialState);
  const [allParticipants, setAllParticipants] = useState([]);
  const [isAddQuestionLoading, setIsAddQuestionLoading] = useState(false);
  const [selectParticipant, setSelectParticipant] = useState("");
  const [participantResult, setParticipantResult] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { participant, questions,date } = questionData;

  useEffect(() => {
    axios
      .get(`${serverUrl}/participant/all`,{
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
          toast.error(err.response.data.message, toastConfig);
        } else {
          toast.error("An unexpected error occurred.", toastConfig);
        }
      });
  }, []);

  const handleParticipantChange = (e) => {
    setQuestionData({ ...questionData, participant: e.target.value, });
  };

  const handleDateChange = (e) => {
    setQuestionData({ ...questionData, date: e.target.value, });
  };

  const handleSubmitCohort = (e) => {
    e.preventDefault();

    const updatedQuestions = questionData.questions.map((question, index) => {
      const selectedValue = document.querySelector(
        `input[name="color${index}"]:checked`
      );

      if (selectedValue) {
        return {
          ...question,
          score: selectedValue.value,
        };
      }

      return question;
    });

    setQuestionData({ ...questionData, questions: updatedQuestions });

    axios
      .post(`${serverUrl}/casp/add`, questionData,{
      // headers: {
      //   Authorization: `${getLocalData("token")}`,
      // },
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
      .get(`${serverUrl}/casp/${selectParticipant}`,{
      // headers: {
      //   Authorization: `${getLocalData("token")}`,
      // },
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

  // console.log(participantResult);

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
                {questions.map((el, index) => {
                  return (
                    <tr key={index}>
                      <td className={`w-[700px] m-2`}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {index + 1}. {el.question || "-"}
                        </Typography>
                      </td>
                      <td className={`p-2 text-center`}>
                        <input
                          type="radio"
                          value={"Often"}
                          name={`color${index}`}
                        />
                      </td>
                      <td className={`p-2 text-center`}>
                        <input
                          type="radio"
                          value={"Sometimes"}
                          name={`color${index}`}
                        />
                      </td>
                      <td className={`p-2 text-center`}>
                        <input
                          type="radio"
                          value={"Not often"}
                          name={`color${index}`}
                        />
                      </td>
                      <td className={`p-2 text-center`}>
                        <input
                          type="radio"
                          value={"Never"}
                          name={`color${index}`}
                        />
                      </td>
                    </tr>
                  );
                })}
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
