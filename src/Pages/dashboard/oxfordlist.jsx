import axios from "axios";
axios.defaults.withCredentials = true;
import React, { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { convertDateFormat, getLocalData } from "../../Utils/localStorage";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { Button, Card, Typography } from "@material-tailwind/react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import EditOxford from "../../Componants/EditOxford";
import ConfirmDeleteModal from "../../Componants/ConfirmDeleteModal";

export const Oxfordlist = () => {
  const [allResult, setallResult] = useState([]);
  const navigate = useNavigate();
  const [allParticipants, setAllParticipants] = useState([]);
  const [selectParticipant, setSelectParticipant] = useState("");
  const [singleOxford, setSingleOxford] = useState({});
  const [isOxfordEditModal, setIsOxfordEditModal] = useState(false);
  const [clickClear, setClickClear] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOxfordDeleteModal, setIsOxfordDeleteModal] = useState(false);
  const [editOrView, setEditorView] = useState("")


  const getAllOxfords = ()=>{
    axios
      .get(`${serverUrl}/oxford/all/`, {
        
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
  }

  useEffect(() => {
    getAllOxfords()
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
      .get(`${serverUrl}/oxford/participant/${selectParticipant}`, {
        
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

  const toggleModal = (el)=>{
    setSingleOxford(el);
    setIsOxfordEditModal(true);
  }

  const closeEditOxfordModal = ()=>{
    setIsOxfordEditModal(false);
  }

  const openOxfordDeleteModal = (id)=>{
    setIsOxfordDeleteModal(true);
    setSearchParams({id})
  }

  const closeOxfordDeleteModal = ()=>{
    setIsOxfordDeleteModal(false);
  }

  const handleSubmitOxfordDelete = () => {
    axios
      .delete(`${serverUrl}/oxford/delete/${searchParams.get("id")}`)
      .then((res) => {
        console.log(res)
        toast.success(res.data.message, toastConfig);
        getAllOxfords();
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
  };


  return (
    <Card className="h-full w-full overflow-scroll mt-5 mb-24">
      <div className="w-[98%] m-auto mt-10 mb-5 flex justify-center items-center">
        <div className="w-[17%]">Get member result</div>
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
          <option value="">Search by member</option>
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
                Member name
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Total score
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
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                
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
                    {el.happinessScore.toFixed(2) || "-"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {convertDateFormat(el?.date?.split("T")[0]) || "-"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    onClick={() => {toggleModal(el);setEditorView("View")}}
                    className="font-medium border w-[100px] text-center p-1 rounded-lg bg-maincolor text-white"
                  >
                    See details
                  </Typography>
                </td>
                <td className={classes}>
                 <Typography
                   as="a"
                   href="#"
                   variant="small"
                   color="blue-gray"
onClick={() => {toggleModal(el);setEditorView("Edit")}}
                   className="text-maincolor2 text-[20px]"
                 >
                   <CiEdit />
                 </Typography>
               </td>
               <td className={classes}>
                 <Typography
                   as="a"
                   href="#"
                   variant="small"
                   color="blue-gray"
                   className="text-red-500  text-[20px]"
                   onClick={()=>openOxfordDeleteModal(el._id)}
                 >
                   <MdOutlineDeleteOutline />
                 </Typography>
               </td>  
              </tr>
            );
          })}
        </tbody>
      </table>
      <ConfirmDeleteModal isOpen={isOxfordDeleteModal} onClose={closeOxfordDeleteModal} handleDelete={handleSubmitOxfordDelete}/>
      <EditOxford editOrView={editOrView} isOpen={isOxfordEditModal} onClose={closeEditOxfordModal} singleOxford={singleOxford} getAllOxfords={getAllOxfords}/>
    </Card>
  );
};

export default Oxfordlist;
