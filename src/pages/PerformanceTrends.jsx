import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiArrowLeft,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
} from "react-icons/fi";
import axiosInstance from "../utils/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import LoadingSpinner from "../components/LoadingSpinner";

const PerformanceTrends = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [centers, setCenters] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    fetchCenters();
  }, []);

  useEffect(() => {
    if (selectedCenter) {
      const selectedCenterData = centers.find(
        (center) => center._id === selectedCenter
      );
      setParticipants(selectedCenterData?.participants || []);
    } else {
      setParticipants([]);
      setSelectedParticipant("");
    }
  }, [selectedCenter, centers]);

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

  const fetchCenters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/cohort/all");
      console.log(response.data);
      if (response.data.success) {
        setCenters(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to fetch centers");
      }
    } catch (error) {
      console.error("Error fetching centers:", error);
      setError(error.response?.data?.message || "Failed to fetch centers");
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceData = async () => {
    if (!selectedParticipant) {
      setError("Please select a participant");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `/evaluation/trends?participantId=${selectedParticipant}`
      );
      if (response.data.success) {
        setPerformanceData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch performance data");
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
      setError(
        error.response?.data?.message || "Failed to fetch performance data"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredCenters = centers.filter((center) =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "improving":
        return <FiTrendingUp className="text-green-500" />;
      case "declining":
        return <FiTrendingDown className="text-red-500" />;
      default:
        return <FiMinus className="text-gray-500" />;
    }
  };

  const getConsistencyColor = (consistency) => {
    switch (consistency) {
      case "high":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Performance Trends
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62]"
        >
          <FiArrowLeft className="mr-2" />
          Go Back
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Center and Participant Selection */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          {/* Center Selection */}
          <div className="md:col-span-4" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Center
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
                placeholder="Search and select center..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62] focus:border-[#239d62] sm:text-sm"
              />
              {showDropdown && (
                <div className="mt-1 max-h-60 overflow-y-auto border border-gray-200 rounded-md absolute z-10 w-full bg-white shadow-lg">
                  {filteredCenters.length > 0 ? (
                    filteredCenters.map((center) => (
                      <div
                        key={center._id}
                        onClick={() => {
                          setSelectedCenter(center._id);
                          setSearchTerm(center.name);
                          setShowDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      >
                        {center.name}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No centers found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Participant Selection */}
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Participant
            </label>
            <select
              value={selectedParticipant}
              onChange={(e) => setSelectedParticipant(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62] focus:border-[#239d62] sm:text-sm"
              disabled={!selectedCenter}
            >
              <option value="">Select a participant</option>
              {participants.map((participant) => (
                <option key={participant._id} value={participant._id}>
                  {participant.name}
                </option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
          <div className="md:col-span-4 flex items-end">
            <button
              onClick={fetchPerformanceData}
              disabled={loading || !selectedParticipant}
              className="w-full px-4 py-2 bg-[#239d62] text-white rounded-md hover:bg-[#239d62]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Generate Trends"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Performance Data Display */}
        {performanceData && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Performance Overview
              </h1>
            </div>

            {/* Overall Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Average Score
                </h3>
                <div className="flex items-baseline">
                  <p className="text-3xl font-semibold text-gray-900">
                    {performanceData.overall.metrics.average}
                  </p>
                  <span className="ml-2 text-sm text-gray-500">/ 7</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Highest Score
                </h3>
                <div className="flex items-baseline">
                  <p className="text-3xl font-semibold text-gray-900">
                    {performanceData.overall.metrics.highest}
                  </p>
                  <span className="ml-2 text-sm text-gray-500">/ 7</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Latest Score
                </h3>
                <div className="flex items-baseline">
                  <p className="text-3xl font-semibold text-gray-900">
                    {performanceData.overall.metrics.latest}
                  </p>
                  <span className="ml-2 text-sm text-gray-500">/ 7</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Lowest Score
                </h3>
                <div className="flex items-baseline">
                  <p className="text-3xl font-semibold text-gray-900">
                    {performanceData.overall.metrics.lowest}
                  </p>
                  <span className="ml-2 text-sm text-gray-500">/ 7</span>
                </div>
              </div>
            </div>

            {/* Performance Trend and Consistency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Performance Trend
                </h3>
                <div className="flex items-center">
                  <div className="text-2xl mr-3">
                    {getTrendIcon(performanceData.overall.metrics.trend)}
                  </div>
                  <p className="text-lg font-medium text-gray-900 capitalize">
                    {performanceData.overall.metrics.trend}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Consistency Level
                </h3>
                <div className="flex items-center">
                  <p
                    className={`text-lg font-medium ${getConsistencyColor(
                      performanceData.overall.metrics.consistency
                    )} capitalize`}
                  >
                    {performanceData.overall.metrics.consistency}
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-6">
                Performance Over Time
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData.overall.scores}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      stroke="#6b7280"
                      tick={{ fill: "#6b7280" }}
                    />
                    <YAxis
                      domain={[0, 7]}
                      ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
                      stroke="#6b7280"
                      tick={{ fill: "#6b7280" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.375rem",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      }}
                      labelStyle={{ color: "#6b7280" }}
                      formatter={(value) => [`${value} / 7`, "Score"]}
                      labelFormatter={formatDate}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#239d62"
                      strokeWidth={2}
                      dot={{ fill: "#239d62", strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: "#239d62" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceTrends;
