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
// import { useReactToPrint } from "react-to-print";
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
import { PieChart, Pie, Cell } from "recharts";

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

const CustomLabel = ({ x, width, value, chartHeight }) => {
  const yPosition = chartHeight + 20; // Fixed position below the x-axis
  return (
    <text x={x + width / 2} y={yPosition} fill="black" textAnchor="middle">
      {value + " session"}
    </text>
  );
};

// const CustomLegend = (props) => {
//   const { payload } = props;
//   return (
//     <div className="custom-legend">
//       {payload.filter(entry => entry.value !== 'centerAverage').map((entry, index) => (
//         <div key={`item-${index}`} style={{ color: entry.color }}>
//           {entry.value}
//         </div>
//       ))}
//     </div>
//   );
// };

const BarChartComponent = ({ data, onRendered }) => {
  return (
    <div id="chart-container">
      <BarChart
        width={1000}
        height={600}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 30 }} // Adjust the bottom margin here
      >
        <CartesianGrid strokeDasharray="3 3" padding={{ bottom: 50 }} />
        <XAxis
          dataKey="domainName"
          tick={{ fontSize: 13, fontWeight: "bold", fill: "black" }}
        >
          <Label
            value="Domain name"
            offset={0}
            position="insideBottom"
            dy={25}
            style={{ fontWeight: "bold", fontSize: "18px", fill: "black" }}
          />
        </XAxis>
        <YAxis
          tick={{ fontSize: 15, fontWeight: "bold", fill: "black" }}
          domain={[0, 7]}
        >
          <Label
            value="Average"
            angle={-90}
            position="insideLeft"
            style={{
              textAnchor: "middle",
              fontWeight: "bold",
              fontSize: "18px",
              fill: "black",
            }}
          />
        </YAxis>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="horizontal"
          verticalAlign="top"
          align="center"
          wrapperStyle={{ paddingBottom: 20 }}
        />
        <Bar
          dataKey="centerAverage"
          fill="#4A3AFF"
          barSize={15}
          radius={[20, 0, 20, 0]}
        >
          <LabelList
            dataKey="numberOfSessions"
            tick={{ fontSize: 10 }}
            content={<CustomLabel chartHeight={555} />}
          />
        </Bar>
      </BarChart>
    </div>
  );
};

const DynamicPieChart = ({ data, colors, title, dataKey, nameKey }) => {
  if (!data || data.length === 0) {
    return <div className="w-80 p-4">No Data Available</div>;
  }

  return (
    <div className="w-[45%] p-4">
      <p className="text-[18px] font-bold text-center mb-2">{title}</p>
      <PieChart width={350} height={350}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          dataKey={dataKey} // Dynamic dataKey for value
          label={({
            name,
            value,
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
          }) => {
            const RADIAN = Math.PI / 180;
            const radius = outerRadius - 20;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                fontWeight="bold"
              >
                {value} {/* Show the count (value) inside the chart */}
              </text>
            );
          }} // Label inside the chart
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </div>
  );
};
import html2canvas from "html2canvas";
import Heatmap2 from "../../Componants/Heatmap2";

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

const CaptureHeatmap = ({ arr, onCapture }) => {
  const chartheatRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      const captureChartAsImage = async () => {
        if (chartheatRef.current) {
          const canvas = await html2canvas(chartheatRef.current);
          const imgData = canvas.toDataURL("image/png");
          onCapture(imgData);
        }
      };
      captureChartAsImage();
    }, 2000);
  }, [arr]);

  return (
    <div ref={chartheatRef}>
      <Heatmap2 arr={arr} />
    </div>
  );
};

const styles = StyleSheet.create({
  document: {},
  page: {
    padding: "35px",
    // backgroundColor:"#ffeaf2",
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
    padding: "35px",
  },
  section: {
    width: "100%",
    marginBottom: 30,
    marginTop: 30,
  },
  image: {
    width: "100%",
    // height: "280px",
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
    fontSize: "12px",
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
  <Document style={styles.document}>
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
            All Centre Report{" "}
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
              fontSize: "12px",
              lineHeight: "1.5px",
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
        </View>

        <View style={styles.flexContainer}>
          <View>
            <Text style={styles.boldText}>
              Graph of Score : (overall score for each centre across Domains)
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
            <Text>Overall Remark : {remarks}</Text>
          </View>

          <View style={styles.marginTop5}>
            <Text>Overall Observations : {observation}</Text>
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
          <View style={{ fontSize: "12px", marginTop: "15px" }}>
            <Text>
              <Text>Date :</Text>
              <Text style={[styles.input]}> {date}</Text>
            </Text>
          </View>
          <View style={{ fontSize: "12px", marginTop: "15px" }}>
            <Text>
              <Text>Name :</Text>
              <Text style={[styles.input, styles.longInput]}> {name}</Text>
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

export const AllCentreReport = () => {
  const [resultnlist, setResultlist] = useState([]);
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
  const [genderData, setGenderData] = useState();

  const [participantData, setParticipantData] = useState();

  const COLORS_GENDER = ["#22d172", "#fe2880", "#efbb29"];

  const COLORS_PARTICIPANT = ["#22d172", "#efbb29"];

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
        `${serverUrl}/report/cohort/all/?start=${startDate}&end=${endDate}`,
        {
          headers: {
            Authorization: `${getLocalData("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data.message.genderData);
        setResultlist(res.data.message.graphDetails);
        setEntireEvaluation(res.data.message.evaluations);

        const genderChartData = res.data.message.genderData.map((item) => ({
          name: item.gender,
          value: item.count,
        }));

        const participantChartData = res.data.message.participantTypeData.map(
          (item) => ({
            name: item.participantType,
            value: item.count,
          })
        );

        setGenderData(genderChartData);
        setParticipantData(participantChartData);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.jwtExpired) {
          toast.error(err.response.data.message, toastConfig);
          setTimeout(() => {
            navigate("/auth/sign-in");
          }, 3000);
        } else if (err.response && err.response.data) {
          // toast.error(err.response.data.message, toastConfig);
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

  // heat map----------------------
  const transformData = entireEvaluation?.map((item) => {
    const domains = item.domain.map((domainItem) => ({
      domainName: domainItem.name,
      subTopics: domainItem.subTopics,
      average: domainItem.average,
    }));

    return {
      participant: item.participant?.name,

      session: item.session?.name,
      sessionDate: convertDateFormat(item.session?.date.split("T")[0]),
      sessionTime: item.session?.numberOfMins,
      domains: domains,
      grandAverage: item.grandAverage,
    };
  });

  const transformMainData = (data) => {
    let result = [];
    data.forEach((item) => {
      const {
        participant,

        sessionDate,
        sessionTime,

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
      item.cohort,
      item.average,
    ]);
  };

  const handleExportToExcel = () => {
    const transformedGraphDetails = transformGraphDetails(resultnlist);

    const graphDetailsWorksheet = XLSX.utils.aoa_to_sheet([
      ["Domain Name", "Centre", "Average"],
      ...transformedGraphDetails,
    ]);

    // Create a workbook
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      graphDetailsWorksheet,
      "Graph Details"
    );

    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, `All Centre Report ${startDate}-${endDate}.xlsx`);
    toast.success("Excel file downloaded successfully", toastConfig);
  };

  return (
    <div className="mb-24">
      <div className="flex justify-between items-center m-3">
        <form
          onSubmit={handleSubmit}
          className="flex justify-center items-center gap-3"
        >
          {/* <select
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
          </select> */}
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
            All Centre Report{" "}
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
        {/* <div>
          <b className="text-[18px]">Graph of Score </b> (Individual Score
          against the Group aggregate Score for each Domain)
        </div> */}

        <div className=" flex justify-between items-center  mb-[80px] mt-[80px]">
          <div>
            <b className="text-[18px]">Graph of Score </b> (overall score for
            each centre across Domains)
          </div>
        </div>
        {/* <div className="border"> */}

        <CaptureHeatmap arr={resultnlist} onCapture={handleHeatmapCapture} />
        {/* </div> */}
        <div className="flex flex-col justify-between lg:flex-row  items-center gap-6 p-6 px-10 ">
          <DynamicPieChart
            data={genderData}
            colors={COLORS_GENDER}
            title="Gender Distribution"
            dataKey="value"
            nameKey="gender"
          />

          <DynamicPieChart
            data={participantData}
            colors={COLORS_PARTICIPANT}
            title="Participant Type Distribution"
            dataKey="value"
            nameKey="participantType"
          />
        </div>
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
            fileName={`All Centre Report-${startDate}-${endDate}.pdf`}
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

export default AllCentreReport;
