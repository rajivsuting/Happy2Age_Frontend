import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
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

const COLORS = [
  "#239d62",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFC107",
  "#FF9800",
  "#FF5722",
  "#795548",
  "#607D8B",
  "#2196F3",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
        <p className="font-semibold text-gray-800">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CenterAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    fetchComparisonData();
  }, []);

  const fetchComparisonData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        "/report/analytics/compare-cohorts"
      );

      console.log(response.data);
      if (response.data.success) {
        setComparisonData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch comparison data");
      }
    } catch (error) {
      console.error("Error fetching comparison data:", error);
      setError(
        error.response?.data?.message || "Failed to fetch comparison data"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Transform data for the domain performance chart
  const transformDataForChart = () => {
    if (!comparisonData?.graphDetails) return [];

    const cohortData = {};
    comparisonData.graphDetails.forEach((item) => {
      if (!cohortData[item.cohort]) {
        cohortData[item.cohort] = { name: item.cohort };
      }
      cohortData[item.cohort][item.domainName] = parseFloat(item.average);
    });

    return Object.values(cohortData);
  };

  return (
    <div className="min-h-full p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Center Analytics
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62]"
        >
          <FiArrowLeft className="mr-2" />
          Go Back
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {comparisonData && (
        <div className="space-y-8">
          {/* Overall Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Total Participants
              </h3>
              <p className="text-2xl font-bold">
                {comparisonData.overallStats.totalParticipants}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Total Centers
              </h3>
              <p className="text-2xl font-bold">
                {comparisonData.overallStats.totalCohorts}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Top Performing Center
              </h3>
              <p className="text-2xl font-bold">
                {comparisonData.overallStats.topPerformingCohort.name}
              </p>
              <p className="text-sm text-gray-500">
                Score:{" "}
                {comparisonData.overallStats.topPerformingCohort.averageScore}
              </p>
              <p className="text-sm text-gray-500">
                Participants:{" "}
                {
                  comparisonData.overallStats.topPerformingCohort
                    .participantCount
                }
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Bottom Performing Center
              </h3>
              <p className="text-2xl font-bold">
                {comparisonData.overallStats.bottomPerformingCohort.name}
              </p>
              <p className="text-sm text-gray-500">
                Score:{" "}
                {
                  comparisonData.overallStats.bottomPerformingCohort
                    .averageScore
                }
              </p>
              <p className="text-sm text-gray-500">
                Participants:{" "}
                {
                  comparisonData.overallStats.bottomPerformingCohort
                    .participantCount
                }
              </p>
            </div>
          </div>

          {/* Domain Performance Comparison */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Domain Performance Comparison
            </h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={transformDataForChart()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 7]}
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "Average Score",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 12 },
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: 20 }} />
                  {comparisonData.graphDetails
                    .reduce((domains, item) => {
                      if (!domains.includes(item.domainName)) {
                        domains.push(item.domainName);
                      }
                      return domains;
                    }, [])
                    .map((domain, index) => (
                      <Line
                        key={domain}
                        type="monotone"
                        dataKey={domain}
                        stroke={COLORS[index % COLORS.length]}
                        name={domain}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CenterAnalytics;
