import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllParticipants } from "../Redux/AllListReducer/action";
import Select from "react-select";

const SelectParticipant = ({ selectedParticipant, setSelectedParticipant }) => {
  const dispatch = useDispatch();

  const { partcipantList } = useSelector((state) => {
    return {
      partcipantList: state.AllListReducer.partcipantList,
    };
  });

  useEffect(() => {
    dispatch(getAllParticipants()).then((res) => {
      return true;
    });
  }, []);

  const options = partcipantList.map((participant) => ({
    value: participant._id,
    label: participant.name,
  }));
  return (
    <Select
      label="Participant"
      name="Participant"
      value={options.find((option) => option.value === selectedParticipant)} // Find the option that matches the selected value
      options={options}
      isSearchable={true}
      isClearable={true} // Add this line to make the select clearable
      placeholder="Select participant"
      onChange={(selectedOption) =>
        setSelectedParticipant(selectedOption ? selectedOption.value : "")
      } // Update the selected activity or clear it if null
      className="w-[80%] px-2 py-2 rounded-md"
    />
  );
};

export default SelectParticipant;
