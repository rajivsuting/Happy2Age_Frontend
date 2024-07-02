import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../api";
import { Button, Card, Typography } from "@material-tailwind/react";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Legend,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getLocalData } from "../../Utils/localStorage";

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
export const Cohortreportdetails = () => {
  const { participantid } = useParams();
  const [partcipantReportdata, setPartcipantReportdata] = useState();
  const [remarks, setRemarks] = useState("");
  const componantPDF = useRef();
  const navigate = useNavigate();
  const { partcipantList } = useSelector((state) => {
    return {
      partcipantList: state.AllListReducer.partcipantList,
    };
  });

  useEffect(() => {
    axios.get(`${serverUrl}/report/${participantid}/`,{
      // headers: {
      //   Authorization: `${getLocalData("token")}`,
      // },
    }).then((res) => {
      // console.log(res.data.message);
      setPartcipantReportdata(res.data.message);
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

  let filterParticipant = partcipantList?.find((el) => el._id == participantid);

  const generatePDF = useReactToPrint({
    content: () => componantPDF.current,
    documentTitle: `${filterParticipant?.name} report`,
    onAfterPrint: () => toast.success("PDF file download successfully"),
  });

  const resultArray = partcipantReportdata?.map((item) => {
    const total = item.list.reduce(
      (sum, session) => sum + Number(session.domainAverage),
      0
    );
    const average = total / item.list.length;
    return {
      domainName: item.domainName,
      averageDomainAverage: average.toFixed(2),
    };
  });

  // const resultGraph = partcipantReportdata?.map((item) => {
  //   const maxdomainAverageObject = item.list.reduce((max, obj) => {
  //     return Number(obj.domainAverage) > Number(max.domainAverage) ? obj : max;
  //   }, item.list[0]);
  //   const newObject = {
  //     domain: item.domainName,
  //     maxValue: maxdomainAverageObject.domainAverage + 1,
  //   };
  //   // console.log(maxdomainAverageObject)

  //   item.list.forEach((session) => {
  //     newObject[session.sessionName] = Number(session.domainAverage);
  //   });

  //   return newObject;
  // });

  const sessionMap = {};
  let maxDomainAverage = -Infinity;
  
  // Collect all session data and find the maximum domainAverage
  partcipantReportdata?.forEach(domain => {
    const domainName = domain.domainName;
    domain.list.forEach(session => {
      const sessionName = session.sessionName;
      const domainAverage = session.domainAverage;
  
      if (!sessionMap[sessionName]) {
        sessionMap[sessionName] = { sessionName };
      }
      sessionMap[sessionName][domainName] = domainAverage;
  
      if (domainAverage > maxDomainAverage) {
        maxDomainAverage = domainAverage;
      }
    });
  });
  
  // Convert the sessionMap to the desired output array
  const outPutArray = Object.values(sessionMap);
  
  // Add the maximum domainAverage to each session object
  outPutArray.forEach(session => {
    session.maxDomainAverage = maxDomainAverage + 1;
  });

  return (
    <div className=" mt-5 mb-10">
      <div
        className="border border-black rounded-xl p-8"
        ref={componantPDF}
        style={{ width: "90%", margin: "auto", marginTop: "20px" }}
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
              Name : <b>{filterParticipant?.name}</b>
            </div>
            <div className="w-[50%] font-normal">
              Email : <b>{filterParticipant?.email}</b>
            </div>
          </div>
          <div className="flex justify-between m-auto mt-2 gap-10">
            <div className="w-[50%] font-normal">
              Address :{" "}
              <b>
                {filterParticipant?.address?.addressLine},{" "}
                {filterParticipant?.address?.pincode},{" "}
                {filterParticipant?.address?.city},{" "}
                {filterParticipant?.address?.state}
              </b>
            </div>
            <div className="w-[50%] font-normal">
              DOB : <b>{filterParticipant?.dob.split("T")[0]}</b>
            </div>
          </div>
          <div className="flex justify-between m-auto mt-2 gap-10">
            <div className="w-[50%] font-normal">
              Gender : <b>{filterParticipant?.gender}</b>
            </div>
            <div className="w-[50%] font-normal">
              Type : <b>{filterParticipant?.participantType}</b>
            </div>
          </div>
        </div>
        <Card className="h-full w-[100%] rounded-xl mt-5">
          <table className="w-full min-w-max table-auto text-left rounded-xl">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Domains name
                  </Typography>
                </th>
                {partcipantReportdata &&
                  partcipantReportdata[0] &&
                  partcipantReportdata[0].list &&
                  partcipantReportdata[0].list.map((el, index) => {
                    // console.log(el.list[0])
                    return (
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {el.sessionName}
                        </Typography>
                      </th>
                    );
                  })}
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Domain average
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {partcipantReportdata?.map((el, index) => {
                const isLast = index === partcipantReportdata.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={index}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {el.domainName}
                      </Typography>
                    </td>
                    {el.list.map((sl) => {
                      return (
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {sl.domainAverage}
                          </Typography>
                        </td>
                      );
                    })}
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {resultArray[index].averageDomainAverage}
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
        <div className="flex justify-center items-center m-auto mt-10 rounded-xl p-8 bg-white shadow">
          <LineChart
            width={760}
            height={300}
            data={outPutArray}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray={1} />
            <XAxis
              dataKey="sessionName"
              padding={{ left: 30, right: 30 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis dataKey="maxDomainAverage" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {partcipantReportdata?.map((el, index) => {
                // console.log(el.list[0])
                return (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={el.domainName}
                    stroke={darkColors[index]}
                    strokeWidth={3}
                    // dot={false}
                  />
                );
              })}
            {/* {
        resultGraph?.map((el)=>{
         return 
        })
      } */}
            {/* <Line type="monotone" dataKey="vivek" stroke="#170C60" strokeWidth={3} dot={false} /> */}
          </LineChart>
        </div>

        {/* {partcipantReportdata?.map((el) => {
          return (
            <div className="bg-white rounded-xl px-8 py-4 mt-5 shadow">
              <div className="text-[20px] border-b pb-2 mb-5 font-semibold">
                {el.domainName}
              </div>
              <div className="w-[100%] flex justify-between m-auto gap-10">
                <Card className="h-full w-[50%]">
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
                            Domain average
                          </Typography>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {el.list.map(({ sessionName, domainAverage }, index) => {
                        const isLast = index === el.list.length - 1;
                        const classes = isLast
                          ? "p-4"
                          : "p-4 border-b border-blue-gray-50";

                        return (
                          <tr key={sessionName}>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {sessionName}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {domainAverage.toFixed(2)}
                              </Typography>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>
                <div className="w-[50%]">
                  <BarChart width={350} height={200} data={el.list}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      minTickGap={1}
                      dataKey="sessionName"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="domainAverage" fill="#22d172" barSize={15} />
                  </BarChart>
                </div>
              </div>
            </div>
          );
        })} */}
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
        <Button >Export to excel</Button>
          <Button onClick={generatePDF}>Generate PDF</Button>
        </div>
      </div>
    </div>
  );
};

export default Cohortreportdetails;
