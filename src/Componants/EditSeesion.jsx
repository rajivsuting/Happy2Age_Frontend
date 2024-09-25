import { Button, Input, List, ListItem } from "@material-tailwind/react";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../api";
import { toast } from "react-toastify";
import { toastConfig } from "../App";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllActivities,
  getAllCohorts,
  getAllParticipants,
  getAllSessions,
} from "../Redux/AllListReducer/action";
import usePreventScrollOnNumberInput from "./CustomHook";
import { getLocalData } from "../Utils/localStorage";

const EditSession = ({ isOpen, onClose, singleSession, getAllData }) => {
  usePreventScrollOnNumberInput();
  const [sessionData, setSessionData] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedCohort, setSelectedCohort] = useState("");
  const [searchParams, setSearchParams] = useSearchParams()
  const [isEditSessionLoading, setIsEditSessionLoading] = useState(false);
  const [checkedParticipants, setCheckedParticipants] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cohortList, activityList } = useSelector((state) => {
    return {
      cohortList: state.AllListReducer.cohortList,
      activityList: state.AllListReducer.activityList,
    };
  });

  useEffect(() => {
    if (singleSession) {
      setSessionData(singleSession);
      setCheckedParticipants(singleSession.participants);
    }
  }, [singleSession]);

  useEffect(()=>{
    setSelectedCohort(singleSession?.cohort?._id)
   
  },[singleSession])

  useEffect(()=>{
    // setSelectedCohort(singleSession?.cohort?._id)
    setSessionData((prevData) => ({
      ...prevData,
      cohort: selectedCohort,
    }));
  },[selectedCohort])

  useEffect(() => {
    dispatch(getAllCohorts("", ""));
    dispatch(getAllActivities("", ""));
  }, [dispatch]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setSessionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  console.log(singleSession);
  const handleAddActivity = () => {
    if (selectedActivity !== "") {
      
      if (sessionData?.activity?.includes(selectedActivity)) {
        toast.error("This activity is already added", toastConfig);
        return; // Do not add the activity again
      }
      
      if (sessionData?.activity?.find((el)=>(el._id == selectedActivity))){
        toast.error("This activity is already added", toastConfig);
        return; // Do not add the activity again
      }

      setSessionData({
        ...sessionData,
        activity: [...sessionData?.activity, selectedActivity],
      });
      setSelectedActivity(""); // Reset selected activity
    }
  };

  const handleRemoveActivity = (activityToRemove) => {
    const updatedActivity = sessionData.activity.filter(
      (activity) => activity !== activityToRemove
    );
    setSessionData({
      ...sessionData,
      activity: updatedActivity,
    });
  };

  const handleCheckboxChange = (participantId) => {
    setCheckedParticipants((prevCheckedParticipants) => {
      if (
        prevCheckedParticipants.some(
          (participant) => participant.participantId === participantId
        )
      ) {
        return prevCheckedParticipants.filter(
          (participant) => participant.participantId !== participantId
        );
      } else {
        return [
          ...prevCheckedParticipants,
          { participantId, cohortId: sessionData.cohort },
        ];
      }
    });
  };

  useEffect(() => {
    setSessionData((prevData) => ({
      ...prevData,
      participants: checkedParticipants,
    }));
  }, [checkedParticipants]);

  const handleSubmitSession = (e) => {
    e.preventDefault();
    setIsEditSessionLoading(true);
    console.log(sessionData);
    axios
      .patch(`${serverUrl}/session/edit/${sessionData._id}`, sessionData,
        {
          headers: {
            Authorization: `${getLocalData("token")}`,
          },
        })
      .then((res) => {
        if (res.status === 200) {
          setIsEditSessionLoading(false);
          toast.success("Session updated successfully", toastConfig);
          dispatch(getAllSessions(searchParams.get("page"), searchParams.get("limit"))).then((res) => {
            dispatch(getAllParticipants("", "")).then(() => {
              setCheckedParticipants([]);
              getAllData();
              onClose();
            });
          });
        } else {
          setIsEditSessionLoading(false);
          toast.error("Something went wrong", toastConfig);
        }
      })
      .catch((err) => {
        setIsEditSessionLoading(false);
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

  if (!isOpen || !sessionData) return null;

  const { name, cohort, activity, date, numberOfMins, numberOfHours } =
    sessionData;

    const options = activityList.map((activity) => ({
      value: activity._id,
      label: activity.name,
    }));

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative m-4 w-[60%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl px-4">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 py-8 font-sans text-2xl font-semibold text-blue-gray-900 bg-white">
     
          Edit Session
          <AiOutlineClose
            className="cursor-pointer"
            size={24}
            onClick={onClose}
          />
        </div>
        <div className="px-4">
          <form onSubmit={handleSubmitSession}>
            <div className="w-[90%] m-auto mb-5 flex justify-center items-center">
              <div className="w-[15%]">Basic details</div>
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
                label="Date"
                name="date"
                value={date?.split("T")[0]}
                type="date"
                onChange={handleChangeInput}
              />
              <Input
                label="No. of mins"
                name="numberOfMins"
                value={numberOfMins || 0}
                className="noscroll"
                type="number"
                onChange={handleChangeInput}
              />
            </div>
            <div className="w-[90%] flex justify-between items-center m-auto gap-10 mt-5">
              <div className="w-[50%] flex justify-between items-center gap-5">
              <Select
    label="Cohort"
    name="cohort"
    value={cohortList.find((option) => option._id === selectedCohort) 
      ? { value: selectedCohort, label: cohortList.find((option) => option._id === selectedCohort).name } 
      : null} // Ensure the value is an object with `value` and `label`
    options={cohortList.map((cohort) => ({
      value: cohort._id,
      label: cohort.name,
    }))} // Map the cohort list to match react-select's format
    isSearchable={true}
    isClearable={true} // Allow clearing the cohort selection
    placeholder="Select centre"
    onChange={(selectedOption) =>
      {setSelectedCohort(selectedOption ? selectedOption.value : "");setCheckedParticipants([])}
    }
    className="w-[80%] px-2 py-2 rounded-md"
  />



                {/* <select
                  label="Cohort"
                  name="cohort"
                  value={selectedCohort}
                  onChange={(e) => {setSelectedCohort(e.target.value);setCheckedParticipants([])
                  }}
                  className="border border-gray-400 w-[100%] px-2 py-2 rounded-md"
                >
                  <option value="">Select centre</option>
                  {cohortList?.map((el) => (
                    <option key={el._id} value={el._id}>
                      {el.name}
                    </option>
                  ))}
                </select> */}
              </div>
              <div className="w-[50%] flex justify-between items-center gap-5">
                {/* <select
                  label="Activity"
                  name="activity"
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="border border-gray-400 w-[80%] px-2 py-2 rounded-md"
                >
                  <option value="">Select an activity</option>
                  {activityList?.map((el) => (
                    <option key={el._id} value={el._id}>
                      {el.name}
                    </option>
                  ))}
                </select> */}
                <Select
              label="Activity"
              name="activity"
              value={options.find(
                (option) => option.value === selectedActivity
              )} // Find the option that matches the selected value
              options={options}
              isSearchable={true}
              isClearable={true} // Add this line to make the select clearable
              placeholder="Select activity"
              onChange={(selectedOption) =>
                setSelectedActivity(selectedOption ? selectedOption.value : "")
              } // Update the selected activity or clear it if null
              className="w-[80%] px-2 py-2 rounded-md"
            />

                <Button
                  className="w-[100px] bg-maincolor"
                  onClick={handleAddActivity}
                >
                  Add
                </Button>
              </div>
            </div>
            <div className="w-[100%] flex justify-between m-auto gap-10 mt-5 px-8">
            <div className="w-[50%]">
                  <h3>Select members:</h3>
                  <div className="max-h-[30vh] overflow-y-scroll">
                    <List>
                      {cohortList
                        ?.find((el) => el._id === selectedCohort)
                        ?.participants?.map((participant) => (
                          <ListItem
                            className="flex justify-between items-center"
                            key={participant._id}
                          >
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={checkedParticipants.some(
                                  (p) => p.participantId === participant._id
                                )}
                                onChange={() =>
                                  handleCheckboxChange(participant._id)
                                }
                                className="mr-2 cursor-pointer"
                              />
                              {participant.name}
                            </label>
                          </ListItem>
                        ))}
                    </List>
                  </div>
                </div>
              <div className="w-[50%] ml-3">
                  <h3>Activities:</h3>
                  <div className="max-h-[30vh] overflow-y-scroll">
                  <List>
                    {activity?.map((activity, index) => (
                      <ListItem
                        className="w-[97%] flex justify-between items-center"
                        key={index}
                      >
                        {activityList?.find((el) => el._id === activity)?.name || activity.name}
                        <AiOutlineClose
                          onClick={() => handleRemoveActivity(activity)}
                        />
                      </ListItem>
                    ))}
                  </List>
                  </div>
                </div>
            </div>
            <div className="w-[90%] text-center mt-5 mb-5 m-auto">
              <Button
                className="bg-maincolor"
                type="submit"
                disabled={isEditSessionLoading}
              >
                {isEditSessionLoading ? (
                  <CgSpinner size={18} className="m-auto animate-spin" />
                ) : (
                  "Edit Session"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSession;
