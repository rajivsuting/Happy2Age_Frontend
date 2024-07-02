import {
  Button,
  Input,
  Select,
  Option,
  List,
  ListItem,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { CgSpinner } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { getAllActivities, getAllCohorts, getAllSessions } from "../../Redux/AllListReducer/action";
import { useNavigate } from "react-router-dom";
import { getLocalData } from "../../Utils/localStorage";

const initialState = {
  name: "",
  cohort: "",
  activity: [],
  date: "",
  participants: [],
  numberOfHours:""
};

export const AddSession = () => {
  const [sessionData, setSessionData] = useState(initialState);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [isAddSessionLoading, setIsSessionLoading] = useState(false);
  const [checkedParticipants, setCheckedParticipants] = useState([]);
  const { name, cohort, activity, date, participants,numberOfHours } = sessionData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setSessionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddActivity = () => {
    if (selectedActivity !== "") {
      setSessionData({
        ...sessionData,
        activity: [...activity, selectedActivity],
      });
      setSelectedActivity(""); // Reset selected activity
    }
  };

  const handleRemoveActivity = (activityToRemove) => {
    const updatedActivity = activity.filter((activity) => activity !== activityToRemove);
    setSessionData({
      ...sessionData,
      activity: updatedActivity,
    });
  };

  const { cohortList, activityList } = useSelector((state) => {
    return {
      cohortList: state.AllListReducer.cohortList,
      activityList: state.AllListReducer.activityList,
    };
  });

  useEffect(()=>{
    dispatch(getAllCohorts("",""));
    dispatch(getAllActivities("",""))
  },[])

  useEffect(() => {
    
    if (cohort) {
      const selectedCohort = cohortList.find((el) => el._id === cohort);
      if (selectedCohort) {
        const initialCheckedState = selectedCohort.participants.map(participant => ({
          participantId: participant._id,
          cohortId: cohort
        }));
        setCheckedParticipants(initialCheckedState);
        setSessionData((prevData) => ({
          ...prevData,
          participants: initialCheckedState
        }));
      }
    }
  }, [cohort, cohortList]);

  const handleCheckboxChange = (participantId) => {
    setCheckedParticipants((prevCheckedParticipants) => {
      if (prevCheckedParticipants.some(participant => participant.participantId === participantId)) {
        return prevCheckedParticipants.filter((participant) => participant.participantId !== participantId);
      } else {
        return [...prevCheckedParticipants, { participantId, cohortId: cohort }];
      }
    });
  };

  useEffect(() => {
    setSessionData((prevData) => ({
      ...prevData,
      participants: checkedParticipants
    }));
  }, [checkedParticipants]);

  const handleSubmitSession = (e) => {
    e.preventDefault();
    setIsSessionLoading(true);
    axios.post(`${serverUrl}/session/create`, sessionData,{
      // headers: {
      //   Authorization: `${getLocalData("token")}`,
      // },
    })
      .then((res) => {
        if (res.status === 201) {
          setIsSessionLoading(false);
          toast.success("Session added successfully", toastConfig);
          dispatch(getAllSessions("","")).then((res) => {
            // setSessionData(initialState);
            setCheckedParticipants([]);
            return true;
          });
        } else {
          setIsSessionLoading(false);
          toast.error("Something went wrong", toastConfig);
        }
      })
      .catch((err) => {
        setIsSessionLoading(false);
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
    <div className="flex justify-center items-center gap-10 mb-24">
      <form
        className="m-auto border rounded-xl shadow w-[70%] py-8 mt-8 bg-white"
        onSubmit={handleSubmitSession}
      >
        {/* Basic details */}
        <div className="w-[90%] m-auto mb-5 flex justify-center items-center">
          <div className="w-[15%]">Basic details</div>{" "}
          <hr className="w-[85%] border" />
        </div>
        <div className="w-[90%] flex justify-between items-center m-auto gap-10">
          <Input
            label="Name"
            name="name"
            value={name}
            onChange={handleChangeInput}
          />
          <Input
            label="date"
            name="date"
            value={date}
            type="date"
            onChange={handleChangeInput}
          />
          <Input
            label="No. of hours"
            name="numberOfHours"
            value={numberOfHours}
            type="number"
            onChange={handleChangeInput}
          />
        </div>
        <div className="w-[90%] flex justify-between items-center m-auto gap-10 mt-5">
          <div className="w-[50%] flex justify-between items-center gap-5">
            <select
              label="Cohort"
              name="cohort"
              value={cohort}
              onChange={handleChangeInput}
              className="border border-gray-400 w-[100%] px-2 py-2 rounded-md"
            >
              <option value="">Select center</option>
              {cohortList?.map((el) => {
                return <option key={el._id} value={el._id}>{el.name}</option>;
              })}
            </select>
          </div>
          <div className="w-[50%] flex justify-between items-center gap-5">
            <select
              label="Activity"
              name="activity"
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="border border-gray-400 w-[80%] px-2 py-2 rounded-md"
            >
              <option value="">Select an activity</option>
              {activityList?.map((el) => {
                return <option key={el._id} value={el._id}>{el.name}</option>;
              })}
            </select>
            <Button
              className="w-[100px] bg-maincolor"
              onClick={handleAddActivity}
            >
              Add
            </Button>
          </div>
        </div>
        <div className="w-[100%] flex justify-between m-auto gap-10 mt-5 px-8">
          {cohort && (
            <div className="w-[50%]">
              <h3>Select Participants:</h3>
              <div className="max-h-[30vh] overflow-y-auto">
                <List>
                  {cohortList
                    ?.find((el) => el._id === cohort)
                    ?.participants?.map((participant) => (
                      <ListItem
                        className="flex justify-between items-center"
                        key={participant._id}
                      >
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={checkedParticipants.some(p => p.participantId === participant._id)}
                            onChange={() => handleCheckboxChange(participant._id)}
                            className="mr-2 cursor-pointer"
                          />
                          {participant.name}
                        </label>
                      </ListItem>
                    ))}
                </List>
              </div>
            </div>
          )}
          {activity?.length ? (
            <div className="w-[50%] ml-3 mt-5">
              <h3>Activities:</h3>
              <List>
                {activity?.map((activity, index) => (
                  <ListItem
                    className="w-[97%] flex justify-between items-center"
                    key={index}
                  >
                    {activityList?.find((el) => el._id === activity)?.name}
                    <AiFillDelete
                      onClick={() => handleRemoveActivity(activity)}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          ) : null}
        </div>

        <div className="w-[90%] text-center mt-5 m-auto">
          <Button
            className="bg-maincolor"
            type="submit"
            disabled={isAddSessionLoading}
          >
            {isAddSessionLoading ? (
              <CgSpinner size={18} className="m-auto animate-spin" />
            ) : (
              "Add Session"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSession;
