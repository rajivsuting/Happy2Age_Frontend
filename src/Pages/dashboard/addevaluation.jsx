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
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import axios from "axios";
import { toastConfig } from "../../App";
import { toast } from "react-toastify";

const initialState = {
  session: "",
  cohort: "",
  participant: "",
  activity: "",
  domain: {}, // Changed to object instead of string
};

export const AddEvaluation = () => {
  const [evaluationData, setEvaluationData] = useState(initialState);
  const [participantList, setParticipantList] = useState([]);
  const [domainList, setDomainList] = useState([]);
  const [sessionList, setSessionList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [cohortList, setCohortList] = useState([]);
  const [cohortFromSession, setCohortFromSession] = useState([]);
  const [participantsFromSession, setParticipantsFromSession] = useState([]);
  const [activityFromSession, setActivityFromSession] = useState([]);

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
    axios.get(`${serverUrl}/domain/all`).then((res) => {
      setDomainList(res.data.message);
    });
    axios.get(`${serverUrl}/session/all`).then((res) => {
      setSessionList(res.data.message);
      console.log("res.data.message", res.data.message);
    });
  }, []);

  useEffect(() => {
    setCohortFromSession(sessionList?.filter((el) => el._id === session));
  }, [session]);

  useEffect(() => {
    setParticipantsFromSession(
      cohortFromSession[0]?.cohort?.filter((el) => el._id === cohort)
    );
  }, [cohort]);

  const handleMarksChange = (index, score) => {
    setEvaluationData((prevData) => {
      // Create a new copy of the domain object and update the marks of the specific subtopic
      const updatedDomain = { ...prevData.domain };
      updatedDomain.subTopics[index].score = score;
      // Return the updated evaluation data
      return {
        ...prevData,
        domain: updatedDomain,
      };
    });
  };

  const handleObservationChange = ( observation) => {
    setEvaluationData((prevData) => {
      // Create a new copy of the domain object and update the marks of the specific subtopic
      const updatedDomain = { ...prevData.domain };
      updatedDomain.observation = observation;
      // Return the updated evaluation data
      return {
        ...prevData,
        domain: updatedDomain,
      };
    });
  };

  const handleSubmitEvaluation = (e) => {
    e.preventDefault();
    console.log(evaluationData);
    axios.post(`${serverUrl}/evaluation/create`,evaluationData)
    .then((res)=>{
      if (res.status==201){
        toast.success("Evaluation added suucessfully", toastConfig);
        setEvaluationData(initialState);
      } else {
        toast.error("Something went wrong", toastConfig);
      }
    }).catch((err)=>{
      console.log(err)
      toast.error(err.response.data.error, toastConfig);
    })
  };

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
            label="Select session"
            name="session"
            value={session}
            onChange={handleChangeEvaluation}
            className="border w-[30%] px-2 py-2 rounded-md"
          >
            <option value="">Select session</option>;
            {sessionList?.map((el) => {
              return (
                <option key={el._id} className="py-1 m-2" value={el._id}>
                  {el.name}
                </option>
              );
            })}
          </select>
          <select
            id=""
            name="cohort"
            value={cohort}
            onChange={handleChangeEvaluation}
            className="border w-[30%] px-2 py-2 rounded-md"
          >
            <option value="">Select cohort</option>;
            {cohortFromSession[0]?.cohort?.map((el) => {
              return (
                <option key={el._id} value={el._id}>
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
            className="border w-[30%] px-2 py-2 rounded-md"
          >
            <option value="">Select participant</option>;
            {participantsFromSession &&
              participantsFromSession[0] &&
              participantsFromSession[0].participants?.map((el) => {
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
            className="border w-[50%] px-2 py-2 rounded-md"
          >
            <option value="">Select activity</option>;
            {cohortFromSession[0]?.activity?.map((el) => {
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
            value={domain.name} // Assuming domain.name is the identifier for domain object
            onChange={handleChangeEvaluation}
            className="border w-[50%] px-2 py-2 rounded-md"
          >
            <option value="">Select domain</option>;
            {domainList?.map((el) => {
              return (
                <option value={el.name} key={el._id}>
                  {el.name}
                </option>
              );
            })}
          </select>
        </div>
        {domain && (
          <Card className="w-[90%] m-auto mt-5">
            <div className="m-3"><Typography>{domain.name}</Typography></div>
            {domain?.subTopics?.map((subtopic, index) => (
              <List key={index}>
                <ListItem>
                  <Typography className="w-[50%]">
                    {index + 1}. {subtopic.content}
                  </Typography>
                  <div className="w-[50%]">
                    {/* Input for marks with onChange handler */}
                    <Input
                      label="Add Marks"
                      value={subtopic.score}
                      type="number"
                      onChange={(e) => handleMarksChange(index, e.target.value)}
                    />
                  </div>
                </ListItem>
              </List>
            ))}
            <div className="w-[95%] m-auto mt-5 mb-5">
            <Textarea
              label="Description"
              name="description"
              value={domain.observation}
              onChange={(e) => handleObservationChange(e.target.value)}
            />
            </div>
          </Card>
        )}
        <div className="w-[90%] text-center mt-5 m-auto">
          <Button className="bg-maincolor" type="submit">
            Add Evaluation
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEvaluation;
