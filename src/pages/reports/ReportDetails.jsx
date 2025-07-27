import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FiDownload } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import axiosInstance from "../../utils/axios";

const ReportDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(location.state?.report || null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (!reportData) {
      fetchReport();
    }
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/report/history/${id}`);

      console.log(response.data.data);
      if (response.data.success) {
        setReportData(response.data.data);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const downloadPDF = async () => {
    if (!reportData) return;

    try {
      setIsGeneratingPDF(true);
      setError(null);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add border
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;

      // Add logo
      const logoWidth = 70;
      const logoHeight = 20;
      pdf.addImage(
        "/logo.png",
        "PNG",
        (pageWidth - logoWidth) / 2,
        15,
        logoWidth,
        logoHeight
      );

      // Add title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      const title = "Individual Member Observations";
      pdf.text(title, pageWidth / 2, 50, { align: "center" });

      // Add subtitle
      pdf.setFontSize(16);
      const subtitle = "Our Journey Together";
      pdf.text(subtitle, pageWidth / 2, 60, { align: "center" });

      // Add description text
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const description = [
        "This document is based on our basic observations about your participation",
        "and engagements made in our sessions which is held",
        `${reportData.helpType || "________________"} in a week for ${
          reportData.hoursPerWeek || "____"
        } hours`,
        "It is limited to the progress made by members in various domains that we",
        "have chosen while designing activities.",
      ];

      let yPos = 70;
      description.forEach((line) => {
        pdf.text(line, pageWidth / 2, yPos, { align: "center" });
        yPos += 5;
      });

      // Add member information box
      yPos += 5;
      const boxStartY = yPos;
      const boxEndY = boxStartY + 30;

      // Add subtle background color
      pdf.setFillColor(248, 250, 252);
      pdf.rect(20, boxStartY, pageWidth - 40, boxEndY - boxStartY, "F");

      pdf.setFontSize(11);
      const memberInfo = [
        ["Name:", reportData.participant?.name],
        [
          "Date of Birth:",
          new Date(reportData.participant?.dob).toLocaleDateString(),
        ],
        ["Gender:", reportData.participant?.gender],
        ["Phone:", reportData.participant?.phone],
        [
          "Address:",
          `${reportData.participant?.address?.addressLine}, ${reportData.participant?.address?.city}, ${reportData.participant?.address?.state} - ${reportData.participant?.address?.pincode}`,
        ],
      ];

      // Calculate positions with improved alignment
      const leftColumnX = 25;
      const rightColumnX = pageWidth / 2 + 5;
      const labelWidth = 38 - 10;
      const lineHeight = 7;
      const padding = 8;

      // First row: Name and Gender
      let currentY = boxStartY + padding;

      // Name
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 157, 98);
      pdf.text("Name:", leftColumnX, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      const nameWidth = pdf.getTextWidth(memberInfo[0][1]);
      pdf.text(memberInfo[0][1], leftColumnX + labelWidth - 14, currentY);

      // Gender
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 157, 98);
      pdf.text("Gender:", rightColumnX, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text(memberInfo[2][1], rightColumnX + labelWidth - 11, currentY);

      // Second row: Phone and Date of Birth
      currentY += lineHeight;

      // Phone
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 157, 98);
      pdf.text("Phone:", leftColumnX, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text(memberInfo[3][1], leftColumnX + labelWidth - 12, currentY);

      // Date of Birth
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 157, 98);
      pdf.text("Date of Birth:", rightColumnX, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text(memberInfo[1][1], rightColumnX + labelWidth, currentY);

      // Third row: Address
      currentY += lineHeight;
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 157, 98);
      pdf.text("Address:", leftColumnX, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      const addressLines = pdf.splitTextToSize(
        memberInfo[4][1],
        pageWidth - 80
      );
      pdf.text(addressLines, leftColumnX + labelWidth - 9, currentY);

      yPos = boxEndY + 10;

      // Add attendance summary
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Attendance Summary", 20, yPos);

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      yPos += 8;
      pdf.text(
        `Attendance: ${reportData.attendance} out of: ${reportData.totalNumberOfSessions}`,
        20,
        yPos
      );

      // Add domain performance
      yPos += 15;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        "Graph (Bar) : On various Domains ratings against the aggregate rating of the Cohort (Centre)",
        20,
        yPos
      );

      // Capture the graph as an image
      const graphElement = document.querySelector(".recharts-wrapper");
      if (graphElement) {
        const canvas = await html2canvas(graphElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/png");

        // Add the graph image to the PDF
        const imgWidth = 170;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 20, yPos + 10, imgWidth, imgHeight);
        yPos += imgHeight + 20;
      }

      // Create domain performance table
      const tableData = reportData.graphDetails.map((domain) => [
        domain.domainName,
        domain.average,
        domain.centerAverage,
        domain.numberOfSessions,
      ]);

      // Add the table
      autoTable(pdf, {
        startY: yPos,
        head: [["Domain", "Participant Avg", "Center Avg", "Sessions"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [35, 157, 98],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
        },
        styles: {
          fontSize: 10,
          cellPadding: 3,
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 60, halign: "left" },
          1: { cellWidth: 40 },
          2: { cellWidth: 40 },
          3: { cellWidth: 30 },
        },
        margin: { left: 20, right: 20 },
      });

      // Get the final Y position after the table
      const finalY = pdf.lastAutoTable.finalY || pageHeight - 30;
      yPos = finalY + 15;

      // Add participant background
      yPos += 5;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Participant Background", 20, yPos);

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      yPos += 8;
      const backgroundLines = pdf.splitTextToSize(
        reportData.participant?.briefBackground ||
          "No background information available.",
        pageWidth - 40
      );
      backgroundLines.forEach((line) => {
        pdf.text(line, 20, yPos);
        yPos += 5;
      });

      yPos += 10;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Summary", 20, yPos);

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      yPos += 8;
      const summaryLines = pdf.splitTextToSize(
        reportData.aiSummary || "No summary available.",
        pageWidth - 40
      );
      summaryLines.forEach((line) => {
        pdf.text(line, 20, yPos);
        yPos += 5;
      });

      // Add overall observation
      yPos += 10;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      const obsHeading = "Overall Observation: ";
      const obsHeadingWidth = pdf.getTextWidth(obsHeading);
      const obsText =
        reportData.overallObservation ||
        "_________________________________________________";
      pdf.text(obsHeading, 20, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(obsText, 20 + obsHeadingWidth, yPos);
      yPos += 5;

      // Add joint plan
      yPos += 10;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      const planHeading = "Joint Plan: ";
      const planHeadingWidth = pdf.getTextWidth(planHeading);
      const planText =
        reportData.jointPlan ||
        "_________________________________________________";
      pdf.text(planHeading, 20, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(planText, 20 + planHeadingWidth, yPos);
      yPos += 5;

      // Add signature section
      yPos += 18;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("Signature (With Stamp)", 20, yPos);

      yPos += 10;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");

      // Name and Date on the same line
      pdf.text(
        "Name: " + (reportData.signatureName || "_________________"),
        20,
        yPos
      );
      pdf.text(
        "Date: " + (reportData.signatureDate || "_________________"),
        100,
        yPos
      );
      yPos += 8;

      // Add mission statement
      yPos += 5;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const missionStatement = [
        "We are here to engage with you to spread joy and provide meaningful involvement.",
        "We stand for Trust, Building Positive Relationship & Spreading Joy and Going that Extra Mile.",
      ];

      missionStatement.forEach((line) => {
        pdf.text(line, pageWidth / 2, yPos, { align: "center" });
        yPos += 5;
      });

      // Add border to each page
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setDrawColor(35, 157, 98);
        pdf.setLineWidth(0.5);
        pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
      }

      // Save the PDF
      pdf.save(
        `member-report-${reportData.participant?.name}-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#239d62] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate("/reports/history")}
            className="mt-4 px-4 py-2 bg-[#239d62] text-white rounded-md hover:bg-[#239d62]/90"
          >
            Back to Report History
          </button>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return null;
  }

  return (
    <div className="min-h-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Member Report
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Report Data Display */}
        <div className="mt-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* PDF-like Header */}
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Member Report
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Generated on: {formatDate(reportData.createdAt)}
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

            {/* PDF-like Content */}
            <div className="relative" style={{ height: "calc(100vh - 300px)" }}>
              <div className="absolute inset-0 overflow-y-auto">
                <div
                  className="max-w-[850px] mx-auto bg-white p-8 shadow-lg relative"
                  style={{ minHeight: "100%" }}
                >
                  {/* Green border */}
                  <div className="absolute inset-0 border-2 border-[#239d62] rounded-lg pointer-events-none"></div>

                  {/* Logo */}
                  <div className="flex justify-center mb-8">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="h-[25px] w-[70px]"
                    />
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-center mb-2">
                    Individual Member Observations
                  </h2>
                  <h3 className="text-xl text-center mb-6">
                    Our Journey Together
                  </h3>

                  {/* Description */}
                  <div className="text-center text-sm text-gray-600 mb-8">
                    <p>
                      This document is based on our basic observations about
                      your participation
                    </p>
                    <p>and engagements made in our sessions which is held</p>
                    <div className="flex justify-center items-center gap-2 mb-2">
                      <span className="w-48 px-2 py-1 border border-gray-300 rounded text-center text-sm">
                        {reportData.helpType || "________________"}
                      </span>
                      <span>in a week for</span>
                      <span className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm">
                        {reportData.hoursPerWeek || "____"}
                      </span>
                      <span>hours</span>
                    </div>
                    <p>
                      It is limited to the progress made by members in various
                      domains that we
                    </p>
                    <p>have chosen while designing activities.</p>
                  </div>

                  {/* Member Information Section */}
                  <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-[#239d62]">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-bold text-[#239d62]">Name</p>
                        <p className="text-sm text-gray-900">
                          {reportData.participant?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#239d62]">
                          Date of Birth
                        </p>
                        <p className="text-sm text-gray-900">
                          {formatDate(reportData.participant?.dob)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#239d62]">
                          Gender
                        </p>
                        <p className="text-sm text-gray-900">
                          {reportData.participant?.gender}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#239d62]">
                          Phone
                        </p>
                        <p className="text-sm text-gray-900">
                          {reportData.participant?.phone}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-bold text-[#239d62]">
                          Address
                        </p>
                        <p className="text-sm text-gray-900">
                          {reportData.participant?.address?.addressLine},{" "}
                          {reportData.participant?.address?.city},{" "}
                          {reportData.participant?.address?.state} -{" "}
                          {reportData.participant?.address?.pincode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Summary */}
                  <div className="mb-8">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Attendance Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">
                          Total Sessions Attended
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {reportData.attendance}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">
                          Total Number of Sessions
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {reportData.totalNumberOfSessions}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Domain Performance */}
                  <div className="mb-8">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Domain Performance
                    </h3>
                    <div className="h-[600px] mb-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={reportData.graphDetails}
                          margin={{
                            top: 40,
                            right: 30,
                            left: 20,
                            bottom: 150,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis
                            dataKey="domainName"
                            height={100}
                            interval={0}
                            axisLine={{ stroke: "#e5e7eb" }}
                            tick={({ payload, x, y }) => {
                              const domain = reportData.graphDetails.find(
                                (d) => d.domainName === payload.value
                              );
                              return (
                                <g transform={`translate(${x},${y})`}>
                                  <text
                                    x={0}
                                    y={0}
                                    dy={16}
                                    textAnchor="middle"
                                    fill="#666"
                                    fontSize={12}
                                  >
                                    {payload.value}
                                  </text>
                                  <text
                                    x={0}
                                    y={0}
                                    dy={32}
                                    textAnchor="middle"
                                    fill="#666"
                                    fontSize={12}
                                  >
                                    ({domain?.numberOfSessions} sessions)
                                  </text>
                                </g>
                              );
                            }}
                          />
                          <YAxis
                            domain={[0, 6]}
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: "#e5e7eb" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "6px",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
                            name="Participant Average"
                            fill="#239d62"
                            barSize={30}
                            radius={[4, 4, 0, 0]}
                          />
                          <Line
                            type="monotone"
                            dataKey="centerAverage"
                            name="Center Average"
                            stroke="#94a3b8"
                            strokeWidth={2}
                            dot={{
                              fill: "#94a3b8",
                              strokeWidth: 2,
                              r: 4,
                            }}
                            activeDot={{
                              r: 6,
                              fill: "#94a3b8",
                              stroke: "#fff",
                              strokeWidth: 2,
                            }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Domain Performance Table */}
                    <div className="mt-8">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">
                        Domain Performance Details
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-[#239d62]">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                              >
                                Domain
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                              >
                                Participant Avg
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                              >
                                Center Avg
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                              >
                                Sessions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.graphDetails.map((domain, index) => (
                              <tr
                                key={index}
                                className={
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {domain.domainName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                  {domain.average}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                  {domain.centerAverage}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                  {domain.numberOfSessions}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Participant Background */}
                  <div className="mb-8">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Participant Background
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-900">
                        {reportData.participant?.briefBackground ||
                          "No background information available."}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mb-8">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Summary
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-900">
                        {reportData.aiSummary || "No summary available."}
                      </p>
                    </div>
                  </div>

                  {/* Overall Observation */}
                  <div className="mb-8">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Overall Observation
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-900">
                        {reportData.overallObservation ||
                          "No observation available."}
                      </p>
                    </div>
                  </div>

                  {/* Joint Plan */}
                  <div className="mb-8">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Joint Plan
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-900">
                        {reportData.jointPlan || "No joint plan available."}
                      </p>
                    </div>
                  </div>

                  {/* Signature Section */}
                  <div className="mb-8">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Signature (With Stamp)
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Name
                          </p>
                          <p className="text-sm text-gray-900">
                            {reportData.signatureName || "_________________"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Date
                          </p>
                          <p className="text-sm text-gray-900">
                            {reportData.signatureDate || "_________________"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mission Statement */}
                  <div className="text-center text-sm text-gray-600">
                    <p className="mb-2">
                      We are here to engage with you to spread joy and provide
                      meaningful involvement.
                    </p>
                    <p>
                      We stand for Trust, Building Positive Relationship &
                      Spreading Joy and Going that Extra Mile.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
