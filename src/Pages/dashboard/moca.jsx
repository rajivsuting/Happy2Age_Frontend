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
import usePreventScrollOnNumberInput from "../../Componants/CustomHook";

const initialState = {
  participant: "",
  questions: [
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
  ],
  totalScore: "",
  date: "",
};

export const Moca = () => {
  usePreventScrollOnNumberInput();
  const [state, setState] = useState(initialState);
  const [allParticipants, setAllParticipants] = useState([]);
  const [selectParticipant, setSelectParticipant] = useState("");
  const [participantResult, setParticipantResult] = useState({});
  const navigate = useNavigate();

  const handleScoreChange = (index, value) => {
    const newQuestions = [...state.questions];
    newQuestions[index].score = value;
    const totalScore = newQuestions.reduce(
      (acc, question) => acc + (question.score || 0),
      0
    );
    setState({ ...state, questions: newQuestions, totalScore });
  };

  const handleDateChange = (e) => {
    setState({ ...state, date: e.target.value });
  };

  useEffect(() => {
    axios
      .get(`${serverUrl}/participant/all`,
        {
          headers: {
            Authorization: `${getLocalData("token")}`,
          },
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

  const validateForm = () => {
    // Check if all questions have scores
    const allQuestionsFilled = state.questions.every(
      (q) => q.score !== "" && q.score !== null
    );

    // Check if the participant and date are selected
    const participantSelected = state.participant !== "";
    const dateSelected = state.date !== "";

    return allQuestionsFilled && participantSelected && dateSelected;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill out all fields before submitting.", toastConfig);
      return;
    }

    axios
      .post(`${serverUrl}/moca/create`, state,
        {
          headers: {
            Authorization: `${getLocalData("token")}`,
          },
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

  const renderSection = (section) => {
    const sectionQuestions = state.questions.filter(
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
                <Input
                  type="number"
                  label="Score"
                  required
                  value={question.score}
                  onChange={(e) =>
                    handleScoreChange(
                      state.questions.indexOf(question),
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="border rounded px-2 py-1 noscroll"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSectionSingle = (section) => {
    const sectionQuestions = participantResult?.questions?.filter(
      (q) => q.section === section
    );

    return (
      <div key={section} className="mb-6">
        <h2 className="font-bold mt-10 mb-4">{section}</h2>
        {sectionQuestions.map((question, index) => (
          <div
            key={index}
            className="w-[90%] m-auto flex justify-between items-center gap-[20px] mb-4"
          >
            <div className="mb-2 w-[80%]">
              {question.subtopic
                ? `${question.subtopic} - ${question.name}`
                : question.name}
            </div>
            <div className="">{question.score || "0"}</div>
          </div>
        ))}
      </div>
    );
  };

  const uniqueSections = [...new Set(state.questions.map((q) => q.section))];

  const uniqueSectionsForsingle = [
    ...new Set(participantResult?.questions?.map((q) => q.section)),
  ];

  return (
    <form className="p-6">
      <div className="w-[100%] m-auto mb-5 flex justify-center items-center">
        <div className="w-[45%] font-bold text-lg">
          MONTREAL COGNITIVE ASSESSMENT (MOCA)
        </div>
        <hr className="w-[75%] border" />
      </div>
      <div className="flex justify-start items-center m-auto gap-10 mt-5">
        <select
          className="border w-[30%] px-2 py-2 rounded-md text-gray-600 border border-gray-600"
          value={state.participant}
          onChange={(e) => setState({ ...state, participant: e.target.value })}
          required
        >
          <option value="">Select member</option>
          {allParticipants?.map((el, index) => (
            <option key={index} value={el._id}>
              {el.name}
            </option>
          ))}
        </select>
        <div className="w-[20%]">
          <Input
            type="date"
            label="Date"
            required
            name="date"
            value={state.date}
            onChange={handleDateChange}
          />
        </div>
        {/* <div className="">
          <h2 className="text-xl font-bold">Total Score: {state.totalScore}</h2>
        </div> */}
      </div>
      {uniqueSections.map((section) => renderSection(section))}

      <div className="w-[90%] text-center mt-5 m-auto">
        <Button className="bg-maincolor" type="submit" onClick={handleSubmit}>
          Add
        </Button>
      </div>
    </form>
  );
};

export default Moca;
