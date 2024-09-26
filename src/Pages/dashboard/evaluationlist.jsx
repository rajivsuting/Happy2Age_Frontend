import { Button, Card, Typography } from "@material-tailwind/react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { MdOutlineDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import SeeDeatailesEvalution from "../../Componants/SeeDeatailesEvalution";
import { getLocalData } from "../../Utils/localStorage";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConfirmDeleteModal from "../../Componants/ConfirmDeleteModal";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import EditEvaluation from "../../Componants/Editevalution";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { getAllParticipants } from "../../Redux/AllListReducer/action";
import { useDispatch, useSelector } from "react-redux";

export const Evaluationlist = () => {
  const [evalutionlist, setEvalutionlist] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [singleEvalustion, setSingleEvaluation] = useState({});
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [searchParams, setsearchParams] = useSearchParams();
  const [isEditModal, setisEditModal] = useState(false);
  const [searchname, setsearchname] = useState("");
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1);
  const [limit, setLimit] = useState(searchParams.get("limit") || 10); // default limit
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const { partcipantList } = useSelector((state) => {
    return {
      partcipantList: state.AllListReducer.partcipantList,
    };
  });

  const toggleModal = (el) => {
    setIsModalOpen(!isModalOpen);
    setSingleEvaluation(el);
  };

  const toggleModalDelete = (id) => {
    setsearchParams({ id });
    setIsModalOpenDelete(!isModalOpenDelete);
  };

  const getAllData = (currentPage, limit) => {
    return axios
      .get(`${serverUrl}/evaluation/all/?page=${currentPage}&limit=${limit}`, {
        headers: {
          Authorization: `${getLocalData("token")}`,
        },
      })
      .then((res) => {
        setEvalutionlist(res.data.data);
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
  };

  useEffect(() => {
    getAllData(currentPage, limit);
    dispatch(getAllParticipants("", "")).then((res) => {
      return true;
    });
  }, [currentPage, limit]);

  const handleDelete = () => {
    axios
      .delete(`${serverUrl}/evaluation/${searchParams.get("id")}`, {
        headers: {
          Authorization: `${getLocalData("token")}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          toast.success("Evaluation deleted suucessfully", toastConfig);
          getAllData(currentPage, limit);
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
    console.log("Updated Evaluation List:", updatedList);
  };

  const openEditModal = (el) => {
    setSelectedEvaluation(null); // Reset to clear old data
    setTimeout(() => {
      setSelectedEvaluation(el); // Set new evaluation after resetting
      setisEditModal(true);
    }, 0); // Ensure there's a small delay to reset state properly
  };

  const closeEditModal = () => {
    setisEditModal(false);
  };

  const handleSearchSubmitname = (e) => {
    e.preventDefault();
    // dispatch(getAllSessionsByname(searchname));
  };

  return (
    <Card className="h-full w-full overflow-scroll mt-5 mb-24">
      <div className="flex justify-between items-center gap-5 mt-4 mr-3 ml-3">
        <form
          className="w-[40%] flex justify-start items-center gap-4"
          onSubmit={handleSearchSubmitname}
        >
          <div className="w-[100%]">
            <select
              name=""
              className="border w-[100%] px-2 py-2 rounded-md text-gray-600 border border-gray-600"
              value={searchname}
              onChange={(e) => setsearchname(e.target.value)}
              id=""
            >
              <option value="">Search by member</option>
              {partcipantList?.map((el, index) => (
                <option key={index} value={el._id}>
                  {el.name}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="">
            Search
          </Button>
        </form>
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center">
            <RiArrowLeftSLine
              className={`text-lg cursor-pointer ${
                currentPage === 1 ? "text-gray-400 pointer-events-none" : ""
              }`}
              onClick={() =>
                currentPage !== 1 && handlePageChange(currentPage - 1)
              }
            />
            <span className="px-5 font-medium">{currentPage}</span>
            <RiArrowRightSLine
              className={`text-lg cursor-pointer ${
                evalutionlist?.length < limit
                  ? "text-gray-400 pointer-events-none"
                  : ""
              }`}
              onClick={() =>
                evalutionlist?.length >= limit &&
                handlePageChange(currentPage + 1)
              }
            />
          </div>
          <div>
            <select
              className="border px-2 py-2 rounded-md mt-3 mb-3"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="15">15 per page</option>
              <option value="20">20 per page</option>
            </select>
          </div>
        </div>
      </div>
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
                    {el.grandAverage || "NA"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    onClick={() => toggleModal(el)}
                    className="text-maincolor2 text-[20px]"
                  >
                    <MdOutlineRemoveRedEye />
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="text-maincolor2 text-[20px]"
                    onClick={() => openEditModal(el)}
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
          isOpen={isEditModal}
          onClose={closeEditModal}
          getAllData={() => getAllData(currentPage, limit)}
        />
      )}
      <ConfirmDeleteModal
        isOpen={isModalOpenDelete}
        onClose={() => toggleModalDelete()}
        handleDelete={handleDelete}
      />
      <SeeDeatailesEvalution
        isOpen={isModalOpen}
        onClose={toggleModal}
        singleEvalustion={singleEvalustion}
      />
    </Card>
  );
};

export default Evaluationlist;
