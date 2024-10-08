import { Button, Card, Input, Typography } from "@material-tailwind/react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { MdOutlineDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import SeeDetailesSession from "../../Componants/SeeDetailesSession";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import {
  getAllActivities,
  getAllSessions,
  getAllSessionsBydate,
  getAllSessionsByname,
} from "../../Redux/AllListReducer/action";
import EditSeesion from "../../Componants/EditSeesion";
import { convertDateFormat, getLocalData } from "../../Utils/localStorage";
import ConfirmDeleteModal from "../../Componants/ConfirmDeleteModal";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";

export const Sessionlist = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [singleSession, setSingleSession] = useState({});
  const [searchParams, setsearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [limit, setLimit] = useState(searchParams.get("limit") || 10); // default limit
  const [startDate, setStartDate] = useState("");
  const [isEditModalOPen, setIsEditModalOpen] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [searchname, setsearchname] = useState("");
  const navigate = useNavigate();
  const toggleModal = (el) => {
    setIsModalOpen(!isModalOpen);
    setSingleSession(el);
  };

  const toggleModalDelete = (id) => {
    setsearchParams({ id });
    setIsModalOpenDelete(!isModalOpenDelete);
  };

  const { sessionlist } = useSelector((state) => {
    return {
      sessionlist: state.AllListReducer.sessionlist,
    };
  });

  const handleSessionDetails = (el) => {
    // localStorage.setItem("sessiondetails",{ name: "Alex" });
    navigate(`/mainpage/session-details/${el._id}`);
  };

  useEffect(() => {
    dispatch(getAllActivities("", ""));
  }, []);

  useEffect(() => {
    setsearchParams({ page: currentPage, limit: limit });
    dispatch(getAllSessions(currentPage, limit)).then((res) => {
      return true;
    });
  }, [currentPage, limit]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(getAllSessionsBydate(startDate, endDate));
  };

  const handleOpenEditSessionEditModal = (el) => {
    setIsEditModalOpen(true);
    setSingleSession(el);
  };

  const closeEditSessionEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSearchSubmitname = (e) => {
    e.preventDefault();
    dispatch(getAllSessionsByname(searchname));
  };

  const handleDelete = () => {
    axios
      .delete(`${serverUrl}/session/delete/?sessionId=${searchParams.get("id")}`,
      {
        headers: {
          Authorization: `${getLocalData("token")}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          toast.success("Session delete suucessfully", toastConfig);
          dispatch(getAllSessions(currentPage, limit)).then((res) => {
            return true;
          });
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


  return (
    <Card className="h-full w-full overflow-scroll mt-5 mb-24">
      <div className="flex justify-between items-center gap-5 mt-4 mr-3 ml-3">
        <div className="w-[70%] flex justify-start ">
          <form
            className="w-[100%] flex justify-start items-center gap-4"
            onSubmit={handleSearchSubmitname}
          >
            <div className="w-[60%]">
              <Input
                label="Search by name"
                required
                value={searchname}
                onChange={(e) => setsearchname(e.target.value)}
              />
            </div>
            <Button type="submit" variant="">
              Search
            </Button>
          </form>
          <form
            className="flex justify-start items-center gap-4"
            onSubmit={handleSearchSubmit}
          >
            <div className="w-[30%]">
              <Input
                label="Select start date"
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="w-[30%]">
              <Input
                label="Select end date"
                required
                value={endDate}
                type="date"
                // type={showPassword ? "text" : "password"}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button type="submit" variant="">
              Search
            </Button>
            <Button
              type="button"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setsearchname("");
                return dispatch(getAllSessions(currentPage, limit)).then(
                  (res) => {
                    return true;
                  }
                );
              }}
              variant=""
              disabled={!startDate && !endDate && !searchname}
            >
              Clear
            </Button>
          </form>
        </div>
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
                sessionlist?.length < limit
                  ? "text-gray-400 pointer-events-none"
                  : ""
              }`}
              onClick={() =>
                sessionlist?.length >= limit &&
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
                Session name
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Centre name
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Activity name
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Session date
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                No. of mins
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
              >
                
              </Typography>
            </th>
          </tr>
        </thead>
          
        <tbody>
          {sessionlist?.map((el, index) => {
            const isLast = index === Sessionlist?.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={el._id}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el?.name || "NA"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.cohort?.name || "NA"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.activity?.map((bl, index) => {
                      return (
                        <div key={index}>
                          {index + 1}. {bl.name}
                        </div>
                      );
                    }) || "NA"}
                    {
                      el.activity.length ? null : "NA"
                    }
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {convertDateFormat(el?.date.split("T")[0]) || "NA"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el?.numberOfMins || "NA"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    onClick={() => handleSessionDetails(el)}
                    className="text-maincolor2 text-[20px]"
                    >
                      <MdOutlineRemoveRedEye />
                  </Typography>
                </td>
                {/* <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium border w-[100px] text-center p-1 rounded-lg bg-maincolor text-white"
                  >
                    See details
                  </Typography>
                </td> */}
                <td
                  className={classes}
                  onClick={() => handleOpenEditSessionEditModal(el)}
                >
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
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
                    className="text-red-500 text-[20px]"
                    onClick={() => toggleModalDelete(el._id)}
                  >
                    <MdOutlineDeleteOutline />
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {
            sessionlist?.length == 0 ? <div className="text-center m-5">No result found!!</div> : null
          }
      <EditSeesion
        isOpen={isEditModalOPen}
        onClose={closeEditSessionEditModal}
        singleSession={singleSession}
        getAllData={()=> dispatch(getAllSessions(currentPage, limit)).then((res) => {
          return true;
        })}
      />
      <SeeDetailesSession
        isOpen={isModalOpen}
        onClose={toggleModal}
        singleSession={singleSession}
      />
       <ConfirmDeleteModal
        isOpen={isModalOpenDelete}
        onClose={() => toggleModalDelete()}
        handleDelete={handleDelete}
      />
    </Card>
  );
};

export default Sessionlist;
