import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  List,
  ListItem,
} from "@material-tailwind/react";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { serverUrl } from "../../api";
import { toastConfig } from "../../App";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";

const initialState = {
  name: "",
  participants: [],
};

export const AddCohort = () => {
  const [cohortData, setCohortData] = useState(initialState);
  const [allParticipants, setAllParticipants] = useState([]);
  const [isAddCohortLoading, setIsAddCohortLoading] = useState(false);

  const { name, participants } = cohortData;

  const handleChangeInput = (e) => {
    setCohortData({
      ...cohortData,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggleParticipant = (participantId) => {
    if (participants.includes(participantId)) {
      setCohortData({
        ...cohortData,
        participants: participants.filter((id) => id !== participantId),
      });
    } else {
      setCohortData({
        ...cohortData,
        participants: [...participants, participantId],
      });
    }
  };

  useEffect(() => {
    axios
      .get(`${serverUrl}/participant/all`)
      .then((res) => {
        setAllParticipants(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmitCohort = (e) => {
    e.preventDefault();
    console.log(cohortData)
    setIsAddCohortLoading(true);
    axios
      .post(`${serverUrl}/cohort/create`, cohortData)
      .then((res) => {
        if (res.status == 201) {
          toast.success("Cohort added successfully", toastConfig);
          setCohortData(initialState);
          setIsAddCohortLoading(false);
        } else {
          toast.error("Something went wrong", toastConfig);
        }
      })
      .catch((err) => {
        setIsAddCohortLoading(false);
        toast.error(err.response.data.error, toastConfig);
      });
  };

  return (
    <div className="flex justify-center items-center gap-10 mb-24">
      <form
        className="m-auto border rounded-xl shadow w-[70%] py-8 mt-16 bg-white"
        onSubmit={handleSubmitCohort}
      >
        {/* Basic details */}
        <div className="w-[90%] m-auto mb-5 flex justify-center items-center">
          <div className="w-[15%]">Cohort details</div>{" "}
          <hr className="w-[85%] border" />
        </div>
        <div className="w-[90%] flex justify-between items-center m-auto gap-10 mt-5">
          <Input
            label="Name of Cohort"
            name="name"
            value={name}
            onChange={handleChangeInput}
            required
          />
        </div>

        {/* List of participants with checkboxes */}
        <div className="w-[90%] m-auto mt-5">
          <h3>Select Participants:</h3>
          <List className="grid grid-cols-3 gap-4">
            {allParticipants.map((participant) => (
              <ListItem
                className="flex justify-between items-center"
                key={participant._id}
              >
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={participants.includes(participant._id)}
                    onChange={() => handleToggleParticipant(participant._id)}
                    className="mr-2 cursor-pointer"
                    required = {!participants.length}
                  />
                  {participant.name}
                </label>
              </ListItem>
            ))}
          </List>
        </div>

        {/* Display list of selected participants */}
        {/* {participants.length ? (
          <div className="w-[90%] m-auto mt-5">
            <h3>Selected Participants:</h3>
            <List>
              {participants.map((participantId, index) => (
                <ListItem
                  className="w-[40%] flex justify-between items-center"
                  key={index}
                >
                  {allParticipants.find((el) => el._id === participantId)?.name}
                  <AiFillDelete
                    onClick={() => handleToggleParticipant(participantId)}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        ) : null} */}

        <div className="w-[90%] text-center mt-5 m-auto">
          <Button className="bg-maincolor" type="submit" disabled={isAddCohortLoading}>
            {isAddCohortLoading ? (
              <CgSpinner size={18} className="m-auto animate-spin" />
            ) : (
              "Add Cohort"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddCohort;
