import React from "react";
import { useNavigate } from "react-router-dom";

const UpcomingFeatures = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4 text-[#239d62]">
        🚀 Upcoming Features
      </h1>
      <ul className="list-disc text-lg text-gray-700 mb-8">
        <li>
          <span>Family Member/Member Dashboard: </span>
          <button
            className="ml-2 px-3 py-1 bg-[#239d62] text-white rounded hover:bg-[#239d62]/90 text-sm"
            onClick={() => navigate("/caregiver-dashboard-preview")}
          >
            Preview
          </button>
        </li>
        <li className="mt-4">
          <span>Family Member Portal: </span>
          <button
            className="ml-2 px-3 py-1 bg-[#239d62] text-white rounded hover:bg-[#239d62]/90 text-sm"
            onClick={() => navigate("/family-portal-preview")}
          >
            Preview
          </button>
        </li>
        <li className="mt-4">
          <span>Cross-Community Insights: </span>
          <button
            className="ml-2 px-3 py-1 bg-[#239d62] text-white rounded hover:bg-[#239d62]/90 text-sm"
            onClick={() => navigate("/cross-community-insights")}
          >
            Preview
          </button>
        </li>
        <li className="mt-4">
          <span>Member Domain Progress: </span>
          <button
            className="ml-2 px-3 py-1 bg-[#239d62] text-white rounded hover:bg-[#239d62]/90 text-sm"
            onClick={() => navigate("/member-domain-progress")}
          >
            Preview
          </button>
        </li>
        <li className="mt-4">
          <span>Tech Enabled Activities: </span>
          <button
            className="ml-2 px-3 py-1 bg-[#239d62] text-white rounded hover:bg-[#239d62]/90 text-sm"
            onClick={() => navigate("/tech-enabled-activities")}
          >
            Preview
          </button>
        </li>
        <li className="mt-4">
          <span>Tech Communication & Sessions: </span>
          <button
            className="ml-2 px-3 py-1 bg-[#239d62] text-white rounded hover:bg-[#239d62]/90 text-sm"
            onClick={() => navigate("/tech-communication-sessions")}
          >
            Preview
          </button>
        </li>
        <li className="mt-4">
          <span>Session Activity Overview: </span>
          <button
            className="ml-2 px-3 py-1 bg-[#239d62] text-white rounded hover:bg-[#239d62]/90 text-sm"
            onClick={() => navigate("/session-activity-overview")}
          >
            Preview
          </button>
        </li>
        <li className="mt-4">
          <span>Expansion Module (Franchise): </span>
          <button
            className="ml-2 px-3 py-1 bg-[#239d62] text-white rounded hover:bg-[#239d62]/90 text-sm"
            onClick={() => navigate("/expansion-module")}
          >
            Preview
          </button>
        </li>
        <li className="mt-4">
          <span>Click Here Games & Personality Assessment: </span>
          <button
            className="ml-2 px-3 py-1 bg-[#239d62] text-white rounded hover:bg-[#239d62]/90 text-sm"
            onClick={() => navigate("/click-here-games")}
          >
            Preview
          </button>
        </li>
        <li className="mt-4">
          <span>Automated Data Analysis and Reporting: </span>
          <button
            className="ml-2 px-3 py-1 bg-[#239d62] text-white rounded hover:bg-[#239d62]/90 text-sm"
            onClick={() => navigate("/automated-data-analysis")}
          >
            Preview
          </button>
        </li>
      </ul>
      <p className="mt-6 text-gray-500">Stay tuned for more updates!</p>
    </div>
  );
};

export default UpcomingFeatures;
