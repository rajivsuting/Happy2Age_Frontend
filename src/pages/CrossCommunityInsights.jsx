import React from "react";
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

// Real domain names for preview
const realDomainNames = [
  "Perception of Self",
  "Motor Skills",
  "Attention",
  "Cognition",
  "Verbalisation",
  "Creativity",
  "Group Interaction",
];

// Use only real domain names in the graphDetails
const graphDetails = [
  { domainName: "Perception of Self", average: 4.2, cohort: "Center A" },
  { domainName: "Perception of Self", average: 3.8, cohort: "Center B" },
  { domainName: "Motor Skills", average: 4.5, cohort: "Center A" },
  { domainName: "Motor Skills", average: 4.0, cohort: "Center B" },
  { domainName: "Attention", average: 3.9, cohort: "Center A" },
  { domainName: "Attention", average: 4.1, cohort: "Center B" },
  { domainName: "Cognition", average: 4.7, cohort: "Center A" },
  { domainName: "Cognition", average: 4.2, cohort: "Center B" },
  { domainName: "Verbalisation", average: 4.0, cohort: "Center A" },
  { domainName: "Verbalisation", average: 3.7, cohort: "Center B" },
  { domainName: "Creativity", average: 4.3, cohort: "Center A" },
  { domainName: "Creativity", average: 4.1, cohort: "Center B" },
  { domainName: "Group Interaction", average: 4.6, cohort: "Center A" },
  { domainName: "Group Interaction", average: 4.2, cohort: "Center B" },
];

const genderData = [
  { gender: "Male", count: 12 },
  { gender: "Female", count: 18 },
  { gender: "Other", count: 2 },
];

const participantTypeData = [
  { participantType: "General", count: 20 },
  { participantType: "Special Need", count: 12 },
];

const ageData = [
  { ageRange: "55-65", count: 10 },
  { ageRange: "65-75", count: 15 },
  { ageRange: "75+", count: 7 },
];

const COLORS = ["#239d62", "#94a3b8", "#ffb347", "#ff6961"];

// Analytics
const totalParticipants = genderData.reduce((sum, g) => sum + g.count, 0);
const mostCommonAge = ageData.reduce(
  (max, a) => (a.count > max.count ? a : max),
  ageData[0]
);
const mostCommonGender = genderData.reduce(
  (max, g) => (g.count > max.count ? g : max),
  genderData[0]
);
const mostCommonType = participantTypeData.reduce(
  (max, t) => (t.count > max.count ? t : max),
  participantTypeData[0]
);

// Prepare data for stacked bar chart (domain averages by cohort)
const domainNames = Array.from(new Set(graphDetails.map((d) => d.domainName)));
const cohortNames = Array.from(new Set(graphDetails.map((d) => d.cohort)));
const stackedData = domainNames.map((domain) => {
  const entry = { domainName: domain };
  cohortNames.forEach((cohort) => {
    const found = graphDetails.find(
      (d) => d.domainName === domain && d.cohort === cohort
    );
    entry[cohort] = found ? found.average : 0;
  });
  return entry;
});

const CrossCommunityInsights = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col">
    <main className="w-full p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#239d62] mb-2">
          Cross-Community Insights
        </h1>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
          Summary Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[#239d62]">
              {totalParticipants}
            </span>
            <span className="text-gray-600 mt-2 text-center">
              Total Participants
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[#239d62]">
              {mostCommonAge.ageRange}
            </span>
            <span className="text-gray-600 mt-2 text-center">
              Most Common Age Group
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[#239d62]">
              {mostCommonGender.gender}
            </span>
            <span className="text-gray-600 mt-2 text-center">
              Most Common Gender
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[#239d62]">
              {mostCommonType.participantType}
            </span>
            <span className="text-gray-600 mt-2 text-center">
              Most Common Type
            </span>
          </div>
        </div>
      </div>

      {/* Domain Averages by Cohort (Stacked Bar Chart) */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
          Domain Averages by Cohort
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stackedData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="domainName" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {cohortNames.map((cohort, idx) => (
                <Bar
                  key={cohort}
                  dataKey={cohort}
                  fill={COLORS[idx % COLORS.length]}
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demographics Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
            Gender Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  dataKey="count"
                  nameKey="gender"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {genderData.map((entry, index) => (
                    <Cell
                      key={`cell-gender-${index}`}
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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
            Participant Type Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={participantTypeData}
                  dataKey="count"
                  nameKey="participantType"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {participantTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-type-${index}`}
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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
            Age Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="ageRange" tick={{ fontSize: 12 }} />
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

      <div className="mt-8 text-gray-400 text-sm text-center">
        This is a static preview. The full insights dashboard will include
        real-time data, filtering, and deeper analytics.
      </div>
    </main>
  </div>
);

export default CrossCommunityInsights;
