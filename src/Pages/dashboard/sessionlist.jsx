import { Button, Card, Input, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import SeeDetailesSession from "../../Componants/SeeDetailesSession";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { getAllActivities, getAllSessions } from "../../Redux/AllListReducer/action";

export const Sessionlist = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [singleSession, setSingleSession] = useState({});
  const [searchParams, setsearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1);
  const [limit, setLimit] = useState(searchParams.get("limit") || 10); // default limit
  const [searchResult, setSearchResult] = useState("")
  const navigate = useNavigate();
  const toggleModal = (el) => {
    setIsModalOpen(!isModalOpen);
    setSingleSession(el);
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

  useEffect(()=>{
    dispatch(getAllActivities("",""))
  },[])

 useEffect(() => {
  setsearchParams({ page: currentPage, limit: limit });
    dispatch(getAllSessions(currentPage, limit)).then((res) => {
      return true;
    });
  }, [currentPage, limit]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
 const handleSearchSubmit = (e)=>{
    e.preventDefault();
    // dispatch(getParticipantsByName(searchResult))
      }  

  return (
    <Card className="h-full w-full overflow-scroll mt-5 mb-24">
      <div className="flex justify-end items-center gap-5 mt-4 mr-3 ml-3">
        {/* <div className="w-[50%]">
          <form className="flex justify-start items-center gap-5" onSubmit={handleSearchSubmit}>
            <div className="w-[50%]">
            <Input
              label="Search session name..."
              name="password"
              // type="search"
              required
              value={searchResult}
              // type={showPassword ? "text" : "password"}
              onChange={(e) => setSearchResult(e.target.value)}
            />

            </div>
            <Button type="submit" variant="">Search</Button>
            <Button type="button" onClick={()=>{
            //   setSearchResult("")
            //  return  dispatch(getAllParticipants(currentPage, limit)).then((res) => {
            //     return true;
            //   });
            }} variant="" disabled={!searchResult}>Clear</Button>
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
                Cohort name
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
                No. of hours
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              ></Typography>
            </th>
            {/* <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
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
            </th> */}
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
                    {el?.name}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.cohort?.name || "-"}
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
                    }) || "-"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el?.date.split("T")[0] || "-"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el?.numberOfHours || "-"}
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
                {/* <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="text-maincolor2 text-[20px]"
                  >
                    <CiEdit />
                  </Typography>
                </td> */}
                {/* <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="text-red-500 text-[20px]"
                  >
                    <MdOutlineDeleteOutline />
                  </Typography>
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
      <SeeDetailesSession
        isOpen={isModalOpen}
        onClose={toggleModal}
        singleSession={singleSession}
      />
    </Card>
  );
};

export default Sessionlist;



