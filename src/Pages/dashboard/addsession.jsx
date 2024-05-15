import { Button, Input, Select, Option } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import axios from "axios";


const initialState = {
  name: "",
  cohort: "",
  activity: "",
  date: "",
}
export const AddSession = () => {
    const [sessionData, setSessionData] = useState(initialState);
    const [cohortsList, setCohortList] = useState([]);
    const [activityList, setActivityList] = useState([]);

    const {name,
    cohort,
    activity,
    date} = sessionData

    const handleChangeInput = (e) => {
      const { name, value } = e.target;
      setSessionData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    };

  
    const handleChangeCohortAndActivity = (name, value) => {
      setSessionData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    };

  useEffect(() => {
    axios.get(`${serverUrl}/cohort/all/`).then((res) => {
      setCohortList(res.data);
    });

    axios.get(`${serverUrl}/activity/all/`).then((res) => {
      setActivityList(res.data);
    });
  }, []);
  
    const handleSubmitSession = (e) => {
      e.preventDefault();
      axios.post(`${serverUrl}/sessions/create`,sessionData)
      .then((res)=>{
        if (res.status==201){
          alert("Session added suucessfully")
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
      <form className="m-auto border rounded-xl shadow w-[70%] py-8 mt-8 bg-white" onSubmit={handleSubmitSession}>
        {/* Basic details */}
        <div className="w-[90%] m-auto mb-5 flex justify-center items-center">
          <div className="w-[15%]">Basic details</div>{" "}
          <hr className="w-[85%] border" />
        </div>
        <div className="w-[90%] flex justify-between items-center m-auto gap-10">
          <Input label="Name" name="name" value={name} onChange={handleChangeInput} />
          <Select label="Cohort" name="cohort" value={cohort} onChange={(value)=>handleChangeCohortAndActivity("cohort",value)}>
            {
              cohortsList?.map((el)=>{
                return <Option value={el._id}>{el.name}</Option>
              })
            }
          </Select>
        </div>
        <div className="w-[90%] flex justify-between items-center m-auto gap-10 mt-5">
          <Input label="date" name="date" value={date} type="date" onChange={handleChangeInput} />
          <Select label="Activity" name="activity" value={activity} onChange={(value)=>handleChangeCohortAndActivity("activity",value)}>
          {
              activityList?.map((el)=>{
                return <Option value={el._id}>{el.name}</Option>
              })
            }
          </Select>
        </div>

        <div className="w-[90%] text-center mt-5 m-auto">
          <Button className="bg-maincolor" type="submit">Add Session</Button>
        </div>
      </form>
    </div>
  )
}

export default AddSession