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
import { useDispatch, useSelector } from "react-redux";
import { getAllActivities, getAllCohorts, getAllDomains, getAllEvaluations, getAllSessions } from "../../Redux/AllListReducer/action";
import { getLocalData } from "../../Utils/localStorage";
import { useNavigate } from "react-router-dom";

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
  // const [domainList, setDomainList] = useState([]);
  const [domainCategory, setDomainCategory] = useState("");
  const [sessionFromCohort, setsessionFromCohort] = useState([]);
  const [participantsFromSession, setParticipantsFromSession] = useState([]);
  const [activityFromSession, setActivityFromSession] = useState([]);
  const [selectDomainByType, setSelectDomainByType] = useState([]);
  const [isAddEvaluationLoading, setIsAddEvaluationLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const {
    cohortList,
    partcipantList,
    evalutionlist,
    sessionlist,
    domainList,
    activityList,
  } = useSelector((state) => {
    return {
      cohortList: state.AllListReducer.cohortList,
      activityList: state.AllListReducer.activityList,
      domainList: state.AllListReducer.domainList,
      sessionlist: state.AllListReducer.sessionlist,
      evalutionlist: state.AllListReducer.evalutionlist,
      partcipantList: state.AllListReducer.partcipantList,
    };
  });

  useEffect(()=>{
    dispatch(getAllCohorts("",""))
    dispatch(getAllSessions("",""));
    dispatch(getAllActivities("",""))
    dispatch(getAllDomains("All"))
  },[])

  useEffect(() => {
    setsessionFromCohort(
      cohortList?.filter((el) => el._id === cohort)[0]?.sessions
    );
  }, [cohort]);

  useEffect(() => {
    setParticipantsFromSession(
      sessionFromCohort?.filter((el) => el._id === session)[0]?.participants
    );
  }, [session]);

  useEffect(() => {
    setDomainCategory(
      partcipantList?.filter((el) => el._id == participant)[0]
        ?.participantType
    );
  }, [participant]);


  useEffect(() => {
    setActivityFromSession(
      sessionFromCohort?.filter((el) => el._id === session)[0]?.activity
    );
  }, [session]);

  useEffect(() => {
    setSelectDomainByType(
      domainList?.filter((el) => el.category === domainCategory)
    );
  }, [domainCategory,participant]);

  console.log(domainCategory)
  console.log(selectDomainByType)
  console.log(domainList)
  const handleScoreChange = (domainIndex, questionIndex, newScore) => {
    const updatedDomains = [...selectDomainByType];
    updatedDomains[domainIndex].subTopics[questionIndex].score = newScore;
    setEvaluationData((prev) => {
      return {
        ...prev,
        domain: updatedDomains,
      };
    });
  };

  // Handle observation change
  const handleObservationChange = (domainIndex, newObservation) => {
    const updatedDomains = [...selectDomainByType];
    updatedDomains[domainIndex].observation = newObservation;
    setEvaluationData((prev) => {
      return {
        ...prev,
        domain: updatedDomains,
      };
    });
  };

  const handleSubmitEvaluation = (e) => {
    e.preventDefault();
    setIsAddEvaluationLoading(true);
    axios
      .post(`${serverUrl}/evaluation/create`, evaluationData,{
        
      })
      .then((res) => {
        if (res.status == 201) {
          toast.success("Evaluation added suucessfully", toastConfig);
          setEvaluationData(initialState);
          dispatch(getAllEvaluations).then((res) => {
            return true;
          });
          setIsAddEvaluationLoading(false);
        } else {
          toast.error("Something went wrong", toastConfig);
        }
      })
      .catch((err) => {
        setIsAddEvaluationLoading(false);
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

  // console.log("sessionFromCohort", sessionFromCohort);

  // console.log("participantsFromSession", participantsFromSession);

  // console.log("partcipantList", partcipantList);
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
            <option value="">Select center</option>;
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
            {partcipantList?.map((pl) => {
             return participantsFromSession?.map((el) => {
                if (el.participantId == pl._id) {
                  return (
                    <option key={pl._id} value={pl._id}>
                      {pl.name}
                    </option>
                  );
                }
              });
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
            {activityList?.map((pl) => {
             return activityFromSession?.map((el) => {
                if (el == pl._id) {
                  return (
                    <option key={pl._id} value={pl._id}>
                      {pl.name}
                    </option>
                  );
                }
              });
            })}
          </select>
          {/* <select
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
          </select> */}
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
              return (
                <List key={questionIndex}>
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
              );
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
          <Button
            className="bg-maincolor"
            type="submit"
            disabled={isAddEvaluationLoading}
          >
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
