import React, { useRef } from "react";
import { Button, Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import SeeDeatailesEvalution from "../../Componants/SeeDeatailesEvalution";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LabelList,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { getAllParticipants } from "../../Redux/AllListReducer/action";
import * as XLSX from "xlsx";
import { getLocalData } from "../../Utils/localStorage";

// import {
//   ComposedChart,
//   Bar,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const data = [
//   { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
//   { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
//   { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
//   { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
//   { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
//   { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
//   { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
// ];

const darkColors = [
  "#17a589",
  "#0669d3",
  "#2ce2a2",
  "#dc3545",
  "#027bff",
  "#d946ef",
  "#4B0082", // Indigo
  "#8B00FF", // Violet
  "#22d172", // Bright Red-Orange
  "#b8a495", // Bright Yellow
  "#fbc7c8", // Bright Orange
  "#93aafd", // Bright Light Green
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const barData = payload.find((p) => p.dataKey === "average");
    const lineData = payload.find((p) => p.dataKey === "cohortAverage");

    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p className="label">{`Domain: ${label}`}</p>
        {barData && <p className="intro">{`Average: ${barData.value}`}</p>}
        {lineData && (
          <p className="desc">{`Chort Average: ${lineData.value.toFixed(2)}`}</p>
        )}
        {barData && (
          <p className="desc">{`Number of Sessions: ${barData.payload.numberOfSessions}`}</p>
        )}
      </div>
    );
  }

  return null;
};

const CustomBar = (props) => {
  const { x, y, width, height, fill } = props;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      className="custom-bar" // Add your custom CSS class here
      fill={fill}
    />
  );
};

export const ParticipantReport = () => {
  const [evalutionlist, setEvalutionlist] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allParticipants, setAllParticipants] = useState([]);
  const [singleParticipant, setSingleParticipant] = useState("");
  const [startDate, setStartdate] = useState("");
  const [happinessScore,setHappinessScore] = useState([])
  const [endDate, setEnddate] = useState("");
  const [sessionSelect, setSessionSelect] = useState("");
  const [getReportData, setGetReportData] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [resultnlist, setResultlist] = useState({});
const dispatch = useDispatch();
const navigate = useNavigate();
  const componantPDF = useRef();

  const [singleEvalustion, setSingleEvaluation] = useState({});
  const toggleModal = (el) => {
    setIsModalOpen(!isModalOpen);
    setSingleEvaluation(el);
  };

  const { cohortList, sessionlist } = useSelector((state) => {
    return {
      cohortList: state.AllListReducer.cohortList,
      sessionlist: state.AllListReducer.sessionlist,
    };
  });

  useEffect(() => {
      dispatch(getAllParticipants("",""));
    axios.get(`${serverUrl}/evaluation/all`,{
        
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
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get(`${serverUrl}/oxford/${singleParticipant}`,{
        
      })
    .then((res) => {
      // console.log(res)
      setHappinessScore(res.data.message);
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
    axios
      .get(
        `${serverUrl}/report/${singleParticipant}/?&start=${startDate}&end=${endDate}`,{
        
      }
      )
      .then((res) => {
        console.log(res);
        setResultlist(res.data.report);
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
  // console.log(resultnlist?.graphDetails);

  let filteredData = resultnlist?.graphDetails?.map((el) => ({
    "Domain name": el.domainName,
    "Cohort average": el.cohortAverage,
    "No. of sessions": el.numberOfSessions,
    "Average": el.average,
  }));

  let participantNameforExcel = allParticipants?.filter((el) =>el._id == singleParticipant)[0]?.name

  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredData);

    XLSX.utils.book_append_sheet(wb, ws, "Participant report");

    XLSX.writeFile(wb, `${participantNameforExcel}-${startDate}-${endDate}.xlsx`);
    toast.success("Excel file download successfully",toastConfig);
  };

  const generatePDF = useReactToPrint({
    content: () => componantPDF.current,
    documentTitle: "Cohort report",
    onAfterPrint: () => toast.success("PDF file download successfully",toastConfig),
  });

  useEffect(() => {
    axios
      .get(`${serverUrl}/participant/all`,{
        
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


  function calculateAge(birthdateStr) {
    const birthdate = new Date(birthdateStr);
    const today = new Date();

    let years = today.getFullYear() - birthdate.getFullYear();
    let months = today.getMonth() - birthdate.getMonth();
    let days = today.getDate() - birthdate.getDate();

    // Adjust for negative days and months
    if (days < 0) {
      months--;
      const prevMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        birthdate.getDate()
      );
      days = Math.floor((today - prevMonth) / (1000 * 60 * 60 * 24));
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} years, ${months} months, ${days} days`;
  }

  return (
    <div className="mb-24">
      <div className="flex justify-between items-center m-3">
        <form
          onSubmit={handleSubmit}
          className="flex justify-center items-center gap-3"
        >
          <select
            className="border w-[30%] px-2 py-2 rounded-md text-gray-600 border border-gray-600"
            value={singleParticipant}
            onChange={(e) => setSingleParticipant(e.target.value)}
            required
          >
            <option value="">Select Participant</option>
            {allParticipants?.map((el, index) => (
              <option key={index} value={el._id}>
                {el.name}
              </option>
            ))}
          </select>
          <div className="ml-10">From</div>
          <input
            name=""
            id=""
            type="date"
            value={startDate}
            className="border px-2 py-3 rounded-md mt-3 mb-3"
            onChange={(e) => setStartdate(e.target.value)}
            required
          />
          <div>To</div>
          <input
            name=""
            id=""
            type="date"
            value={endDate}
            className="border px-2 py-3 rounded-md mt-3 mb-3"
            onChange={(e) => setEnddate(e.target.value)}
            required
          />
          <Button type="submit">Search</Button>
        </form>
        <Button onClick={generatePDF}>Download pdf</Button>
      </div>
      <div
        ref={componantPDF}
        style={{ width: "90%", margin: "auto", marginTop: "20px" }}
        className="border border-black rounded-xl p-8 bg-white"
      >
        <div className="flex justify-center items-center">
          <img
            className="w-[200px] rounded-xl"
            src="/img/Happy-2age-logo-1-1.png"
            alt=""
          />
        </div>
        <div className="text-center">
          <div className="font-bold mb-5 mt-5 text-[20px]">
            Report 1: Individual Member Observations
          </div>
          <div className="font-bold mb-5 mt-5 text-[20px]">
            Our Journey Together
          </div>
          <div className="w-[70%] m-auto mt-5">
            (This document is based on our basic observations about your
            participation and engagements made in our sessions which is held
            <input className="border-b w-[50px] ml-2 mr-2 text-center border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />{" "}
            in a week for{" "}
            <input className="border-b w-[50px] ml-2 mr-2 text-center border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />{" "}
            hours. It is limited to the progress made by members in various
            domains that we have chosen while designing activities.)
          </div>
        </div>
        <div className="w-[100%] m-auto grid grid-cols-2 border rounded-xl p-8 mt-5">
          <div className="mb-3">
            Name :
            <input
              value={resultnlist?.participantDetails?.name || ""}
              className="border-b w-[250px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />
          </div>
          <div>
            Age :
            <input
              value={calculateAge(resultnlist?.participantDetails?.dob || "")}
              className="border-b w-[250px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />
          </div>
          <div className="mb-3">
            Address :
            <input
              value={`${
                resultnlist?.participantDetails?.address?.addressLine || ""
              }, ${resultnlist?.participantDetails?.address?.city || ""}, ${
                resultnlist?.participantDetails?.address?.state || ""
              }, ${resultnlist?.participantDetails?.address?.pincode || ""}`}
              className="border-b w-[330px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />
          </div>
          <div>
            Mobile No :
            <input
              value={
                resultnlist?.participantDetails?.emergencyContact?.phone || ""
              }
              className="border-b w-[100px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />
          </div>
          <div className="mb-3">
            Date From :
            <input
              value={startDate || ""}
              className="border-b w-[100px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />
            To :
            <input
              value={endDate || ""}
              className="border-b w-[100px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />
          </div>
          <div>
            Attendance :
            <input
              value={resultnlist?.attendance || 0}
              className="border-b w-[50px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />
            out of :
            <input
              value={resultnlist?.attendedSessions || 0}
              className="border-b w-[50px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-5 mt-5 ">
          <b className="text-[18px]">Oxford happiness score: {(happinessScore[0]?.happinessScore)?.toFixed(2)}</b>
        </div>
        <div className="mb-5 mt-5 ">
          <b className="text-[18px]">Brief Background:</b>{" "}
          {resultnlist?.participantDetails?.briefBackground}
        </div>
        <div>
          <b className="text-[18px]">Graph (Bar):</b> On various Domains ratings
          against the aggregate rating of the Cohort (Centre)
        </div>

        <div className="w-[100%] flex justify-center items-center m-auto mt-12">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={resultnlist?.graphDetails}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                minTickGap={1}
                dataKey="domainName"
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 7]}/>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="average"
                fill="#4A3AFF"
                barSize={20}
                radius={[5, 5, 0, 0]}
              >
                <LabelList dataKey="numberOfSessions" position="top" />
              </Bar>

              <Line
                type="monotone"
                dataKey="cohortAverage"
                stroke="green"
                activeDot={{ r: 8 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          {/* <BarChart width={1100} height={500} data={resultnlist.graphDetails}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              minTickGap={1}
              dataKey="domainName"
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="average"
              fill="#4A3AFF"
              barSize={20}
              radius={[5, 5, 0, 0]}
            >
              <LabelList dataKey="numberOfSessions" position="top" />
            </Bar>
      
              <Line
                type="monotone"
                dataKey="cohortaverage"
                stroke="green"
                activeDot={{ r: 8 }}
              />
   
          </BarChart> */}
        </div>
        <div className="mb-5 mt-5">
          <b className=" text-[18px]">Overall Observations:</b> {remarks}
        </div>
        <div className="mb-5 mt-5">
          <b className=" text-[18px]">Joint Plan:</b>
          <br />{" "}
          <textarea
            className=" p-2 pt-2 placeholder:pl-2 placeholder:pt-2 mt-5 border-2 rounded-md w-[100%] border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            name=""
            id=""
          ></textarea>
        </div>
        <div className="mb-5 mt-5">
          <b>Date:</b>{" "}
          <input className="border-b w-[100px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />
        </div>
        <div className="mb-5 mt-5">
          <b>Name:</b>{" "}
          <input className="border-b w-[250px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />
        </div>
        <div className="mb-5 mt-5">
          <b>Signature:</b>{" "}
          <input className="border-b w-[250px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />
          (with Stamp)
        </div>
        <div className="mb-5 mt-5">
          <b>Mobile:</b>{" "}
          <input className="border-b w-[120px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />
        </div>
        <div className="mt-10">
          We are here to engage with you to spread joy and provide meaningful
          involvement.{" "}
        </div>
        <div className="mt-5">
          We stand for Trust, Building Positive Relationship & Spreading Joy and
          Going that Extra Mile.{" "}
        </div>
      </div>
      <div className="w-[90%] m-auto">
        <textarea
          className="w-[100%] h-[80px] mt-5 shadow rounded-xl p-2 pt-4 outline-none placeholder:pl-2 placeholder:pt-2"
          placeholder="Write remarks..."
          name=""
          id=""
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <div className="flex justify-end gap-5 mt-5">
          <Button onClick={handleExportToExcel}>Export to excel</Button>
          <Button onClick={generatePDF}>Generate PDF</Button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantReport;
