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
import { toastConfig } from "../../App";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";

export const Adddomain = () => {
  const [domainData, setdomainData] = useState({
    name: "",
    category: "",
    subTopics: [{ content: "", score: 0 }],
    // observation: "",
  });
  const [isaddDomainLoading, setIsaddDomainLoading] = useState(false);

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setdomainData({ ...domainData, [name]: value });
  };

  const addSubtopic = () => {
    setdomainData({
      ...domainData,
      subTopics: [...domainData.subTopics, { content: "", score: 0 }],
    });
  };

  const removeSubtopic = (index) => {
    const updatedSubtopic = [...domainData.subTopics];
    updatedSubtopic.splice(index, 1);
    setdomainData({ ...domainData, subTopics: updatedSubtopic });
  };

  const handleSubtopicChange = (index, event) => {
    const updatedSubtopic = [...domainData.subTopics];
    updatedSubtopic[index][event.target.name] = event.target.value;
    setdomainData({ ...domainData, subTopics: updatedSubtopic });
  };

  const handleChangeCategory = (name, value) => {
    setdomainData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitCohort = (e) => {
    e.preventDefault();
    setIsaddDomainLoading(true);
    axios
      .post(`${serverUrl}/domain/create/`, domainData)
      .then((res) => {
        console.log(res);
        if (res.status == 201) {
          toast.success("Domain added suucessfully", toastConfig);
          setdomainData({
            name: "",
            category: "",
            subTopics: [{ content: "", score: 0 }],
            // observation: "",
          });
          setIsaddDomainLoading(false);
        } else {
          toast.error("Something went wrong", toastConfig);
        }
      })
      .catch((err) => {
        setIsaddDomainLoading(false);
        toast.error(err.response.data.error, toastConfig);
      });
  };

  return (
    <div className="flex justify-center items-center gap-10 mb-24">
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
          <div className="flex justify-between items-center m-auto gap-10">
            <Input
              label="Name of Domain"
              name="name"
              value={domainData.name}
              onChange={handleChangeInput}
              required
            />
            <Select
              label="Category"
              name="category"
              value={domainData.category}
              onChange={(value) => handleChangeCategory("category", value)}
              required
            >
              <Option value="General">General</Option>
              <Option value="Special Need">Special Need</Option>
            </Select>
          </div>
          <br />
          <div className={`max-h-[30vh]  overflow-auto`}>
          {domainData.subTopics.map((item, index) => {
            return (
              <div
                key={index}
                className={`w-[90%] flex justify-between items-center gap-5 ${
                  index === 0 ? "mt-0" : "mt-5"
                }`}
              >
                <Input
                  label="Topic name"
                  name="content"
                  value={item.content}
                  onChange={(e) => handleSubtopicChange(index, e)}
                  required
                />

                {index === 0 ? null : (
                  <AiFillDelete
                    className="text-[20px] cursor-pointer"
                    onClick={() => removeSubtopic(index)}
                  />
                )}
                {index === 0 ? (
                  <FaPlus
                    className="text-[20px] cursor-pointer"
                    onClick={addSubtopic}
                  />
                ) : null}
              </div>
            );
          })}
          </div>
        </div>
        <div className="w-[90%] text-center mt-5 m-auto">
          <Button className="bg-maincolor" type="submit" disabled={isaddDomainLoading}>
            {isaddDomainLoading ? (
              <CgSpinner size={18} className=" m-auto animate-spin" />
            ) : (
              "Add Domain"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Adddomain;
