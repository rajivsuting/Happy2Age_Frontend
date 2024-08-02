import React, { useRef } from "react";
import {
  Button,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-tailwind/react";
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
  Label,
} from "recharts";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { getAllCohorts } from "../../Redux/AllListReducer/action";
import { convertDateFormat, getLocalData } from "../../Utils/localStorage";
import { useNavigate } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import Heatmap from "../../Componants/Heatmap";
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

const CustomLabel = ({ x, y, width, value }) => {
  return (
    <text x={x + width / 2} y={y + 20} fill="black" textAnchor="middle">
      {value + " " + "session"}
    </text>
  );
};

const BarChartComponent = ({ data, onRendered }) => {
  return (
    <div id="chart-container">
      <BarChart
        width={900}
        height={500}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 50 }} // Adjust the bottom margin here
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="domainName" tick={{ fontSize: 15, fontWeight: "bold" }}>
          <Label
            value="Domain name"
            offset={0}
            position="insideBottom"
            dy={50}
          />{" "}
          {/* Adjust dy as needed */}
        </XAxis>
        <YAxis tick={{ fontSize: 15, fontWeight: "bold" }} domain={[0, 7]}>
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
          dataKey="centerAverage"
          fill="#4A3AFF"
          barSize={20}
          radius={[5, 5, 0, 0]}
        >
          <LabelList
            dataKey="numberOfSessions"
            position="bottom"
            content={<CustomLabel />}
          />
        </Bar>
      </BarChart>
    </div>
  );
};

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
          console.log(imgData);
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

const CaptureHeatmap = ({ arr, onCapture }) => {
  const chartheatRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      const captureChartAsImage = async () => {
        if (chartheatRef.current) {
          const canvas = await html2canvas(chartheatRef.current);
          const imgData = canvas.toDataURL("image/png");
          onCapture(imgData);
          console.log(imgData);
        }
      };
      captureChartAsImage();
    }, 2000);
  }, [arr]);

  return (
    <div ref={chartheatRef}>
      <Heatmap arr={arr} />
    </div>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: "20px",
    border: "1px solid black",
    // borderRadius:"10px",
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
    padding: "20px",
  },
  section: {
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "300px",
    marginBottom: "20px",
    borderRadius: "10px",
    // border: "1px solid black",
  },
  image2: {
    width: "100%",
    height: "300px",
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
    marginTop: "40px",
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
    fontSize: "14px",
  },
  text: {
    fontSize: "14px",
    marginTop: "20px",
  },
  marginTop5: {
    marginTop: "20px",
    fontSize: "14px",
  },
  marginTop10: {
    marginTop: "20px",
    fontSize: "14px",
  },
  italicText: {
    fontStyle: "italic",
  },
  normalText: {
    fontSize: 12,
  },
  section: {
    width: "100%",
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    borderBottom: "2px solid rgba(0, 0, 0, 0.5)",
    width: "100px",
    marginLeft: "20px",
    outline: "none",
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
    marginTop: "40px",
    fontSize: "14px",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  input: {
    borderBottom: "2px solid rgba(0, 0, 0, 0.5)",
    outline: "none",
    transition: "border-color 200ms",
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
  cohortList,
  cohortSelect,
  startDate,
  endDate,
  remarks,
  observation,
  resultnlist,
  chartImage,
  heatImage,
  date,
  name,
  signature,
  mobile,
  des1,
  des2,
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
            style={{ width: "150px", borderRadius: "10px" }}
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
              fontWeight: "bold",
              marginBottom: "5px",
              marginTop: "20px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Centre Report{" "}
            {cohortList?.filter((el) => el._id == cohortSelect)[0]?.name ||
              "Unknown"}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              marginBottom: "10px",
              marginTop: "10px",
              fontSize: "18px",
            }}
          >
            Journey Together
          </Text>
          <Text
            style={{
              width: "100%",
              margin: "auto",
              marginTop: "5px",
              fontSize: "14px",
            }}
          >
            (This document is based on our basic observations about member’s
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
              Name of the Centre:
              <Text style={[styles.input, styles.nameInput]}>
                {cohortList?.filter((el) => el._id == cohortSelect)[0]?.name ||
                  "Unknown"}
              </Text>
            </Text>
            <Text>
              Total Participants:
              <Text style={[styles.input, styles.nameInput]}>
                {cohortList?.filter((el) => el._id == cohortSelect)[0]
                  ?.participants?.length || "0"}
              </Text>
            </Text>
          </View>
          <Text>
            Date From:
            <Text style={[styles.input, styles.dateInput]}>
              {convertDateFormat(startDate) || ""}
            </Text>
            {" "} To:
            <Text style={[styles.input, styles.dateInput]}>
              {convertDateFormat(endDate) || ""}
            </Text>
          </Text>
        </View>

        {/* Overall Remark */}
        <View style={{ marginBottom: "20px", marginTop: "20px" }}>
          <Text style={{ fontSize: "14px" }}>
            Graph of Score : (Individual Score against the Group aggregate Score
            for each Domain)
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
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Domain</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Center Average</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Number Of Sessions</Text>
            </View>
          </View>

          {/* Table Body */}
          {resultnlist?.graphDetails?.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.domainName}</Text>
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

        <View style={styles.flexContainer}>
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
        )}

        <View>
          <View style={styles.marginTop5}>
            <Text>Overall Remark:{remarks}</Text>
          </View>

          <View style={styles.marginTop5}>
            <Text>Overall Observations: {observation}</Text>
          </View>
          <View style={styles.marginTop10}>
            <Text>
              We are happy to have collaborated with you and look forward to
              continuing our engagements with your Society’s Senior Citizen
              Members in spreading joy and providing meaningful involvement.
            </Text>
          </View>
        </View>

        <View>
          <View style={{ fontSize: "14px", marginTop: "15px" }}>
            <Text>
              <Text>Date:</Text>
              <Text style={[styles.input]}>{date}</Text>
            </Text>
          </View>
          <View style={{ fontSize: "14px", marginTop: "15px" }}>
            <Text>
              <Text>Name:</Text>
              <Text style={[styles.input, styles.longInput]}>{name}</Text>
            </Text>
          </View>
          <View style={{ fontSize: "14px", marginTop: "15px" }}>
            <Text>
              <Text>Signature(with Stamp):</Text>
              <Text style={[styles.input, styles.longInput]}>{signature}</Text>
            </Text>
          </View>
          <View style={{ fontSize: "14px", marginTop: "15px" }}>
            <Text>
              <Text>Mobile:</Text>
              <Text style={[styles.input, styles.shortInput]}>{mobile}</Text>
            </Text>
          </View>
          <View style={{ fontSize: "14px", marginTop: "15px" }}>
            <Text>
              We stand for Trust, Building Positive Relationship & Spreading Joy
              and Going that Extra Mile.
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
  const [entireEvaluation, setEntireEvaluation] = useState([]);
  const componantPDF = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [chartImage, setChartImage] = useState(null);
  const [heatImage, setHeatImage] = useState(null);
  const [date, setDate] = useState();
  const [name, setName] = useState();
  const [signature, setSignature] = useState();
  const [mobile, setMobile] = useState();
  const [des1, setDes1] = useState();
  const [des2, setDes2] = useState();

  const handleCapture = (imgData) => {
    setChartImage(imgData);
  };

  const handleHeatmapCapture = (imgData) => {
    setHeatImage(imgData);
  };

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
        setEntireEvaluation(res.data.evaluations);
      })
      .catch((err) => {
        console.log(err);
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

  let filteredData = resultnlist?.graphDetails?.map((el) => ({
    "Domain name": el.domainName,
    "Centre average": el.centerAverage,
    "No. of sessions": el.numberOfSessions,
  }));

  let cohortNameforExcel = cohortList?.filter((el) => el._id == cohortSelect)[0]
    ?.name;

  // console.log(cohortList?.filter((el) =>el._id == cohortSelect)[0]?.name);

  const generatePDF = useReactToPrint({
    content: () => componantPDF.current,
    documentTitle: "Centre report",
    onAfterPrint: () =>
      toast.success("PDF file download successfully", toastConfig),
    pageStyle: `
    .custom-header {
      padding: 10px; /* Add padding for better readability */
      border: 1px solid #ccc; /* Add border to header and footer */
    }
  `,
  });

  // heat map----------------------
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
        sessionDate,
        sessionTime,
        activity,
        session,
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
      item.centerAverage,
      item.numberOfSessions,
    ]);
  };

  const transformParticipantDomainScores = (participantDomainScores) => {
    return participantDomainScores.map((item) => [
      item.domain,
      item.participant,
      item.score,
    ]);
  };

  const handleExportToExcel = () => {
    // Transform data
    const transformedMainData = transformMainData(transformData);
    const transformedGraphDetails = transformGraphDetails(
      resultnlist?.graphDetails
    );
    const transformedParticipantDomainScores = transformParticipantDomainScores(
      resultnlist?.participantDomainScores
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
      ["Domain Name", "Centre Average", "Number of Sessions"],
      ...transformedGraphDetails,
    ]);

    const participantDomainScoresWorksheet = XLSX.utils.aoa_to_sheet([
      ["Domain Name", "Participant Name", "Score"],
      ...transformedParticipantDomainScores,
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
    XLSX.utils.book_append_sheet(
      workbook,
      participantDomainScoresWorksheet,
      "Participant Domain Scores"
    );

    // Export the workbook to an Excel file
    XLSX.writeFile(
      workbook,
      `${cohortNameforExcel}-${startDate}-${endDate}.xlsx`
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
            name=""
            id=""
            value={cohortSelect}
            className="border px-2 py-3 rounded-md mt-3 mb-3"
            onChange={(e) => setCohortSelect(e.target.value)}
            required
          >
            <option value="">Select a centre</option>
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
        <div className="w-[100%] m-auto border rounded-xl p-8 mt-5">
          <div className="flex justify-between items-center ">
            <div className="mb-3">
              Name of the Centre:
              <input
                value={
                  cohortList?.filter((el) => el._id == cohortSelect)[0]?.name ||
                  "Unknown"
                }
                className="border-b w-[150px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
              />
            </div>
            <div>
              Total Participants:
              <input
                value={
                  cohortList?.filter((el) => el._id == cohortSelect)[0]
                    ?.participants?.length || "0"
                }
                className="border-b w-[150px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-3">
            Date From :
            <input
              value={convertDateFormat(startDate) || ""}
              className="border-b w-[180px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
            />
            To :
            <input
              value={convertDateFormat(endDate) || ""}
              className="border-b w-[180px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
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
        <div className="w-[100%] flex justify-center items-center m-auto mt-12 mb-[80px]">
          <CaptureChart
            data={resultnlist?.graphDetails}
            onCapture={handleCapture}
          />
          {/* <BarChart
            width={900}
            height={500}
            data={resultnlist?.graphDetails}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }} // Adjust the bottom margin here
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="domainName"
              tick={{ fontSize: 15, fontWeight: "bold" }}
            >
              <Label
                value="Domain name"
                offset={0}
                position="insideBottom"
                dy={50}
              />{" "}
        
            </XAxis>
            <YAxis tick={{ fontSize: 15, fontWeight: "bold" }} domain={[0, 7]}>
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
              dataKey="centerAverage"
              fill="#4A3AFF"
              barSize={20}
              radius={[5, 5, 0, 0]}
            >
              <LabelList
                dataKey="numberOfSessions"
                position="bottom"
                content={<CustomLabel />}
              />
            </Bar>
          </BarChart> */}
        </div>
        <div className="container mx-auto my-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-center">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Domain Name
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

        <div className=" flex justify-between items-center  mb-[80px] mt-[80px]">
          <div>
            <b className="text-[18px]">Graph of Score </b> (overall score for
            each member across Domains)
          </div>
          <div>
            Centre average : <b>{resultnlist?.averageForCohort}</b>
          </div>
        </div>

        <CaptureHeatmap
          arr={resultnlist?.participantDomainScores}
          onCapture={handleHeatmapCapture}
        />

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
          <PDFDownloadLink
            document={
              <MyDocument
                cohortList={cohortList}
                cohortSelect={cohortSelect}
                startDate={startDate}
                endDate={endDate}
                remarks={remarks}
                observation={observation}
                resultnlist={resultnlist}
                chartImage={chartImage}
                heatImage={heatImage}
                date={date}
                name={name}
                signature={signature}
                mobile={mobile}
                des1={des1}
                des2={des2}
              />
            }
            fileName="dynamic.pdf"
          >
            {({ blob, url, loading, error }) =>
              loading ? <Button>Generate PDF</Button> : <Button>Generate PDF</Button>
            }
          </PDFDownloadLink>
        </div>
        {/* <PDFViewer width={600} height={800}>
          <MyDocument
            cohortList={cohortList}
            cohortSelect={cohortSelect}
            startDate={startDate}
            endDate={endDate}
            remarks={remarks}
            observation={observation}
            resultnlist={resultnlist}
            chartImage={chartImage}
            heatImage={heatImage}
            date={date}
            name={name}
            signature={signature}
            mobile={mobile}
            des1={des1}
                des2={des2}
          />
        </PDFViewer> */}
      </div>
    </div>
  );
};

export default Cohortreport;

// import React, { useRef } from "react";
// import {
//   Button,
//   Card,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@material-tailwind/react";
// import axios from "axios";
// axios.defaults.withCredentials = true;
// import { useEffect, useState } from "react";
// import { serverUrl } from "../../api";
// import { MdOutlineDeleteOutline } from "react-icons/md";
// import { CiEdit } from "react-icons/ci";
// import SeeDeatailesEvalution from "../../Componants/SeeDeatailesEvalution";
// import { useReactToPrint } from "react-to-print";
// import { useDispatch, useSelector } from "react-redux";
// import * as XLSX from "xlsx";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Legend,
//   Tooltip,
//   XAxis,
//   YAxis,
//   Line,
//   LabelList,
//   Label,
// } from "recharts";
// import { toast } from "react-toastify";
// import { toastConfig } from "../../App";
// import { getAllCohorts } from "../../Redux/AllListReducer/action";
// import { convertDateFormat, getLocalData } from "../../Utils/localStorage";
// import { useNavigate } from "react-router-dom";
// import ReactApexChart from "react-apexcharts";
// import Heatmap from "../../Componants/Heatmap";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const darkColors = [
//   "#17a589",
//   "#0669d3",
//   "#2ce2a2",
//   "#dc3545",
//   "#027bff",
//   "#d946ef",
//   "#4B0082", // Indigo
//   "#8B00FF", // Violet
//   "#22d172", // Bright Red-Orange
//   "#b8a495", // Bright Yellow
//   "#fbc7c8", // Bright Orange
//   "#93aafd", // Bright Light Green
// ];

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div
//         className="custom-tooltip"
//         style={{
//           backgroundColor: "#fff",
//           padding: "10px",
//           border: "1px solid #ccc",
//         }}
//       >
//         <p className="label">{`Domain: ${label}`}</p>
//         <p className="intro">{`Average: ${payload[0].value}`}</p>
//         <p className="desc">{`Number of Sessions: ${payload[0].payload.numberOfSessions}`}</p>
//       </div>
//     );
//   }

//   return null;
// };

// const CustomLabel = ({ x, y, width, value }) => {
//   return (
//     <text x={x + width / 2} y={y + 20} fill="#FFF" textAnchor="middle">
//       {value}
//     </text>
//   );
// };

// export const Cohortreport = () => {
//   const [resultnlist, setResultlist] = useState({});
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [cohortSelect, setCohortSelect] = useState("");
//   const [startDate, setStartdate] = useState("");
//   const [endDate, setEnddate] = useState("");
//   const [sessionSelect, setSessionSelect] = useState("");
//   const [getReportData, setGetReportData] = useState([]);
//   const [remarks, setRemarks] = useState("");
//   const [observation, setObservation] = useState("");
//   const [entireEvaluation, setEntireEvaluation] = useState([]);
//   const componantPDF = useRef();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [singleEvalustion, setSingleEvaluation] = useState({});
//   const toggleModal = (el) => {
//     setIsModalOpen(!isModalOpen);
//     setSingleEvaluation(el);
//   };

//   const { cohortList, sessionlist } = useSelector((state) => {
//     return {
//       cohortList: state.AllListReducer.cohortList,
//       sessionlist: state.AllListReducer.sessionlist,
//     };
//   });

//   useEffect(() => {
//     dispatch(getAllCohorts("", ""));
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios
//       .get(
//         `${serverUrl}/report/get/?cohort=${cohortSelect}&start=${startDate}&end=${endDate}`
//       )
//       .then((res) => {
//         console.log(res);
//         setResultlist(res.data.message);
//         setEntireEvaluation(res.data.evaluations);
//       })
//       .catch((err) => {
//         console.log(err);
//         if (err.response && err.response.data && err.response.data.jwtExpired) {
//           toast.error(err.response.data.message, toastConfig);
//           setTimeout(() => {
//             navigate("/auth/sign-in");
//           }, 3000);
//         } else if (err.response && err.response.data) {
//           toast.error(err.response.data.message, toastConfig);
//         } else {
//           toast.error("An unexpected error occurred.", toastConfig);
//         }
//       });
//   };

//   // let arr = [];

//   // evalutionlist?.map((el) => {
//   //   return arr.push({
//   //     name: el.participant.name,
//   //     score: Number(el.grandAverage.toFixed(2)),
//   //   });
//   // });

//   // console.log(resultnlist);

//   let filteredData = resultnlist?.graphDetails?.map((el) => ({
//     "Domain name": el.domainName,
//     "Centre average": el.centerAverage,
//     "No. of sessions": el.numberOfSessions,
//   }));

//   let cohortNameforExcel = cohortList?.filter((el) => el._id == cohortSelect)[0]
//     ?.name;

//   // console.log(cohortList?.filter((el) =>el._id == cohortSelect)[0]?.name);

//   const generatePDF = () => {
//     const componentPDF = document.getElementById('componentPDF');

//     html2canvas(componentPDF, {
//       scale: 2 // Adjust the scale for better quality
//     }).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const imgWidth = 210; // A4 width in mm
//       const pageHeight = 295; // A4 height in mm
//       const imgHeight = canvas.height * imgWidth / canvas.width;
//       let heightLeft = imgHeight;

//       let position = 0;
//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;

//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }

//       pdf.save('report.pdf');
//     });
//   };

//   // heat map----------------------
//   const transformData = entireEvaluation?.map((item) => {
//     const domains = item.domain.map((domainItem) => ({
//       domainName: domainItem.name,
//       subTopics: domainItem.subTopics,
//       average: domainItem.average,
//     }));

//     return {
//       participant: item.participant.name,
//       participantType: item.participant.participantType,
//       activity: item.activity.name,
//       session: item.session.name,
//       sessionDate: convertDateFormat(item.session.date.split("T")[0]),
//       sessionTime: item.session.numberOfMins,
//       domains: domains,
//       grandAverage: item.grandAverage,
//     };
//   });

//   const transformMainData = (data) => {
//     let result = [];
//     data.forEach((item) => {
//       const {
//         participant,
//         participantType,
//         sessionDate,
//         sessionTime,
//         activity,
//         session,
//         domains,
//         grandAverage,
//       } = item;

//       domains.forEach((domain) => {
//         let domainHeader = true;
//         domain.subTopics.forEach((subtopic) => {
//           if (domainHeader) {
//             result.push([
//               participant,
//               participantType,
//               activity,
//               session,
//               sessionDate,
//               sessionTime,
//               domain.domainName,
//               domain.average,
//               subtopic.content,
//               subtopic.score,
//               grandAverage,
//             ]);
//             domainHeader = false;
//           } else {
//             result.push([
//               "",
//               "",
//               "",
//               "",
//               "",
//               "",
//               "",
//               "",
//               subtopic.content,
//               subtopic.score,
//               "",
//             ]);
//           }
//         });
//       });
//     });

//     return result;
//   };

//   const transformGraphDetails = (graphDetails) => {
//     return graphDetails.map((item) => [
//       item.domainName,
//       item.centerAverage,
//       item.numberOfSessions,
//     ]);
//   };

//   const transformParticipantDomainScores = (participantDomainScores) => {
//     return participantDomainScores.map((item) => [
//       item.domain,
//       item.participant,
//       item.score,
//     ]);
//   };

//   const handleExportToExcel = () => {
//     // Transform data
//     const transformedMainData = transformMainData(transformData);
//     const transformedGraphDetails = transformGraphDetails(
//       resultnlist?.graphDetails
//     );
//     const transformedParticipantDomainScores = transformParticipantDomainScores(
//       resultnlist?.participantDomainScores
//     );

//     // Create worksheets using AoA
//     const mainWorksheet = XLSX.utils.aoa_to_sheet([
//       [
//         "Participant Name",
//         "Participant Type",
//         "Activity Name",
//         "Session Name",
//         "Session Date",
//         "Session Time",
//         "Domain Name",
//         "Domain Average",
//         "Subtopic Content",
//         "Score",
//         "Grand Average",
//       ],
//       ...transformedMainData,
//     ]);

//     const graphDetailsWorksheet = XLSX.utils.aoa_to_sheet([
//       ["Domain Name", "Centre Average", "Number of Sessions"],
//       ...transformedGraphDetails,
//     ]);

//     const participantDomainScoresWorksheet = XLSX.utils.aoa_to_sheet([
//       ["Domain Name", "Participant Name", "Score"],
//       ...transformedParticipantDomainScores,
//     ]);

//     // Create a workbook
//     const workbook = XLSX.utils.book_new();

//     // Add worksheets to the workbook
//     XLSX.utils.book_append_sheet(workbook, mainWorksheet, "Main Data");
//     XLSX.utils.book_append_sheet(
//       workbook,
//       graphDetailsWorksheet,
//       "Graph Details"
//     );
//     XLSX.utils.book_append_sheet(
//       workbook,
//       participantDomainScoresWorksheet,
//       "Participant Domain Scores"
//     );

//     // Export the workbook to an Excel file
//     XLSX.writeFile(
//       workbook,
//       `${cohortNameforExcel}-${startDate}-${endDate}.xlsx`
//     );
//     toast.success("Excel file downloaded successfully", toastConfig);
//   };

//   return (
//     <div className="mb-24">
//       <div className="flex justify-between items-center m-3">
//         <form
//           onSubmit={handleSubmit}
//           className="flex justify-center items-center gap-3"
//         >
//           <select
//             name=""
//             id=""
//             value={cohortSelect}
//             className="border px-2 py-3 rounded-md mt-3 mb-3"
//             onChange={(e) => setCohortSelect(e.target.value)}
//             required
//           >
//             <option value="">Select a centre</option>
//             {cohortList?.map((el) => {
//               return <option value={el._id}>{el.name}</option>;
//             })}
//           </select>
//           <div className="ml-10">From</div>
//           <input
//             name=""
//             id=""
//             type="date"
//             value={startDate}
//             className="border px-2 py-3 rounded-md mt-3 mb-3"
//             onChange={(e) => setStartdate(e.target.value)}
//             required
//           />
//           <div>To</div>
//           <input
//             name=""
//             id=""
//             type="date"
//             value={endDate}
//             className="border px-2 py-3 rounded-md mt-3 mb-3"
//             onChange={(e) => setEnddate(e.target.value)}
//             required
//           />
//           <Button type="submit">Search</Button>
//         </form>
//         <Button onClick={generatePDF}>Download pdf</Button>
//       </div>
//       <div
//         id="componentPDF"
//         style={{ width: "90%", margin: "auto", marginTop: "20px" }}
//         className="p-8 bg-white"
//       >
//         <div className="flex justify-center items-center">
//           <img
//             className="w-[200px] rounded-xl"
//             src="/img/Happy-2age-logo-1-1.png"
//             alt=""
//           />
//         </div>
//         <div className="text-center">
//           <div className="font-bold mb-5 mt-5 text-[20px]">
//             Centre Report{" "}
//             {cohortList?.filter((el) => el._id == cohortSelect)[0]?.name ||
//               "Unknown"}
//           </div>
//           <div className="font-bold mb-5 mt-5 text-[20px]">
//             Journey Together
//           </div>
//           <div className="w-[70%] m-auto mt-5">
//             (This document is based on our basic observations about member’s
//             participation and engagements made in our sessions which is held
//             <input className="border-b w-[50px] ml-2 mr-2 text-center border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />{" "}
//             in a week for{" "}
//             <input className="border-b w-[50px] ml-2 mr-2 text-center border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />{" "}
//             hours. It is limited to the progress made by members in various
//             domains that we have chosen while designing activities.)
//           </div>
//         </div>
//         <div className="w-[100%] m-auto border rounded-xl p-8 mt-5">
//           <div className="flex justify-between items-center ">
//             <div className="mb-3">
//               Name of the Centre:
//               <input
//                 value={
//                   cohortList?.filter((el) => el._id == cohortSelect)[0]?.name ||
//                   "Unknown"
//                 }
//                 className="border-b w-[150px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
//               />
//             </div>
//             <div>
//               Total Participants:
//               <input
//                 value={
//                   cohortList?.filter((el) => el._id == cohortSelect)[0]
//                     ?.participants?.length || "0"
//                 }
//                 className="border-b w-[150px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
//               />
//             </div>
//           </div>

//           <div className="mb-3">
//             Date From :
//             <input
//               value={convertDateFormat(startDate) || ""}
//               className="border-b w-[180px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
//             />
//             To :
//             <input
//               value={convertDateFormat(endDate) || ""}
//               className="border-b w-[180px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
//             />
//           </div>
//         </div>
//         <div className="mb-5 mt-5 ">
//           <b className="text-[18px]">Overall Remark:{remarks}</b>{" "}
//         </div>
//         <div>
//           <b className="text-[18px]">Graph of Score </b> (Individual Score
//           against the Group aggregate Score for each Domain)
//         </div>
//         <div className="w-[100%] flex justify-center items-center m-auto mt-12 mb-[80px]">
//           <BarChart
//             width={900}
//             height={500}
//             data={resultnlist?.graphDetails}
//             margin={{ top: 20, right: 30, left: 20, bottom: 50 }} // Adjust the bottom margin here
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="domainName"
//               tick={{ fontSize: 15, fontWeight: "bold" }}
//             >
//               <Label value="Domain name" offset={0} position="insideBottom" />
//             </XAxis>
//             <YAxis tick={{ fontSize: 15, fontWeight: "bold" }} domain={[0, 7]}>
//               <Label
//                 value="Average"
//                 angle={-90}
//                 position="insideLeft"
//                 style={{ textAnchor: "middle" }}
//               />
//             </YAxis>
//             <Tooltip content={<CustomTooltip />} />
//             <Legend />
//             <Bar
//               dataKey="centerAverage"
//               fill="#4A3AFF"
//               barSize={20}
//               radius={[5, 5, 0, 0]}
//             >
//               <LabelList
//                 dataKey="numberOfSessions"
//                 position="bottom"
//                 content={<CustomLabel />}
//               />
//             </Bar>
//           </BarChart>
//         </div>
//         <div className="container mx-auto my-4">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50 text-center">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
//                   Domain Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
//                   Center Average
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
//                   Number Of Sessions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {resultnlist?.graphDetails?.map((item, index) => (
//                 <tr key={index}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {item.domainName}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {item.centerAverage}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {item.numberOfSessions}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className=" flex justify-between items-center  mb-[80px] mt-[80px]">
//           <div>
//             <b className="text-[18px]">Graph of Score </b> (overall score for
//             each member across Domains)
//           </div>
//           <div>
//             Centre average : <b>{resultnlist?.averageForCohort}</b>
//           </div>
//         </div>
//         <Heatmap arr={resultnlist?.participantDomainScores} />

//         <div className="mt-5">
//           <i>Overall Observations: {observation}</i>
//         </div>
//         <div className="mt-10">
//           We are happy to have collaborated with you and look forward to
//           continuing our engagements with your Society’s Senior Citizen Members
//           in spreading joy and providing meaningful involvement.
//         </div>
//         <div className="mb-5 mt-5">
//           <b>Date:</b>{" "}
//           <input className="border-b w-[100px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />
//         </div>
//         <div className="mb-5 mt-5">
//           <b>Name:</b>{" "}
//           <input className="border-b w-[250px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />
//         </div>
//         <div className="mb-5 mt-5">
//           <b>Signature:</b>{" "}
//           <input className="border-b w-[250px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />
//           (with Stamp)
//         </div>
//         <div className="mb-5 mt-5">
//           <b>Mobile:</b>{" "}
//           <input className="border-b w-[120px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />
//         </div>
//         <div className="mt-10">
//           We stand for Trust, Building Positive Relationship & Spreading Joy and
//           Going that Extra Mile.
//         </div>
//       </div>
//       <div className="w-[90%] m-auto">
//         <textarea
//           className="w-[100%] h-[80px] mt-5 shadow rounded-xl p-2 pt-4 outline-none placeholder:pl-2 placeholder:pt-2"
//           placeholder="Write remarks..."
//           name=""
//           id=""
//           value={remarks}
//           onChange={(e) => setRemarks(e.target.value)}
//         />
//         <textarea
//           className="w-[100%] h-[80px] mt-5 shadow rounded-xl p-2 pt-4 outline-none placeholder:pl-2 placeholder:pt-2"
//           placeholder="Write observation..."
//           name=""
//           id=""
//           value={observation}
//           onChange={(e) => setObservation(e.target.value)}
//         />
//         <div className="flex justify-end gap-5 mt-5">
//           <Button onClick={handleExportToExcel}>Export to excel</Button>
//           <Button onClick={generatePDF}>Generate PDF</Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cohortreport;

// import React, { useRef } from "react";
// import {
//   Button,
//   Card,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@material-tailwind/react";
// import axios from "axios";
// axios.defaults.withCredentials = true;
// import { useEffect, useState } from "react";
// import { serverUrl } from "../../api";
// import { MdOutlineDeleteOutline } from "react-icons/md";
// import { CiEdit } from "react-icons/ci";
// import SeeDeatailesEvalution from "../../Componants/SeeDeatailesEvalution";
// import { useReactToPrint } from "react-to-print";
// import { useDispatch, useSelector } from "react-redux";
// import * as XLSX from "xlsx";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Legend,
//   Tooltip,
//   XAxis,
//   YAxis,
//   Line,
//   LabelList,
//   Label,
// } from "recharts";
// import { toast } from "react-toastify";
// import { toastConfig } from "../../App";
// import { getAllCohorts } from "../../Redux/AllListReducer/action";
// import { convertDateFormat, getLocalData } from "../../Utils/localStorage";
// import { useNavigate } from "react-router-dom";
// import ReactApexChart from "react-apexcharts";
// import Heatmap from "../../Componants/Heatmap";
// // import { Link } from "react-router-dom";
// // import { resultnlist } from "./dummy";

// const darkColors = [
//   "#17a589",
//   "#0669d3",
//   "#2ce2a2",
//   "#dc3545",
//   "#027bff",
//   "#d946ef",
//   "#4B0082", // Indigo
//   "#8B00FF", // Violet
//   "#22d172", // Bright Red-Orange
//   "#b8a495", // Bright Yellow
//   "#fbc7c8", // Bright Orange
//   "#93aafd", // Bright Light Green
// ];

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div
//         className="custom-tooltip"
//         style={{
//           backgroundColor: "#fff",
//           padding: "10px",
//           border: "1px solid #ccc",
//         }}
//       >
//         <p className="label">{`Domain: ${label}`}</p>
//         <p className="intro">{`Average: ${payload[0].value}`}</p>
//         <p className="desc">{`Number of Sessions: ${payload[0].payload.numberOfSessions}`}</p>
//       </div>
//     );
//   }

//   return null;
// };

// const CustomLabel = ({ x, y, width, value }) => {
//   return (
//     <text x={x + width / 2} y={y + 20} fill="black" textAnchor="middle">
//       {value + " " + "session"}
//     </text>
//   );
// };

// export const Cohortreport = () => {
//   const [resultnlist, setResultlist] = useState({});
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [cohortSelect, setCohortSelect] = useState("");
//   const [startDate, setStartdate] = useState("");
//   const [endDate, setEnddate] = useState("");
//   const [sessionSelect, setSessionSelect] = useState("");
//   const [getReportData, setGetReportData] = useState([]);
//   const [remarks, setRemarks] = useState("");
//   const [observation, setObservation] = useState("");
//   const [entireEvaluation, setEntireEvaluation] = useState([]);
//   const componantPDF = useRef();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [singleEvalustion, setSingleEvaluation] = useState({});
//   const toggleModal = (el) => {
//     setIsModalOpen(!isModalOpen);
//     setSingleEvaluation(el);
//   };

//   const { cohortList, sessionlist } = useSelector((state) => {
//     return {
//       cohortList: state.AllListReducer.cohortList,
//       sessionlist: state.AllListReducer.sessionlist,
//     };
//   });

//   useEffect(() => {
//     dispatch(getAllCohorts("", ""));
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios
//       .get(
//         `${serverUrl}/report/get/?cohort=${cohortSelect}&start=${startDate}&end=${endDate}`
//       )
//       .then((res) => {
//         console.log(res);
//         setResultlist(res.data.message);
//         setEntireEvaluation(res.data.evaluations);
//       })
//       .catch((err) => {
//         console.log(err);
//         if (err.response && err.response.data && err.response.data.jwtExpired) {
//           toast.error(err.response.data.message, toastConfig);
//           setTimeout(() => {
//             navigate("/auth/sign-in");
//           }, 3000);
//         } else if (err.response && err.response.data) {
//           toast.error(err.response.data.message, toastConfig);
//         } else {
//           toast.error("An unexpected error occurred.", toastConfig);
//         }
//       });
//   };

//   // let arr = [];

//   // evalutionlist?.map((el) => {
//   //   return arr.push({
//   //     name: el.participant.name,
//   //     score: Number(el.grandAverage.toFixed(2)),
//   //   });
//   // });

//   // console.log(resultnlist);

//   let filteredData = resultnlist?.graphDetails?.map((el) => ({
//     "Domain name": el.domainName,
//     "Centre average": el.centerAverage,
//     "No. of sessions": el.numberOfSessions,
//   }));

//   let cohortNameforExcel = cohortList?.filter((el) => el._id == cohortSelect)[0]
//     ?.name;

//   // console.log(cohortList?.filter((el) =>el._id == cohortSelect)[0]?.name);

//   const generatePDF = useReactToPrint({
//     content: () => componantPDF.current,
//     documentTitle: "Centre report",
//     onAfterPrint: () =>
//       toast.success("PDF file download successfully", toastConfig),
//     pageStyle: `
//     .custom-header {
//       padding: 10px; /* Add padding for better readability */
//       border: 1px solid #ccc; /* Add border to header and footer */
//     }
//   `,
//   });

//   // heat map----------------------
//   const transformData = entireEvaluation?.map((item) => {
//     const domains = item.domain.map((domainItem) => ({
//       domainName: domainItem.name,
//       subTopics: domainItem.subTopics,
//       average: domainItem.average,
//     }));

//     return {
//       participant: item.participant.name,
//       participantType: item.participant.participantType,
//       activity: item.activity.name,
//       session: item.session.name,
//       sessionDate: convertDateFormat(item.session.date.split("T")[0]),
//       sessionTime: item.session.numberOfMins,
//       domains: domains,
//       grandAverage: item.grandAverage,
//     };
//   });

//   const transformMainData = (data) => {
//     let result = [];
//     data.forEach((item) => {
//       const {
//         participant,
//         participantType,
//         sessionDate,
//         sessionTime,
//         activity,
//         session,
//         domains,
//         grandAverage,
//       } = item;

//       domains.forEach((domain) => {
//         let domainHeader = true;
//         domain.subTopics.forEach((subtopic) => {
//           if (domainHeader) {
//             result.push([
//               participant,
//               participantType,
//               activity,
//               session,
//               sessionDate,
//               sessionTime,
//               domain.domainName,
//               domain.average,
//               subtopic.content,
//               subtopic.score,
//               grandAverage,
//             ]);
//             domainHeader = false;
//           } else {
//             result.push([
//               "",
//               "",
//               "",
//               "",
//               "",
//               "",
//               "",
//               "",
//               subtopic.content,
//               subtopic.score,
//               "",
//             ]);
//           }
//         });
//       });
//     });

//     return result;
//   };

//   const transformGraphDetails = (graphDetails) => {
//     return graphDetails.map((item) => [
//       item.domainName,
//       item.centerAverage,
//       item.numberOfSessions,
//     ]);
//   };

//   const transformParticipantDomainScores = (participantDomainScores) => {
//     return participantDomainScores.map((item) => [
//       item.domain,
//       item.participant,
//       item.score,
//     ]);
//   };

//   const handleExportToExcel = () => {
//     // Transform data
//     const transformedMainData = transformMainData(transformData);
//     const transformedGraphDetails = transformGraphDetails(
//       resultnlist?.graphDetails
//     );
//     const transformedParticipantDomainScores = transformParticipantDomainScores(
//       resultnlist?.participantDomainScores
//     );

//     // Create worksheets using AoA
//     const mainWorksheet = XLSX.utils.aoa_to_sheet([
//       [
//         "Participant Name",
//         "Participant Type",
//         "Activity Name",
//         "Session Name",
//         "Session Date",
//         "Session Time",
//         "Domain Name",
//         "Domain Average",
//         "Subtopic Content",
//         "Score",
//         "Grand Average",
//       ],
//       ...transformedMainData,
//     ]);

//     const graphDetailsWorksheet = XLSX.utils.aoa_to_sheet([
//       ["Domain Name", "Centre Average", "Number of Sessions"],
//       ...transformedGraphDetails,
//     ]);

//     const participantDomainScoresWorksheet = XLSX.utils.aoa_to_sheet([
//       ["Domain Name", "Participant Name", "Score"],
//       ...transformedParticipantDomainScores,
//     ]);

//     // Create a workbook
//     const workbook = XLSX.utils.book_new();

//     // Add worksheets to the workbook
//     XLSX.utils.book_append_sheet(workbook, mainWorksheet, "Main Data");
//     XLSX.utils.book_append_sheet(
//       workbook,
//       graphDetailsWorksheet,
//       "Graph Details"
//     );
//     XLSX.utils.book_append_sheet(
//       workbook,
//       participantDomainScoresWorksheet,
//       "Participant Domain Scores"
//     );

//     // Export the workbook to an Excel file
//     XLSX.writeFile(
//       workbook,
//       `${cohortNameforExcel}-${startDate}-${endDate}.xlsx`
//     );
//     toast.success("Excel file downloaded successfully", toastConfig);
//   };

//   return (
//     <div className="mb-24">
//       <div className="flex justify-between items-center m-3">
//         <form
//           onSubmit={handleSubmit}
//           className="flex justify-center items-center gap-3"
//         >
//           <select
//             name=""
//             id=""
//             value={cohortSelect}
//             className="border px-2 py-3 rounded-md mt-3 mb-3"
//             onChange={(e) => setCohortSelect(e.target.value)}
//             required
//           >
//             <option value="">Select a centre</option>
//             {cohortList?.map((el) => {
//               return <option value={el._id}>{el.name}</option>;
//             })}
//           </select>
//           <div className="ml-10">From</div>
//           <input
//             name=""
//             id=""
//             type="date"
//             value={startDate}
//             className="border px-2 py-3 rounded-md mt-3 mb-3"
//             onChange={(e) => setStartdate(e.target.value)}
//             required
//           />
//           <div>To</div>
//           <input
//             name=""
//             id=""
//             type="date"
//             value={endDate}
//             className="border px-2 py-3 rounded-md mt-3 mb-3"
//             onChange={(e) => setEnddate(e.target.value)}
//             required
//           />
//           <Button type="submit">Search</Button>
//         </form>
//         <Button onClick={generatePDF}>Download pdf</Button>
//       </div>
//       <div
//         ref={componantPDF}
//         style={{
//           width: "90%",
//           margin: "auto",
//           marginTop: "20px",
//           boxShadow:
//             "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
//         }}
//         className="custom-header p-8 bg-white"
//       >
//         <div className="flex justify-center items-center">
//           <img
//             className="w-[200px] rounded-xl"
//             src="/img/Happy-2age-logo-1-1.png"
//             alt=""
//           />
//         </div>
//         <div className="text-center">
//           <div className="font-bold mb-5 mt-5 text-[20px]">
//             Centre Report{" "}
//             {cohortList?.filter((el) => el._id == cohortSelect)[0]?.name ||
//               "Unknown"}
//           </div>
//           <div className="font-bold mb-5 mt-5 text-[20px]">
//             Journey Together
//           </div>
//           <div className="w-[70%] m-auto mt-5">
//             (This document is based on our basic observations about member’s
//             participation and engagements made in our sessions which is held
//             <input className="border-b w-[50px] ml-2 mr-2 text-center border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />{" "}
//             in a week for{" "}
//             <input className="border-b w-[50px] ml-2 mr-2 text-center border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />{" "}
//             hours. It is limited to the progress made by members in various
//             domains that we have chosen while designing activities.)
//           </div>
//         </div>
//         <div className="w-[100%] m-auto border rounded-xl p-8 mt-5">
//           <div className="flex justify-between items-center ">
//             <div className="mb-3">
//               Name of the Centre:
//               <input
//                 value={
//                   cohortList?.filter((el) => el._id == cohortSelect)[0]?.name ||
//                   "Unknown"
//                 }
//                 className="w-[150px] ml-5 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
//               />
//             </div>
//             <div>
//               Total Participants:
//               <input
//                 value={
//                   cohortList?.filter((el) => el._id == cohortSelect)[0]
//                     ?.participants?.length || "0"
//                 }
//                 className="w-[150px] ml-5 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
//               />
//             </div>
//           </div>

//           <div className="mb-3">
//             Date From :
//             <input
//               value={convertDateFormat(startDate) || ""}
//               className="w-[180px] ml-5 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
//             />
//             To :
//             <input
//               value={convertDateFormat(endDate) || ""}
//               className="w-[180px] ml-5 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none"
//             />
//           </div>
//         </div>
//         <div className="mb-5 mt-5 ">
//           <b className="text-[18px]">Overall Remark:{remarks}</b>{" "}
//         </div>
//         <div>
//           <b className="text-[18px]">Graph of Score </b> (Individual Score
//           against the Group aggregate Score for each Domain)
//         </div>
//         <div className="w-[100%] flex justify-center items-center m-auto mt-12 mb-[80px]">
//           {/* <BarChart width={900} height={500} data={}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               minTickGap={1}
//               dataKey="domainName"
//               tick={{ fontSize: 15,fontWeight:"bold" }}
//             />
//             <YAxis tick={{ fontSize: 15,fontWeight:"bold" }} domain={[0, 7]} />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend />
//             <Bar
//               dataKey="centerAverage"
//               fill="#4A3AFF"
//               barSize={20}
//               radius={[5, 5, 0, 0]}
//             >
//               <LabelList dataKey="numberOfSessions" position="top" />
//             </Bar>
//           </BarChart> */}

//           <BarChart
//             width={900}
//             height={500}
//             data={resultnlist?.graphDetails}
//             margin={{ top: 20, right: 30, left: 20, bottom: 50 }} // Adjust the bottom margin here
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="domainName"
//               tick={{ fontSize: 15, fontWeight: "bold" }}
//             >
//               <Label
//                 value="Domain name"
//                 offset={0}
//                 position="insideBottom"
//                 dy={50}
//               />{" "}
//               {/* Adjust dy as needed */}
//             </XAxis>
//             <YAxis tick={{ fontSize: 15, fontWeight: "bold" }} domain={[0, 7]}>
//               <Label
//                 value="Average"
//                 angle={-90}
//                 position="insideLeft"
//                 style={{ textAnchor: "middle" }}
//               />
//             </YAxis>
//             <Tooltip content={<CustomTooltip />} />
//             <Legend />
//             <Bar
//               dataKey="centerAverage"
//               fill="#4A3AFF"
//               barSize={20}
//               radius={[5, 5, 0, 0]}
//             >
//               <LabelList
//                 dataKey="numberOfSessions"
//                 position="bottom"
//                 content={<CustomLabel />}
//               />
//             </Bar>
//           </BarChart>
//         </div>
//         <div className="container mx-auto my-4">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50 text-center">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
//                   Domain Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
//                   Center Average
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
//                   Number Of Sessions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {resultnlist?.graphDetails?.map((item, index) => (
//                 <tr key={index}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {item.domainName}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {item.centerAverage}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {item.numberOfSessions}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className=" flex justify-between items-center  mb-[80px] mt-[80px]">
//           <div>
//             <b className="text-[18px]">Graph of Score </b> (overall score for
//             each member across Domains)
//           </div>
//           <div>
//             Centre average : <b>{resultnlist?.averageForCohort}</b>
//           </div>
//         </div>
//         <Heatmap arr={resultnlist?.participantDomainScores} />

//         <div className="mt-5">
//           <i>Overall Observations: {observation}</i>
//         </div>
//         <div className="mt-10">
//           We are happy to have collaborated with you and look forward to
//           continuing our engagements with your Society’s Senior Citizen Members
//           in spreading joy and providing meaningful involvement.
//         </div>
//         <div className="mb-5 mt-5">
//           <b>Date:</b>{" "}
//           <input className="border-b w-[100px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />
//         </div>
//         <div className="mb-5 mt-5">
//           <b>Name:</b>{" "}
//           <input className="border-b w-[250px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />
//         </div>
//         <div className="mb-5 mt-5">
//           <b>Signature:</b>{" "}
//           <input className="border-b w-[250px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />
//           (with Stamp)
//         </div>
//         <div className="mb-5 mt-5">
//           <b>Mobile:</b>{" "}
//           <input className="border-b w-[120px] ml-5 border-b-2 border-opacity-50 outline-none placeholder-gray-300 placeholder-opacity-0 transition duration-200 focus:outline-none" />
//         </div>
//         <div className="mt-10">
//           We stand for Trust, Building Positive Relationship & Spreading Joy and
//           Going that Extra Mile.
//         </div>
//       </div>
//       <div className="w-[90%] m-auto">
//         <textarea
//           className="w-[100%] h-[80px] mt-5 shadow rounded-xl p-2 pt-4 outline-none placeholder:pl-2 placeholder:pt-2"
//           placeholder="Write remarks..."
//           name=""
//           id=""
//           value={remarks}
//           onChange={(e) => setRemarks(e.target.value)}
//         />
//         <textarea
//           className="w-[100%] h-[80px] mt-5 shadow rounded-xl p-2 pt-4 outline-none placeholder:pl-2 placeholder:pt-2"
//           placeholder="Write observation..."
//           name=""
//           id=""
//           value={observation}
//           onChange={(e) => setObservation(e.target.value)}
//         />
//         <div className="flex justify-end gap-5 mt-5">
//           <Button onClick={handleExportToExcel}>Export to excel</Button>
//           <Button onClick={generatePDF}>Generate PDF</Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cohortreport;
