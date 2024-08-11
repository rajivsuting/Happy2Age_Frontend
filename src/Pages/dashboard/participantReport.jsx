import React, { useRef } from "react";
import { Button, Card, Typography } from "@material-tailwind/react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import SeeDeatailesEvalution from "../../Componants/SeeDeatailesEvalution";
// import { useReactToPrint } from "react-to-print";
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
  Label,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { getAllParticipants } from "../../Redux/AllListReducer/action";
import * as XLSX from "xlsx";
import { convertDateFormat, getLocalData } from "../../Utils/localStorage";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  PDFDownloadLink,
  PDFViewer,
} from "@react-pdf/renderer";

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
    const lineData = payload.find((p) => p.dataKey === "centerAverage");

    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          border: "1px solid #ccc",
        }}
      >
        <p className="label">{`Domain: ${label}`}</p>
        {barData && <p className="intro">{`Average: ${barData.value}`}</p>}
        {lineData && (
          <p className="desc">{`Centre Average: ${lineData?.value}`}</p>
        )}
        {barData && (
          <p className="desc">{`Number of Sessions: ${barData.payload.numberOfSessions}`}</p>
        )}
      </div>
    );
  }

  return null;
};

const CustomLabel = ({ x, width, value, chartHeight }) => {
  const yPosition = chartHeight + 20; // Fixed position below the x-axis
  return (
    <text x={x + width / 2} y={yPosition} fill="black" textAnchor="middle">
      {value + " session"}
    </text>
  );
};

const BarChartComponent = ({ data, onRendered }) => {
  return (
    <div id="chart-container">
        <ResponsiveContainer width={900} height={550}> {/* Increase height */}
        <ComposedChart data={data} margin={{ top: 20, right: 30, bottom: 90, left: 20 }}> 
          <CartesianGrid strokeDasharray="3 3" padding={{bottom:50}}/>
          <XAxis
            minTickGap={1}
            dataKey="domainName"
            tick={{ fontSize: 15, fontWeight: "bold" }}
          >
            <Label
              value="Domain name"
              offset={0}
              position="insideBottom"
              dy={50}
              style={{ fontWeight: "bold" }} 
            />
          </XAxis>
          <YAxis tick={{ fontSize: 15, fontWeight: "bold" }} domain={[0, 7]}>
            <Label
              value="Average"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle", fontWeight: "bold" }}
            />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: 20 }} />
          <Bar
            dataKey="average"
            fill="#4A3AFF"
            barSize={15} radius={[20, 0, 20, 0]}
          >
             <LabelList
              dataKey="numberOfSessions"
              position="top" // Change to "top" or "insideTop"
              content={<CustomLabel chartHeight={460} />}
            />
          </Bar>
          <Line
            type="monotone"
            dataKey="centerAverage"
            stroke="green"
            activeDot={{ r: 10 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

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

import html2canvas from "html2canvas";

const CaptureChart = ({ data, onCapture }) => {
  const chartRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      const captureChartAsImage = async () => {
        if (chartRef.current) {
          const canvas = await html2canvas(chartRef.current);
          const imgData = canvas.toDataURL("image/png");
          onCapture(imgData);
         
        }
      };
      captureChartAsImage();
    }, 2000);
  }, [data]);

  return (
    <div ref={chartRef}>
      <BarChartComponent data={data} />
    </div>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: "35px",
    border: "1px solid black",
    // backgroundColor: "#ffeaf2",
    // marginRight:"20px",
    // Remove margin to avoid overlap issues
    position: "relative", // Ensure position for absolute elements
  },
  // pageNumber: {
  //   position: "absolute",
  //   fontSize: 12,
  //   bottom: 20,
  //   left: 0,
  //   right: 0,
  //   textAlign: "center",
  //   color: "grey",
  // },
  customHeader: {
    width: "100%",
    // backgroundColor:"#ffe0ec",
    // border: "1px solid black",
    margin: "auto",
    marginTop: "0px",
    boxShadow:
      "0px 6px 24px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px rgba(0, 0, 0, 0.08)",
    padding: "35px",
  },
  section: {
    width: "100%",
    marginBottom: 10,
    marginTop: 20,
  },
  image: {
    width: "100%",
    // height: "250px",
    marginBottom: "20px",
    borderRadius: "10px",
    // border: "1px solid black",
  },
  image2: {
    width: "100%",
    // height: "300px",
    borderRadius: "10px",
    //  border: "1px solid black",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: "20px",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "33.33%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    // backgroundColor: "#ffe0ec",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
    textAlign: "center",
  },
  flexContainer: {
    marginBottom: "40px",
    marginTop: "40px",
  },
  boldText: {
    fontSize: "12px",
  },
  text: {
    fontSize: "12px",
    marginTop: "20px",
  },
  marginTop5: {
    marginTop: "20px",
    fontSize: "12px",
    lineHeight: "1.5px",
  },
  marginTop10: {
    marginTop: "20px",
    fontSize: "12px",
    lineHeight: "1.5px",
  },
  italicText: {
    fontStyle: "italic",
  },
  normalText: {
    fontSize: 12,
  },
  input: {
    borderBottom: "2px solid rgba(0, 0, 0, 0.5)",
    width: "100px",
    marginLeft: "20px",
    outline: "none",
    transition: "border-color 200ms",
  },
  longInput: {
    width: "250px",
  },
  shortInput: {
    width: "120px",
  },
  finalNote: {
    marginTop: 40,
    fontSize: 12,
  },
  container: {
    width: "100%",
    margin: "auto",
    border: "1px solid black",
    borderRadius: "10px",
    padding: "20px",
    marginTop: "20px",
    fontSize: "12px",
   
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  nameInput: {
    width: "150px",
    marginLeft: "20px",
  },
  dateInput: {
    width: "180px",
    marginLeft: "20px",
  },
});

const MyDocument = ({
  chartImage,
  des1,
  des2,
  startDate,
  endDate,
  resultnlist,
  remarks,
  date,
  name,
  signature,
  mobile,
  jointPlan,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.customHeader}>
        {/* Header Logo */}
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src="/img/Happy-2age-logo-1-1.png"
            style={{ width: "200px", borderRadius: "10px" }}
          />
        </View>

        {/* Report Title */}
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginBottom: "5px",
              marginTop: "20px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Individual Member Observations
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              marginBottom: "10px",
              marginTop: "10px",
              fontSize: "18px",
            }}
          >
            Our Journey Together
          </Text>
          <Text
            style={{
              width: "100%",
              margin: "auto",
              marginTop: "5px",
              fontSize: "14px",
              lineHeight:"1.5px"
            }}
          >
            (This document is based on our basic observations about your
            participation and engagements made in our sessions which is held
            <Text
              style={{
                borderBottom: "2px solid rgba(0, 0, 0, 0.5)",
                width: "50px",
                marginLeft: "2px",
                marginRight: "2px",
                textAlign: "center",
                border: "none",
                outline: "none",
              }}
            >
              {" "}
              {des1}{" "}
            </Text>
            in a week for
            <Text
              style={{
                borderBottom: "2px solid rgba(0, 0, 0, 0.5)",
                width: "50px",
                marginLeft: "2px",
                marginRight: "2px",
                textAlign: "center",
                border: "none",
                outline: "none",
              }}
            >
              {" "}
              {des2}{" "}
            </Text>
            hours. It is limited to the progress made by members in various
            domains that we have chosen while designing activities.)
          </Text>
        </View>

        {/* Centre Information */}
        <View style={styles.container}>
          <View style={styles.row}>
            <Text>
              Name :{" "}
              <Text style={[styles.input, styles.nameInput]}>
                {resultnlist?.participant?.name || ""}
              </Text>
            </Text>
            <Text>
              Age :{" "}
              <Text style={[styles.input, styles.nameInput]}>
                {calculateAge(resultnlist?.participant?.dob || "")}
              </Text>
            </Text>
          </View>
          <View style={styles.row}>
            <Text>
              Address :{" "}
              <Text style={[styles.input, styles.nameInput]}>
                {`${resultnlist?.participant?.address?.addressLine || ""}, ${
                  resultnlist?.participant?.address?.city || ""
                }, ${resultnlist?.participant?.address?.state || ""}, ${
                  resultnlist?.participant?.address?.pincode || ""
                }`}
              </Text>
            </Text>
            <Text>
              Mobile No :{" "}
              <Text style={[styles.input, styles.nameInput]}>
                {resultnlist?.participant?.emergencyContact?.phone || ""}
              </Text>
            </Text>
          </View>
          <View style={styles.row}>
            <Text>
              Date From :{" "}
              <Text style={[styles.input, styles.dateInput]}>
                {convertDateFormat(startDate) || ""}
              </Text>{" "}
              To :{" "}
              <Text style={[styles.input, styles.dateInput]}>
                {convertDateFormat(endDate) || ""}
              </Text>
            </Text>
            <Text>
              Attendance :{" "}
              <Text style={[styles.input, styles.dateInput]}>
                {resultnlist?.attendance || 0}
              </Text>{" "}
              out of :{" "}
              <Text style={[styles.input, styles.dateInput]}>
                {resultnlist?.totalNumberOfSessions || 0}
              </Text>
            </Text>
          </View>
        </View>

        {/* Overall Remark */}
        <View style={{ marginBottom: "20px", marginTop: "20px" }}>

          <Text style={{ fontSize: "12px" }}>
            Graph (Bar) : On various Domains ratings against the aggregate
            rating of the Cohort (Centre)
          </Text>
        </View>

        {/* Images */}
        {chartImage && (
          <View style={styles.section}>
            <Image src={chartImage} style={styles.image} />
          </View>
        )}

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Domain</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Average</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}> Center Average</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Number Of Sessions</Text>
            </View>
          </View>

          {resultnlist?.graphDetails?.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.domainName}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.average}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.centerAverage}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.numberOfSessions}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* <View style={styles.flexContainer}>
          <View>
            <Text style={styles.boldText}>
              Graph of Score: (overall score for each member across Domains)
            </Text>
          </View>
          <View>
            <Text style={styles.text}>
              Centre average:{" "}
              <Text style={styles.boldText}>
                {resultnlist?.averageForCohort}
              </Text>
            </Text>
          </View>
        </View>

        {heatImage && (
          <View>
            <Image src={heatImage} style={styles.image2} />
          </View>
        )} */}

        <View>
          <View style={styles.marginTop5}>
            <Text>
              Brief Background : {resultnlist?.participant?.briefBackground}
            </Text>
          </View>

          <View style={styles.marginTop5}>
            <Text>Overall Observations : {remarks}</Text>
          </View>
          <View style={styles.marginTop5}>
            <Text>Joint Plan : {jointPlan}</Text>
          </View>
          {/* <View style={styles.marginTop10}>
            <Text>
              We are happy to have collaborated with you and look forward to
              continuing our engagements with your Society’s Senior Citizen
              Members in spreading joy and providing meaningful involvement.
            </Text>
          </View> */}
        </View>

        <View>
          <View style={{ fontSize: "12px", marginTop: "15px" }}>
            <Text>
              <Text>Date : </Text>
              <Text style={[styles.input]}>{date}</Text>
            </Text>
          </View>
          <View style={{ fontSize: "12px", marginTop: "15px" }}>
            <Text>
              <Text>Name : </Text>
              <Text style={[styles.input, styles.longInput]}>{name}</Text>
            </Text>
          </View>
          <View style={{ fontSize: "12px", marginTop: "15px" }}>
            <Text>
              <Text>Signature(with Stamp) : </Text>
              <Text style={[styles.input, styles.longInput]}>{signature}</Text>
            </Text>
          </View>
          <View style={{ fontSize: "12px", marginTop: "15px" }}>
            <Text>
              <Text>Mobile : </Text>
              <Text style={[styles.input, styles.shortInput]}>{mobile}</Text>
            </Text>
          </View>
          <View style={{ fontSize: "12px", marginTop: "15px" }}>
            <Text>
              We are here to engage with you to spread joy and provide
              meaningful involvement.{" "}
            </Text>
          </View>
          <View style={{ fontSize: "12px", marginTop: "15px" }}>
            <Text>
              We stand for Trust, Building Positive Relationship & Spreading Joy
              and Going that Extra Mile.{" "}
            </Text>
          </View>
        </View>
      </View>
      {/* <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) =>
          `${pageNumber} / ${totalPages}`
        }
      /> */}
    </Page>
  </Document>
);

export const ParticipantReport = () => {
  const [evalutionlist, setEvalutionlist] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allParticipants, setAllParticipants] = useState([]);
  const [singleParticipant, setSingleParticipant] = useState("");
  const [startDate, setStartdate] = useState("");
  const [happinessScore, setHappinessScore] = useState([]);
  const [endDate, setEnddate] = useState("");
  const [sessionSelect, setSessionSelect] = useState("");
  const [getReportData, setGetReportData] = useState([]);
  const [entireEvaluation, setEntireEvaluation] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [resultnlist, setResultlist] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const componantPDF = useRef();
  const [chartImage, setChartImage] = useState(null);
  const [date, setDate] = useState();
  const [name, setName] = useState();
  const [signature, setSignature] = useState();
  const [mobile, setMobile] = useState();
  const [des1, setDes1] = useState();
  const [des2, setDes2] = useState();
  const [singleEvalustion, setSingleEvaluation] = useState({});
  const [jointPlan, setJoinplan] = useState("");

  const handleCapture = (imgData) => {
    setChartImage(imgData);
  };

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
    dispatch(getAllParticipants("", ""));
    axios
      .get(`${serverUrl}/evaluation/all`, {})
      .then((res) => {
        setEvalutionlist(res.data.message);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .get(
        `${serverUrl}/report/${singleParticipant}/?start=${startDate}&end=${endDate}`,
        {}
      )
      .then((res) => {
        console.log(res);
        setResultlist(res.data.data);
        setEntireEvaluation(res.data.participantEvaluations);
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
    "Centre average": el.centerAverage,
    "No. of sessions": el.numberOfSessions,
    Average: el.average,
  }));

  let participantNameforExcel = allParticipants?.filter(
    (el) => el._id == singleParticipant
  )[0]?.name;

  // const generatePDF = useReactToPrint({
  //   content: () => componantPDF.current,
  //   documentTitle: "Cohort report",
  //   onAfterPrint: () =>
  //     toast.success("PDF file download successfully", toastConfig),
  // });

  useEffect(() => {
    axios
      .get(`${serverUrl}/participant/all`, {})
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

  // excel showing ----------

  const transformData = entireEvaluation?.map((item) => {
    const domains = item.domain.map((domainItem) => ({
      domainName: domainItem.name,
      subTopics: domainItem.subTopics,
      average: domainItem.average,
    }));

    return {
      participant: item.participant.name,
      participantType: item.participant.participantType,
      activity: item.activity.name,
      session: item.session.name,
      sessionDate: convertDateFormat(item.session.date.split("T")[0]),
      sessionTime: item.session.numberOfMins,
      domains: domains,
      grandAverage: item.grandAverage,
    };
  });

  const transformMainData = (data) => {
    let result = [];

    data.forEach((item) => {
      const {
        participant,
        participantType,
        activity,
        session,
        sessionDate,
        sessionTime,
        domains,
        grandAverage,
      } = item;

      domains.forEach((domain) => {
        let domainHeader = true;
        domain.subTopics.forEach((subtopic) => {
          if (domainHeader) {
            result.push([
              participant,
              participantType,
              activity,
              session,
              sessionDate,
              sessionTime,
              domain.domainName,
              domain.average,
              subtopic.content,
              subtopic.score,
              grandAverage,
            ]);
            domainHeader = false;
          } else {
            result.push([
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              subtopic.content,
              subtopic.score,
              "",
            ]);
          }
        });
      });
    });

    return result;
  };

  const transformGraphDetails = (graphDetails) => {
    return graphDetails.map((item) => [
      item.domainName,
      item.average,
      item.centerAverage,
      item.numberOfSessions,
    ]);
  };

  const handleExportToExcel = () => {
    // Transform data
    const transformedMainData = transformMainData(transformData);
    const transformedGraphDetails = transformGraphDetails(
      resultnlist?.graphDetails
    );

    // Create worksheets using AoA
    const mainWorksheet = XLSX.utils.aoa_to_sheet([
      [
        "Participant Name",
        "Participant Type",
        "Activity Name",
        "Session Name",
        "Session Date",
        "Session Time",
        "Domain Name",
        "Domain Average",
        "Subtopic Content",
        "Score",
        "Grand Average",
      ],
      ...transformedMainData,
    ]);

    const graphDetailsWorksheet = XLSX.utils.aoa_to_sheet([
      ["Domain Name", "Average", "Centre Average", "Number of Sessions"],
      ...transformedGraphDetails,
    ]);

    // Create a workbook
    const workbook = XLSX.utils.book_new();

    // Add worksheets to the workbook
    XLSX.utils.book_append_sheet(workbook, mainWorksheet, "Main Data");
    XLSX.utils.book_append_sheet(
      workbook,
      graphDetailsWorksheet,
      "Graph Details"
    );

    // Export the workbook to an Excel file
    XLSX.writeFile(
      workbook,
      `${participantNameforExcel}-${startDate}-${endDate}.xlsx`
    );
    toast.success("Excel file downloaded successfully", toastConfig);
  };

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
            <option value="">Select member</option>
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
        {/* <Button onClick={generatePDF}>Download pdf</Button> */}
      </div>
      <div
        ref={componantPDF}
        style={{
          width: "90%",
          margin: "auto",
          marginTop: "20px",
          boxShadow:
            "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
        }}
        className="custom-header p-8 bg-white"
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
            Individual Member Observations
          </div>
          <div className="font-bold mb-5 mt-5 text-[20px]">
            Our Journey Together
          </div>
          <div className="w-[70%] m-auto mt-5">
            (This document is based on our basic observations about your
            participation and engagements made in our sessions which is held
            <input
              value={des1}
              onChange={(e) => setDes1(e.target.value)}
              className="border-b w-[50px] ml-2 mr-2 text-center border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />{" "}
            in a week for{" "}
            <input
              value={des2}
              onChange={(e) => setDes2(e.target.value)}
              className="border-b w-[50px] ml-2 mr-2 text-center border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />{" "}
            hours. It is limited to the progress made by members in various
            domains that we have chosen while designing activities.)
          </div>
        </div>
        <div className="w-[100%] m-auto grid grid-cols-2 border rounded-xl p-8 mt-5">
          <div className="mb-3">
            Name :
            <input
              value={resultnlist?.participant?.name || ""}
              className="border-b w-[250px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />
          </div>
          <div>
            Age :
            <input
              value={calculateAge(resultnlist?.participant?.dob || "")}
              className="border-b w-[250px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />
          </div>
          <div className="mb-3">
            Address :
            <input
              value={`${
                resultnlist?.participant?.address?.addressLine || ""
              }, ${resultnlist?.participant?.address?.city || ""}, ${
                resultnlist?.participant?.address?.state || ""
              }, ${resultnlist?.participant?.address?.pincode || ""}`}
              className="border-b w-[330px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />
          </div>
          <div>
            Mobile No :
            <input
              value={resultnlist?.participant?.emergencyContact?.phone || ""}
              className="border-b w-[100px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />
          </div>
          <div className="mb-3">
            Date From :
            <input
              value={convertDateFormat(startDate) || ""}
              className="border-b w-[100px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />
            To :
            <input
              value={convertDateFormat(endDate) || ""}
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
              value={resultnlist?.totalNumberOfSessions || 0}
              className="border-b w-[50px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />
          </div>
        </div>

        {/* <div className="mb-5 mt-5 ">
          <b className="text-[18px]">Oxford happiness score: {(happinessScore[0]?.happinessScore)?.toFixed(2)}</b>
        </div> */}
        <div className="mb-5 mt-5 ">
          <b className="text-[18px]">Brief Background:</b>{" "}
          {resultnlist?.participant?.briefBackground}
        </div>
        <div>
          <b className="text-[18px]">Graph (Bar):</b> On various Domains ratings
          against the aggregate rating of the Cohort (Centre)
        </div>

        <div className="w-[100%] flex justify-center items-center m-auto mt-12">
          <CaptureChart
            data={resultnlist?.graphDetails}
            onCapture={handleCapture}
          />
          {/* <ResponsiveContainer width={900} height={500}>
            <ComposedChart data={resultnlist?.graphDetails}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                minTickGap={1}
                dataKey="domainName"
                tick={{ fontSize: 15, fontWeight: "bold" }}
              >
                <Label value="Domain name" offset={0} position="insideBottom" dy={30} />
              </XAxis>
              <YAxis
                tick={{ fontSize: 15, fontWeight: "bold" }}
                domain={[0, 7]}
              >
                <Label
                  value="Average"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="average"
                fill="#4A3AFF"
                barSize={20}
                radius={[5, 5, 0, 0]}
              >
                <LabelList dataKey="numberOfSessions" position="bottom"  content={<CustomLabel />} />
              </Bar>

              <Line
                type="monotone"
                dataKey="centerAverage"
                stroke="green"
                activeDot={{ r: 10 }}
              />
            </ComposedChart>
          </ResponsiveContainer> */}
        </div>
        <div className="container mx-auto my-4 mt-[80px] mb-[40px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-center">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Domain Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Average
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Center Average
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Number Of Sessions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resultnlist?.graphDetails?.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.domainName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.average}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.centerAverage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.numberOfSessions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mb-5 mt-5">
          <b className=" text-[18px]">Overall Observations:</b> {remarks}
        </div>
        <div className="mb-5 mt-5">
          <b className=" text-[18px]">Joint Plan:</b>
          <br />{" "}
          <textarea
            value={jointPlan}
            onChange={(e) => setJoinplan(e.target.value)}
            className=" p-2 pt-2 placeholder:pl-2 placeholder:pt-2 mt-5 border-2 rounded-md w-[100%] border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            name=""
            id=""
          ></textarea>
        </div>
        <div className="mb-5 mt-5">
          <b>Date:</b>{" "}
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-b w-[100px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
          />
        </div>
        <div className="mb-5 mt-5">
          <b>Name:</b>{" "}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-b w-[250px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
          />
        </div>
        <div className="mb-5 mt-5">
          <b>Signature(with Stamp):</b>{" "}
          <input
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="border-b w-[250px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
          />
        </div>
        <div className="mb-5 mt-5">
          <b>Mobile:</b>{" "}
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="border-b w-[120px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
          />
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

          <PDFDownloadLink
            document={
              <MyDocument
                chartImage={chartImage}
                des1={des1}
                des2={des2}
                startDate={startDate}
                endDate={endDate}
                resultnlist={resultnlist}
                remarks={remarks}
                date={date}
                name={name}
                signature={signature}
                mobile={mobile}
                jointPlan={jointPlan}
              />
            }
            fileName={`${participantNameforExcel}-${startDate}-${endDate}.pdf`}
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                <Button>...Loading</Button>
              ) : (
                <Button>Generate PDF</Button>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>
      {/* <PDFViewer>
        <MyDocument
          chartImage={chartImage}
          des1={des1}
          des2={des2}
          startDate={startDate}
          endDate={endDate}
          resultnlist={resultnlist}
          remarks={remarks}
          date={date}
          name={name}
          signature={signature}
          mobile={mobile}
          jointPlan={jointPlan}
        />
      </PDFViewer> */}
    </div>
  );
};

export default ParticipantReport;
