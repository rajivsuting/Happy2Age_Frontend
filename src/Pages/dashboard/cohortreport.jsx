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
} from "recharts";
import { Link } from "react-router-dom";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Legend,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

export const Cohortreport = () => {
  const [evalutionlist, setEvalutionlist] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cohortSelect, setCohortSelect] = useState("");
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
            <option value="">Select a cohort</option>
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
          <div className="flex justify-between m-auto gap-10">
            <div className="w-[50%] font-normal">
              Cohort :{" "}
              <b>
                {cohortList?.filter((el) => el._id == cohortSelect)[0]?.name ||
                  "Unknown"}
              </b>
              {/* <b>{filterParticipant?.name}</b> */}
            </div>
            <div className="w-[50%] font-normal">
              Session :{" "}
              <b>
                {sessionlist?.filter((el) => el._id == sessionSelect)[0]
                  ?.name || "Unknown"}
              </b>
            </div>
          </div>
        </div>
        <Card className="h-full w-full overflow-scroll mt-5 mb-24">
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
                    Cohort
                  </Typography>
                </th>
                {/* <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Activity
              </Typography>
            </th> */}
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
                {/* <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
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
            </th> */}
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
                      {/* <Link
                    to={`/mainpage/cohort-report-details/${el.participant?._id}`}
                  >
                    {" "} */}
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {el.participant?.name}
                      </Typography>
                      {/* </Link> */}
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
                    {/* <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.activity?.name}
                  </Typography>
                </td> */}
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {el.grandAverage.toFixed(2)}
                      </Typography>
                    </td>
                    {/* <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    onClick={() => toggleModal(el)}
                    className="font-medium border w-[100px] text-center p-1 rounded-lg bg-maincolor text-white"
                  >
                    See deatails
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
                  className="text-maincolor2 text-[20px]"
                >
                  <MdOutlineDeleteOutline />
                </Typography>
              </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
        <div className="w-[100%] flex justify-center items-center m-auto mt-12">
        <BarChart width={1100} height={500} data={arr}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis minTickGap={1} dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="score" fill="#4A3AFF" barSize={20} />
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
        <div className="text-end mt-5">
          <Button onClick={generatePDF}>Generate PDF</Button>
        </div>
      </div>
    </div>
  );
};

export default Cohortreport;
