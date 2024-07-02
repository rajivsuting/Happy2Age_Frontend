import { Button, Card, Input, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import SeeDetailsCohort from "../../Componants/SeeDetailsCohort";
import EditCohort from "../../Componants/EditCohort";
import ConfirmDeleteModal from "../../Componants/ConfirmDeleteModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { getAllCohorts, getCohortsByName } from "../../Redux/AllListReducer/action";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { getLocalData } from "../../Utils/localStorage";

export const Cohortlist = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [searchParams, setsearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1);
  const [limit, setLimit] = useState(searchParams.get("limit") || 10); // default limit
  const [searchResult, setSearchResult] = useState("");
  const [singleCohort, setSingleCohort] = useState({});
  const dispatch = useDispatch();
const navigate = useNavigate();
  const { cohortList } = useSelector((state) => {
    return {
      cohortList: state.AllListReducer.cohortList,
    };
  });


  useEffect(() => {
    // setSearchParams({ page: currentPage, limit: limit });
    dispatch(getAllCohorts(currentPage, limit)).then((res) => {
      return true;
    });
  }, [currentPage, limit]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleModal = (el) => {
    setIsModalOpen(!isModalOpen);
    setSingleCohort(el);
  };

  const toggleModalEdit = (el) => {
    setsearchParams({ id: el._id });
    setIsModalOpenEdit(!isModalOpenEdit);
    setSingleCohort(el);
  };

  const toggleModalDelete = (id) => {
    setsearchParams({ id });
    setIsModalOpenDelete(!isModalOpenDelete);
  };

  const handleDelete = () => {
    axios
      .delete(`${serverUrl}/cohort/delete/${searchParams.get("id")}`,{
        
      })
      .then((res) => {
        if (res.status == 200) {
          toast.success("Cohort delete suucessfully", toastConfig);
          dispatch(getAllCohorts("","")).then((res) => {});
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(getCohortsByName(searchResult)).then((res)=>{
      console.log(res)
    }).catch((err)=>{
      console.log(err)
    })
  };
  return (
    <Card className="h-full w-full overflow-scroll mt-5 mb-24">
      <div className="flex justify-between items-center gap-5 mt-4 mr-3 ml-3">
        <div className="w-[50%]">
          <form
            className="flex justify-start items-center gap-5"
            onSubmit={handleSearchSubmit}
          >
            <div className="w-[50%]">
              <Input
                label="Search cohort name..."
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
                  setSearchResult("")
                 return  dispatch(getAllCohorts(currentPage, limit)).then((res) => {
                    return true;
                  });
              }}
              variant=""
              disabled={!searchResult}
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
                cohortList?.length < limit
                  ? "text-gray-400 pointer-events-none"
                  : ""
              }`}
              onClick={() =>
                cohortList?.length >= limit && handlePageChange(currentPage + 1)
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
                Center name
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
                      return el.name.substring(0, 5).length < el.name.length
                        ? el.name.substring(0, 5) + "... ,"
                        : el.name || "-";
                    })}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    onClick={() => toggleModal(el)}
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
                    onClick={() => toggleModalEdit(el)}
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
      <SeeDetailsCohort
        isOpen={isModalOpen}
        onClose={toggleModal}
        singleCohort={singleCohort}
      />
      <EditCohort
        isOpen={isModalOpenEdit}
        onClose={toggleModalEdit}
        singleCohort={singleCohort}
        getAllCohorts={() => dispatch(getAllCohorts("","")).then((res) => {})}
      />
      <ConfirmDeleteModal
        isOpen={isModalOpenDelete}
        onClose={toggleModalDelete}
        handleDelete={handleDelete}
      />
    </Card>
  );
};

export default Cohortlist;
