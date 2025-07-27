import React from "react";
import { FiBell } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const activities = [
  { title: "Singing (with Words)", date: "2024-06-12" },
  { title: "Story Writing", date: "2024-06-11" },
  { title: "Story Telling", date: "2024-06-10" },
  { title: "Doodling (with Stencils)", date: "2024-06-09" },
  { title: "Tambola (Different Type)", date: "2024-06-08" },
  { title: "Pair Game", date: "2024-06-07" },
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
  { date: "2024-06-01", mood: 5, domain: domainNames[0] },
  { date: "2024-06-03", mood: 6, domain: domainNames[1] },
  { date: "2024-06-05", mood: 4, domain: domainNames[2] },
  { date: "2024-06-07", mood: 7, domain: domainNames[3] },
  { date: "2024-06-09", mood: 6, domain: domainNames[4] },
  { date: "2024-06-11", mood: 5, domain: domainNames[5] },
  { date: "2024-06-12", mood: 6, domain: domainNames[6] },
];

const activityParticipation = [
  { name: domainNames[0], count: 4 },
  { name: domainNames[1], count: 3 },
  { name: domainNames[2], count: 5 },
  { name: domainNames[3], count: 2 },
  { name: domainNames[4], count: 3 },
  { name: domainNames[5], count: 4 },
  { name: domainNames[6], count: 2 },
];

const activityTypeDistribution = [
  { name: domainNames[0], value: 8 },
  { name: domainNames[1], value: 5 },
  { name: domainNames[2], value: 3 },
  { name: domainNames[3], value: 6 },
  { name: domainNames[4], value: 4 },
  { name: domainNames[5], value: 2 },
  { name: domainNames[6], value: 3 },
];

const alerts = [
  {
    message: `Low score detected in ${domainNames[2]}`,
    date: "2024-06-12",
    type: "critical",
  },
  {
    message: `Improvement needed in ${domainNames[3]}`,
    date: "2024-06-11",
    type: "warning",
  },
  {
    message: `Excellent progress in ${domainNames[0]}`,
    date: "2024-06-10",
    type: "success",
  },
];

const suggestions = [
  "Daily 10-minute walk",
  "Memory games (crossword, sudoku)",
  "Call a family member for a chat",
];

const COLORS = ["#239d62", "#94a3b8", "#ffb347", "#ff6961"];

const CaregiverDashboardPreview = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col">
    {/* Main Content */}
    <main className="w-full p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#239d62]">
            Welcome, Caregiver!
          </h1>
          <p className="text-gray-600">
            Monitor and support the well-being of your senior citizen.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <FiBell className="text-2xl text-gray-400" />
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Caregiver Avatar"
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
                <Tooltip formatter={(value) => [`${value} / 7`, "Mood"]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#239d62"
                  strokeWidth={2}
                  dot={{ r: 4 }}
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
              <BarChart
                data={activityParticipation}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#239d62"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Activity Type Distribution (Pie Chart) */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
          Activity Type Distribution
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activityTypeDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {activityTypeDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Updates & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-md font-semibold text-[#239d62] mb-2">
            Recent Updates
          </h3>
          <ul className="divide-y divide-gray-100">
            {activities.map((a, idx) => (
              <li key={idx} className="py-2 flex justify-between text-gray-700">
                <span>{a.title}</span>
                <span className="text-xs text-gray-400">{a.date}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-md font-semibold text-[#239d62] mb-2">Alerts</h3>
          <ul className="divide-y divide-gray-100">
            {alerts.map((alert, idx) => (
              <li
                key={idx}
                className={`py-2 flex justify-between ${
                  alert.type === "critical" ? "text-red-600" : "text-yellow-600"
                }`}
              >
                <span>{alert.message}</span>
                <span className="text-xs text-gray-400">{alert.date}</span>
              </li>
            ))}
          </ul>
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
        This is a static dashboard preview. The full dashboard will include
        real-time updates, interactive charts, and more features.
      </div>
    </main>
  </div>
);

export default CaregiverDashboardPreview;
