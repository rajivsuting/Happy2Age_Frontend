import { Button, Input, Textarea } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../api";
import { toast } from "react-toastify";
import { toastConfig } from "../App";
import { useSearchParams } from "react-router-dom";

const EditActivity = ({ isOpen, onClose, singleActivity }) => {
  const [activityData, setActivityData] = useState(null);
  const [searchParams, setsearchParams] = useSearchParams()
  useEffect(() => {
    if (singleActivity) {
      setActivityData(singleActivity);
    }
  }, [singleActivity]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setActivityData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitActivity = (e) => {
    e.preventDefault();
    axios
    .patch(`${serverUrl}/activity/edit/${searchParams.get("id")}`, activityData)
    .then((res) => {
      if (res.status === 200) {
        toast.success("Activity edited successfully", toastConfig);
        window.location.reload()
      } else {
        toast.error("Something went wrong", toastConfig);
      }
    })
    .catch((err) => {
      console.log(err)
      toast.error(err.response.data.error, toastConfig);
    });
  };

  if (!isOpen || !activityData) return null;

  const { name, description } = activityData;

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative m-4 w-2/5 min-w-[30%] max-w-[30%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl p-8">
        <div className="flex items-center p-4 font-sans text-2xl font-semibold text-blue-gray-900">
          Edit Activity
        </div>
        <div className="flex justify-center items-center gap-10">
          <form
            className="m-auto rounded-xl "
            onSubmit={handleSubmitActivity}
          >
            <div className=" m-auto mb-5 flex justify-center items-center">
              <div className="w-[40%]">Activity details</div>{" "}
              <hr className="w-[60%] border" />
            </div>
            <div className="m-auto mt-5">
              <Input
                label="Name"
                name="name"
                value={name || ""}
                onChange={handleChangeInput}
              />
            </div>
            <div className="m-auto mt-5">
              <Textarea
                label="Description"
                name="description"
                value={description || ""}
                onChange={handleChangeInput}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 p-4 mt-5 text-blue-gray-500">
              <button
                onClick={onClose}
                className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg hover:bg-red-500/10 active:bg-red-500/30  border border-red-300"
              >
                Close
              </button>
              <Button className="bg-maincolor" type="submit">
                Edit activity
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditActivity;
