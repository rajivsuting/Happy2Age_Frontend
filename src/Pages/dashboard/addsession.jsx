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

const initialState = {
  name: "",
  cohort: [],
  activity: [],
  date: "",
};
export const AddSession = () => {
  const [sessionData, setSessionData] = useState(initialState);
  const [selectedCohort, setSelectedCohort] = useState("");
  const [selectedActivity, setselectedActivity] = useState("");
  const [cohortsList, setCohortList] = useState([]);
  const [activityList, setActivityList] = useState([]);

  const { name, cohort, activity, date } = sessionData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setSessionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeCohortAndActivity = (name, value) => {
    setSessionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddCohort = () => {
    if (selectedCohort !== "") {
      setSessionData({
        ...sessionData,
        cohort: [...cohort, selectedCohort],
      });
      setSelectedCohort(""); // Reset selected participant
    }
  };

  const handleRemoveCohort = (cohortToRemove) => {
    const updatedCohorts = cohort.filter((cohort) => cohort !== cohortToRemove);
    setSessionData({
      ...sessionData,
      cohort: updatedCohorts,
    });
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

  useEffect(() => {
    axios.get(`${serverUrl}/cohort/all/`).then((res) => {
      setCohortList(res.data);
    });

    axios.get(`${serverUrl}/activity/all/`).then((res) => {
      setActivityList(res.data);
    });
  }, []);

  const handleSubmitSession = (e) => {
    e.preventDefault();
    // console.log(sessionData);
    axios.post(`${serverUrl}/sessions/create`,sessionData)
    .then((res)=>{
      if (res.status==201){
        alert("Session added suucessfully")
      } else {
        alert("Something went wrong")
      }
    }).catch((err)=>{
      console.log(err)
      alert(err.response.data.error)
    })
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
          <div className="w-[47%] flex justify-between items-center gap-5">
            <Select
              label="Cohort"
              name="cohort"
              value={selectedCohort}
              onChange={(value) => setSelectedCohort(value)}
            >
              {cohortsList?.map((el) => {
                return <Option value={el._id}>{el.name}</Option>;
              })}
            </Select>
            <Button
              className="w-[120px] bg-maincolor"
              onClick={handleAddCohort}
            >
              Add
            </Button>
          </div>
          <div className="w-[47%] flex justify-between items-center gap-5">
            <Select
              label="Activity"
              name="activity"
              value={selectedActivity}
              onChange={(value) => setselectedActivity(value)}
            >
              {activityList?.map((el) => {
                return <Option value={el._id}>{el.name}</Option>;
              })}
            </Select>
            <Button
              className="w-[120px] bg-maincolor"
              onClick={handleAddActivity}
            >
              Add
            </Button>
          </div>
        </div>
        <div className="w-[90%] flex justify-between items-center m-auto gap-10 mt-5">
          {cohort?.length ? (
            <div className="w-[100%] m-auto mt-5">
              <h3>Cohorts:</h3>
              <List>
                {cohort?.map((cohort, index) => (
                  <ListItem
                    className="w-[97%] flex justify-between items-center"
                    key={index}
                  >
                    {cohortsList?.map((el) => {
                      if (el._id == cohort) {
                        return el.name;
                      }
                    })}
                    <AiFillDelete onClick={() => handleRemoveCohort(cohort)} />
                  </ListItem>
                ))}
              </List>
            </div>
          ) : null}
          {activity?.length ? (
            <div className="w-[90%] m-auto mt-5">
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
          <Button className="bg-maincolor" type="submit">
            Add Session
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSession;
