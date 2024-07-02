import { Button, Input, Select, Option } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../api";
import axios from "axios";
import { toastConfig } from "../App";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { getAllCohorts, getAllParticipants } from "../Redux/AllListReducer/action";
import { getLocalData } from "../Utils/localStorage";

const EditParticipants = ({ isOpen, onClose, singleParticipant }) => {
  const [participantData, setParticipantData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  // const [isEditParticipantLoading, setIsEditParticipantLoadingLoading] = useState(false);
  const [isEditParticipantLoading, setIsEditParticipantLoading] = useState(false);
  const {cohortList} = useSelector((state)=>{
    return {
      cohortList : state.AllListReducer.cohortList
    }
  })

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getAllCohorts("",""));
  },[])

  useEffect(() => {
    if (singleParticipant) {
      setParticipantData(singleParticipant);
    }
  }, [singleParticipant]);

  if (!isOpen || !participantData) return null;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setParticipantData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeAddress = (e) => {
    const { name, value } = e.target;
    setParticipantData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value,
      },
    }));
  };

  const handleChangeGenderAndParticipants = (name, value) => {
    setParticipantData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeStateAndCity = (e) => {
    const { name, value } = e.target;
    setParticipantData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value,
      },
    }));
  };

  const handleChangeEmergencyContact = (e) => {
    const { name, value } = e.target;
    setParticipantData((prevData) => ({
      ...prevData,
      emergencyContact: {
        ...prevData.emergencyContact,
        [name]: value,
      },
    }));
  };

  const handleSubmitParticipant = (e) => {
    e.preventDefault();
    setIsEditParticipantLoading(true);
    axios
      .patch(
        `${serverUrl}/participant/edit/${searchParams.get("id")}`,
        participantData
      )
      .then((res) => {
        if (res.status === 200) {
          dispatch(getAllParticipants(searchParams.get("page"),searchParams.get("limit"))).then((res)=>{
            dispatch(getAllCohorts("","")).then((res)=>{
              toast.success("Participant edited successfully", toastConfig);
              onClose();
            })
          })
          setIsEditParticipantLoading(false);
        } else {
          setIsEditParticipantLoading(false);
          toast.error("Something went wrong", toastConfig);
        }
      })
      .catch((err) => {
        setIsEditParticipantLoading(false);
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
      <div className="relative m-4 w-2/5 min-w-[60%] max-w-[60%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl p-8">
        <div className="flex items-center p-4 font-sans text-2xl font-semibold text-blue-gray-900">
          Edit participant
        </div>
        <div className="px-4">
          <form
            className="m-auto rounded-xl "
            onSubmit={handleSubmitParticipant}
          >
            {/* Basic details */}
            <div className="w-[100%] m-auto mb-5 flex justify-center items-center">
              <div className="w-[15%]">Basic details</div>{" "}
              <hr className="w-[85%] border" />
            </div>
            <div className="w-[100%] flex justify-between items-center m-auto gap-10">
              <Input
                label="Name"
                name="name"
                value={participantData?.name}
                onChange={handleChangeInput}
              />
              <Input
                label="Email"
                name="email"
                value={participantData?.email}
                type="email"
                onChange={handleChangeInput}
              />
              <Input
                label="Date of Birth"
                name="dob"
                value={participantData?.dob?.split("T")[0]}
                type="date"
                onChange={handleChangeInput}
              />
            </div>
            <div className="w-[100%] flex justify-between items-center m-auto gap-10 mt-5">
              <Select
                label="Gender"
                name="gender"
                value={participantData?.gender}
                onChange={(value) =>
                  handleChangeGenderAndParticipants("gender", value)
                }
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
              <Select
                label="Participant Type"
                name="participantType"
                value={participantData?.participantType}
                onChange={(value) =>
                  handleChangeGenderAndParticipants("participantType", value)
                }
              >
                <Option value="General">General</Option>
                <Option value="Special Need">Special Need</Option>
              </Select>
              <Select label="Select center" name="cohort" value={participantData.cohort} onChange={(value)=>handleChangeGenderAndParticipants("cohort",value)}>
            {
              cohortList?.map((el)=>{
                return <Option value={el._id}>{el.name}</Option>
              })
            }
          </Select>
            </div>

            {/* Address */}
            <div className="w-[100%] m-auto mb-5 flex justify-center items-center mt-5">
              <div className="w-[10%]">Address</div>{" "}
              <hr className="w-[90%] border" />
            </div>
            <div className="w-[100%] flex justify-between items-center m-auto gap-10 mt-5">
              <Input
                label="Address Line"
                name="addressLine"
                value={participantData?.address?.addressLine}
                onChange={handleChangeAddress}
              />
              <Input
                label="Pincode"
                type="number"
                name="pincode"
                value={participantData?.address?.pincode}
                onChange={handleChangeAddress}
              />
            </div>
            <div className="w-[100%] flex justify-between items-center m-auto gap-10 mt-5">
              <Input
                label="State"
                name="state"
                value={participantData?.address?.state}
                onChange={handleChangeStateAndCity}
              />
              <Input
                label="City"
                name="city"
                value={participantData?.address?.city}
                onChange={handleChangeStateAndCity}
              />
            </div>

            {/* Emergency contact */}
            <div className="w-[100%] m-auto mb-5 flex justify-center items-center mt-5">
              <div className="w-[20%]">Emergency contact</div>{" "}
              <hr className="w-[80%] border" />
            </div>
            <div className="w-[100%] flex justify-between items-center m-auto gap-10 mt-5">
              <Input
                label="Name"
                name="name"
                value={participantData?.emergencyContact?.name}
                onChange={handleChangeEmergencyContact}
              />
              <Input
                maxLength={10}
                minLength={10}
                label="Phone"
                name="phone"
                value={participantData?.emergencyContact?.phone}
                onChange={handleChangeEmergencyContact}
              />
              <Input
                label="Relationship"
                name="relationship"
                value={participantData?.emergencyContact?.relationship}
                onChange={handleChangeEmergencyContact}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 p-4 mt-5 text-blue-gray-500">
              <button
                onClick={onClose}
                className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg hover:bg-red-500/10 active:bg-red-500/30  border border-red-300"
              >
                Close
              </button>
              <Button className="bg-maincolor" type="submit" disabled={isEditParticipantLoading}>
                {isEditParticipantLoading ? (
                  <CgSpinner size={18} className=" m-auto animate-spin" />
                ) : (
                  "Edit participant"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditParticipants;
