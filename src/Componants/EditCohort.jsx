import React, { useEffect, useState } from "react";
import { Button, Input, List, ListItem } from "@material-tailwind/react";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { serverUrl } from "../api";
import { toastConfig } from "../App";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

const EditCohort = ({ isOpen, onClose, singleCohort,getAlldata }) => {
  const [cohortData, setCohortData] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [allParticipants, setAllParticipants] = useState([]);
  const [searchParams, setsearchParams] = useSearchParams()

  useEffect(() => {
    if (singleCohort) {
      setCohortData(singleCohort);
    }
  }, [singleCohort]);

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

  console.log(allParticipants)

  if (!isOpen || !cohortData) return null;

  const { name, participants } = cohortData;

  const handleChangeInput = (e) => {
    setCohortData({
      ...cohortData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddParticipant = () => {
    if (selectedParticipant !== "") {
      setCohortData({
        ...cohortData,
        participants: [...participants, selectedParticipant],
      });
      setSelectedParticipant(""); // Reset selected participant
    }
  };

  const handleRemoveParticipant = (participantToRemove) => {
    const updatedParticipants = participants.filter(
      (participant) => participant !== participantToRemove
    );
    setCohortData({
      ...cohortData,
      participants: updatedParticipants,
    });
  };

  const handleSubmitCohort = (e) => {
    e.preventDefault();
    axios
      .patch(`${serverUrl}/cohort/edit/${searchParams.get("id")}`, cohortData)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Cohort edited successfully", toastConfig);
          window.location.reload()
        } else {
          toast.error("Something went wrong", toastConfig);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.error, toastConfig);
      });
  };


  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative m-4 w-2/5 min-w-[50%] max-w-[50%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl p-8">
        <div className="flex items-center p-4 font-sans text-2xl font-semibold text-blue-gray-900">
          Edit Cohort
        </div>
        <div className="flex justify-center items-center gap-10 ">
          <form
            className="m-auto rounded-xl "
            onSubmit={handleSubmitCohort}
          >
            {/* Basic details */}
            <div className="m-auto mb-5 flex justify-center items-center">
              <div className="w-[20%]">Cohort details</div>{" "}
              <hr className="w-[80%] border" />
            </div>
            <div className="flex justify-between items-center m-auto gap-10 mt-5">
              <Input
                label="Name of Cohort"
                name="name"
                value={name}
                onChange={handleChangeInput}
              />
              <select
                id=""
                value={selectedParticipant}
                onChange={(e) => setSelectedParticipant(e.target.value)}
                className="border w-[70%] px-2 py-3 rounded-md"
              >
                <option value="">Select participant</option>
                {allParticipants?.map((el) => (
                  <option
                    key={el._id}
                    value={el._id}
                    // disabled={participants?.includes(el._id)}
                  >
                    {el.name}
                  </option>
                ))}
              </select>
              <Button
                className="w-[120px] bg-maincolor"
                onClick={handleAddParticipant}
              >
                Add
              </Button>
            </div>

            {/* Display list of participants */}
            {participants?.length ? (
              <div className="m-auto mt-5">
                <h3>Participants:</h3>
                <List>
                  {participants.map((participant, index) => {
                    const participantDetails = allParticipants.find(
                      (el) => participant._id ? el._id === participant._id : el._id === participant
                    );
                    console.log(participantDetails)
                    return (
                      <ListItem
                        className="w-[40%] flex justify-between items-center"
                        key={index}
                      >
                        {participantDetails ? participantDetails.name : "Unknown"}
                        <AiFillDelete
                          onClick={() => handleRemoveParticipant(participant)}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            ) : null}

<div className="flex flex-wrap items-center justify-center gap-5 p-4 mt-5 text-blue-gray-500">
          <button
            onClick={onClose}
            className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg hover:bg-red-500/10 active:bg-red-500/30  border border-red-300"
          >
            Close
          </button>
          <Button className="bg-maincolor" type="submit" >
            Edit cohort
              </Button>
        </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCohort;
