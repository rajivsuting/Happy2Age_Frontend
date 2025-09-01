import React from "react";
import {
  FiBell,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiActivity,
  FiTarget,
  FiCalendar,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Enhanced data structure with domain connections
const activities = [
  {
    title: "Singing (with Words)",
    date: "2024-06-12",
    domain: "Verbalisation",
    domainIndex: 4,
  },
  {
    title: "Story Writing",
    date: "2024-06-11",
    domain: "Creativity",
    domainIndex: 5,
  },
  {
    title: "Story Telling",
    date: "2024-06-10",
    domain: "Verbalisation",
    domainIndex: 4,
  },
  {
    title: "Doodling (with Stencils)",
    date: "2024-06-09",
    domain: "Motor Skills",
    domainIndex: 1,
  },
  {
    title: "Tambola (Different Type)",
    date: "2024-06-08",
    domain: "Attention",
    domainIndex: 2,
  },
  {
    title: "Pair Game",
    date: "2024-06-07",
    domain: "Group Interaction",
    domainIndex: 6,
  },
];

// Real domain/activity names
const domainNames = [
  "Perception of Self",
  "Motor Skills",
  "Attention",
  "Cognition",
  "Verbalisation",
  "Creativity",
  "Group Interaction",
];

const moodData = [
  {
    date: "2024-06-01",
    memberMood: 5,
    centerMood: 5.8,
    domain: domainNames[0],
  },
  {
    date: "2024-06-03",
    memberMood: 6,
    centerMood: 6.3,
    domain: domainNames[1],
  },
  {
    date: "2024-06-05",
    memberMood: 4,
    centerMood: 5.5,
    domain: domainNames[2],
  },
  {
    date: "2024-06-07",
    memberMood: 7,
    centerMood: 6.8,
    domain: domainNames[3],
  },
  {
    date: "2024-06-09",
    memberMood: 6,
    centerMood: 6.4,
    domain: domainNames[4],
  },
  {
    date: "2024-06-11",
    memberMood: 5,
    centerMood: 6.1,
    domain: domainNames[5],
  },
  {
    date: "2024-06-12",
    memberMood: 6,
    centerMood: 6.5,
    domain: domainNames[6],
  },
];

const activityParticipation = [
  { name: domainNames[0], count: 4, centerBenchmark: 3.5 },
  { name: domainNames[1], count: 3, centerBenchmark: 4.2 },
  { name: domainNames[2], count: 5, centerBenchmark: 4.8 },
  { name: domainNames[3], count: 2, centerBenchmark: 3.1 },
  { name: domainNames[4], count: 3, centerBenchmark: 3.7 },
  { name: domainNames[5], count: 4, centerBenchmark: 4.0 },
  { name: domainNames[6], count: 2, centerBenchmark: 2.8 },
];

const activityTypeDistribution = [
  {
    name: domainNames[0],
    value: 8,
    activities: ["Meditation", "Self-reflection", "Goal Setting"],
  },
  {
    name: domainNames[1],
    value: 5,
    activities: ["Art & Craft", "Doodling", "Physical Games"],
  },
  {
    name: domainNames[2],
    value: 3,
    activities: ["Memory Games", "Puzzles", "Focus Exercises"],
  },
  {
    name: domainNames[3],
    value: 6,
    activities: ["Brain Teasers", "Logic Games", "Problem Solving"],
  },
  {
    name: domainNames[4],
    value: 4,
    activities: ["Singing", "Story Telling", "Group Discussion"],
  },
  {
    name: domainNames[5],
    value: 2,
    activities: ["Creative Writing", "Art Projects", "Innovation"],
  },
  {
    name: domainNames[6],
    value: 3,
    activities: ["Team Games", "Social Events", "Collaboration"],
  },
];

const alerts = [
  {
    message: `Low score detected in ${domainNames[2]}`,
    date: "2024-06-12",
    type: "critical",
    domain: domainNames[2],
    domainIndex: 2,
    relatedActivity: "Memory Games",
  },
  {
    message: `Improvement needed in ${domainNames[3]}`,
    date: "2024-06-11",
    type: "warning",
    domain: domainNames[3],
    domainIndex: 3,
    relatedActivity: "Puzzle Solving",
  },
  {
    message: `Excellent progress in ${domainNames[0]}`,
    date: "2024-06-10",
    type: "success",
    domain: domainNames[0],
    domainIndex: 0,
    relatedActivity: "Morning Meditation",
  },
];

const suggestions = [
  "Daily 10-minute walk",
  "Memory games (crossword, sudoku)",
  "Call a family member for a chat",
];

// Static happiness parameter data
const happinessParameterData = [
  { happinessParameter: "Positive Emotions", average: 4.2, centerAverage: 4.5 },
  { happinessParameter: "Social Belonging", average: 5.1, centerAverage: 4.8 },
  {
    happinessParameter: "Engagement & Purpose",
    average: 3.8,
    centerAverage: 4.2,
  },
  {
    happinessParameter: "Satisfaction with the program",
    average: 4.6,
    centerAverage: 4.3,
  },
];

// Enhanced color palette for better domain distinction
const COLORS = [
  "#239d62", // Perception of Self - Green
  "#94a3b8", // Motor Skills - Gray
  "#ffb347", // Attention - Orange
  "#ff6961", // Cognition - Red
  "#a855f7", // Verbalisation - Purple
  "#06b6d4", // Creativity - Cyan
  "#f59e0b", // Group Interaction - Amber
];

const CaregiverDashboardPreview = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col">
    {/* Main Content */}
    <main className="w-full p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#239d62]">
            Welcome, Family Member/Member!
          </h1>
          <p className="text-gray-600">
            Monitor and support the well-being of your senior citizen.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <FiBell className="text-2xl text-gray-400" />
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Family Member/Member Avatar"
            className="w-10 h-10 rounded-full border"
          />
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-[#239d62]">3</span>
          <span className="text-gray-600 mt-2">Activities This Week</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-[#239d62]">1</span>
          <span className="text-gray-600 mt-2">Alerts</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-[#239d62]">2</span>
          <span className="text-gray-600 mt-2">Suggestions</span>
        </div>
      </div>

      {/* Happiness Parameter Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
          Happiness Parameter Overview
        </h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={happinessParameterData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="happinessParameter"
                height={60}
                interval={0}
                axisLine={{ stroke: "#e5e7eb" }}
                tick={{ fontSize: 10, fill: "#666" }}
                angle={-45}
                textAnchor="end"
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
                formatter={(value, name) => [
                  `${value} / 6`,
                  name === "average" ? "Member Average" : "Center Average",
                ]}
                labelFormatter={(label) => `Parameter: ${label}`}
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
                name="Member Average"
                fill="#239d62"
                barSize={50}
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
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Mood Over Time (Line Chart) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
            Mood Over Time
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={moodData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 7]} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) => [
                    `${value} / 7`,
                    name === "memberMood" ? "Member Mood" : "Center Mood",
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="memberMood"
                  name="Member Mood"
                  stroke="#239d62"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="centerMood"
                  name="Center Mood"
                  stroke="#94a3b8"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  strokeDasharray="8 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Activity Participation (Bar Chart) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
            Activity Participation
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={activityParticipation}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "count") {
                      return [value, "Member Participation"];
                    } else if (name === "centerBenchmark") {
                      return [value, "Center"];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Domain: ${label}`}
                />
                <Legend />
                <Bar
                  dataKey="count"
                  name="Member Participation"
                  fill="#239d62"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="centerBenchmark"
                  name="Center"
                  stroke="#94a3b8"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Connected Activity Distribution and Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Activity Type Distribution (Pie Chart) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#239d62] flex items-center">
            <FiTarget className="mr-2" />
            Activity Distribution by Domain
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityTypeDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={20}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {activityTypeDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(label) => `Domain: ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Enhanced Domain Legend with Color Coding */}
          <div className="mt-6 space-y-3">
            {activityTypeDistribution.map((domain, index) => (
              <div
                key={domain.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div>
                    <span className="text-sm font-medium text-gray-800">
                      {domain.name}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {domain.activities.slice(0, 2).join(", ")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[#239d62]">
                    {domain.value}
                  </span>
                  <div className="text-xs text-gray-500">activities</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Updates with Domain Color Coding */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-md font-semibold text-[#239d62] mb-4 flex items-center">
            <FiCalendar className="mr-2" />
            Recent Activities by Domain
          </h3>
          <div className="space-y-3">
            {activities.map((activity, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md"
                style={{
                  borderLeftColor: COLORS[activity.domainIndex % COLORS.length],
                  backgroundColor: `${
                    COLORS[activity.domainIndex % COLORS.length]
                  }10`,
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-800 text-sm">
                    {activity.title}
                  </span>
                  <span className="text-xs text-gray-400">{activity.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          COLORS[activity.domainIndex % COLORS.length],
                      }}
                    ></div>
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: COLORS[activity.domainIndex % COLORS.length],
                      }}
                    >
                      {activity.domain}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {
                      activityTypeDistribution[activity.domainIndex]
                        ?.activities[0]
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Connection Explanation */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              💡 <strong>Color Connection:</strong> Each activity's border color
              matches its domain in the pie chart above
            </p>
          </div>
        </div>
      </div>

      {/* Connected Alerts with Domain Color Coding */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-md font-semibold text-[#239d62] mb-4 flex items-center">
          <FiAlertTriangle className="mr-2" />
          Domain-Specific Alerts with Activity Connections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                alert.type === "critical"
                  ? "bg-red-50"
                  : alert.type === "warning"
                  ? "bg-yellow-50"
                  : "bg-green-50"
              }`}
              style={{
                borderLeftColor: COLORS[alert.domainIndex % COLORS.length],
              }}
            >
              <div className="flex items-center space-x-2 mb-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: COLORS[alert.domainIndex % COLORS.length],
                  }}
                ></div>
                <span
                  className={`text-sm font-semibold ${
                    alert.type === "critical"
                      ? "text-red-800"
                      : alert.type === "warning"
                      ? "text-yellow-800"
                      : "text-green-800"
                  }`}
                >
                  {alert.domain}
                </span>
              </div>

              <div className="mb-3">
                <p
                  className={`text-sm font-medium mb-2 ${
                    alert.type === "critical"
                      ? "text-red-800"
                      : alert.type === "warning"
                      ? "text-yellow-800"
                      : "text-green-800"
                  }`}
                >
                  {alert.message}
                </p>
                <p className="text-xs text-gray-600">
                  Related Activity:{" "}
                  <span className="font-medium">{alert.relatedActivity}</span>
                </p>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">{alert.date}</span>
                <span
                  className={`px-2 py-1 rounded-full ${
                    alert.type === "critical"
                      ? "bg-red-200 text-red-800"
                      : alert.type === "warning"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {alert.type}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Connection Legend */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            🎯 <strong>Visual Connection:</strong> Alert border colors match the
            domain colors in the pie chart above
          </p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-md font-semibold text-[#239d62] mb-2">
          Suggestions for At-Home Activities
        </h3>
        <ul className="list-disc ml-6 text-gray-700">
          {suggestions.map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 text-gray-400 text-sm text-center">
        This dashboard shows color-coded connections: activities, domains, and
        alerts all use matching colors for easy identification.
      </div>
    </main>
  </div>
);

export default CaregiverDashboardPreview;
