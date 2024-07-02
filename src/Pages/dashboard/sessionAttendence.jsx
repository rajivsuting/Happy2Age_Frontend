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
import SeeDeatailsSessionAttendence from "../../Componants/SeeDeatailsSessionAttendence";
import { getLocalData } from "../../Utils/localStorage";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { getAllCohorts } from "../../Redux/AllListReducer/action";

export const SessionAttendence = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allAttendence, setAllAttendence] = useState([]);
  const [singleSession, setSingleSession] = useState({});
  const [searchParams, setsearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1);
  const [limit, setLimit] = useState(searchParams.get("limit") || 10); // default limit
  const [searchResult, setSearchResult] = useState("");
  const [openAttendenceModal, setOpenAttendenceModal] = useState(false);
  const [singleAttentence, setSingleAttence] = useState({});
  const navigate = useNavigate();
  const toggleModal = (el) => {
    setIsModalOpen(!isModalOpen);
    setSingleSession(el);
  };



  const { cohortList, partcipantList } = useSelector((state) => {
    return {
      cohortList: state.AllListReducer.cohortList,
      partcipantList: state.AllListReducer.partcipantList,
    };
  });

  useEffect(()=>{
    dispatch(getAllCohorts("",""))
  },[])

  const handleSessionDetails = (el) => {
    setOpenAttendenceModal(true);
    setSingleAttence(el);
  };

  const closeSessionDetails = () => {
    setOpenAttendenceModal(false);
  };

  //  useEffect(() => {
  //    dispatch(getAllParticipants(currentPage, limit)).then((res) => {
  //      return true;
  //     });
  //   }, [currentPage, limit]);

  useEffect(() => {
    setsearchParams({ page: currentPage, limit: limit });
    axios
      .get(
        `${serverUrl}/session/attendance/?page=${currentPage}&limit=${limit}`,
        {
          
        }
      )
      .then((res) => {
        console.log(res)
        setAllAttendence(res.data.data);
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
    axios
    .get(
      `${serverUrl}/session/attendencecohort/${searchResult}`,
      {
        
      }
    )
    .then((res) => {
      console.log(res)
      setAllAttendence(res.data.data);
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
        <div className="w-[50%]">
          <form
            className="flex justify-start items-center gap-5"
            onSubmit={handleSearchSubmit}
          >
            <div className="w-[100%]">
            <select
            id=""
            name="searchResult"
            value={searchResult}
            onChange={(e)=>setSearchResult(e.target.value)}
            className="borderm w-[100%] px-2 py-2 rounded-md text-gray-600 border border-gray-600"
            required
          >
            <option value="">Select center</option>;
            {cohortList.map((el) => {
              return (
                <option key={el._id} value={el._id}>
                  {el.name}
                </option>
              );
            })}
          </select>
            </div>
            <Button type="submit" variant="">
              Search
            </Button>
            <Button
              type="button"
              onClick={() => {
                  setSearchResult("")
                 return axios
                 .get(
                   `${serverUrl}/session/attendance/?page=${currentPage}&limit=${limit}`,
                   {
                    //  headers: {
                    //    Authorization: `${getLocalData("token")}`,
                    //  },
                   }
                 )
                 .then((res) => {
                   console.log(res)
                   setAllAttendence(res.data.data);
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
                allAttendence?.length < limit
                  ? "text-gray-400 pointer-events-none"
                  : ""
              }`}
              onClick={() =>
                allAttendence?.length >= limit &&
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
                Participant name
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Present
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Absent
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Total attendence
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Total attendence
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {allAttendence?.map((el, index) => {
            const isLast = index === allAttendence?.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={el._id}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el?.participantName}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.sessions.filter((pl) => pl.present).length}
                  </Typography>
                </td>

                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.sessions.filter((pl) => !pl.present).length}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.sessions.length}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    onClick={() => handleSessionDetails(el)}
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
      <SeeDeatailsSessionAttendence
        isOpen={openAttendenceModal}
        onClose={closeSessionDetails}
        singleSession={singleAttentence}
      />
    </Card>
  );
};

export default SessionAttendence;

// import React, { useState } from 'react';
// import ReactApexChart from 'react-apexcharts';

// export const Sessionlist = () => {
//   const arr = [
//     { domain: "abc", score: 1, participant: "Hilton" },
//     { domain: "abc", score: 2, participant: "rajiv" },
//     { domain: "eefef", score: 3, participant: "rajiv" },
//     { domain: "eefef", score: 4, participant: "Hilton" },
//     { domain: "fbfgb", score: 3, participant: "rajiv" },
//     { domain: "fbfgb", score: 4, participant: "Hilton" }
//   ];

//   // Extract unique participants and domains
//   const participants = [...new Set(arr.map(item => item.participant))];
//   const domains = [...new Set(arr.map(item => item.domain))];

//   // Transform data into heatmap format
//   const heatmapData = domains.map(domain => {
//     return {
//       name: domain,
//       data: participants.map(participant => {
//         const item = arr.find(el => el.domain === domain && el.participant === participant);
//         return {
//           x: participant,
//           y: item ? item.score : 0 // Default to 0 if no score is found
//         };
//       })
//     };
//   });

//   const [series, setSeries] = useState(heatmapData);

//   const [options, setOptions] = useState({
//     chart: {
//       height: 450,
//       type: 'heatmap',
//     },
//     dataLabels: {
//       enabled: false
//     },
//     colors: ["#008FFB"],
//     xaxis: {
//       type: 'category',
//       categories: participants
//     },
//     yaxis: {
//       type: 'category',
//       categories: domains
//     },
//     title: {
//       text: 'HeatMap Chart (Score in the middle boxes)'
//     },
//     grid: {
//       padding: {
//         right: 20
//       }
//     }
//   });

//   return (
//     <div>
//       <div id="chart">
//         <ReactApexChart options={options} series={series} type="heatmap" height={450} />
//       </div>
//       <div id="html-dist"></div>
//     </div>
//   );
// };

// export default sessionAttendence;
