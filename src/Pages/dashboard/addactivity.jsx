import {
  Button,
  Input,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../../api";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { CgSpinner } from "react-icons/cg";
import { useDispatch } from "react-redux";
import { getAllActivities } from "../../Redux/AllListReducer/action";
import { getLocalData } from "../../Utils/localStorage";
import { useNavigate } from "react-router-dom";

const initialState = {
  name: "",
  description: "",
  references: "",
};

export const AddActivity = () => {
  const [activityData, setActivityData] = useState(initialState);
  const [isAddActivityLoading, setIsAddActivityLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, description, references } = activityData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setActivityData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitActivity = (e) => {
    e.preventDefault();
    setIsAddActivityLoading(true);
    axios
      .post(`${serverUrl}/activity/create`, activityData, {
        
      })
      .then((res) => {
        if (res.status == 201) {
          toast.success("Activity added suucessfully", toastConfig);
          setActivityData(initialState);
          dispatch(getAllActivities("","")).then((res)=>{
            setIsAddActivityLoading(false);
          })
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
    <div className="w-[100%] flex justify-center items-center gap-10 mb-24">
      <form
        className="m-auto border rounded-xl shadow w-[70%] py-8 mt-16 bg-white "
        onSubmit={handleSubmitActivity}
      >
        {/* Basic details */}
        <div className="w-[90%] m-auto mb-5 flex justify-center items-center">
          <div className="w-[15%]">Activity details</div>{" "}
          <hr className="w-[85%] border" />
        </div>
        <div className="w-[90%] flex justify-between items-center m-auto gap-10 mt-5">
          <Input
            label="Name"
            name="name"
            value={name}
            onChange={handleChangeInput}
            required
          />
          {/* <Select label="Add domain" required>
            <Option value="General">General</Option>
            <Option value="Special Need">Special Need</Option>
          </Select> */}
        </div>
        <div className="w-[90%] m-auto mt-5">
          <Textarea
            label="Methodology"
            name="description"
            value={description}
            onChange={handleChangeInput}
            required
          />
        </div>
        <div className="w-[90%] m-auto mt-5">
          <Textarea
            label="References"
            name="references"
            value={references}
            onChange={handleChangeInput}
            required
          />
        </div>

        <div className="w-[90%] flex justify-center items-center text-center mt-5 m-auto">
          <Button
            disabled={isAddActivityLoading}
            className="bg-maincolor"
            type="submit"
          >
            {isAddActivityLoading ? (
              <CgSpinner size={18} className=" m-auto animate-spin" />
            ) : (
              "Add Activity"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddActivity;
