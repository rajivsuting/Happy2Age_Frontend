import { Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import SeeDetailsCohort from "../../Componants/SeeDetailsCohort";
import EditCohort from "../../Componants/EditCohort";
import ConfirmDeleteModal from "../../Componants/ConfirmDeleteModal";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { getAllCohorts } from "../../Redux/AllListReducer/action";


export const Cohortlist = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [searchParams, setsearchParams] = useSearchParams()
  const [singleCohort, setSingleCohort] = useState({});
  const dispatch = useDispatch();

  const {cohortList} = useSelector((state)=>{
    return {
      cohortList : state.AllListReducer.cohortList
    }
  })

  const toggleModal = (el) => {
     setIsModalOpen(!isModalOpen);
     setSingleCohort(el)
   };

   const toggleModalEdit = (el) => {
    setsearchParams({id:el._id})
    setIsModalOpenEdit(!isModalOpenEdit);
    setSingleCohort(el)
  };

  const toggleModalDelete = (id) => {
    setsearchParams({id})
    setIsModalOpenDelete(!isModalOpenDelete);
  };

  const handleDelete = () => {
    axios.delete(`${serverUrl}/cohort/delete/${searchParams.get("id")}`)
    .then((res)=>{
      if (res.status==200){
        toast.success("Cohort delete suucessfully", toastConfig);
        dispatch(getAllCohorts).then((res)=>{})
      } else {
        toast.error("Something went wrong", toastConfig);
      }
    }).catch((err)=>{
      console.log(err)
      toast.error(err.response.data.error, toastConfig);
    })
  };


  
  return (
    <Card className="h-full w-full overflow-scroll mt-5 mb-24">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Cohort name
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Participants name
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              ></Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              ></Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              ></Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {cohortList?.map((el, index) => {
            const isLast = index === cohortList.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={el.name}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.name || "-"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.participants?.map((el) => {
                      return el.name.substring(0, 5) + "... ," || "-";
                    })}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    onClick={()=>toggleModal(el)}
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
                    className="text-maincolor2 text-[20px]"
                    onClick={()=>toggleModalEdit(el)}
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
                    className="text-red-500 text-[20px]"
                    onClick={()=>toggleModalDelete(el._id)}
                  >
                    <MdOutlineDeleteOutline />
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
 <SeeDetailsCohort isOpen={isModalOpen} onClose={toggleModal} singleCohort={singleCohort}/>
 <EditCohort isOpen={isModalOpenEdit} onClose={toggleModalEdit} singleCohort={singleCohort} getAllCohorts={()=>dispatch(getAllCohorts).then((res)=>{})}/>
 <ConfirmDeleteModal isOpen={isModalOpenDelete} onClose={toggleModalDelete} handleDelete={handleDelete} />
    </Card>
  );
};

export default Cohortlist;
