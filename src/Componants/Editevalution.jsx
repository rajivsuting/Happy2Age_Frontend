import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { serverUrl } from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { toastConfig } from "../App";
import usePreventScrollOnNumberInput from "./CustomHook";

const EditEvaluation = ({
  evaluation,
  getAllData,
  onSave,
  isOpen,
  onClose,
}) => {
  usePreventScrollOnNumberInput();

  const [domains, setDomains] = useState([]);
  const [domainList, setDomainList] = useState([]);
  const [finalArray, setFinalArray] = useState([]);
  const [finalObject, setFinalObject] = useState({});
  const navigate = useNavigate();

  // Reset state whenever the modal opens or the evaluation changes
  useEffect(() => {
    if (isOpen && evaluation) {
      console.log("moi call holu");
      
      // Reset state variables when the modal opens
      setDomains(evaluation.domain || []);
      setFinalObject(evaluation);
      setFinalArray([]);
    }
  }, [isOpen, evaluation]);

  useEffect(() => {
    if (evaluation?.participant?.participantType) {
      axios
        .get(
          `${serverUrl}/domain/all/?category=${evaluation.participant.participantType}`
        )
        .then((res) => {
          setDomainList(res.data.message);
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.jwtExpired) {
            toast.error(err.response.data.message, toastConfig);
            setTimeout(() => {
              navigate("/auth/sign-in");
            }, 3000);
          } else if (err.response && err.response.data) {
            // toast.error(err.response.data.message, toastConfig);
          } else {
            toast.error("An unexpected error occurred.", toastConfig);
          }
        });
    }
  }, [evaluation?.participant?.participantType]);

  useEffect(() => {
    const combinedArray = domainList?.map((item) => {
      const match = domains?.find((el) => el._id === item._id);
      if (match) {
        item.subTopics = item.subTopics.map((subTopic) => {
          const matchSubTopic = match.subTopics.find(
            (el) => el._id === subTopic._id
          );
          if (matchSubTopic) {
            subTopic.score = matchSubTopic.score;
          }
          return subTopic;
        });
      }
      return item;
    });

    setFinalArray(combinedArray);
  }, [domainList, domains]);

  const handleScoreChange = (domainIndex, subTopicIndex, newScore) => {
    const updatedDomains = [...finalArray];
    updatedDomains[domainIndex].subTopics[subTopicIndex].score = newScore;
    setFinalArray(updatedDomains);
    setFinalObject((prevObj) => ({
      ...prevObj,
      domain: updatedDomains,
    }));
  };

  const handleSave = () => {
    axios
      .patch(`${serverUrl}/evaluation/${evaluation?._id}`, finalObject)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Evaluation edited successfully", toastConfig);
          getAllData();
          onClose(); // Close the modal after successful save
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

  const handleCloseModal = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative m-4 w-[40%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl px-4">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 py-8 font-sans text-2xl font-semibold text-blue-gray-900 bg-white">
          Edit evaluation
          <AiOutlineClose
            className="cursor-pointer"
            size={24}
            onClick={handleCloseModal}
          />
        </div>
        {finalArray?.map((domain, domainIndex) => (
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
                    className="noscroll"
                    value={subTopic.score || ""}
                    onChange={(e) =>
                      handleScoreChange(
                        domainIndex,
                        subTopicIndex,
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
        <div
          className="sticky bottom-0 z-10 flex flex-wrap items-center justify-center gap-5 p-4 mt-5 text-blue-gray-500"
          onClick={handleSave}
        >
          <Button className="bg-maincolor" type="submit">
            Edit evaluation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditEvaluation;
