import React from 'react'
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
import Heatmap from "../../Componants/Heatmap";
import { convertDateFormat } from '../../Utils/localStorage';
import { Document, Font, Page, StyleSheet, Text } from '@react-pdf/renderer';


Font.register({
    family: "Oswald",
    src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
  });
  
  const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
    },
    title: {
      fontSize: 24,
      textAlign: "center",
      fontFamily: "Oswald",
    },
    author: {
      fontSize: 12,
      textAlign: "center",
      marginBottom: 40,
    },
    subtitle: {
      fontSize: 18,
      margin: 12,
      fontFamily: "Oswald",
    },
    text: {
      margin: 12,
      fontSize: 14,
      textAlign: "justify",
      fontFamily: "Times-Roman",
    },
    image: {
      marginVertical: 15,
      marginHorizontal: 100,
    },
    header: {
      fontSize: 12,
      marginBottom: 20,
      textAlign: "center",
      color: "grey",
    },
    pageNumber: {
      position: "absolute",
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey",
    },
  });

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
      <text x={x + width / 2} y={y + 20} fill="#FFF" textAnchor="middle">
        {value}
      </text>
    );
  };

  // ref={componantPDF}
  // style={{ width: "90%", margin: "auto", marginTop: "20px" }}
const CohortPdf = ({cohortList,
    cohortSelect,
    startDate,
    endDate,
    remarks,
    resultnlist,
    observation}) => {
  return (
    <Document>
        <Page style={styles.body}>

        <div
          className="border border-black shadow rounded-xl p-8 bg-white"
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
          <div className="w-[100%] m-auto border rounded-xl p-8 mt-5">
            <div className="flex justify-between items-center ">
              <div className="mb-3">
                Name of the Centre:
                <input
                  value={
                    cohortList?.filter((el) => el._id == cohortSelect)[0]
                      ?.name || "Unknown"
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
           

            <BarChart
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
                <Label value="Domain name" offset={0} position="insideBottom" />
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
          <Heatmap arr={resultnlist?.participantDomainScores} />

          <div className="mt-5">
            <i>Overall Observations: {observation}</i>
          </div>
          <div className="mt-10">
            We are happy to have collaborated with you and look forward to
            continuing our engagements with your Society’s Senior Citizen
            Members in spreading joy and providing meaningful involvement.
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
            We stand for Trust, Building Positive Relationship & Spreading Joy
            and Going that Extra Mile.
          </div>
        </div>
          </Page>
      </Document>
  )
}

export default CohortPdf