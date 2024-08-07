import { Card, Typography } from "@material-tailwind/react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import SeeDeatailesEvalution from "../../Componants/SeeDeatailesEvalution";
import { getLocalData } from "../../Utils/localStorage";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConfirmDeleteModal from "../../Componants/ConfirmDeleteModal";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import EditEvaluation from "../../Componants/Editevalution";

export const Evaluationlist = () => {
  const [evalutionlist, setEvalutionlist] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState({}); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [singleEvalustion, setSingleEvaluation] = useState({})
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [searchParams, setsearchParams] = useSearchParams();
const [isEditModal, setisEditModal] = useState(false);
  
  
  const toggleModal = (el) => {
     setIsModalOpen(!isModalOpen);
     setSingleEvaluation(el)
   };

  const toggleModalDelete = (id) => {
     setsearchParams({ id });
     setIsModalOpenDelete(!isModalOpenDelete);
   };

   const getAllData = ()=>{
    return axios.get(`${serverUrl}/evaluation/all`,{
      // headers: {
      //   Authorization: `${getLocalData("token")}`,
      // },
    }).then((res) => {
      setEvalutionlist(res.data.message);
    }).catch((err) => {
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
    getAllData()
  }, []);


  const handleDelete = () => {
    axios
      .delete(`${serverUrl}/evaluation/${searchParams.get("id")}`, {
        
      })
      .then((res) => {
        if (res.status == 200) {
          toast.success("Evaluation deleted suucessfully", toastConfig);
          getAllData();
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

  const handleSave = (updatedEvaluation) => {
    const updatedList = evalutionlist.map((ev) =>
      ev._id === updatedEvaluation._id ? updatedEvaluation : ev
    );
    // setEvaluationList(updatedList);
    console.log('Updated Evaluation List:', updatedList);
  };

  const openEditModal = (el)=>{
    setSelectedEvaluation(el)
setisEditModal(true);
  }

  const closeEditModal = ()=>{
    setisEditModal(false);
  }

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
                Member
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Session
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Centre
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Activity
              </Typography>
            </th>
            {/* <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Domain 
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Subtopics
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Score
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Average
              </Typography>
            </th> */}
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Grand average
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
          {evalutionlist?.map((el, index) => {
            const isLast = index === evalutionlist?.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={el._id}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.participant?.name || "NA"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el?.session?.name || "NA"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el?.cohort?.name || "NA"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.activity?.name || "NA"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.grandAverage  || "NA"}
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
                    onClick={() =>openEditModal(el)}
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
                    onClick={() => toggleModalDelete(el._id)}
                    className="text-red-500  text-[20px]"
                  >
                    <MdOutlineDeleteOutline />
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selectedEvaluation && (
        <EditEvaluation
          evaluation={selectedEvaluation}
          onSave={handleSave}
          isOpen={isEditModal} onClose={closeEditModal}
          getAllData = {getAllData}
        />
      )}
      <ConfirmDeleteModal
        isOpen={isModalOpenDelete}
        onClose={() => toggleModalDelete()}
        handleDelete={handleDelete}
      />
      <SeeDeatailesEvalution isOpen={isModalOpen} onClose={toggleModal} singleEvalustion={singleEvalustion}/>
    </Card>
  );
};

export default Evaluationlist;
