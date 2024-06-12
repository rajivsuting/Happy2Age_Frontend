import React, { useRef } from "react";
import { Button, Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import SeeDeatailesEvalution from "../../Componants/SeeDeatailesEvalution";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LabelList
} from "recharts";
import { Link } from "react-router-dom";
import { cohortDataForGraph } from "./dummy";


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
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
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
  const [evalutionlist, setEvalutionlist] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cohortSelect, setCohortSelect] = useState(
    "665a11a12046aa42c1ae540c" || ""
  );
  const [sessionSelect, setSessionSelect] = useState("");
  const [getReportData, setGetReportData] = useState([]);
  const [remarks, setRemarks] = useState("");
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
    axios.get(`${serverUrl}/evaluation/all`).then((res) => {
      setEvalutionlist(res.data.message);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get(
        `${serverUrl}/report/get/?cohort=${cohortSelect}&session=${sessionSelect}`
      )
      .then((res) => {
        console.log(res);
        setEvalutionlist(res.data.message);
      });
  };

  let arr = [];

  evalutionlist?.map((el) => {
    return arr.push({
      name: el.participant.name,
      score: Number(el.grandAverage.toFixed(2)),
    });
  });

  const generatePDF = useReactToPrint({
    content: () => componantPDF.current,
    documentTitle: "Cohort report",
    onAfterPrint: () => toast.success("PDF file download successfully"),
  });

  console.log(cohortList);

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
            value={"665a11a12046aa42c1ae540c"}
            className="border px-2 py-3 rounded-md mt-3 mb-3"
            onChange={(e) => setCohortSelect(e.target.value)}
            required
            disabled
          >
            <option value="">Select a center</option>
            {cohortList?.map((el) => {
              return <option value={el._id}>{el.name}</option>;
            })}
          </select>
          <select
            name=""
            id=""
            value={sessionSelect}
            className="border px-2 py-3 rounded-md mt-3 mb-3"
            onChange={(e) => setSessionSelect(e.target.value)}
            required
            disabled
          >
            <option value="">Select a session</option>
            {sessionlist?.map((el) => {
              return <option value={el._id}>{el.name}</option>;
            })}
          </select>
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
              Total sessions : <b>{cohortDataForGraph.TotalnumberOfSessions}</b>
            </div>
            <div className="w-[50%] font-normal">
              Attendence : <b>{cohortDataForGraph.attendence}</b>
            </div>
          </div>
        </div>
        {/* <Card className="h-full w-full overflow-scroll mt-5 mb-24">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Participant
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
                    Center
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Grand average
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {evalutionlist?.map((el, index) => {
                const isLast = index === evalutionlist?.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={el._id}>
                    <td className={classes}>
                      <Link
                    to={`/mainpage/participant-report-details/${el.participant?._id}`}
                  >
                    {" "}
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {el.participant?.name}
                      </Typography>
                      </Link>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {el?.session?.name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {el?.cohort?.name}
                      </Typography>
                    </td>
                    
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {el.grandAverage.toFixed(2)}
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card> */}
        <div className="w-[100%] flex justify-center items-center m-auto mt-12">
        <BarChart width={1100} height={500} data={cohortDataForGraph.graphDetails}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis minTickGap={1} dataKey="domainName" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="average" fill="#4A3AFF" barSize={20} radius={[5, 5, 0, 0]} >
          <LabelList dataKey="numberOfSessions" position="top" />
        </Bar>
      </BarChart>
        </div>
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
          <Button>Export to excel</Button>
          <Button onClick={generatePDF}>Generate PDF</Button>
        </div>
      </div>
    </div>
  );
};

export default Cohortreport;
