import {
  Button,
  Input,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../api";
import axios from "axios";
import { toastConfig } from "../App";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCohorts,
  getAllParticipants,
} from "../Redux/AllListReducer/action";
import { convertDateFormat, getLocalData } from "../Utils/localStorage";
import usePreventScrollOnNumberInput from "./CustomHook";

const SeeDeatailesParticipant = ({
  isOpen,
  onClose,
  singleParticipant,
  name,
}) => {
  usePreventScrollOnNumberInput();
  const [participantData, setParticipantData] = useState(null);
  const { cohortList } = useSelector((state) => {
    return {
      cohortList: state.AllListReducer.cohortList,
    };
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCohorts("", ""));
  }, [dispatch]);

  useEffect(() => {
    if (singleParticipant) {
      setParticipantData(singleParticipant);
    }
  }, [singleParticipant]);

  if (!isOpen || !participantData) return null;

 console.log(participantData);
 

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative m-4 w-2/5 min-w-[60%] max-w-[60%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl p-8">
        <div className="flex items-center justify-between p-4 font-sans text-2xl font-semibold text-blue-gray-900">
          View member details
          <AiOutlineClose
            className="cursor-pointer"
            size={24}
            onClick={onClose}
          />
        </div>
        <div className="px-4">
        <div className="w-[100%] m-auto mb-5 flex justify-center items-center">
              <div className="w-[15%]">Basic details</div>{" "}
              <hr className="w-[85%] border" />
            </div>
            <div className="w-[100%] ">
              <div>Name : {participantData?.name}</div>
              <div>Email : {participantData?.email}</div>
              <div>Date of Birth : {convertDateFormat(participantData?.dob?.split("T")[0])}</div>
              <div>Gender : {participantData?.gender}</div>
              <div>Member type : {participantData?.participantType}</div>
              <div>Centre name : {cohortList?.find((el)=>el._id == participantData?.cohort)?.name}</div>
            </div>

            {/* Address */}
            <div className="w-[100%] m-auto mb-5 flex justify-center items-center mt-5">
              <div className="w-[10%]">Address</div>{" "}
              <hr className="w-[90%] border" />
            </div>
            <div className="w-[100%]">
              <div>
                Address : {participantData?.address?.addressLine};{" "}
                {participantData?.address?.state};{" "}
                {participantData?.address?.city};{" "}
                {participantData?.address?.pincode}
              </div>
              <div>Phone : {participantData?.phone}</div>
            </div>

            {/* Emergency contact */}
            <div className="w-[100%] m-auto mb-5 flex justify-center items-center mt-5">
              <div className="w-[20%]">Emergency contact</div>{" "}
              <hr className="w-[80%] border" />
            </div>
            <div className="w-[100%]">
              <div>Person name : {participantData?.emergencyContact?.name}</div>
              <div>Phone no. : {participantData?.emergencyContact?.phone}</div>
              <div>Relation : {participantData?.emergencyContact?.relationship}</div>
              <div>
                About member : {participantData?.briefBackground}
              </div>
            </div>

            
        </div>
      </div>
    </div>
  );
};

export default SeeDeatailesParticipant;
