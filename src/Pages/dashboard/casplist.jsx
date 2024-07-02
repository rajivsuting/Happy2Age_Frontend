import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { getLocalData } from "../../Utils/localStorage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { Button, Card, Typography } from "@material-tailwind/react";

export const Casplist = () => {
  const [allResult, setallResult] = useState([]);
  const navigate = useNavigate();
  const [allParticipants, setAllParticipants] = useState([]);
  const [selectParticipant, setSelectParticipant] = useState("");
  const [clickClear, setClickClear] = useState(false);
  const [singleSession, setSingleSession] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const toggleModal = (el) => {
     setIsModalOpen(!isModalOpen);
     setSingleSession(el);
   };

   const handleSessionDetails = (el) => {
    console.log(el);
    // localStorage.setItem("sessiondetails",{ name: "Alex" });
    // navigate(`/mainpage/session-details/${el._id}`);
  };

  useEffect(() => {
    axios
      .get(`${serverUrl}/casp/all/`, {
        
      })
      .then((res) => {
        setallResult(res.data.message);
      })
      .catch((err) => {
        console.log(err);
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
  }, [clickClear]);

  useEffect(() => {
    axios
      .get(`${serverUrl}/participant/all`, {
        
      })
      .then((res) => {
        setAllParticipants(res.data.message);
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
  }, []);

  const handleSubmitOxfordResult = (e) => {
    e.preventDefault();
    axios
      .get(`${serverUrl}/casp/participant/${selectParticipant}`, {
        
      })
      .then((res) => {
        console.log(res);
        setallResult(res.data.message);
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

  console.log(allResult)

  return (
    <Card className="h-full w-full overflow-scroll mt-5 mb-24">
      <div className="w-[98%] m-auto mt-10 mb-5 flex justify-center items-center">
        <div className="w-[17%]">Get participant result</div>
        <hr className="w-[83%] border" />
      </div>

      <form
        onSubmit={handleSubmitOxfordResult}
        className="w-[98%] m-auto flex justify-start items-center gap-10 mt-3 mb-3"
      >
        <select
          className="border w-[30%] px-2 py-2 rounded-md text-gray-600 border border-gray-600"
          value={selectParticipant}
          onChange={(e) => setSelectParticipant(e.target.value)}
          required
        >
          <option value="">Search by Participant</option>
          {allParticipants?.map((el, index) => (
            <option key={index} value={el._id}>
              {el.name}
            </option>
          ))}
        </select>
        <Button type="submit" variant="">
          Get result
        </Button>
        <Button type="submit" disabled={!selectParticipant} onClick={()=>{setClickClear(!clickClear);setSelectParticipant("")}} variant="">
          Clear
        </Button>
      </form>
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Partcipant name
              </Typography>
            </th>
            
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Date
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {allResult?.map((el, index) => {
            const isLast = index === allResult.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={el.name}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {allParticipants?.filter(
                      (pl) => pl._id == el.participant
                    )[0]?.name || "-"}
                  </Typography>
                </td>
                
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el?.date?.split("T")[0] || "-"}
                  </Typography>
                </td>
       
<td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    onClick={()=>handleSessionDetails(el)}
                    className="font-medium border w-[100px] text-center p-1 rounded-lg bg-maincolor text-white"
                  >
                    See details
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
};

export default Casplist;
