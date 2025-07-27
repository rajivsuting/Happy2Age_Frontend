import React from "react";
import {
  FaBullhorn,
  FaEnvelope,
  FaMobileAlt,
  FaVideo,
  FaUsers,
  FaChalkboardTeacher,
} from "react-icons/fa";

// Mock announcements
const mockAnnouncements = [
  {
    id: 1,
    title: "New Word Formation Session Announced!",
    date: "2024-10-20",
    content:
      "Join our new Word Formation session next week. Both online and offline slots available.",
  },
  {
    id: 2,
    title: "Performance Reports Released",
    date: "2024-10-18",
    content:
      "Your updated activity performance reports are now available in your dashboard.",
  },
  {
    id: 3,
    title: "Collaboration with Art Club",
    date: "2024-10-15",
    content:
      "Special offline sessions with the Local Art Club start this Friday.",
  },
];

// Mock activity progress updates
const mockActivityUpdates = [
  {
    id: 1,
    activity: "Word Formation",
    progress: "Completed 3/5 modules",
    lastSession: "2024-10-19",
  },
  {
    id: 2,
    activity: "Ball Throwing",
    progress: "Completed 2/4 modules",
    lastSession: "2024-10-18",
  },
  {
    id: 3,
    activity: "Story Creations (with words)",
    progress: "Completed 1/3 modules",
    lastSession: "2024-10-17",
  },
];

// Mock sessions
const mockSessions = [
  {
    id: 1,
    name: "S1/26/10/2024",
    type: "Online",
    collaborator: "City Music Academy",
    date: "2024-10-26",
  },
  {
    id: 2,
    name: "S1/29/10/2024",
    type: "Offline",
    collaborator: "Local Art Club",
    date: "2024-10-29",
  },
  {
    id: 3,
    name: "S2-11/11/2024",
    type: "Online",
    collaborator: "Language Institute",
    date: "2024-11-11",
  },
  {
    id: 4,
    name: "RP - 11/11/2024",
    type: "Offline",
    collaborator: "Wellness Center",
    date: "2024-11-11",
  },
];

const communicationChannels = [
  {
    icon: <FaEnvelope className="text-[#239d62] text-xl" />,
    label: "Email Updates",
  },
  {
    icon: <FaMobileAlt className="text-[#239d62] text-xl" />,
    label: "Mobile App Notifications",
  },
  {
    icon: <FaBullhorn className="text-[#239d62] text-xl" />,
    label: "Announcements Board",
  },
  {
    icon: <FaVideo className="text-[#239d62] text-xl" />,
    label: "Live Video Sessions",
  },
  {
    icon: <FaUsers className="text-[#239d62] text-xl" />,
    label: "Group Chats & Forums",
  },
];

const TechCommunicationAndSessions = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col">
    <main className="w-full p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#239d62] mb-2">
          Hybrid Activity Communication Hub
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl">
          A modern, centralized hub for managing communication, announcements,
          and hybrid (online/offline) sessions for all activities. Easily keep
          members and collaborators informed and engaged with real-time updates
          and flexible session delivery.
        </p>
      </div>

      {/* Communication Channels */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
          Communication Channels
        </h2>
        <div className="flex flex-wrap gap-6">
          {communicationChannels.map((ch, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2 shadow-sm"
            >
              {ch.icon}
              <span className="text-gray-700 text-lg">{ch.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
          Recent Announcements
        </h2>
        <ul className="divide-y divide-gray-200">
          {mockAnnouncements.map((a) => (
            <li key={a.id} className="py-4">
              <div className="flex items-center gap-3 mb-1">
                <FaBullhorn className="text-[#239d62]" />
                <span className="font-semibold text-gray-900">{a.title}</span>
                <span className="ml-2 text-xs text-gray-400">{a.date}</span>
              </div>
              <div className="text-gray-700 ml-7">{a.content}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Activity Progress Updates */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
          Activity Progress Updates
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#239d62]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Last Session
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockActivityUpdates.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {u.activity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {u.progress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {u.lastSession}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
          Upcoming Sessions (Online & Offline)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#239d62]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Session
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Collaborator
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockSessions.map((s) => (
                <tr key={s.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                    {s.type === "Online" ? (
                      <FaVideo className="text-[#239d62]" />
                    ) : (
                      <FaChalkboardTeacher className="text-[#ffb347]" />
                    )}
                    {s.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {s.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {s.collaborator}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {s.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-gray-400 text-sm text-center">
        This is a static preview. The full platform will include real-time chat,
        push notifications, and session management.
      </div>
    </main>
  </div>
);

export default TechCommunicationAndSessions;
