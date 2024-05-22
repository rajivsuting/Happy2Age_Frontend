import {
  Button,
  Input,
  Select,
  Option,
  Typography,
  Card,
  List,
  ListItem,
  Textarea,
  Radio,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import axios from "axios";
import { toastConfig } from "../../App";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";

const initialState = {
  session: "",
  cohort: "",
  participant: "",
  activity: "",
  domain: [], // Changed to object instead of string
};

export const AddEvaluation = () => {
  const [evaluationData, setEvaluationData] = useState(initialState);
  const [participantList, setParticipantList] = useState([]);
  const [domainList, setDomainList] = useState([]);
  const [sessionList, setSessionList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [cohortList, setCohortList] = useState([]);
  const [domainCategory, setDomainCategory] = useState("");
  const [sessionFromCohort, setsessionFromCohort] = useState([]);
  const [participantsFromSession, setParticipantsFromSession] = useState([]);
  const [activityFromSession, setActivityFromSession] = useState([]);
  const [selectDomainByType, setSelectDomainByType] = useState([]);
  const [isAddEvaluationLoading, setIsAddEvaluationLoading] = useState(false)

  const { session, cohort, participant, activity, domain } = evaluationData;

  const handleChangeEvaluation = (e) => {
    const { name, value } = e.target;
    // For domain field, find the selected object from domainList
    if (name === "domain") {
      const selectedDomain = domainList.find((item) => item.name === value);
      setEvaluationData({
        ...evaluationData,
        [name]: selectedDomain || {}, // If not found, set empty object
      });
    } else {
      setEvaluationData({
        ...evaluationData,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    axios.get(`${serverUrl}/participant/all`).then((res) => {
      setParticipantList(res.data.message);
    });
    axios.get(`${serverUrl}/cohort/all`).then((res) => {
      setCohortList(res.data.message);
    });
    axios.get(`${serverUrl}/activity/all`).then((res) => {
      setActivityList(res.data.message);
    });
    axios.get(`${serverUrl}/domain/all/?category=All`).then((res) => {
      setDomainList(res.data.message);
      console.log();
    });
    axios.get(`${serverUrl}/session/all`).then((res) => {
      setSessionList(res.data.message);
      // console.log("res.data.message", res.data.message);
    });
  
  
    axios.get(`${serverUrl}/evaluation/all`).then((res) => {
      // setSessionList(res.data.message);
      console.log("res.data.message", res.data.message);
    });}, []);

  useEffect(() => {
    setsessionFromCohort(
      cohortList?.filter((el) => el._id === cohort)[0]?.sessions
    );
  }, [cohort]);

  useEffect(() => {
    setParticipantsFromSession(
      cohortList?.filter((el) => el._id === cohort)[0]?.participants
    );
  }, [cohort]);

  useEffect(() => {
    setActivityFromSession(
      sessionList?.filter((el) => el._id === session)[0]?.activity
    );
  }, [session]);

  useEffect(() => {
    setSelectDomainByType(
      domainList?.filter((el) => el.category === domainCategory)
    );
  }, [domainCategory]);

  // console.log(cohortList)
  const handleScoreChange = (domainIndex, questionIndex, newScore) => {
    const updatedDomains = [...selectDomainByType];
    updatedDomains[domainIndex].subTopics[questionIndex].score = newScore;
    setEvaluationData((prev)=>{
      return {
        ...prev,
        domain:updatedDomains
      }
    });
  };

  // Handle observation change
  const handleObservationChange = (domainIndex, newObservation) => {
    const updatedDomains = [...selectDomainByType];
    updatedDomains[domainIndex].observation = newObservation;
    setEvaluationData((prev)=>{
      return {
        ...prev,
        domain:updatedDomains
      }
    });
  };

  const handleSubmitEvaluation = (e) => {
    e.preventDefault();
    setIsAddEvaluationLoading(true);
    axios
      .post(`${serverUrl}/evaluation/create`, evaluationData)
      .then((res) => {
        if (res.status == 201) {
          toast.success("Evaluation added suucessfully", toastConfig);
          setEvaluationData(initialState);
          setIsAddEvaluationLoading(false);
        } else {
          toast.error("Something went wrong", toastConfig);
        }
      })
      .catch((err) => {
        setIsAddEvaluationLoading(false);
        toast.error(err.response.data.error, toastConfig);
      });
  };

  // console.log("domainList", domainList);

  return (
    <div className="flex justify-center items-center gap-10 mb-24">
      <form
        className="m-auto border rounded-xl shadow w-[70%] py-8 mt-8 bg-white"
        onSubmit={handleSubmitEvaluation}
      >
        <div className="w-[90%] m-auto mb-5 flex justify-center items-center">
          <div className="w-[15%]">Add details</div>{" "}
          <hr className="w-[85%] border" />
        </div>
        <div className="w-[90%] flex justify-between items-center m-auto gap-10">
          <select
            id=""
            name="cohort"
            value={cohort}
            onChange={handleChangeEvaluation}
            className="border w-[30%] px-2 py-2 rounded-md text-gray-600 border border-gray-600"
            required
          >
            <option value="">Select cohort</option>;
            {cohortList.map((el) => {
              return (
                <option key={el._id} value={el._id}>
                  {el.name}
                </option>
              );
            })}
          </select>
          <select
            label="Select session"
            name="session"
            value={session}
            onChange={handleChangeEvaluation}
            className="border w-[30%] px-2 py-2 rounded-md text-gray-600 border border-gray-600"
            required
          >
            <option value="">Select session</option>;
            {sessionFromCohort?.map((el) => {
              return (
                <option key={el._id} className="py-1 m-2" value={el._id}>
                  {el.name}
                </option>
              );
            })}
          </select>
          <select
            id=""
            name="participant"
            value={participant}
            onChange={handleChangeEvaluation}
            className="border w-[30%] px-2 py-2 rounded-md  text-gray-600 border border-gray-600"
            required
          >
            <option value="">Select participant</option>;
            {participantsFromSession?.map((el) => {
              return (
                <option key={el._id} value={el._id}>
                  {el.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="w-[90%] flex justify-between items-center m-auto gap-10 mt-5">
          <select
            id=""
            name="activity"
            value={activity}
            onChange={handleChangeEvaluation}
            className="border w-[50%] px-2 py-2 rounded-md  text-gray-600 border border-gray-600"
            required
          >
            <option value="">Select activity</option>;
            {activityFromSession?.map((el) => {
              return (
                <option key={el._id} value={el._id}>
                  {el.name}
                </option>
              );
            })}
          </select>
          <select
            id=""
            name="domain"
            value={domainCategory} // Assuming domain.name is the identifier for domain object
            onChange={(e) => setDomainCategory(e.target.value)}
            className="border w-[50%] px-2 py-2 rounded-md  text-gray-600 border border-gray-600"
            required
          >
            <option value="">Select evaluation type</option>;
            <option value="General">General</option>
            <option value="Special Need">Special Need</option>
          </select>
        </div>
        {selectDomainByType?.map((domain, domainIndex) => (
          <Card className="w-[90%] m-auto mt-5" key={domainIndex}>
            <div className="m-3">
              <Typography>{domain.name}</Typography>
            </div>

            {domain?.subTopics?.map((question, questionIndex) => {
              // console.log(domain.name)
              // if (domain.name.includes("Skills")){
              //   return <List key={questionIndex}>
              //   <ListItem>
              //     <div className="w-[40%]">
              //       <Radio
              //         value={question.score || ""}
              //         type="radio"
              //         onChange={(e) =>
              //           handleScoreChange(
              //             domainIndex,
              //             questionIndex,
              //             e.target.value
              //           )
              //         }
              //         // defaultChecked 
              //       />
              //     </div>
              //     <Typography className="w-[60%] mr-5">
              //       {questionIndex + 1}. {question.content}
              //     </Typography>
              //   </ListItem>
              // </List>
              // } else {
               return <List key={questionIndex}>
                <ListItem>
                  <Typography className="w-[60%] mr-5">
                    {questionIndex + 1}. {question.content}
                  </Typography>
                  <div className="w-[40%]">
                    <Input
                      label="Add score"
                      value={question.score || ""}
                      type="number"
                      onChange={(e) =>
                        handleScoreChange(
                          domainIndex,
                          questionIndex,
                          e.target.value
                        )
                      }
                    />
                  </div>
                </ListItem>
              </List>
              // }
            })}

            <div className="m-3">
              <Textarea
                label="Observation"
                value={domain.observation}
                fullWidth
                multiline
                onChange={(e) =>
                  handleObservationChange(domainIndex, e.target.value)
                }
              />
            </div>
          </Card>
        ))}

        {/* {domain && (
          
        )} */}
        <div className="w-[90%] text-center mt-5 m-auto">
          <Button className="bg-maincolor" type="submit" disabled={isAddEvaluationLoading}>
          {isAddEvaluationLoading ? (
              <CgSpinner size={18} className=" m-auto animate-spin" />
            ) : (
              "Add Evaluation"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEvaluation;
