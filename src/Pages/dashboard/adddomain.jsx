import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Select,
  Option,
  List,
  ListItem,
} from "@material-tailwind/react";
import axios from "axios";
import { serverUrl } from "../../api";
import { FaPlus } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

const initialState = {
  name: "",
  subtopics: [{ topicName: "", marks: 0, observation: "" }],
};

export const Adddomain = () => {
  const [domainData, setdomainData] = useState(initialState);

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setdomainData({ ...domainData, [name]: value });
  };

  const addSubtopic = () => {
    setdomainData({
      ...domainData,
      subtopics: [
        ...domainData.subtopics,
        { topicName: "", marks: 0, observation: "" },
      ],
    });
  };

  const removeSubtopic = (index) => {
    const updatedSubtopic = [...domainData.subtopics];
    updatedSubtopic.splice(index, 1);
    setdomainData({ ...domainData, subtopics: updatedSubtopic });
  };

  const handleSubtopicChange = (index, event) => {
    const updatedSubtopic = [...domainData.subtopics];
    updatedSubtopic[index][event.target.name] = event.target.value;
    setdomainData({ ...domainData, subtopics: updatedSubtopic });
  };

  const handleSubmitCohort = (e) => {
    e.preventDefault();
    console.log(domainData)
  };

  return (
    <div className="flex justify-center items-center gap-10">
      <form
        className="m-auto border rounded-xl shadow w-[70%] py-8 mt-16 bg-white"
        onSubmit={handleSubmitCohort}
      >
        {/* Basic details */}
        <div className="w-[90%] m-auto mb-5 flex justify-center items-center">
          <div className="w-[15%]">Domain details</div>{" "}
          <hr className="w-[85%] border" />
        </div>
        <div className="w-[90%] m-auto mt-5">
          <div>
            <Input
              label="Name of Cohort"
              name="name"
              value={domainData.name}
                onChange={handleChangeInput}
                required
            />
          </div>
          <br />
          {domainData.subtopics.map((item, index) => {
            return (
              <div
                key={index}
                className="w-[100%] flex justify-between items-center gap-5"
              >
                <Input
                  label="Topic name"
                  name="topicName"
                  value={item.topicName}
                  onChange={(e) => handleSubtopicChange(index, e)}
                  required
                />

                <Input
                  label="Marks"
                  name="marks"
                  type="number"
                  value={item.marks}
                  onChange={(e) => handleSubtopicChange(index, e)}
                  required
                />

                <Input
                  label="Observation"
                  name="observation"
                  value={item.observation}
                  onChange={(e) => handleSubtopicChange(index, e)}
                />
                {index === 0 ? null : (
                    <AiFillDelete className="text-[50px] cursor-pointer" onClick={() => removeSubtopic(index)}/>
                )}
                {index === 0 ? (
               <FaPlus className="text-[50px] cursor-pointer" onClick={addSubtopic}/>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="w-[90%] text-center mt-5 m-auto">
          <Button className="bg-maincolor" type="submit">
            Add Domain
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Adddomain;
