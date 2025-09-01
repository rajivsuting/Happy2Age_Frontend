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
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HCMore from "highcharts/highcharts-more";
import Heatmap from "highcharts/modules/heatmap";

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

// Use only real domain names in the graphDetails with 5 centers
const graphDetails = [
  { domainName: "Perception of Self", average: 4.2, cohort: "Center A" },
  { domainName: "Perception of Self", average: 3.8, cohort: "Center B" },
  { domainName: "Perception of Self", average: 4.5, cohort: "Center C" },
  { domainName: "Perception of Self", average: 3.9, cohort: "Center D" },
  { domainName: "Perception of Self", average: 4.1, cohort: "Center E" },

  { domainName: "Motor Skills", average: 4.5, cohort: "Center A" },
  { domainName: "Motor Skills", average: 4.0, cohort: "Center B" },
  { domainName: "Motor Skills", average: 3.7, cohort: "Center C" },
  { domainName: "Motor Skills", average: 4.3, cohort: "Center D" },
  { domainName: "Motor Skills", average: 3.8, cohort: "Center E" },

  { domainName: "Attention", average: 3.9, cohort: "Center A" },
  { domainName: "Attention", average: 4.1, cohort: "Center B" },
  { domainName: "Attention", average: 4.6, cohort: "Center C" },
  { domainName: "Attention", average: 3.5, cohort: "Center D" },
  { domainName: "Attention", average: 4.2, cohort: "Center E" },

  { domainName: "Cognition", average: 4.7, cohort: "Center A" },
  { domainName: "Cognition", average: 4.2, cohort: "Center B" },
  { domainName: "Cognition", average: 3.8, cohort: "Center C" },
  { domainName: "Cognition", average: 4.4, cohort: "Center D" },
  { domainName: "Cognition", average: 4.0, cohort: "Center E" },

  { domainName: "Verbalisation", average: 4.0, cohort: "Center A" },
  { domainName: "Verbalisation", average: 3.7, cohort: "Center B" },
  { domainName: "Verbalisation", average: 4.3, cohort: "Center C" },
  { domainName: "Verbalisation", average: 3.6, cohort: "Center D" },
  { domainName: "Verbalisation", average: 4.1, cohort: "Center E" },

  { domainName: "Creativity", average: 4.3, cohort: "Center A" },
  { domainName: "Creativity", average: 4.1, cohort: "Center B" },
  { domainName: "Creativity", average: 3.9, cohort: "Center C" },
  { domainName: "Creativity", average: 4.5, cohort: "Center D" },
  { domainName: "Creativity", average: 3.8, cohort: "Center E" },

  { domainName: "Group Interaction", average: 4.6, cohort: "Center A" },
  { domainName: "Group Interaction", average: 4.2, cohort: "Center B" },
  { domainName: "Group Interaction", average: 4.0, cohort: "Center C" },
  { domainName: "Group Interaction", average: 3.7, cohort: "Center D" },
  { domainName: "Group Interaction", average: 4.4, cohort: "Center E" },
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

const COLORS = ["#239d62", "#94a3b8", "#ffb347", "#ff6961"];

// Analytics
const totalParticipants = genderData.reduce((sum, g) => sum + g.count, 0);
const totalCenters = 5; // Updated to reflect 5 centers
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

// Heat map component using Highcharts
const DomainHeatmap = ({ data }) => {
  const domains = [...new Set(data.map((item) => item.domainName))];
  const cohorts = [...new Set(data.map((item) => item.cohort))];
  const heatmapData = data.map((item, index) => [
    domains.indexOf(item.domainName),
    cohorts.indexOf(item.cohort),
    parseFloat(item.average) || 0,
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
      labels: {
        style: { color: "#000000", fontSize: "12px" },
        rotation: -45,
      },
    },
    yAxis: {
      categories: cohorts,
      title: {
        text: "Cohorts",
        style: { color: "#000000", fontSize: "14px" },
      },
      labels: { style: { color: "#000000", fontSize: "12px" } },
    },
    colorAxis: {
      min: 0,
      max: 6,
      stops: [
        [0, "#FF8042"], // Orange
        [0.33, "#FF8042"], // Orange (0-2: 2/6 = 0.33)
        [0.34, "#f3ba00"], // Yellow
        [0.67, "#f3ba00"], // Yellow (2.1-4: 1.9/6 = 0.67)
        [0.68, "#239d62"], // Green
        [1, "#239d62"], // Green (4.1-6: 1.9/6 = 0.68-1)
      ],
      labels: { enabled: false },
      title: { enabled: false },
      legend: { enabled: false },
      visible: false,
    },
    series: [
      {
        name: "Domain Performance",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        data: heatmapData,
        dataLabels: {
          enabled: true,
          color: "#000000",
          format: "{point.value:.1f}",
          style: { fontSize: "12px", fontWeight: "bold" },
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
        }</b><br>Cohort: ${
          this.series.yAxis.categories[this.point.y]
        }<br>Average: ${this.point.value.toFixed(1)}`;
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
            flexWrap: "wrap",
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
              Green (4.1-6)
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
        </div>
      </div>
    </div>
  );
};

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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
              {totalCenters}
            </span>
            <span className="text-gray-600 mt-2 text-center">
              Total Centers
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

      {/* Domain Performance Heat Map */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
          Domain Performance Heat Map
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg border border-[#239d62]">
          <DomainHeatmap data={graphDetails} />
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
