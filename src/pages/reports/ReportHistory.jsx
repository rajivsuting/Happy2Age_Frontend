import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { FiSearch, FiEye, FiDownload } from "react-icons/fi";

const ReportHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportType, setReportType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    fetchReports();
  }, [reportType]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = "/report/history";
      if (reportType !== "all") {
        url += `?type=${reportType}`;
      }
      const response = await axiosInstance.get(url);
      if (response.data.success) {
        setReports(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to fetch reports");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError(error.response?.data?.message || "Failed to fetch reports");
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

  const handleViewReport = (report) => {
    navigate(`/reports/history/${report._id}`, { state: { report } });
  };

  const handleDownload = async (report) => {
    try {
      if (!report.pdfUrl) {
        setError("No PDF available for this report");
        return;
      }

      // Get the base URL from axios instance
      const baseURL = axiosInstance.defaults.baseURL || "";
      const fullUrl = `${baseURL}${report.pdfUrl}`;

      // Create a link element
      const link = document.createElement("a");
      link.href = fullUrl;
      link.download = report.name || "report.pdf";

      // For viewing, open in new tab
      if (report.pdfUrl.startsWith("/uploads/")) {
        window.open(fullUrl, "_blank");
      } else {
        // For downloading
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      console.error("Error handling report:", error);
      setError("Failed to handle report. Please try again.");
    }
  };

  const filteredReports = reports.filter((report) => {
    const searchLower = searchTerm.toLowerCase();
    const reportName = report.name;
    return reportName.toLowerCase().includes(searchLower);
  });

  return (
    <div className="min-h-full">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Report History
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          {/* Report Type Selection */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62] focus:border-[#239d62] sm:text-sm"
            >
              <option value="all">All Reports</option>
              <option value="cohort">Cohort Reports</option>
              <option value="individual">Individual Reports</option>
              <option value="allCohorts">All Cohorts Reports</option>
            </select>
          </div>

          {/* Search */}
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62] focus:border-[#239d62] sm:text-sm"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="md:col-span-2">
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
          <div className="md:col-span-2">
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

          {/* Refresh Button */}
          <div className="md:col-span-1 flex items-end">
            <button
              onClick={fetchReports}
              disabled={loading}
              className="w-full px-4 py-2 bg-[#239d62] text-white rounded-md hover:bg-[#239d62]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Reports Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)}{" "}
                    Report
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(report.startDate)} -{" "}
                    {formatDate(report.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(report.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDownload(report)}
                      className="text-[#239d62] hover:text-[#239d62]/90 flex items-center"
                    >
                      <FiDownload className="mr-1" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportHistory;
