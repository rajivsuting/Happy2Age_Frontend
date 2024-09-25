import {
  Button,
  Input,
  Option,
  List,
  ListItem,
} from "@material-tailwind/react";
import Select from "react-select";

import React, { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import axios from "axios";
axios.defaults.withCredentials = true;
import { AiFillDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { CgSpinner } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllActivities,
  getAllCohorts,
  getAllParticipants,
  getAllSessions,
} from "../../Redux/AllListReducer/action";
import { useNavigate } from "react-router-dom";
import { getLocalData } from "../../Utils/localStorage";
import usePreventScrollOnNumberInput from "../../Componants/CustomHook";

const initialState = {
  name: "",
  cohort: "",
  activity: [],
  date: "",
  participants: [],
  numberOfMins: "",
};

export const AddSession = () => {
  usePreventScrollOnNumberInput();
  const [sessionData, setSessionData] = useState(initialState);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [isAddSessionLoading, setIsSessionLoading] = useState(false);
  const [checkedParticipants, setCheckedParticipants] = useState([]);
  const { name, cohort, activity, date, participants, numberOfMins } =
    sessionData;
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
      // Check if the activity is already in the list
      if (activity.includes(selectedActivity)) {
        toast.error("This activity is already added", toastConfig);
        return; // Do not add the activity again
      }

      setSessionData({
        ...sessionData,
        activity: [...activity, selectedActivity],
      });
      setSelectedActivity(""); // Reset selected activity
    }
  };

  const handleRemoveActivity = (activityToRemove) => {
    const updatedActivity = activity.filter(
      (activity) => activity !== activityToRemove
    );
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

  useEffect(() => {
    dispatch(getAllCohorts("", ""));
    dispatch(getAllActivities("", ""));
  }, []);

  useEffect(() => {
    if (cohort) {
      const selectedCohort = cohortList.find((el) => el._id === cohort);
      if (selectedCohort) {
        const initialCheckedState = selectedCohort.participants.map(
          (participant) => ({
            participantId: participant._id,
            cohortId: cohort,
          })
        );
        setCheckedParticipants(initialCheckedState);
        setSessionData((prevData) => ({
          ...prevData,
          participants: initialCheckedState,
        }));
      }
    }
  }, [cohort, cohortList]);

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
          { participantId, cohortId: cohort },
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
    // console.log(sessionData);
    setIsSessionLoading(true);
    axios
      .post(`${serverUrl}/session/create`, sessionData, {
        headers: {
          Authorization: `${getLocalData("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 201) {
          setIsSessionLoading(false);
          toast.success("Session added successfully", toastConfig);
          dispatch(getAllSessions("", "")).then((res) => {
            dispatch(getAllParticipants("", "")).then((re) => {
              setCheckedParticipants([]);
              setSessionData(initialState);
              return true;
            });
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

  const options = activityList.map((activity) => ({
    value: activity._id,
    label: activity.name,
  }));

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
            label="No. of mins"
            name="numberOfMins"
            value={numberOfMins}
            type="number"
            className="noscroll"
            onChange={handleChangeInput}
          />
        </div>
        <div className="w-[90%] flex justify-between items-center m-auto gap-10 mt-5">
        <div className="w-[50%] flex justify-between items-center gap-5">
  <Select
    label="Cohort"
    name="cohort"
    value={cohortList.find((option) => option._id === cohort) 
      ? { value: cohort, label: cohortList.find((option) => option._id === cohort).name } 
      : null} // Ensure the value is an object with `value` and `label`
    options={cohortList.map((cohort) => ({
      value: cohort._id,
      label: cohort.name,
    }))} // Map the cohort list to match react-select's format
    isSearchable={true}
    isClearable={true} // Allow clearing the cohort selection
    placeholder="Select centre"
    onChange={(selectedOption) =>
      handleChangeInput({
        target: {
          name: "cohort",
          value: selectedOption ? selectedOption.value : "",
        },
      })
    } // Handle change or clear the cohort selection
    className="w-[80%] px-2 py-2 rounded-md"
  />
</div>


          <div className="w-[50%] flex justify-between items-center gap-5">
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
          {cohort && (
            <div className="w-[50%]">
              <h3>Select members:</h3>
              <div className="max-h-[30vh] overflow-y-scroll">
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
          )}
          {activity?.length ? (
            <div className="w-[50%] ml-3">
              <h3>Activities:</h3>
              <div className="max-h-[30vh] overflow-y-scroll">
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
