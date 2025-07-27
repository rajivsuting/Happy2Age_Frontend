import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Legend,
  BarChart,
} from "recharts";
import { FiSearch, FiDownload } from "react-icons/fi";
import axiosInstance from "../../utils/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom/client";

const MemberReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [reportData, setReportData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [helpType, setHelpType] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [overallObservation, setOverallObservation] = useState("");
  const [jointPlan, setJointPlan] = useState("");
  const [signatureDate, setSignatureDate] = useState("");
  const [signatureName, setSignatureName] = useState("");
  const [signatureMobile, setSignatureMobile] = useState("");
  const [editableSummary, setEditableSummary] = useState("");
  const dropdownRef = useRef(null);
  const reportRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchParticipants();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/participant/all");
      if (response.data.success) {
        setParticipants(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to fetch participants");
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
      setError(error.response?.data?.message || "Failed to fetch participants");
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async () => {
    if (!selectedParticipant || !dateRange.start || !dateRange.end) {
      setError("Please select a participant and date range");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `/report/${selectedParticipant}/?start=${dateRange.start}&end=${dateRange.end}&generateSummary=true`
      );
      if (response.data.success) {
        setReportData(response.data.data);
        setEditableSummary(response.data.data.aiSummary || "");
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

  const filteredParticipants = participants.filter((participant) =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const PDFTrendChart = ({ data, domainName }) => {
    const yDomain = domainName === "Initiative" ? [0, 16] : [0, 7];

    return (
      <div
        className="trend-chart"
        style={{
          width: "300px",
          height: "200px",
          backgroundColor: "#ffffff",
          padding: "10px",
          borderRadius: "4px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h4
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#000000",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          {domainName}
        </h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            margin={{ top: 5, right: 10, left: 10, bottom: 30 }}
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={40}
              tick={{ fontSize: 10, fill: "#000000" }}
              interval={Math.floor(data.length / 10)}
              stroke="#000000"
            />
            <YAxis
              domain={yDomain}
              tick={{ fontSize: 10, fill: "#000000" }}
              stroke="#000000"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                color: "#000000",
              }}
              formatter={(value) => [`Score: ${value || "N/A"}`]}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#239d62"
              strokeWidth={1}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const downloadPDF = async () => {
    if (!reportData) return;

    let tempContainer = null;
    try {
      setIsGeneratingPDF(true);
      setError(null);

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin; // 170mm
      let yPos = margin;

      // 1. Logo
      const logoWidth = 70;
      const logoHeight = 25;
      pdf.addImage(
        "/logo.png",
        "PNG",
        (pageWidth - logoWidth) / 2,
        yPos,
        logoWidth,
        logoHeight
      );
      yPos += logoHeight + 10;

      // 2. Title and Subtitle
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 0);
      const title = "Individual Member Observations";
      pdf.text(title, pageWidth / 2, yPos, { align: "center" });
      yPos += 10;
      pdf.setFontSize(18);
      const subtitle = "Our Journey Together";
      pdf.text(subtitle, pageWidth / 2, yPos, { align: "center" });
      yPos += 10;

      // 3. Description
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const description = [
        "This document is based on our basic observations about your participation",
        "and engagements made in our sessions which is held",
        `${helpType || "Number of days"} in a week for ${
          hoursPerWeek || "Hours"
        } hours`,
        "It is limited to the progress made by members in various domains that we",
        "have chosen while designing activities.",
      ];
      description.forEach((line) => {
        const lines = pdf.splitTextToSize(line, contentWidth - 10);
        lines.forEach((splitLine) => {
          pdf.text(splitLine, pageWidth / 2, yPos, { align: "center" });
          yPos += 5;
        });
      });
      yPos += 10;

      // 4. Member Information
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = margin;
      }
      const boxStartY = yPos;
      const boxEndY = boxStartY + 40;
      pdf.setFillColor(249, 250, 251);
      pdf.rect(margin, boxStartY, contentWidth, boxEndY - boxStartY, "F");

      const memberInfo = [
        ["Name:", reportData.participant?.name || "N/A"],
        [
          "Date of Birth:",
          reportData.participant?.dob
            ? formatDate(reportData.participant.dob)
            : "N/A",
        ],
        ["Gender:", reportData.participant?.gender || "N/A"],
        ["Phone:", reportData.participant?.phone || "N/A"],
        [
          "Address:",
          reportData.participant?.address
            ? `${reportData.participant.address.addressLine}, ${reportData.participant.address.city}, ${reportData.participant.address.state} - ${reportData.participant.address.pincode}`
            : "N/A",
        ],
      ];

      const leftColumnX = margin + 5;
      const rightColumnX = margin + contentWidth / 2 + 5;
      const labelWidth = 30;
      const lineHeight = 7;
      const padding = 8;
      let currentY = boxStartY + padding;

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 157, 98);
      pdf.text("Name:", leftColumnX, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      const nameLines = pdf.splitTextToSize(
        memberInfo[0][1],
        contentWidth / 2 - labelWidth - 5
      );
      pdf.text(nameLines, leftColumnX + labelWidth, currentY);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 157, 98);
      pdf.text("Gender:", rightColumnX, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text(memberInfo[2][1], rightColumnX + labelWidth, currentY);

      currentY += lineHeight;

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 157, 98);
      pdf.text("Phone:", leftColumnX, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text(memberInfo[3][1], leftColumnX + labelWidth, currentY);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 157, 98);
      pdf.text("Date of Birth:", rightColumnX, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text(memberInfo[1][1], rightColumnX + labelWidth, currentY);

      currentY += lineHeight;

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(35, 157, 98);
      pdf.text("Address:", leftColumnX, currentY);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      const addressLines = pdf.splitTextToSize(
        memberInfo[4][1],
        contentWidth - 10
      );
      pdf.text(addressLines, leftColumnX + labelWidth, currentY);
      yPos = boxEndY + 10;

      // 5. Attendance Summary
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Attendance Summary", margin, yPos);
      yPos += 8;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Total Sessions Attended: ${reportData.attendance || "N/A"}`,
        margin + 5,
        yPos + 7
      );
      pdf.text(
        `Total Number of Sessions: ${
          reportData.totalNumberOfSessions || "N/A"
        }`,
        margin + contentWidth / 2 + 5,
        yPos + 7
      );
      yPos += 30;

      // 6. Participant Background
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Participant Background", margin, yPos);
      yPos += 8;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const backgroundText =
        reportData.participant?.briefBackground ||
        "No background information available.";
      const backgroundLines = pdf.splitTextToSize(
        backgroundText,
        contentWidth - 10
      );
      const backgroundHeight = backgroundLines.length * 6 + 16;
      backgroundLines.forEach((line, index) => {
        pdf.text(line, margin + 5, yPos + 10 + index * 6);
      });
      yPos += backgroundHeight + 10;

      // 7. Happiness Parameter Trends
      if (reportData.quarterlyHappinessParameterAverages) {
        if (yPos > pageHeight - 100) {
          pdf.addPage();
          yPos = margin;
        }
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        const happinessTitle =
          reportData.quarterlyHappinessParameterAverages.length === 1
            ? "Happiness Parameter Trends"
            : "Quarterly Happiness Parameter Trends";
        pdf.text(happinessTitle, margin, yPos);
        yPos += 8;

        const chartClass =
          reportData.quarterlyHappinessParameterAverages.length === 1
            ? ".overall-happiness-chart .recharts-wrapper"
            : ".quarterly-happiness-chart .recharts-wrapper";
        const chartElement = document.querySelector(chartClass);
        if (chartElement) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const canvas = await html2canvas(chartElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
          });
          const imgWidth = contentWidth - 10;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          const imgData = canvas.toDataURL("image/png");
          pdf.addImage(
            imgData,
            "PNG",
            margin + 5,
            yPos + 8,
            imgWidth,
            imgHeight
          );
          yPos += imgHeight + 18;
        }
      }

      // 8. Domain Performance (Bar + Line Chart)
      if (yPos > pageHeight - 150) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Domain Performance", margin, yPos);
      yPos += 8;

      const domainChartElement = document.querySelector(
        ".composed-domain-chart .recharts-wrapper"
      );
      if (domainChartElement) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const canvas = await html2canvas(domainChartElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const imgWidth = contentWidth - 10;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL("image/png");
        // Calculate available height for two graphs on the page
        // If this is the first of two graphs, calculate spacing
        // We'll assume the next chart is the trends chart
        let nextChartHeight = 0;
        const trendCharts = document.querySelectorAll(".trend-chart");
        if (trendCharts.length === 2) {
          // If there are exactly 2 trend charts, calculate their heights
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const trendCanvas0 = await html2canvas(trendCharts[0], {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
          });
          const trendCanvas1 = await html2canvas(trendCharts[1], {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
          });
          const trendImgHeight0 =
            (trendCanvas0.height * imgWidth) / trendCanvas0.width;
          const trendImgHeight1 =
            (trendCanvas1.height * imgWidth) / trendCanvas1.width;
          // Calculate available space after the first chart
          const availableHeight = pageHeight - margin * 2 - 8 - imgHeight;
          // Distribute the two trend charts evenly in the available space
          const totalTrendHeight = trendImgHeight0 + trendImgHeight1;
          const spacing = (availableHeight - totalTrendHeight) / 3;
          // Draw the first chart (domain performance)
          pdf.addImage(
            imgData,
            "PNG",
            margin + 5,
            yPos + 8,
            imgWidth,
            imgHeight
          );
          let trendY = yPos + 8 + imgHeight + spacing;
          // Draw the two trend charts
          const trendImgData0 = trendCanvas0.toDataURL("image/png");
          pdf.addImage(
            trendImgData0,
            "PNG",
            margin + 5,
            trendY,
            imgWidth,
            trendImgHeight0
          );
          trendY += trendImgHeight0 + spacing;
          const trendImgData1 = trendCanvas1.toDataURL("image/png");
          pdf.addImage(
            trendImgData1,
            "PNG",
            margin + 5,
            trendY,
            imgWidth,
            trendImgHeight1
          );
          yPos = trendY + trendImgHeight1 + spacing;
        } else {
          // Default behavior for a single chart
          pdf.addImage(
            imgData,
            "PNG",
            margin + 5,
            yPos + 8,
            imgWidth,
            imgHeight
          );
          yPos += imgHeight + 18;
        }
      }

      // 9. Domain Performance Details Table
      if (yPos > pageHeight - 100) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Domain Performance Details", margin, yPos);
      yPos += 8;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const tableData = Array.isArray(reportData.graphDetails)
        ? reportData.graphDetails.map((domain) => [
            domain.domainName || "N/A",
            domain.average != null ? domain.average.toString() : "N/A",
            domain.centerAverage != null
              ? domain.centerAverage.toString()
              : "N/A",
            domain.numberOfSessions != null
              ? domain.numberOfSessions.toString()
              : "N/A",
          ])
        : [];

      if (tableData.length === 0) {
        pdf.setTextColor(255, 0, 0);
        pdf.text(
          "No data available for Domain Performance Details",
          margin + 5,
          yPos + 5
        );
        yPos += 20;
      } else {
        try {
          console.log("Preparing to render table with data:", tableData);
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
              fontSize: 10,
              font: "helvetica",
            },
            styles: {
              fontSize: 10,
              cellPadding: 3,
              halign: "center",
              overflow: "linebreak",
              font: "helvetica",
              minCellWidth: 20,
            },
            columnStyles: {
              0: { cellWidth: contentWidth * 0.45, halign: "left" }, // 76.5mm
              1: { cellWidth: contentWidth * 0.2 }, // 34mm
              2: { cellWidth: contentWidth * 0.2 }, // 34mm
              3: { cellWidth: contentWidth * 0.15 }, // 25.5mm
            },
            margin: { left: margin, right: margin },
            didParseCell: (data) => {
              console.log(
                `Parsing table cell: ${data.cell.text}, Row: ${data.row.index}, Column: ${data.column.index}`
              );
            },
            didDrawCell: (data) => {
              console.log(
                `Drawing table cell: ${data.cell.text}, Row: ${data.row.index}, Column: ${data.column.index}`
              );
            },
            didDrawPage: () => {
              console.log("Table page drawn");
            },
          });
          yPos = pdf.lastAutoTable?.finalY || yPos + 20;
          console.log("Table rendered, final Y position:", yPos);
        } catch (tableError) {
          console.error("Error rendering table:", tableError);
          pdf.setTextColor(255, 0, 0);
          pdf.text(
            "Failed to render Domain Performance Details table",
            margin + 5,
            yPos + 5
          );
          yPos += 20;
          setError(
            "Failed to render table in PDF. Please check console for details."
          );
        }
      }
      yPos += 10;

      // 10. Domain Performance Trends (Mini Line Charts)
      if (yPos > pageHeight - 100) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Domain Performance Trends", margin, yPos);
      yPos += 8;

      tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      document.body.appendChild(tempContainer);

      const uniqueDates = [
        ...new Set(
          Object.values(reportData.domainTrends || {}).flatMap((scores) =>
            scores.map((session) => {
              const dateMatch = session.session.match(/(\d{2}\/\d{2}\/\d{4})/);
              return dateMatch ? dateMatch[0] : session.date;
            })
          )
        ),
      ].sort((a, b) => {
        const [dayA, monthA, yearA] = a.split("/");
        const [dayB, monthB, yearB] = b.split("/");
        return (
          new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB)
        );
      });

      const pdfCharts = Object.entries(reportData.domainTrends || {}).map(
        ([domainName, scores]) => {
          const chartData = uniqueDates.map((date) => {
            const matchingSession = scores.find((session) => {
              const sessionDate = session.session.match(
                /(\d{2}\/\d{2}\/\d{4})/
              )?.[0];
              return sessionDate === date;
            });
            return {
              date,
              score: matchingSession ? matchingSession.score : null,
            };
          });

          return (
            <PDFTrendChart
              key={domainName}
              data={chartData}
              domainName={domainName}
            />
          );
        }
      );

      const root = ReactDOM.createRoot(tempContainer);
      root.render(<>{pdfCharts}</>);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const trendCharts = tempContainer.querySelectorAll(".trend-chart");
      if (trendCharts.length > 0) {
        const chartWidth = (contentWidth - 10) / 2; // Two charts per row
        const chartHeight = 60;
        const spacing = 10;
        for (let i = 0; i < trendCharts.length; i++) {
          if (yPos + chartHeight > pageHeight - margin) {
            pdf.addPage();
            yPos = margin;
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
          const canvas = await html2canvas(trendCharts[i], {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            allowTaint: true,
            foreignObjectRendering: false,
          });
          const imgData = canvas.toDataURL("image/png");
          const xPos = margin + (chartWidth + spacing) * (i % 2);
          pdf.addImage(
            imgData,
            "PNG",
            xPos + 5,
            yPos + 5,
            chartWidth - 10,
            chartHeight - 10
          );
          if (i % 2 === 1 || i === trendCharts.length - 1) {
            yPos += chartHeight + 10;
          }
        }
      }
      yPos += 10;

      // 11. Summary
      if (yPos > pageHeight - 100) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Summary", margin, yPos);
      yPos += 8;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      // Remove any line that starts with '**Participant Performance Analysis:'
      let pdfSummaryText = editableSummary || "No summary available.";
      pdfSummaryText = pdfSummaryText
        .split("\n")
        .filter(
          (line) =>
            !line.trim().startsWith("**Participant Performance Analysis:")
        )
        .join("\n");
      // Only render summary if there is content after filtering
      if (
        pdfSummaryText.trim() &&
        pdfSummaryText.trim() !== "No summary available."
      ) {
        const sections = pdfSummaryText.split(/\*\*(.*?):\*\*/);
        let summarySectionY = yPos;
        let summaryHeight = 0;
        sections.forEach((section, index) => {
          if (index % 2 === 0 && section.trim()) {
            summaryHeight +=
              pdf.splitTextToSize(section.trim(), contentWidth - 10).length *
                6 +
              8;
          } else if (index % 2 === 1) {
            summaryHeight +=
              6 +
              pdf.splitTextToSize(section.trim(), contentWidth - 10).length *
                6 +
              5;
          }
        });
        sections.forEach((section, index) => {
          if (index % 2 === 0) {
            if (index > 0) {
              const heading = sections[index - 1];
              pdf.setFont("helvetica", "bold");
              pdf.text(heading + ":", margin + 5, summarySectionY + 5);
              summarySectionY += 6;
              pdf.setFont("helvetica", "normal");
              const descLines = pdf.splitTextToSize(
                section.trim(),
                contentWidth - 10
              );
              descLines.forEach((line) => {
                pdf.text(line, margin + 5, summarySectionY + 5);
                summarySectionY += 6;
              });
              summarySectionY += 5;
            } else if (section.trim()) {
              const lines = pdf.splitTextToSize(
                section.trim(),
                contentWidth - 10
              );
              lines.forEach((line) => {
                pdf.text(line, margin + 5, summarySectionY + 5);
                summarySectionY += 6;
              });
              summarySectionY += 8;
            }
          }
        });
        yPos = summarySectionY + 10;
      }

      // 12. Overall Observation
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Overall Observation", margin, yPos);
      yPos += 8;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const observationText =
        overallObservation || "Enter overall observation...";
      const observationLines = pdf.splitTextToSize(
        observationText,
        contentWidth - 10
      );
      const observationHeight = observationLines.length * 6 + 16;
      observationLines.forEach((line, index) => {
        pdf.text(line, margin + 5, yPos + 10 + index * 6);
      });
      yPos += observationHeight + 10;

      // 13. Joint Plan
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Joint Plan", margin, yPos);
      yPos += 8;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const jointPlanText = jointPlan || "Enter joint plan...";
      const jointPlanLines = pdf.splitTextToSize(
        jointPlanText,
        contentWidth - 10
      );
      const jointPlanHeight = jointPlanLines.length * 6 + 16;
      jointPlanLines.forEach((line, index) => {
        pdf.text(line, margin + 5, yPos + 10 + index * 6);
      });
      yPos += jointPlanHeight + 10;

      // 14. Signature (With Stamp)
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Signature (With Stamp)", margin, yPos);
      yPos += 8;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Name: ${signatureName || "Enter name..."}`,
        margin + 5,
        yPos + 7
      );
      pdf.text(
        `Date: ${signatureDate || "Enter date..."}`,
        margin + contentWidth / 2 + 5,
        yPos + 7
      );
      pdf.text(
        `Mobile: ${signatureMobile || "Enter mobile number..."}`,
        margin + 5,
        yPos + 14
      );
      yPos += 40;

      // 15. Footer (Mission Statements)
      if (yPos > pageHeight - 40) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const missionStatements = [
        "We are here to engage with you to spread joy and provide meaningful involvement.",
        "We stand for Trust, Building Positive Relationship & Spreading Joy and Going that Extra Mile.",
      ];
      missionStatements.forEach((line) => {
        const lines = pdf.splitTextToSize(line, contentWidth - 10);
        lines.forEach((splitLine) => {
          pdf.text(splitLine, pageWidth / 2, yPos, { align: "center" });
          yPos += 8;
        });
      });

      // Add page borders
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        // True outer border (10mm from the edge)
        pdf.setDrawColor(35, 157, 98);
        pdf.setLineWidth(0.7);
        pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
      }

      // Save PDF and upload
      const pdfBlob = pdf.output("blob");
      const pdfFile = new File(
        [pdfBlob],
        `member-report-${reportData.participant?.name || "unknown"}-${
          new Date().toISOString().split("T")[0]
        }.pdf`,
        { type: "application/pdf" }
      );

      const formData = new FormData();
      formData.append("pdf", pdfFile);
      formData.append("type", "individual");
      formData.append(
        "name",
        `Member Report - ${reportData.participant?.name || "unknown"}`
      );
      formData.append("participant", selectedParticipant);
      formData.append("startDate", dateRange.start);
      formData.append("endDate", dateRange.end);
      formData.append(
        "metadata",
        JSON.stringify({
          helpType,
          hoursPerWeek,
          overallObservation,
          jointPlan,
          signatureName,
          signatureDate,
          signatureMobile,
          attendance: reportData.attendance,
          totalNumberOfSessions: reportData.totalNumberOfSessions,
          graphDetails: reportData.graphDetails,
          aiSummary: editableSummary,
        })
      );

      const response = await axiosInstance.post("/report/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.success) {
        throw new Error("Failed to save report");
      }

      pdf.save(
        `member-report-${reportData.participant?.name || "unknown"}-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please check console for details.");
    } finally {
      setIsGeneratingPDF(false);
      if (tempContainer) {
        document.body.removeChild(tempContainer);
      }
    }
  };

  const TrendChart = ({ data, domainName }) => {
    const yDomain = domainName === "Initiative" ? [0, 16] : [0, 7];

    return (
      <div className="h-[200px] bg-white p-4 rounded-lg shadow trend-chart">
        <h4 className="text-sm font-medium text-gray-900 mb-2">{domainName}</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 30,
            }}
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={40}
              tick={{ fontSize: 10, fill: "#000000" }}
              interval={Math.floor(data.length / 10)}
              stroke="#000000"
            />
            <YAxis
              domain={yDomain}
              tick={{ fontSize: 10, fill: "#000000" }}
              stroke="#000000"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                color: "#000000",
              }}
              formatter={(value) => [`Score: ${value || "N/A"}`]}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#239d62"
              strokeWidth={1}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="min-h-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Member Report
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          <div className="md:col-span-4" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search and Select Participant
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search and select participant..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62] focus:border-[#239d62] sm:text-sm"
              />
              {showDropdown && (
                <div className="mt-1 max-h-60 overflow-y-auto border border-gray-200 rounded-md absolute z-10 w-full bg-white shadow-lg">
                  {filteredParticipants.length > 0 ? (
                    filteredParticipants.map((participant) => (
                      <div
                        key={participant._id}
                        onClick={() => {
                          setSelectedParticipant(participant._id);
                          setSearchTerm(participant.name);
                          setShowDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      >
                        {participant.name}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No participants found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-1"></div>

          <div className="md:col-span-3">
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
          <div className="md:col-span-3">
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

          <div className="md:col-span-1 flex items-end">
            <button
              onClick={fetchReport}
              disabled={loading}
              className="w-full px-4 py-2 bg-[#239d62] text-white rounded-md hover:bg-[#239d62]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Generate"}
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
                  <h2 className="text-lg font-medium text-[#239d62]">
                    Individual Report
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
                    className="max-w-[850px] mx-auto bg-white p-8 shadow-md relative"
                    id="report-content"
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
                      Individual Member Observations
                    </h2>
                    <h3 className="text-xl text-center mb-6">
                      Our Journey Together
                    </h3>

                    <div className="text-center text-sm text-gray-600 mb-8">
                      <p>
                        This document is based on our basic observations about
                        your participation
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
                            Name
                          </p>
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

                    <div className="mb-8">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">
                        Attendance Summary
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Total Sessions Attended
                          </p>
                          <p className="text-2xl font-semibold text-gray-900">
                            {reportData.attendance}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Total Number of Sessions
                          </p>
                          <p className="text-2xl font-semibold text-gray-900">
                            {reportData.totalNumberOfSessions}
                          </p>
                        </div>
                      </div>
                    </div>

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

                    {reportData.quarterlyHappinessParameterAverages &&
                      reportData.quarterlyHappinessParameterAverages.length ===
                        1 && (
                        <div className="mb-8">
                          <h3 className="text-base font-semibold text-gray-900 mb-4">
                            Happiness Parameter Trends
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-lg overall-happiness-chart">
                            <OverallHappinessChart
                              data={
                                reportData
                                  .quarterlyHappinessParameterAverages[0]
                                  .happinessParameterAverages
                              }
                            />
                          </div>
                        </div>
                      )}
                    {reportData.quarterlyHappinessParameterAverages &&
                      reportData.quarterlyHappinessParameterAverages.length >
                        1 && (
                        <div className="mb-8">
                          <h3 className="text-base font-semibold text-gray-900 mb-4">
                            Quarterly Happiness Parameter Trends
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-lg quarterly-happiness-chart">
                            <QuarterlyHappinessChart
                              data={
                                reportData.quarterlyHappinessParameterAverages
                              }
                            />
                          </div>
                        </div>
                      )}

                    <div className="mb-8">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">
                        Domain Performance
                      </h3>
                      <div className="h-[600px] mb-8 composed-domain-chart">
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
                                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider sm:text-sm"
                                >
                                  Domain
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider sm:text-sm"
                                >
                                  Participant Avg
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider sm:text-sm"
                                >
                                  Center Avg
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider sm:text-sm"
                                >
                                  Sessions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {reportData.graphDetails?.map((domain, index) => (
                                <tr
                                  key={index}
                                  className={
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                  }
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {domain.domainName}
                                  </td>
                                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                                    {domain.average}
                                  </td>
                                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                                    {domain.centerAverage}
                                  </td>
                                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                                    {domain.numberOfSessions}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">
                        Domain Performance Trends
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(() => {
                          const allDates = new Set();
                          Object.values(reportData.domainTrends || {}).forEach(
                            (domainData) => {
                              domainData.forEach((item) => {
                                const dateMatch = item.session.match(
                                  /(\d{2}\/\d{2}\/\d{4})/
                                );
                                if (dateMatch) {
                                  allDates.add(dateMatch[0]);
                                }
                              });
                            }
                          );

                          const sortedDates = Array.from(allDates).sort(
                            (a, b) => {
                              const [dayA, monthA, yearA] = a.split("/");
                              const [dayB, monthB, yearB] = b.split("/");
                              return (
                                new Date(yearA, monthA - 1, dayA) -
                                new Date(yearB, monthB - 1, dayB)
                              );
                            }
                          );

                          return Object.entries(
                            reportData.domainTrends || {}
                          ).map(([domainName, domainData]) => {
                            const chartData = sortedDates.map((date) => {
                              const matchingSession = domainData.find((item) =>
                                item.session.includes(date)
                              );
                              return {
                                date,
                                score: matchingSession
                                  ? matchingSession.score
                                  : null,
                              };
                            });

                            return (
                              <TrendChart
                                key={domainName}
                                data={chartData}
                                domainName={domainName}
                              />
                            );
                          });
                        })()}
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">
                        Summary
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62] focus:border-[#239d62] text-sm"
                          value={editableSummary}
                          onChange={(e) => setEditableSummary(e.target.value)}
                          placeholder="No summary available."
                          rows={5}
                        />
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">
                        Overall Observation
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <input
                          type="text"
                          value={overallObservation}
                          onChange={(e) =>
                            setOverallObservation(e.target.value)
                          }
                          placeholder="Enter overall observation..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62] focus:border-[#239d62] text-sm"
                        />
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">
                        Joint Plan
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <input
                          type="text"
                          value={jointPlan}
                          onChange={(e) => setJointPlan(e.target.value)}
                          placeholder="Enter joint plan..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62] focus:border-[#239d62] text-sm"
                        />
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">
                        Signature (With Stamp)
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Name
                            </label>
                            <input
                              type="text"
                              value={signatureName}
                              onChange={(e) => setSignatureName(e.target.value)}
                              placeholder="Enter name..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62] focus:border-[#239d62] text-sm"
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62] focus:border-[#239d62] text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Mobile
                            </label>
                            <input
                              type="text"
                              value={signatureMobile}
                              onChange={(e) =>
                                setSignatureMobile(e.target.value)
                              }
                              placeholder="Enter mobile number..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62] focus:border-[#239d62] text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

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
        )}
      </div>
    </div>
  );
};

export default MemberReport;

const QuarterlyHappinessChart = ({ data }) => {
  const allParams = Array.from(
    new Set(
      data.flatMap((q) =>
        q.happinessParameterAverages.map((h) => h.happinessParameter)
      )
    )
  );
  const chartData = allParams.map((param) => {
    const entry = { happinessParameter: param };
    data.forEach((q, idx) => {
      const found = q.happinessParameterAverages.find(
        (h) => h.happinessParameter === param
      );
      entry[`Q${idx + 1}`] = found ? Number(found.average) : null;
    });
    return entry;
  });
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="happinessParameter" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Q1" fill="#4285F4" barSize={30} />
        <Bar dataKey="Q2" fill="#EA4335" barSize={30} />
        <Bar dataKey="Q3" fill="#FBBC05" barSize={30} />
        <Bar dataKey="Q4" fill="#34A853" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const OverallHappinessChart = ({ data }) => {
  const chartData = data.map((param) => ({
    happinessParameter: param.happinessParameter,
    Average: Number(param.average),
    centerAverage: Number(param.centerAverage),
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="happinessParameter" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="Average"
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
  );
};
