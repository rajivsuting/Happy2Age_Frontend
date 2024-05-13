import { Button, Input, Select, Option } from "@material-tailwind/react";
import React, { useState } from "react";
import { serverUrl } from "../../api";
import axios from "axios";


const initialState = {
  name: "",
  email: "",
  dob: "",
  gender: "",
  participantType: "",
  address: {
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  },
  emergencyContact: {
    name: "",
    relationship: "",
  },
}
export const AddParticipant = () => {
    const [participantData, setParticipantData] = useState(initialState);

    const handleChangeInput = (e) => {
      const { name, value } = e.target;
      setParticipantData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleChangeAddress = (e) => {
      const { name, value } = e.target;
      setParticipantData(prevData => ({
        ...prevData,
        address: {
          ...prevData.address,
          [name]: value,
        },
      }));
    };
  
    const handleChangeGenderAndParticipants = (name, value) => {
      setParticipantData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleChangeStateAndCity = (name, value) => {
      setParticipantData(prevData => ({
        ...prevData,
        address: {
          ...prevData.address,
          [name]: value,
        },
      }));
    };
  
  
    const handleChangeEmergencyContact = (e) => {
      const { name, value } = e.target;
      setParticipantData(prevData => ({
        ...prevData,
        emergencyContact: {
          ...prevData.emergencyContact,
          [name]: value,
        },
      }));
    };
  
    const handleSubmitParticipant = (e) => {
      e.preventDefault();
      axios.post(`${serverUrl}/participant/create`,participantData)
      .then((res)=>{
        if (res.status==201){
          alert("Participant added suucessfully")
        } else {
          alert("Something went wrong")
        }
      }).catch((err)=>{
        console.log(err)
        alert(err.response.data.error)
      })
    };
  return (
    <div className="flex justify-center items-center gap-10">
      <form className="m-auto border rounded-xl shadow w-[70%] py-8 mt-8 bg-white" onSubmit={handleSubmitParticipant}>
        {/* Basic details */}
        <div className="w-[90%] m-auto mb-5 flex justify-center items-center">
          <div className="w-[15%]">Basic details</div>{" "}
          <hr className="w-[85%] border" />
        </div>
        <div className="w-[90%] flex justify-between items-center m-auto gap-10">
          <Input label="Name" name="name" value={participantData.name} onChange={handleChangeInput} />
          <Input label="Email" name="email" value={participantData.email} type="email" onChange={handleChangeInput} />
        </div>
        <div className="w-[90%] flex justify-between items-center m-auto gap-10 mt-5">
          <Input label="Date of Birth" name="dob" value={participantData.dob} type="date" onChange={handleChangeInput} />
          <Select label="Gender" name="gender" value={participantData.gender} onChange={(value)=>handleChangeGenderAndParticipants("gender",value)}>
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
          </Select>
          <Select label="Participant Type" name="participantType" value={participantData.participantType} onChange={(value)=>handleChangeGenderAndParticipants("participantType",value)}>
            <Option value="General">General</Option>
            <Option value="Special Need">Special Need</Option>
          </Select>
        </div>

        {/* Address */}
        <div className="w-[90%] m-auto mb-5 flex justify-center items-center mt-5">
          <div className="w-[10%]">Address</div> <hr className="w-[90%] border" />
        </div>
        <div className="w-[90%] flex justify-between items-center m-auto gap-10 mt-5">
          <Input label="Address Line" name="addressLine" value={participantData.address.addressLine} onChange={handleChangeAddress} />
          <Input label="Pincode" type="number" name="pincode" value={participantData.address.pincode} onChange={handleChangeAddress} />
        </div>
        <div className="w-[90%] flex justify-between items-center m-auto gap-10 mt-5">
          <Select label="State" name="state" value={participantData.address.state}  onChange={(value) => handleChangeStateAndCity("state", value)}>
            <Option value="Assam">Assam</Option>
            <Option value="Arunachal Pradesh">Arunachal Pradesh</Option>
            <Option value="West Bangal">West Bangal</Option>
            <Option value="Bihar">Bihar</Option>
            <Option value="Kerala">Kerala</Option>
          </Select>
          <Select label="City" name="city" value={participantData.address.city}   onChange={(value) => handleChangeStateAndCity("city", value)}>
            <Option value="Guwahati">Guwahati</Option>
            <Option value="Tawang">Tawang</Option>
            <Option value="Kalkutta">Kalkutta</Option>
            <Option value="Mirzapur">Mirzapur</Option>
            <Option value="Hyderabad">Hyderabad</Option>
          </Select>
        </div>

        {/* Emergency contact */}
        <div className="w-[90%] m-auto mb-5 flex justify-center items-center mt-5">
          <div className="w-[20%]">Emergency contact</div> <hr className="w-[80%] border" />
        </div>
        <div className="w-[90%] flex justify-between items-center m-auto gap-10 mt-5">
          <Input label="Name" name="name" value={participantData.emergencyContact.name} onChange={handleChangeEmergencyContact} />
          <Input label="Relationship" name="relationship" value={participantData.emergencyContact.relationship} onChange={handleChangeEmergencyContact} />
        </div>

        <div className="w-[90%] text-center mt-5 m-auto">
          <Button className="bg-maincolor" type="submit">Add Participant</Button>
        </div>
      </form>
    </div>
  )
}

export default AddParticipant