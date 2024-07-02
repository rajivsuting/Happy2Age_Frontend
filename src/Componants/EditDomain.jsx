import React, { useEffect, useState } from "react";
import { Button, Input, List, ListItem } from "@material-tailwind/react";
import axios from "axios";
import { serverUrl } from "../api";
import { toastConfig } from "../App";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import { getLocalData } from "../Utils/localStorage";

const EditDomain = ({ isOpen, onClose, singleCohort, getAlldata }) => {
  const [cohortData, setCohortData] = useState(null);
  const [allParticipants, setAllParticipants] = useState([]);
  const [isEditCohortLoading, setIsEditCohortLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  if (!isOpen || !cohortData) return null;
  
  useEffect(() => {
    if (singleCohort) {
      setCohortData(singleCohort);
    }
  }, [singleCohort]);

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
      .post(`${serverUrl}/domain/create/`, domainData,{
        
      })
      .then((res) => {
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
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative m-4 w-2/5 min-w-[60%] max-w-[60%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl p-4">
        <div className="flex items-center p-4 font-sans text-2xl font-semibold text-blue-gray-900">
          Edit Domain
        </div>
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
          <div
            className="cursor-pointer flex justify-end items-center gap-5 mb-5"
            onClick={addSubtopic}
          >
            <div className="flex justify-center items-center gap-5 border px-4 py-1 rounded">
              <div>Add questions</div>
              <FaPlus />
            </div>
          </div>
          {domainData.subTopics.map((item, index) => {
            return (
              <div
                key={index}
                className={`w-[100%] flex justify-between items-center gap-5 ${
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

                {/* {index === 0 ? null : ( */}
                  <AiFillDelete
                    className="text-[20px] cursor-pointer"
                    onClick={() => removeSubtopic(index)}
                  />
                {/* )} */}
                
              </div>
            );
          })}
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
      </div>
    </div>
  );
};

export default EditDomain;
