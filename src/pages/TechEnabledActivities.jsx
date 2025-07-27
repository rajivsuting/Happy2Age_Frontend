import React from "react";
import {
  FaMusic,
  FaPaintBrush,
  FaLanguage,
  FaVideo,
  FaHeadphones,
} from "react-icons/fa";

// Mock data for activities
const mockActivities = [
  {
    _id: "a1",
    name: "Learn Guitar",
    category: "Musical Instrument",
    offlineFormat: "In-person group class",
    techEnabled: [
      "Video Lessons",
      "Live Online Jam Sessions",
      "Audio Practice Tracks",
    ],
    icon: <FaMusic className="text-[#239d62] text-xl" />,
  },
  {
    _id: "a2",
    name: "Watercolor Painting",
    category: "Visual Art",
    offlineFormat: "Studio workshop",
    techEnabled: [
      "Step-by-step Video Tutorials",
      "Virtual Art Gallery",
      "Live Q&A",
    ],
    icon: <FaPaintBrush className="text-[#239d62] text-xl" />,
  },
  {
    _id: "a3",
    name: "Spanish Language Basics",
    category: "Language Learning",
    offlineFormat: "Classroom lessons",
    techEnabled: [
      "Interactive Audio Lessons",
      "Video Practice",
      "Online Language Games",
    ],
    icon: <FaLanguage className="text-[#239d62] text-xl" />,
  },
  {
    _id: "a4",
    name: "Keyboard Skills",
    category: "Musical Instrument",
    offlineFormat: "Private tutor",
    techEnabled: [
      "Virtual Keyboard Simulator",
      "Video Demos",
      "Audio Feedback",
    ],
    icon: <FaMusic className="text-[#239d62] text-xl" />,
  },
  {
    _id: "a5",
    name: "Sketching",
    category: "Visual Art",
    offlineFormat: "Art club meetup",
    techEnabled: [
      "Digital Drawing App",
      "Recorded Lessons",
      "Online Critique Sessions",
    ],
    icon: <FaPaintBrush className="text-[#239d62] text-xl" />,
  },
];

const benefits = [
  "Accessible from anywhere, anytime",
  "Self-paced and interactive learning",
  "Audio/visual aids enhance engagement",
  "Opportunities for live feedback and community sharing",
  "Broader reach for members with mobility constraints",
];

const TechEnabledActivities = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col">
    <main className="w-full p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#239d62] mb-2">
          Tech-Enabled Skill Activities
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl">
          All offline skill-based activities are being converted into
          tech-enabled (audio/visual) activities for online offers to registered
          members. Example: learning musical instruments, visual art, new
          languages, and more.
        </p>
      </div>

      {/* Activities Table */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
          Activity Conversion Overview
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#239d62]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Offline Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Tech-Enabled Formats
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockActivities.map((activity) => (
                <tr key={activity._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                    {activity.icon}
                    {activity.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.offlineFormat}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <ul className="list-disc ml-4">
                      {activity.techEnabled.map((format, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          {format.includes("Video") && (
                            <FaVideo className="text-[#94a3b8]" />
                          )}
                          {format.includes("Audio") && (
                            <FaHeadphones className="text-[#ffb347]" />
                          )}
                          {format}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#239d62]">
          Benefits of Tech-Enabled Activities
        </h2>
        <ul className="list-disc ml-6 text-gray-700 text-lg">
          {benefits.map((b, idx) => (
            <li key={idx}>{b}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 text-gray-400 text-sm text-center">
        This is a static preview. The full platform will include interactive
        modules, progress tracking, and more.
      </div>
    </main>
  </div>
);

export default TechEnabledActivities;
