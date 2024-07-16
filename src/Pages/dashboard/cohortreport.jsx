import React, { useRef } from "react";
import { Button, Card, Typography } from "@material-tailwind/react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import SeeDeatailesEvalution from "../../Componants/SeeDeatailesEvalution";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
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
} from "recharts";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { getAllCohorts } from "../../Redux/AllListReducer/action";
import { getLocalData } from "../../Utils/localStorage";
import { useNavigate } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import Heatmap from "../../Componants/Heatmap";
// import { Link } from "react-router-dom";
// import { resultnlist } from "./dummy";

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
        <p className="intro">{`Average: ${payload[0].value}`}</p>
        <p className="desc">{`Number of Sessions: ${payload[0].payload.numberOfSessions}`}</p>
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

export const Cohortreport = () => {
  const [resultnlist, setResultlist] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cohortSelect, setCohortSelect] = useState("");
  const [startDate, setStartdate] = useState("");
  const [endDate, setEnddate] = useState("");
  const [sessionSelect, setSessionSelect] = useState("");
  const [getReportData, setGetReportData] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [observation, setObservation] = useState("");
  const componantPDF = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    dispatch(getAllCohorts("", ""));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get(
        `${serverUrl}/report/get/?cohort=${cohortSelect}&start=${startDate}&end=${endDate}`
      )
      .then((res) => {
        console.log(res);
        setResultlist(res.data.message);
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

  // let arr = [];

  // evalutionlist?.map((el) => {
  //   return arr.push({
  //     name: el.participant.name,
  //     score: Number(el.grandAverage.toFixed(2)),
  //   });
  // });

  // console.log(resultnlist);

  let filteredData = resultnlist?.graphDetails?.map((el) => ({
    "Domain name": el.domainName,
    "Cohort average": el.centerAverage,
    "No. of sessions": el.numberOfSessions,
  }));

  let cohortNameforExcel = cohortList?.filter((el) => el._id == cohortSelect)[0]
    ?.name;

  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredData);

    XLSX.utils.book_append_sheet(wb, ws, "Center report");

    XLSX.writeFile(wb, `${cohortNameforExcel}-${startDate}-${endDate}.xlsx`);
    toast.success("Excel file download successfully", toastConfig);
  };

  // console.log(cohortList?.filter((el) =>el._id == cohortSelect)[0]?.name);

  const generatePDF = useReactToPrint({
    content: () => componantPDF.current,
    documentTitle: "Center report",
    onAfterPrint: () =>
      toast.success("PDF file download successfully", toastConfig),
  });

  // heat map----------------------

  // console.log(resultnlist?.detailedScores);

  return (
    <div className="mb-24">
      <div className="flex justify-between items-center m-3">
        <form
          onSubmit={handleSubmit}
          className="flex justify-center items-center gap-3"
        >
          <select
            name=""
            id=""
            value={cohortSelect}
            className="border px-2 py-3 rounded-md mt-3 mb-3"
            onChange={(e) => setCohortSelect(e.target.value)}
            required
          >
            <option value="">Select a center</option>
            {cohortList?.map((el) => {
              return <option value={el._id}>{el.name}</option>;
            })}
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
            Centre Report{" "}
            {cohortList?.filter((el) => el._id == cohortSelect)[0]?.name ||
              "Unknown"}
          </div>
          <div className="font-bold mb-5 mt-5 text-[20px]">
            Journey Together
          </div>
          <div className="w-[70%] m-auto mt-5">
            (This document is based on our basic observations about member’s
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
            Name of the Centre:
            <input
              value={cohortList?.filter((el) => el._id == cohortSelect)[0]?.name ||
                "Unknown"}
              className="border-b w-[250px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />
          </div>
          <div>
            Total Participants:
            <input
              value={
                cohortList?.filter((el) => el._id == cohortSelect)[0]
                  ?.participants?.length || "0"
              }
              className="border-b w-[250px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
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
        </div>
        <div className="mb-5 mt-5 ">
          <b className="text-[18px]">Overall Remark:{remarks}</b>{" "}
        </div>
        <div>
          <b className="text-[18px]">Graph of Score </b> (Individual Score
          against the Group aggregate Score for each Domain)
        </div>
        {/* <div>
          <div id="chart">
            <ReactApexChart
              options={options}
              series={series}
              type="heatmap"
              height={450}
            />
          </div>
          <div id="html-dist"></div>
        </div> */}
        <div className="w-[100%] flex justify-center items-center m-auto mt-12">
          <BarChart width={1100} height={500} data={resultnlist?.graphDetails}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              minTickGap={1}
              dataKey="domainName"
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 7]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="centerAverage"
              fill="#4A3AFF"
              barSize={20}
              radius={[5, 5, 0, 0]}
            >
              <LabelList dataKey="numberOfSessions" position="top" />
            </Bar>
          </BarChart>
        </div>
        <div className="w-[100%] font-normal text-end">
          Center average : <b>{resultnlist?.averageForCohort}</b>
        </div>

        <div>
          <b className="text-[18px]">Graph of Score </b> (overall score for each
          member across Domains)
        </div>
        <Heatmap arr={resultnlist?.participantDomainScores} />
        <div className="mt-5">
          <i>Overall Observations: {observation}</i>
        </div>
        <div className="mt-10">
          We are happy to have collaborated with you and look forward to
          continuing our engagements with your Society’s Senior Citizen Members
          in spreading joy and providing meaningful involvement.
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
          We stand for Trust, Building Positive Relationship & Spreading Joy and
          Going that Extra Mile.
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
        <textarea
          className="w-[100%] h-[80px] mt-5 shadow rounded-xl p-2 pt-4 outline-none placeholder:pl-2 placeholder:pt-2"
          placeholder="Write observation..."
          name=""
          id=""
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
        />
        <div className="flex justify-end gap-5 mt-5">
          <Button onClick={handleExportToExcel}>Export to excel</Button>
          <Button onClick={generatePDF}>Generate PDF</Button>
        </div>
      </div>
    </div>
  );
};

export default Cohortreport;
