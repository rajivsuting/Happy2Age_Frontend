import { Button, Card, Input, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import EditActivity from "../../Componants/EditActivity";
import ConfirmDeleteModal from "../../Componants/ConfirmDeleteModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { getAllActivities } from "../../Redux/AllListReducer/action";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { getLocalData } from "../../Utils/localStorage";

export const ActivityList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [singleActivity, setSingleActivity] = useState({});
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [searchParams, setsearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1);
  const [limit, setLimit] = useState(searchParams.get("limit") || 10); // default limit
  const [searchResult, setSearchResult] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activityList } = useSelector((state) => {
    return {
      activityList: state.AllListReducer.activityList,
    };
  });

  const toggleModalDelete = (id) => {
    setsearchParams({ id });
    setIsModalOpenDelete(!isModalOpenDelete);
  };

  const handleDelete = () => {
    axios
      .delete(`${serverUrl}/activity/delete/${searchParams.get("id")}`, {
        
      })
      .then((res) => {
        if (res.status == 200) {
          toast.success("Activity delete suucessfully", toastConfig);
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

  const toggleModal = (el) => {
    setsearchParams({ id: el._id });
    setIsModalOpen(!isModalOpen);
    setSingleActivity(el);
  };

  function getAllData() {
    return dispatch(getAllActivities(currentPage, limit))
      .then((res) => {
        return true;
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
  }

  useEffect(() => {
    // setSearchParams({ page: currentPage, limit: limit });
    dispatch(getAllActivities(currentPage, limit))
      .then((res) => {
        return true;
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
  }, [currentPage, limit]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // dispatch(getParticipantsByName(searchResult))
  };

  return (
    <Card className="h-full w-full overflow-scroll mt-5 mb-24">
      <div className="flex justify-end items-center gap-5 mt-4 mr-3 ml-3">
        {/* <div className="w-[50%]">
          <form
            className="flex justify-start items-center gap-5"
            onSubmit={handleSearchSubmit}
          >
            <div className="w-[50%]">
              <Input
                label="Search activity name..."
                name="password"
                // type="search"
                required
                value={searchResult}
                // type={showPassword ? "text" : "password"}
                onChange={(e) => setSearchResult(e.target.value)}
              />
            </div>
            <Button type="submit" variant="">
              Search
            </Button>
            <Button
              type="button"
              onClick={() => {
                //   setSearchResult("")
                //  return  dispatch(getAllParticipants(currentPage, limit)).then((res) => {
                //     return true;
                //   });
              }}
              variant=""
              disabled={!searchResult}
            >
              Clear
            </Button>
          </form>
        </div> */}
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
                activityList?.length < limit
                  ? "text-gray-400 pointer-events-none"
                  : ""
              }`}
              onClick={() =>
                activityList?.length >= limit &&
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
      {/* <div className="flex justify-between items-center gap-5 m-3">
        <div className="w-[50%]">
          <form className="flex justify-start items-center gap-5">
            <div className="w-[50%]">
              <Input
                label="Search by domain name..."
                name="password"
                // type="search"
                required
                // value={searchResult}
                // type={showPassword ? "text" : "password"}
                // onChange={(e) => setSearchResult(e.target.value)}
              />
            </div>
            <Button type="submit" variant="">
              Search
            </Button>
            <Button type="button" variant="">
              Clear
            </Button>
          </form>
        </div>
      </div> */}
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
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
                Description
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >References</Typography>
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
          {activityList?.map((el, index) => {
            const isLast = index === activityList.length - 1;
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
                <td className={`${classes} w-[400px]`}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.description.substring(0, 20).length <
                    el.description.length
                      ? el.description.substring(0, 20) + "..."
                      : el.description || "-"}
                  </Typography>
                </td>
                <td className={`${classes} w-[400px]`}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.references.substring(0, 20).length <
                    el.references.length
                      ? el.references.substring(0, 20) + "..."
                      : el.references || "-"}
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
      <EditActivity
        isOpen={isModalOpen}
        onClose={toggleModal}
        singleActivity={singleActivity}
        getAllData={getAllData}
      />
      <ConfirmDeleteModal
        isOpen={isModalOpenDelete}
        onClose={() => toggleModalDelete()}
        handleDelete={handleDelete}
      />
    </Card>
  );
};

export default ActivityList;
