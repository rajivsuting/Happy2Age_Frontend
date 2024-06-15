import React, { useEffect, useState } from "react";
import { Button, Input, List, ListItem } from "@material-tailwind/react";
import axios from "axios";
import { serverUrl } from "../api";
import { toastConfig } from "../App";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";

const EditCohort = ({ isOpen, onClose, singleCohort, getAllCohorts }) => {
  const [cohortData, setCohortData] = useState(null);
  const [allParticipants, setAllParticipants] = useState([]);
  const [isEditCohortLoading, setIsEditCohortLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (singleCohort) {
      setCohortData(singleCohort);
    }
  }, [singleCohort]);



  if (!isOpen || !cohortData) return null;

  const { name } = cohortData;

  const handleChangeInput = (e) => {
    setCohortData({
      ...cohortData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmitCohort = (e) => {
    e.preventDefault();
    setIsEditCohortLoading(true);
    axios
      .patch(`${serverUrl}/cohort/edit/${searchParams.get("id")}`, cohortData)
      .then((res) => {
        if (res.status === 200) {
          getAllCohorts().then((res)=>{
            setIsEditCohortLoading(false);
            toast.success("Cohort edited successfully", toastConfig);
            onClose();
          }); // Call the function to refresh the data
        } else {
          setIsEditCohortLoading(false);
          toast.error("Something went wrong", toastConfig);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsEditCohortLoading(false);
        toast.error(err.response.data.error, toastConfig);
      });
  };

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative m-4 w-2/5 min-w-[30%] max-w-[30%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl p-4">
        <div className="flex items-center p-4 font-sans text-2xl font-semibold text-blue-gray-900">
          Edit Cohort
        </div>
        <div className="px-4">
          <form className="m-auto rounded-xl" onSubmit={handleSubmitCohort}>
            <div className="flex justify-between items-center m-auto mt-5">
              <Input
                label="Name of Cohort"
                name="name"
                value={name}
                onChange={handleChangeInput}
              />
            </div>

            {/* Display list of participants */}
            {/* <div className="w-[100%] m-auto mt-5 max-h-[40vh] overflow-hidden">
              <h3>Select Participants:</h3>
              <div className="max-h-[30vh] overflow-y-auto">
                <List className="grid grid-cols-4 gap-4">
                  {allParticipants.map((participant) => (
                    <div key={participant._id} className="relative group">
                      <ListItem
                        className="flex justify-between items-center"
                      >
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            // checked={participants.includes(participant._id)}
                            onChange={() => handleToggleParticipant(participant._id)}
                            className="mr-2 cursor-pointer"
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

            <div className="flex flex-wrap items-center justify-center gap-5 p-4 mt-5 text-blue-gray-500">
              <button
                onClick={onClose}
                className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg hover:bg-red-500/10 active:bg-red-500/30 border border-red-300"
              >
                Close
              </button>
              <Button className="bg-maincolor" type="submit">
                {isEditCohortLoading ? (
                  <CgSpinner size={18} className=" m-auto animate-spin" />
                ) : (
                  "Edit cohort"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCohort;
