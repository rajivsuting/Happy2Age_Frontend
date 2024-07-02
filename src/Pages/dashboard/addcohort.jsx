import React, { useEffect, useState } from "react";
import { Button, Input, List, ListItem } from "@material-tailwind/react";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { serverUrl } from "../../api";
import { toastConfig } from "../../App";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";
import { useDispatch } from "react-redux";
import { getAllCohorts } from "../../Redux/AllListReducer/action";
import { getLocalData } from "../../Utils/localStorage";
import { useNavigate } from "react-router-dom";

const initialState = {
  name: "",
  participants: [],
};

export const AddCohort = () => {
  const [cohortData, setCohortData] = useState(initialState);
  const [allParticipants, setAllParticipants] = useState([]);
  const [isAddCohortLoading, setIsAddCohortLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { name, participants } = cohortData;

  const handleChangeInput = (e) => {
    setCohortData({
      ...cohortData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleToggleParticipant = (participantId) => {
  //   if (participants.includes(participantId)) {
  //     setCohortData({
  //       ...cohortData,
  //       participants: participants.filter((id) => id !== participantId),
  //     });
  //   } else {
  //     setCohortData({
  //       ...cohortData,
  //       participants: [...participants, participantId],
  //     });
  //   }
  // };

  // useEffect(() => {
  //   axios
  //     .get(`${serverUrl}/participant/all`)
  //     .then((res) => {
  //       console.log(res.data.message);
  //       setAllParticipants(res.data.message);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  const handleSubmitCohort = (e) => {
    e.preventDefault();
    console.log(cohortData);
    setIsAddCohortLoading(true);
    axios
      .post(`${serverUrl}/cohort/create`, cohortData, {
        
      })
      .then((res) => {
        if (res.status == 201) {
          toast.success("Cohort added successfully", toastConfig);
          setCohortData(initialState);
          setIsAddCohortLoading(false);
          dispatch(getAllCohorts("",""));
        } else {
          toast.error("Something went wrong", toastConfig);
        }
      })
      .catch((err) => {
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
        className="m-auto border rounded-xl shadow w-[70%] py-8 mt-16 bg-white "
        onSubmit={handleSubmitCohort}
      >
        {/* Basic details */}
        <div className="w-[90%] m-auto mb-5 flex justify-center items-center">
          <div className="w-[15%]">Center details</div>{" "}
          <hr className="w-[85%] border" />
        </div>
        <div className="w-[90%] flex justify-between items-center m-auto gap-10 mt-5">
          <Input
            label="Name of Center"
            name="name"
            value={name}
            onChange={handleChangeInput}
            required
          />
        </div>

        {/* List of participants with checkboxes */}
        {/* <div className="w-[90%] m-auto mt-5 max-h-[40vh] overflow-hidden">
          <h3>Select Participants:</h3>
          <div className="max-h-[30vh] overflow-y-auto">
            <List className="grid grid-cols-4 gap-4">
              {allParticipants.map((participant) => (
                <div className="relative group">
                  <ListItem
                    className="flex justify-between items-center"
                    key={participant._id}
                  >
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={participants.includes(participant._id)}
                        onChange={() =>
                          handleToggleParticipant(participant._id)
                        }
                        className="mr-2 cursor-pointer"
                        required={!participants.length}
                      />
                      {participant.name.length > 10
                        ? participant.name.substring(0, 10) + "..."
                        : participant.name}
                    </label>
                  </ListItem>
                  <ul className="w-[200px] mt-[-10px] ml-[10px] shadow absolute hidden bg-white border rounded p-2 text-gray-700 group-hover:block z-50">
                    <li className="w-full text-xs font-semibold">
                      {participant.name}
                    </li>
                    <li className="w-full text-xs font-semibold">
                      {participant.email}
                    </li>
                  </ul>
                </div>
              ))}
            </List>
          </div>
        </div> */}

        {/* <div className="relative group">
          <FaPlus
            onClick={handleSalesTargetModalOpen}
            className="bg-forestgreen text-xl text-white rounded-full p-1 cursor-pointer"
          />
          <ul className="w-[200px] absolute text-center hidden bg-white border rounded p-2 text-gray-700 group-hover:block">
            <li className="w-full text-xs font-semibold">
              Click this button to add or edit sales target for your office
            </li>
          </ul>
        </div> */}

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
          <Button
            className="bg-maincolor"
            type="submit"
            disabled={isAddCohortLoading}
          >
            {isAddCohortLoading ? (
              <CgSpinner size={18} className="m-auto animate-spin" />
            ) : (
              "Add Center"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddCohort;
