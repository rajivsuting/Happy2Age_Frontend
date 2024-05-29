import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import SeeDeatailesEvalution from "../../Componants/SeeDeatailesEvalution";
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
  const [cohortFromEvaluation, setCohortFromEvaluation] = useState([]);
  const [sessionFromEvaluation, setSessionFromEvaluation] = useState([]);

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
      console.log(res.data.message);
    });
  }, []);

  useEffect(() => {
    setEvalutionlist(
      evalutionlist?.filter((el) => el.cohort._id == cohortSelect)
    );
  }, [cohortSelect]);

  useEffect(() => {
    setEvalutionlist(
      evalutionlist?.filter((el) => el.session._id == sessionSelect)
    );
  }, [sessionSelect]);

  let arr = [];

  evalutionlist.map((el) => {
    return arr.push({
      name: el.participant.name,
      score: Number(el.grandAverage.toFixed(2)),
    });
  });

  return (
    <Card className="h-full w-full overflow-scroll mt-5 mb-24">
      <div className="flex justify-between items-center m-3">
        <select
          name=""
          id=""
          value={cohortSelect}
          className="border w-[20%] px-2 py-2 rounded-md mt-3 mb-3"
          onChange={(e) => setCohortSelect(e.target.value)}
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
          className="border w-[20%] px-2 py-2 rounded-md mt-3 mb-3"
          onChange={(e) => setSessionSelect(e.target.value)}
        >
          <option value="">Select a session</option>
          {sessionlist?.map((el) => {
            return <option value={el._id}>{el.name}</option>;
          })}
        </select>
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
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={el._id}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.participant?.name}
                  </Typography>
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
<div className="flex justify-center items-center m-auto mt-5"></div>
      <BarChart
        width={450}
        height={250}
        data={arr}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis minTickGap={1} dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="score" fill="#4A3AFF" barSize={20} />
      </BarChart>
    </Card>
  );
};

export default Cohortreport;
