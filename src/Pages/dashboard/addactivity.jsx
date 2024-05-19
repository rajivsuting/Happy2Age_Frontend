import { Button, Input, Select, Option, Textarea } from "@material-tailwind/react";
import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../../api";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";

const initialState = {
  name: "",
  description: ""
}

export const AddActivity = () => {
  const [activityData, setActivityData] = useState(initialState);

  const {name, description} = activityData

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setActivityData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitActivity = (e) => {
    e.preventDefault();
    axios.post(`${serverUrl}/activity/create`,activityData)
    .then((res)=>{
      if (res.status==201){
        toast.success("Activity added suucessfully", toastConfig);
        setActivityData(initialState);
      } else {
        toast.error("Something went wrong", toastConfig);
      }
    }).catch((err)=>{
      toast.error(err.response.data.error, toastConfig);
    })
  };

  return (
    <div className="w-[100%] flex justify-center items-center gap-10 mb-24">
      <form className="m-auto border rounded-xl shadow w-[70%] py-8 mt-16 bg-white " onSubmit={handleSubmitActivity}>
        {/* Basic details */}
        <div className="w-[90%] m-auto mb-5 flex justify-center items-center">
          <div className="w-[15%]">Activity details</div>{" "}
          <hr className="w-[85%] border" />
        </div>
        <div className="w-[90%] m-auto mt-5">
          <Input label="Name" name="name" value={name} onChange={handleChangeInput} />
        </div>
        <div className="w-[90%] m-auto mt-5">
          <Textarea label="Description" name="description" value={description} onChange={handleChangeInput} />
        </div>

        <div className="w-[90%] text-center mt-5 m-auto">
          <Button className="bg-maincolor" type="submit">Add Activity</Button>
        </div>
      </form>
    </div>
  );
};

export default AddActivity;
