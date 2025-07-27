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
} from "recharts";

// Real domain names for preview
const realDomains = [
  {
    _id: "d1",
    name: "Perception of Self",
    category: "Special Need",
    average: 4.2,
  },
  { _id: "d2", name: "Motor Skills", category: "Special Need", average: 3.8 },
  { _id: "d3", name: "Attention", category: "Special Need", average: 4.5 },
  { _id: "d4", name: "Cognition", category: "Special Need", average: 4.0 },
  { _id: "d5", name: "Verbalisation", category: "Special Need", average: 3.7 },
  { _id: "d6", name: "Creativity", category: "Special Need", average: 4.3 },
  {
    _id: "d7",
    name: "Group Interaction",
    category: "Special Need",
    average: 4.1,
  },
];

// Update mockActivities to use these domains
const realActivities = [
  {
    _id: "a1",
    name: "Singing (with Words)",
    primaryDomain: "d1",
    secondaryDomain: "d2",
  },
  {
    _id: "a2",
    name: "Story Writing",
    primaryDomain: "d3",
    secondaryDomain: "d4",
  },
  {
    _id: "a3",
    name: "Story Telling",
    primaryDomain: "d5",
    secondaryDomain: "d6",
  },
  {
    _id: "a4",
    name: "Doodling (with Stencils)",
    primaryDomain: "d7",
    secondaryDomain: "d1",
  },
  {
    _id: "a5",
    name: "Tambola (Different Type)",
    primaryDomain: "d2",
    secondaryDomain: "d3",
  },
  { _id: "a6", name: "Pair Game", primaryDomain: "d4", secondaryDomain: "d5" },
];

// Update mockMembers to use these domains and activities
const realMembers = [
  {
    _id: "m1",
    name: "John Doe",
    progress: { d1: 4.5, d2: 3.9, d3: 4.7, d4: 4.2, d5: 3.8, d6: 4.1, d7: 4.0 },
    activities: ["a1", "a3", "a5"],
  },
  {
    _id: "m2",
    name: "Jane Smith",
    progress: { d1: 4.0, d2: 4.2, d3: 4.3, d4: 3.8, d5: 3.9, d6: 4.0, d7: 3.9 },
    activities: ["a2", "a4"],
  },
  {
    _id: "m3",
    name: "Sam Lee",
    progress: { d1: 3.8, d2: 3.7, d3: 4.1, d4: 4.5, d5: 4.0, d6: 3.8, d7: 4.2 },
    activities: ["a1", "a2", "a4"],
  },
];

// Analytics
const domainAverages = realDomains.map((domain) => {
  const total = realMembers.reduce(
    (sum, m) => sum + (m.progress[domain._id] || 0),
    0
  );
  return {
    name: domain.name,
    average: (total / realMembers.length).toFixed(2),
  };
});
const mostActiveMember = realMembers.reduce(
  (max, m) => (m.activities.length > max.activities.length ? m : max),
  realMembers[0]
);

const MemberDomainProgress = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col">
    <main className="w-full p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#239d62] mb-2">
          Member Progress on Domains
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl">
          Track the progress of every member on various selected domains.
          Activity modules are linked to these domains for targeted development.
        </p>
      </div>

      {/* Analytics */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#239d62]">Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[#239d62]">
              {mostActiveMember.name}
            </span>
            <span className="text-gray-600 mt-2 text-center">
              Most Active Member
              <br />
              (Activities: {mostActiveMember.activities.length})
            </span>
          </div>
          <div className="w-full">
            <h3 className="text-md font-semibold text-[#239d62] mb-2 text-center">
              Average Progress by Domain
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={domainAverages}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="average"
                    fill="#239d62"
                    barSize={40}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Member Progress Table */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
          Member Progress Table
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#239d62]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Member
                </th>
                {realDomains.map((domain) => (
                  <th
                    key={domain._id}
                    className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                  >
                    {domain.name}
                  </th>
                ))}
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Activities
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {realMembers.map((member) => (
                <tr key={member._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.name}
                  </td>
                  {realDomains.map((domain) => (
                    <td
                      key={domain._id}
                      className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900"
                    >
                      {member.progress[domain._id]}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                    {member.activities
                      .map((aid) => {
                        const act = realActivities.find((a) => a._id === aid);
                        return act ? act.name : aid;
                      })
                      .join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
          Activity Modules & Linked Domains
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#239d62]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Primary Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Secondary Domain
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {realActivities.map((activity) => (
                <tr key={activity._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {
                      realDomains.find((d) => d._id === activity.primaryDomain)
                        ?.name
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {
                      realDomains.find(
                        (d) => d._id === activity.secondaryDomain
                      )?.name
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-gray-400 text-sm text-center">
        This is a static preview. The full dashboard will include real-time
        data, filtering, and deeper analytics.
      </div>
    </main>
  </div>
);

export default MemberDomainProgress;
