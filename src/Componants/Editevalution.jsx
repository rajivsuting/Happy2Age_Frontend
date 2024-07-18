import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { serverUrl } from "../api";

const EditEvaluation = ({ evaluation, onSave, isOpen, onClose }) => {
  const [domains, setDomains] = useState(evaluation?.domain);
  useEffect(() => {
    setDomains(evaluation?.domain);
  }, [evaluation?.domain]);

  const handleScoreChange = (domainIndex, subTopicIndex, newScore) => {
    const updatedDomains = [...domains];
    updatedDomains[domainIndex].subTopics[subTopicIndex].score = newScore;
    setDomains(updatedDomains);
  };

  const handleSave = () => {
    console.log(evaluation)
    // axios
    //   .delete(`${serverUrl}/evaluation/${searchParams.get("id")}`)
    //   .then((res) => {
    //     if (res.status == 200) {
    //       toast.success("Evaluation edited suucessfully", toastConfig);
    //       getAllData();
    //     } else {
    //       toast.error("Something went wrong", toastConfig);
    //     }
    //   })
    //   .catch((err) => {
    //     if (err.response && err.response.data && err.response.data.jwtExpired) {
    //       toast.error(err.response.data.message, toastConfig);
    //       setTimeout(() => {
    //         navigate("/auth/sign-in");
    //       }, 3000);
    //     } else if (err.response && err.response.data) {
    //       toast.error(err.response.data.message, toastConfig);
    //     } else {
    //       toast.error("An unexpected error occurred.", toastConfig);
    //     }
    //   });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative m-4 w-2/5 min-w-[40%] max-w-[30%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl p-4">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 font-sans text-2xl font-semibold text-blue-gray-900 bg-white">
          Edit evaluation
          <AiOutlineClose
            className="cursor-pointer"
            size={24}
            onClick={onClose}
          />
        </div>
        {domains?.map((domain, domainIndex) => (
          <div key={domain._id}>
            <h3 className="mt-3 mb-3 text-[20px]">{domain.name}</h3>
            {domain.subTopics.map((subTopic, subTopicIndex) => (
              <div
                className="flex justify-between items-center mt-2"
                key={subTopic._id}
              >
                <div className="">{subTopic.content}:</div>
                <div className="w-[40%]">
                <Input
                  label="Add score"
                  type="number"
                  value={subTopic.score}
                  onChange={(e) =>
                    handleScoreChange(domainIndex, subTopicIndex, e.target.value)
                  }
                  
                />

                </div>
              </div>
            ))}
          </div>
        ))}
        <div
          className="flex flex-wrap items-center justify-center gap-5 p-4 mt-5 text-blue-gray-500"
          onClick={handleSave}
        >
          <Button className="bg-maincolor" type="submit">
            Edit evaluation
            {/* {isEditCohortLoading ? (
                  <CgSpinner size={18} className="m-auto animate-spin" />
                ) : (
                )} */}
          </Button>
        </div>
        {/* <button>Save</button> */}
      </div>
    </div>
  );
};

export default EditEvaluation;
