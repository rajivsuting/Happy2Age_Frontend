import React from "react";

// Real activity names for preview
const realActivities = [
  {
    _id: "66f2818645c8eab2e978c913",
    name: "Singing (with Words)",
    description:
      "Write chits of words on which Hindi Songs can be identified and allow …",
    references: "No reference",
  },
  {
    _id: "66f281b245c8eab2e978c917",
    name: "Story Writing",
    description:
      "Provide a set of words that are picked up from a box. Each one will ne…",
    references: "No reference.",
  },
  {
    _id: "66f281ba45c8eab2e978c91b",
    name: "Story Telling",
    description:
      "Provide chits of words or give a mix of themes and members have to nar…",
    references: "No reference",
  },
  {
    _id: "66f281e145c8eab2e978c91f",
    name: "Doodling (with Stencils)",
    description:
      "Give them some stencils,and their creativity flow freely.. They can ei…",
    references: "No reference",
  },
  {
    _id: "66f281f345c8eab2e978c923",
    name: "Tambola (Different Type)",
    description:
      "Make the sheet with A, B, C.... Z with boxes for members to fill in th…",
    references:
      "https://youtu.be/25oZKTd7xa0?si=4ynS0m3M0lbBjWta https://youtu.b…",
  },
  {
    _id: "66f2823645c8eab2e978c927",
    name: "Pair Game",
    description:
      "Standing in pair back to back &turn and say numbers when they see each…",
    references: "No reference",
  },
];

// Update mockSessions to use these activities
const realSessions = [
  {
    _id: "s1",
    name: "S1/01/07/2024",
    cohort: "c1",
    activity: ["66f2818645c8eab2e978c913"],
    participants: Array(7).fill({}),
    numberOfMins: 75,
    date: "2024-07-01T00:00:00.000+00:00",
  },
  {
    _id: "s2",
    name: "S2/02/07/2024",
    cohort: "c1",
    activity: ["66f281b245c8eab2e978c917", "66f281ba45c8eab2e978c91b"],
    participants: Array(9).fill({}),
    numberOfMins: 60,
    date: "2024-07-02T00:00:00.000+00:00",
  },
  {
    _id: "s3",
    name: "S3/03/07/2024",
    cohort: "c2",
    activity: ["66f281e145c8eab2e978c91f", "66f281f345c8eab2e978c923"],
    participants: Array(8).fill({}),
    numberOfMins: 60,
    date: "2024-07-03T00:00:00.000+00:00",
  },
  {
    _id: "s4",
    name: "S4/04/07/2024",
    cohort: "c2",
    activity: ["66f2823645c8eab2e978c927", "66f2818645c8eab2e978c913"],
    participants: Array(10).fill({}),
    numberOfMins: 75,
    date: "2024-07-04T00:00:00.000+00:00",
  },
];

const SessionActivityOverview = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col">
    <main className="w-full p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#239d62] mb-2">
          Session & Activity Overview
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl">
          Overview of all sessions, their activities, and participation.
          Activities are linked to sessions and described in detail below.
        </p>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#239d62]">Sessions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#239d62]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Session Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  # Activities
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Activities
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  # Participants
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Duration (min)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {realSessions.map((session) => (
                <tr key={session._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {session.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(session.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                    {session.activity.length}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                    {session.activity
                      .map((aid) => {
                        const act = realActivities.find((a) => a._id === aid);
                        return act ? act.name : aid;
                      })
                      .join(", ")}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                    {session.participants.length}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                    {session.numberOfMins}
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
          Activities
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#239d62]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Activity Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  References
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
                    {activity.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.references}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-gray-400 text-sm text-center">
        This is a static preview. The full dashboard will include session
        analytics, participant lists, and more.
      </div>
    </main>
  </div>
);

export default SessionActivityOverview;
