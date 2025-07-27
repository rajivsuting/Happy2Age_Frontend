import React from "react";
import {
  FiBarChart2,
  FiMessageSquare,
  FiTrendingUp,
  FiUsers,
  FiHeart,
  FiMap,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

const domainNames = [
  "Perception of Self",
  "Motor Skills",
  "Attention",
  "Cognition",
  "Verbalisation",
  "Creativity",
  "Group Interaction",
];

const AutomatedDataAnalysis = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 w-full">
    {/* Coming Soon Badge */}
    <div className="absolute top-6 right-6 z-10">
      <span className="bg-yellow-400 text-white px-4 py-1 rounded-full font-semibold text-sm shadow-lg">
        Coming Soon
      </span>
    </div>
    {/* Hero Section */}
    <div className="w-full text-center mb-10 px-8 md:px-12">
      <h1 className="text-5xl font-extrabold text-[#239d62] mb-3">
        Automated Data Analysis & Reporting
      </h1>
      <p className="text-xl text-gray-700 mb-6">
        Harness AI and NLP to make complex data accessible, track progress over
        years, and integrate with leading partners for holistic senior care.
      </p>
    </div>
    {/* NLP Summaries Section */}
    <div className="w-full bg-white rounded-lg shadow p-8 md:p-12 mb-10 flex flex-col md:flex-row gap-8 items-center">
      <div className="flex-shrink-0 flex flex-col items-center">
        <FiMessageSquare className="h-12 w-12 text-[#239d62] mb-2" />
        <h2 className="text-2xl font-semibold text-[#239d62] mb-2">
          NLP-Powered Summaries
        </h2>
        <p className="text-gray-600 text-center mb-2">
          AI-generated, easy-to-understand summaries of complex reports.
        </p>
      </div>
      <div className="flex-1 bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm w-full">
        <div className="text-gray-500 text-sm mb-2">Sample Summary:</div>
        <div className="text-base text-gray-800 italic">
          “In the last quarter, <b>Cognition</b> and <b>Creativity</b> domains
          showed the highest improvement, with average scores rising by 18% and
          15% respectively. <b>Group Interaction</b> and{" "}
          <b>Perception of Self</b> also saw steady growth. Attendance remained
          high, and satisfaction scores increased across all centres.”
        </div>
      </div>
    </div>
    {/* Longitudinal Studies Section */}
    <div className="w-full bg-white rounded-lg shadow p-8 md:p-12 mb-10 flex flex-col md:flex-row gap-8 items-center">
      <div className="flex-shrink-0 flex flex-col items-center">
        <FiTrendingUp className="h-12 w-12 text-[#239d62] mb-2" />
        <h2 className="text-2xl font-semibold text-[#239d62] mb-2">
          Longitudinal Studies
        </h2>
        <p className="text-gray-600 text-center mb-2">
          Track member progress and outcomes over years for research and care
          improvement.
        </p>
      </div>
      <div className="flex-1 bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm flex flex-col items-center justify-center w-full">
        <div className="text-gray-500 text-sm mb-2">
          Sample Progress Timeline:
        </div>
        <div className="w-full h-24 flex flex-col items-center justify-center text-gray-400">
          <div className="flex gap-4 flex-wrap justify-center">
            {domainNames.map((domain) => (
              <div key={domain} className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-[#239d62] mb-1" />
                <span className="text-xs text-gray-700 whitespace-nowrap">
                  {domain}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            (Each dot represents a tracked domain's progress over time)
          </div>
        </div>
      </div>
    </div>
    {/* Integration with Partners Section */}
    <div className="w-full bg-white rounded-lg shadow p-8 md:p-12 mb-10">
      <h2 className="text-2xl font-semibold text-[#239d62] mb-6 text-center">
        Integration with Leading Partners
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
          <FiHeart className="h-10 w-10 text-[#239d62] mb-2" />
          <div className="font-semibold text-gray-800 mb-1">Healthcare</div>
          <div className="text-gray-500 text-sm text-center mb-2">
            Connect with healthcare providers for holistic well-being.
          </div>
          <div className="text-xs text-gray-600 text-center">
            <b>Example:</b> Book telemedicine appointments, share health reports
            with your doctor, or receive medication reminders directly from the
            Happy2Age platform.
          </div>
        </div>
        <div className="flex flex-col items-center bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
          <FiClock className="h-10 w-10 text-[#239d62] mb-2" />
          <div className="font-semibold text-gray-800 mb-1">
            Dementia Assessment
          </div>
          <div className="text-gray-500 text-sm text-center mb-2">
            Integrate dementia screening and management tools.
          </div>
          <div className="text-xs text-gray-600 text-center">
            <b>Example:</b> Take a digital cognitive assessment, track changes
            over time, and connect with dementia care specialists for
            personalized support.
          </div>
        </div>
        <div className="flex flex-col items-center bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
          <FiMap className="h-10 w-10 text-[#239d62] mb-2" />
          <div className="font-semibold text-gray-800 mb-1">
            Travel & Lifestyle
          </div>
          <div className="text-gray-500 text-sm text-center mb-2">
            Offer travel and lifestyle services for seniors.
          </div>
          <div className="text-xs text-gray-600 text-center">
            <b>Example:</b> Browse curated travel packages for seniors, book
            group trips, or access local events and wellness activities through
            trusted partners.
          </div>
        </div>
      </div>
    </div>
    {/* Benefits Section */}
    <div className="w-full bg-white rounded-lg shadow p-8 md:p-12 mb-16">
      <h2 className="text-2xl font-semibold text-[#239d62] mb-6 text-center">
        Benefits for Users
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-gray-700 list-disc list-inside">
        <li>Easy-to-understand, actionable reports</li>
        <li>
          Track progress in domains like Cognition, Creativity, Group
          Interaction, and more
        </li>
        <li>Support for research and evidence-based care</li>
        <li>Access to integrated health and lifestyle services</li>
        <li>Personalized insights for every member</li>
        <li>Empowers families, caregivers, and professionals</li>
      </ul>
    </div>
  </div>
);

export default AutomatedDataAnalysis;
