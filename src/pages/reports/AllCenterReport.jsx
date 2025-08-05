import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiDownload, FiCalendar, FiFilter } from "react-icons/fi";
import axiosInstance from "../../utils/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HCMore from "highcharts/highcharts-more";
import Heatmap from "highcharts/modules/heatmap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom/client";

// Robust Highcharts module initialization
if (typeof HCMore === "function") {
  HCMore(Highcharts);
} else if (HCMore && typeof HCMore.default === "function") {
  HCMore.default(Highcharts);
}
if (typeof Heatmap === "function") {
  Heatmap(Highcharts);
} else if (Heatmap && typeof Heatmap.default === "function") {
  Heatmap.default(Highcharts);
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const CenterHappinessChart = ({ data }) => {
  const chartData = data.map((param) => ({
    happinessParameter: param.happinessParameter,
    centerAverage: Number(param.centerAverage),
  }));
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="happinessParameter"
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            color: "#000000",
          }}
        />
        <Legend wrapperStyle={{ paddingTop: "10px" }} />
        <Bar
          dataKey="centerAverage"
          name="Center Average"
          fill="#239d62"
          barSize={30}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const ParticipantHeatmap = ({ data }) => {
  const participants = [...new Set(data.map((item) => item.participant))];
  const domains = [...new Set(data.map((item) => item.domain))];
  const heatmapData = data.map((item, index) => [
    domains.indexOf(item.domain),
    participants.indexOf(item.participant),
    item.score === "NA" ? null : parseFloat(item.score),
  ]);

  const options = {
    chart: {
      type: "heatmap",
      height: 500,
      backgroundColor: "#ffffff",
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: domains,
      title: {
        text: "Domains",
        style: { color: "#000000", fontSize: "14px" },
      },
      labels: { style: { color: "#000000", fontSize: "12px" } },
    },
    yAxis: {
      categories: participants,
      title: {
        text: "Participants",
        style: { color: "#000000", fontSize: "14px" },
      },
      labels: { style: { color: "#000000", fontSize: "12px" } },
    },
    colorAxis: {
      min: 0,
      max: 7,
      stops: [
        [0, "#FF8042"], // Orange
        [0.285, "#FF8042"], // Orange (0-2: 2/7 = 0.285)
        [0.286, "#f3ba00"], // Yellow
        [0.571, "#f3ba00"], // Yellow (2.1-4: 1.9/7 = 0.571)
        [0.572, "#239d62"], // Green
        [1, "#239d62"], // Green (4.1-7: 2.9/7 = 0.572-1)
      ],
      labels: { enabled: false },
      title: { enabled: false },
      legend: { enabled: false },
      visible: false,
    },
    series: [
      {
        name: "Participant Domain Scores",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        data: heatmapData,
        dataLabels: {
          enabled: true,
          color: "#000000",
          format: "{point.value:.1f}",
          style: { fontSize: "12px" },
        },
      },
    ],
    tooltip: {
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
      borderRadius: 6,
      formatter: function () {
        return `<b>${
          this.series.xAxis.categories[this.point.x]
        }</b><br>Participant: ${
          this.series.yAxis.categories[this.point.y]
        }<br>Score: ${this.point.value || "NA"}`;
      },
    },
    legend: {
      enabled: true,
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
      itemStyle: { color: "#000000", fontSize: "10px" },
    },
  };

  return (
    <div className="heatmap-chart">
      <HighchartsReact highcharts={Highcharts} options={options} />
      <div
        style={{
          marginTop: "24px",
          padding: "16px",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: "#239d62",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
              }}
            ></div>
            <span
              style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}
            >
              Green (4.1-7)
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: "#f3ba00",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
              }}
            ></div>
            <span
              style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}
            >
              Yellow (2.1-4)
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: "#FF8042",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
              }}
            ></div>
            <span
              style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}
            >
              Orange (0-2)
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: "#ffffff",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
              }}
            ></div>
            <span
              style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}
            >
              White (NA)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PDFPieChart = ({ data, title }) => {
  console.log("PDFPieChart data:", data, "title:", title);
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    count,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {count}
      </text>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div style={{ width: "220px", height: "300px" }}>
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#333",
              margin: 0,
            }}
          >
            {title}
          </h4>
        </div>
        <div style={{ textAlign: "center", color: "#666", marginTop: "50px" }}>
          No data available
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "220px", height: "300px" }}>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h4
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
            margin: 0,
          }}
        >
          {title}
        </h4>
      </div>
      <PieChart>
        <Pie
          data={data}
          cx="110"
          cy="100"
          outerRadius={80}
          dataKey="count"
          label={renderCustomLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        {data.map((entry, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "5px",
              fontSize: "12px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: COLORS[index % COLORS.length],
                marginRight: "5px",
                borderRadius: "2px",
              }}
            />
            <span style={{ color: "#666" }}>
              {entry.gender || entry.participantType || entry.ageRange}:{" "}
              {entry.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AllCenterReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [reportData, setReportData] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [helpType, setHelpType] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [overallObservation, setOverallObservation] = useState("");
  const [jointPlan, setJointPlan] = useState("");
  const [signatureDate, setSignatureDate] = useState("");
  const [signatureName, setSignatureName] = useState("");
  const [signatureMobile, setSignatureMobile] = useState("");
  const reportRef = useRef(null);

  const fetchReport = async () => {
    if (!dateRange.start || !dateRange.end) {
      setError("Please select a date range");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/report/cohort/all", {
        params: {
          start: dateRange.start,
          end: dateRange.end,
        },
      });
      if (response.data.success) {
        console.log("Fetched reportData:", response.data);
        setReportData(response.data);
      } else {
        setError(response.data.message || "Failed to fetch report");
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      setError(error.response?.data?.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportData) return;

    try {
      setIsGeneratingPDF(true);

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;

      // Header
      pdf.setDrawColor(35, 157, 98);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, margin, contentWidth, pageHeight - 2 * margin);
      let yPos = margin + 10;

      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("All Centers Report", pageWidth / 2, yPos, { align: "center" });
      yPos += 15;

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text("Our Journey Together", pageWidth / 2, yPos, {
        align: "center",
      });
      yPos += 20;

      // Report Information
      const boxHeight = 40;
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(35, 157, 98);
      pdf.setLineWidth(0.2);
      pdf.rect(margin + 5, yPos, contentWidth - 10, boxHeight, "FD");

      const leftColumnX = margin + 10;
      const rightColumnX = margin + 10 + (contentWidth - 20) / 2;
      const labelWidth = 40;
      const lineHeight = 7;
      let currentY = yPos + 8;

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 157, 98);
      pdf.text("Date From:", leftColumnX, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text(dateRange.start || "N/A", leftColumnX + labelWidth, currentY);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 157, 98);
      pdf.text("Date To:", rightColumnX, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text(dateRange.end || "N/A", rightColumnX + labelWidth, currentY);

      currentY += lineHeight;

      const totalParticipants =
        reportData.message.genderData?.reduce(
          (sum, item) => sum + item.count,
          0
        ) || 0;
      const totalDomains = reportData.message.graphDetails?.length || 0;

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 157, 98);
      pdf.text("Total Participants:", leftColumnX, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text(
        totalParticipants.toString(),
        leftColumnX + labelWidth,
        currentY
      );

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 157, 98);
      pdf.text("Total Domains:", rightColumnX, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text(totalDomains.toString(), rightColumnX + labelWidth, currentY);

      // Domain Performance Table
      if (reportData.message.graphDetails?.length > 0) {
        pdf.addPage();
        pdf.setDrawColor(35, 157, 98);
        pdf.setLineWidth(0.5);
        pdf.rect(margin, margin, contentWidth, pageHeight - 2 * margin);
        yPos = margin + 10;

        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Domain Performance Across All Centers", margin + 10, yPos);
        yPos += 15;

        const domainTableData = reportData.message.graphDetails.map((item) => [
          item.domainName,
          item.cohort,
          parseFloat(item.average).toFixed(2),
        ]);

        autoTable(pdf, {
          startY: yPos,
          head: [["Domain", "Center", "Average Score"]],
          body: domainTableData,
          theme: "grid",
          headStyles: {
            fillColor: [35, 157, 98],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "center",
            fontSize: 10,
            font: "helvetica",
          },
          styles: {
            fontSize: 10,
            cellPadding: 3,
            halign: "center",
            font: "helvetica",
          },
          margin: { left: margin + 10, right: margin + 10 },
        });
      }

      // Happiness Parameter Averages Table
      if (reportData.message.happinessParameterAverages?.length > 0) {
        pdf.addPage();
        pdf.setDrawColor(35, 157, 98);
        pdf.setLineWidth(0.5);
        pdf.rect(margin, margin, contentWidth, pageHeight - 2 * margin);
        yPos = margin + 10;

        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Happiness Parameter Averages", margin + 10, yPos);
        yPos += 15;

        const happinessTableData =
          reportData.message.happinessParameterAverages.map((item) => [
            item.happinessParameter,
            parseFloat(item.centerAverage).toFixed(2),
          ]);

        autoTable(pdf, {
          startY: yPos,
          head: [["Happiness Parameter", "Center Average"]],
          body: happinessTableData,
          theme: "grid",
          headStyles: {
            fillColor: [35, 157, 98],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "center",
            fontSize: 10,
            font: "helvetica",
          },
          styles: {
            fontSize: 10,
            cellPadding: 3,
            halign: "center",
            font: "helvetica",
          },
          margin: { left: margin + 10, right: margin + 10 },
        });
      }

      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setDrawColor(35, 157, 98);
        pdf.setLineWidth(0.5);
        pdf.rect(margin, margin, contentWidth, pageHeight - 2 * margin);
      }

      pdf.save(
        `all-centers-report-${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please check console for details.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        All Centers Report
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62] focus:border-[#239d62] sm:text-sm"
            />
          </div>
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62] focus:border-[#239d62] sm:text-sm"
            />
          </div>
          <div className="md:col-span-4 flex items-end">
            <button
              onClick={fetchReport}
              disabled={loading}
              className="w-full px-4 py-2 bg-[#239d62] text-white rounded-md hover:bg-[#239d62]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Generate Report"}
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {reportData && (
          <div className="mt-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    All Centers Report
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Generated on: {new Date().toLocaleDateString()}
                    </span>
                    <button
                      onClick={downloadPDF}
                      disabled={isGeneratingPDF}
                      className="flex items-center px-3 py-1 text-sm text-[#239d62] hover:text-[#239d62]/90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiDownload className="mr-1" />
                      {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="relative"
                style={{ height: "calc(100vh - 300px)" }}
              >
                <div className="absolute inset-0 overflow-y-auto">
                  <div
                    ref={reportRef}
                    className="max-w-[1000px] mx-auto bg-white p-8 shadow-lg relative"
                    style={{ minHeight: "100%" }}
                  >
                    <div className="absolute inset-0 border-2 border-[#239d62] rounded-lg pointer-events-none"></div>
                    <div className="flex justify-center mb-8">
                      <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-[25px] w-[70px]"
                      />
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-2">
                      All Centers Report
                    </h2>
                    <h3 className="text-xl text-center mb-6">
                      Our Journey Together
                    </h3>
                    <div className="text-center text-sm text-gray-600 mb-8">
                      <p>
                        This document is based on our basic observations about
                        all centers' performance
                      </p>
                      <p>and engagements made in our sessions which is held</p>
                      <div className="flex justify-center items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={helpType}
                          onChange={(e) => setHelpType(e.target.value)}
                          placeholder="Number of days"
                          className="w-48 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                        />
                        <span>in a week for</span>
                        <input
                          type="number"
                          value={hoursPerWeek}
                          onChange={(e) => setHoursPerWeek(e.target.value)}
                          placeholder="Hours"
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                        />
                        <span>hours</span>
                      </div>
                      <p>
                        It is limited to the progress made by members in various
                        domains that we
                      </p>
                      <p>have chosen while designing activities.</p>
                    </div>
                    <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-[#239d62]">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-bold text-[#239d62]">
                            Date From
                          </p>
                          <p className="text-sm text-gray-900">
                            {dateRange.start}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#239d62]">
                            Date To
                          </p>
                          <p className="text-sm text-gray-900">
                            {dateRange.end}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#239d62]">
                            Total Participants
                          </p>
                          <p className="text-sm text-gray-900">
                            {reportData.message.genderData?.reduce(
                              (sum, item) => sum + item.count,
                              0
                            ) || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#239d62]">
                            Total Domains
                          </p>
                          <p className="text-sm text-gray-900">
                            {reportData.message.graphDetails?.length || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#239d62]">
                            Average Score
                          </p>
                          <p className="text-sm text-gray-900">
                            {reportData.message.graphDetails?.length > 0
                              ? (
                                  reportData.message.graphDetails.reduce(
                                    (sum, item) =>
                                      sum + parseFloat(item.average),
                                    0
                                  ) / reportData.message.graphDetails.length
                                ).toFixed(2)
                              : "0.00"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Happiness Parameter Averages */}
                    {reportData?.message?.happinessParameterAverages &&
                      reportData.message.happinessParameterAverages.length >
                        0 && (
                        <div className="mb-8 happiness-chart">
                          <h3 className="text-base font-semibold text-gray-900 mb-4">
                            Happiness Parameter Averages
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-lg border border-[#239d62] mb-4">
                            <CenterHappinessChart
                              data={
                                reportData.message.happinessParameterAverages
                              }
                            />
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead>
                                <tr className="bg-[#239d62]">
                                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Happiness Parameter
                                  </th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                    Center Average
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.message.happinessParameterAverages.map(
                                  (param) => (
                                    <tr
                                      key={param.happinessParameter}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {param.happinessParameter}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                        {param.centerAverage}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                    {/* Domain Performance Chart */}
                    {reportData.message.graphDetails &&
                      reportData.message.graphDetails.length > 0 && (
                        <div className="mb-8 domain-chart">
                          <h3 className="text-base font-semibold text-gray-900 mb-4">
                            Domain Performance
                          </h3>
                          <div className="h-[500px] mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={reportData.message.graphDetails}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  left: 20,
                                  bottom: 100,
                                }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#e5e7eb"
                                />
                                <XAxis
                                  dataKey="domainName"
                                  angle={-45}
                                  textAnchor="end"
                                  height={100}
                                  tick={{ fontSize: 12 }}
                                  axisLine={{ stroke: "#e5e7eb" }}
                                />
                                <YAxis
                                  domain={[0, 6]}
                                  tick={{ fontSize: 12 }}
                                  axisLine={{ stroke: "#e5e7eb" }}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "6px",
                                    color: "#000000",
                                  }}
                                />
                                <Legend
                                  wrapperStyle={{
                                    paddingTop: "10px",
                                    paddingBottom: "20px",
                                  }}
                                  verticalAlign="top"
                                />
                                <Bar
                                  dataKey="average"
                                  name="Center Average"
                                  fill="#239d62"
                                  barSize={30}
                                  radius={[4, 4, 0, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Domain Performance Table */}
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead>
                                <tr className="bg-[#239d62]">
                                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Domain
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Center
                                  </th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                    Average Score
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.message.graphDetails.map(
                                  (item, index) => (
                                    <tr
                                      key={index}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.domainName}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.cohort}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        {parseFloat(item.average).toFixed(2)}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                    {/* Participant Domain Scores Heatmap */}
                    {reportData?.message?.participantDomainScores && (
                      <div className="mb-8">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">
                          Participant Domain Scores
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-[#239d62]">
                          <ParticipantHeatmap
                            data={reportData.message.participantDomainScores}
                          />
                        </div>
                      </div>
                    )}

                    {/* Demographics */}
                    {reportData.message.genderData &&
                      reportData.message.genderData.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-base font-semibold text-gray-900 mb-4">
                            Demographics
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <div
                                style={{
                                  width: "200px",
                                  height: "260px",
                                  margin: "0 auto",
                                }}
                              >
                                <PDFPieChart
                                  data={reportData.message.genderData}
                                  title="Gender Distribution"
                                />
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <div
                                style={{
                                  width: "200px",
                                  height: "260px",
                                  margin: "0 auto",
                                }}
                              >
                                <PDFPieChart
                                  data={reportData.message.participantTypeData}
                                  title="Participant Type Distribution"
                                />
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <div
                                style={{
                                  width: "200px",
                                  height: "260px",
                                  margin: "0 auto",
                                }}
                              >
                                <PDFPieChart
                                  data={reportData.message.ageData}
                                  title="Age Distribution"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Happiness Parameter Averages */}
                    {reportData?.message?.happinessParameterAverages &&
                      reportData.message.happinessParameterAverages.length >
                        0 && (
                        <div className="mb-8">
                          <h3 className="text-base font-semibold text-gray-900 mb-4">
                            Happiness Parameter Averages
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-lg border border-[#239d62] mb-6">
                            <CenterHappinessChart
                              data={
                                reportData.message.happinessParameterAverages
                              }
                            />
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead>
                                <tr className="bg-[#239d62]">
                                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Happiness Parameter
                                  </th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                    Center Average
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.message.happinessParameterAverages.map(
                                  (item, index) => (
                                    <tr
                                      key={index}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.happinessParameter}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        {parseFloat(item.centerAverage).toFixed(
                                          2
                                        )}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                    {/* Overall Observation */}
                    <div className="mb-8">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">
                        Overall Observation
                      </h3>
                      <textarea
                        value={overallObservation}
                        onChange={(e) => setOverallObservation(e.target.value)}
                        placeholder="Enter overall observation..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#239d62] focus:border-[#239d62] resize-none"
                        rows={4}
                      />
                    </div>

                    {/* Joint Plan */}
                    <div className="mb-8">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">
                        Joint Plan
                      </h3>
                      <textarea
                        value={jointPlan}
                        onChange={(e) => setJointPlan(e.target.value)}
                        placeholder="Enter joint plan..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#239d62] focus:border-[#239d62] resize-none"
                        rows={4}
                      />
                    </div>

                    {/* Signature */}
                    <div className="mb-8">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">
                        Signature
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            value={signatureName}
                            onChange={(e) => setSignatureName(e.target.value)}
                            placeholder="Enter name..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#239d62] focus:border-[#239d62]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                          </label>
                          <input
                            type="date"
                            value={signatureDate}
                            onChange={(e) => setSignatureDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#239d62] focus:border-[#239d62]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mobile
                          </label>
                          <input
                            type="text"
                            value={signatureMobile}
                            onChange={(e) => setSignatureMobile(e.target.value)}
                            placeholder="Enter mobile number..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#239d62] focus:border-[#239d62]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCenterReport;
