import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Select,
  Option,
  List,
  ListItem,
} from "@material-tailwind/react";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { serverUrl } from "../../api";

const initialState = {
  name: "",
  participants: [],
};

export const AddCohort = () => {
  const [cohortData, setCohortData] = useState(initialState);
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [allPartcipants, setAllparticipants] = useState([])

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

  useEffect(()=>{
    axios.get(`${serverUrl}/participant/all`)
    .then((res)=>{
      setAllparticipants(res.data.participants)
    }).catch((err)=>{
      console.log(err)
    })
  },[])


  const handleSubmitCohort = (e) => {
    e.preventDefault();
    axios.post(`${serverUrl}/cohort/create`,cohortData)
    .then((res)=>{
      if (res.status==201){
        alert("Cohort added suucessfully")
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
        />
        <Select
          label="Participants"
          value={selectedParticipant}
          onChange={(value) => setSelectedParticipant(value)}
        >
          {
            allPartcipants?.map((el)=>{
              return (<Option value={el._id} disabled={participants.includes(el.name)}>
              {el.name}
            </Option>)
            })
          }
          {/* <Option value="Rajiv" disabled={participants.includes("Rajiv")}>
            Rajiv
          </Option>
          <Option value="Hilton" disabled={participants.includes("Hilton")}>
            Hilton
          </Option>
          <Option value="Vivek" disabled={participants.includes("Vivek")}>
            Vivek
          </Option> */}
        </Select>
        <Button className="w-[120px] bg-maincolor" onClick={handleAddParticipant}>
          Add
        </Button>
      </div>

      {/* Display list of participants */}
      {participants.length ? (
        <div className="w-[90%] m-auto mt-5">
          <h3>Participants:</h3>
          <List>
            {participants.map((participant, index) => (
              <ListItem className="w-[40%] flex justify-between items-center" key={index}>
                {allPartcipants.map((el)=>{
 if (el._id == participant){
  return el.name
 }
                })}
                <AiFillDelete onClick={() => handleRemoveParticipant(participant)}/>
              </ListItem>
            ))}
          </List>
        </div>
      ) : null}

      <div className="w-[90%] text-center mt-5 m-auto">
        <Button className="bg-maincolor" type="submit">
          Add Cohort
        </Button>
      </div>
    </form>
  </div>
  )
}

export default AddCohort