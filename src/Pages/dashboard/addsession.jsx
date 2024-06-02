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
import { getAllSessions } from "../../Redux/AllListReducer/action";

const initialState = {
  name: "",
  cohort: "",
  activity: [],
  date: "",
};
export const AddSession = () => {
  const [sessionData, setSessionData] = useState(initialState);
  const [selectedCohort, setSelectedCohort] = useState("");
  const [selectedActivity, setselectedActivity] = useState("");
  const [checkedBox, setCheckBox] = useState(false);
  const [isAddsessionLoading, setIsSessionLoading] = useState(false);
  const { name, cohort, activity, date } = sessionData;
  const dispatch = useDispatch();

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
      setselectedActivity(""); // Reset selected participant
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

  const handleSubmitSession = (e) => {
    e.preventDefault();
    setIsSessionLoading(true);
    axios.post(`${serverUrl}/session/create`,sessionData)
    .then((res)=>{
      if (res.status==201){
        setIsSessionLoading(false);
        toast.success("Session added suucessfully", toastConfig);
        dispatch(getAllSessions).then((res)=>{
          setSessionData(initialState);
          return true;
        })
      } else {
        setIsSessionLoading(false);
        toast.error("Something went wrong", toastConfig);
      }
    }).catch((err)=>{
      setIsSessionLoading(false);
      toast.error(err.response.data.error, toastConfig);
    })
    // console.log(cohortList?.filter((el) => el._id == cohort));
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
              <option value="">Select cohort</option>
              {cohortList?.map((el) => {
                return <option value={el._id}>{el.name}</option>;
              })}
            </select>
            {/* <Button
              className="w-[120px] bg-maincolor"
              onClick={handleAddCohort}
            >
              Add
            </Button> */}
          </div>
          <div className="w-[50%] flex justify-between items-center gap-5">
            <select
              label="Activity"
              name="activity"
              value={selectedActivity}
              onChange={(e) => setselectedActivity(e.target.value)}
              className="border border-gray-400 w-[80%] px-2 py-2 rounded-md"
            >
              <option value="">Select a activity</option>
              {activityList?.map((el) => {
                return <option value={el._id}>{el.name}</option>;
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
        <div className="w-[100%] flex justify-between  m-auto gap-10 mt-5 px-8">
          {cohort && (
            <div className="w-[50%]">
              <h3>Select Participants:</h3>
              <div className="max-h-[30vh] overflow-y-auto">
                <List className="">
                  {cohortList
                    ?.filter((el) => el._id == cohort)[0]
                    ?.participants?.map((participant) => (
                      // <div className="relative group">
                        <ListItem
                          className="flex justify-between items-center"
                          key={participant._id}
                        >
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={checkedBox}
                              onChange={(e)=>setCheckBox(!checkedBox)
                              }
                              className="mr-2 cursor-pointer"
                              // required={!participants.length}
                            />
                            {participant.name}
                          </label>
                        </ListItem>
                      //   <ul className="w-[200px] mt-[-10px] ml-[10px] shadow absolute hidden bg-white border rounded p-2 text-gray-700 group-hover:block z-50">
                      //     <li className="w-full text-xs font-semibold">
                      //       {participant.name}
                      //     </li>
                      //     <li className="w-full text-xs font-semibold">
                      //       {participant.email}
                      //     </li>
                      //   </ul>
                      // </div>
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
                    {activityList?.map((el) => {
                      if (el._id == activity) {
                        return el.name;
                      }
                    })}
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
            disabled={isAddsessionLoading}
          >
            {isAddsessionLoading ? (
              <CgSpinner size={18} className=" m-auto animate-spin" />
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
