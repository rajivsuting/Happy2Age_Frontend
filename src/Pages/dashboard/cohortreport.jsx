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
        `${serverUrl}/report/get/?cohort=${cohortSelect}&start=${startDate}&end=${endDate}`,
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
    "Cohort average": el.cohortAverage,
    "No. of sessions": el.numberOfSessions,
    Average: el.average,
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
    documentTitle: "Cohort report",
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
        <div className="flex justify-between items-center">
          <div className="text-[30px] font-bold text-center">Report card</div>
          <img
            className="w-[200px] rounded-xl"
            src="/img/Happy-2age-logo-1-1.png"
            alt=""
          />
        </div>
        <div className="w-[100%] m-auto bg-white shadow rounded-xl px-8 py-4 mt-5">
          <div className="">
            <div className="w-[50%] font-normal">
              Center :{" "}
              <b>
                {cohortList?.filter((el) => el._id == cohortSelect)[0]?.name ||
                  "Unknown"}
              </b>
              {/* <b>{filterParticipant?.name}</b> */}
            </div>
            <div className="w-[50%] font-normal">
              No. of participant :{" "}
              <b>
                {cohortList?.filter((el) => el._id == cohortSelect)[0]
                  ?.participants?.length || "0"}
              </b>
              {/* <b>{filterParticipant?.name}</b> */}
            </div>
            <div className="w-[50%] font-normal">
              Total sessions : <b>{resultnlist?.totalNumberOfSessions}</b>
            </div>
            <div className="w-[50%] font-normal">
              Attendence : <b>{resultnlist?.totalAttendance}</b>
            </div>
            
          </div>
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
              dataKey="cohortAverage"
              fill="#4A3AFF"
              barSize={20}
              radius={[5, 5, 0, 0]}
            >
              <LabelList dataKey="numberOfSessions" position="top" />
            </Bar>
          </BarChart>
        </div>
        <div className="w-[100%] font-normal text-end">
              Cohort average : <b>{resultnlist?.averageForCohort}</b>
            </div>
        <Heatmap arr={resultnlist?.detailedScores}/>
        <div className="mt-5">
          <i>Remarks : {remarks}</i>
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

export default Cohortreport;
