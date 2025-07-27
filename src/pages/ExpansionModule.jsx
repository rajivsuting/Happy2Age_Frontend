import React from "react";
import {
  FiUserPlus,
  FiBookOpen,
  FiMapPin,
  FiBarChart2,
  FiCheckCircle,
  FiUsers,
  FiHome,
  FiClipboard,
  FiStar,
} from "react-icons/fi";

const stats = [
  {
    icon: <FiUsers className="h-7 w-7 text-[#239d62]" />,
    label: "Total Partners",
    value: 12,
  },
  {
    icon: <FiHome className="h-7 w-7 text-[#239d62]" />,
    label: "Centres",
    value: 8,
  },
  {
    icon: <FiClipboard className="h-7 w-7 text-[#239d62]" />,
    label: "Members",
    value: 320,
  },
  {
    icon: <FiBookOpen className="h-7 w-7 text-[#239d62]" />,
    label: "Modules",
    value: 4,
  },
];

const steps = [
  {
    icon: <FiUserPlus className="h-8 w-8 text-[#239d62]" />,
    title: "Register as a Partner",
    desc: "Sign up to become a Happy2Age franchise/business partner.",
  },
  {
    icon: <FiBookOpen className="h-8 w-8 text-[#239d62]" />,
    title: "Access Knowledge Modules",
    desc: "Get exclusive access to training and delivery modules for your centre.",
  },
  {
    icon: <FiMapPin className="h-8 w-8 text-[#239d62]" />,
    title: "Launch at New Centre",
    desc: "Start delivering programs at your location with full support.",
  },
  {
    icon: <FiBarChart2 className="h-8 w-8 text-[#239d62]" />,
    title: "Monitor Progress",
    desc: "Track your centre’s performance and member outcomes.",
  },
];

const modules = [
  {
    name: "Cognition Module",
    desc: "Activities and resources for cognitive development.",
  },
  {
    name: "Social Engagement Module",
    desc: "Tools for fostering group interaction and social skills.",
  },
  {
    name: "Physical Wellness Module",
    desc: "Guides and activities for physical health and mobility.",
  },
  {
    name: "Creative Expression Module",
    desc: "Art, music, and creative therapies for members.",
  },
];

const partners = [
  {
    name: "Sunrise Eldercare",
    city: "Mumbai",
    since: "2022",
    status: "Active",
  },
  { name: "Silver Years", city: "Pune", since: "2023", status: "Active" },
  {
    name: "Golden Touch",
    city: "Delhi",
    since: "2023",
    status: "Launching Soon",
  },
];

const testimonials = [
  {
    name: "Rohit Sharma",
    org: "Sunrise Eldercare",
    text: "Joining Happy2Age as a partner has helped us deliver world-class programs and grow our community.",
    icon: <FiStar className="h-6 w-6 text-yellow-400" />,
  },
  {
    name: "Anita Desai",
    org: "Silver Years",
    text: "The knowledge modules and support are top-notch. Our members love the activities!",
    icon: <FiStar className="h-6 w-6 text-yellow-400" />,
  },
];

const ExpansionModule = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 w-full">
    {/* Coming Soon Badge */}
    <div className="absolute top-6 right-6 z-10">
      <span className="bg-yellow-400 text-white px-4 py-1 rounded-full font-semibold text-sm shadow-lg">
        Coming Soon
      </span>
    </div>
    {/* Hero Section */}
    <div className="w-full max-w-5xl text-center mb-10">
      <h1 className="text-5xl font-extrabold text-[#239d62] mb-3">
        Expansion Module (Franchise)
      </h1>
      <p className="text-xl text-gray-700 mb-6">
        Empower your organization to deliver Happy2Age programs nationwide.
        Register as a partner, access exclusive modules, and launch new centres
        with full support.
      </p>
      <button className="px-8 py-3 bg-[#239d62] text-white rounded-lg font-semibold shadow hover:bg-[#1e7e53] transition text-lg">
        Register as a Partner
      </button>
    </div>
    {/* Dashboard Stats */}
    <div className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 px-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl shadow flex flex-col items-center py-6 px-2"
        >
          {stat.icon}
          <div className="text-2xl font-bold text-[#239d62] mt-2">
            {stat.value}
          </div>
          <div className="text-gray-600 mt-1 text-sm text-center">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
    {/* Steps Timeline */}
    <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8 mb-10">
      <h2 className="text-2xl font-semibold text-[#239d62] mb-6 text-center">
        How It Works
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {steps.map((step, idx) => (
          <div key={step.title} className="flex flex-col items-center flex-1">
            <div className="mb-2">{step.icon}</div>
            <div className="text-xl font-bold text-[#239d62] mb-1">
              {step.title}
            </div>
            <div className="text-gray-500 text-sm text-center mb-2">
              {step.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Knowledge Modules */}
    <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8 mb-10">
      <h2 className="text-2xl font-semibold text-[#239d62] mb-6 text-center">
        Available Knowledge Modules
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => (
          <div
            key={mod.name}
            className="bg-gray-50 rounded-lg p-5 border border-gray-200 flex flex-col gap-2 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 mb-1">
              <FiCheckCircle className="text-[#239d62] h-5 w-5" />
              <span className="font-semibold text-gray-800 text-lg">
                {mod.name}
              </span>
            </div>
            <div className="text-gray-500 text-sm mb-2">{mod.desc}</div>
          </div>
        ))}
      </div>
    </div>
    {/* Existing Partners Table */}
    <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8 mb-10">
      <h2 className="text-2xl font-semibold text-[#239d62] mb-6 text-center">
        Existing Partners
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#239d62]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Partner Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Since
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {partners.map((p) => (
              <tr key={p.name}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {p.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {p.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {p.since}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      p.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    {/* Partner Benefits */}
    <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8 mb-10">
      <h2 className="text-2xl font-semibold text-[#239d62] mb-6 text-center">
        Partner Benefits
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-gray-700 list-disc list-inside">
        <li>Access to exclusive Happy2Age knowledge modules and resources</li>
        <li>Comprehensive onboarding and ongoing support</li>
        <li>Brand recognition and marketing support</li>
        <li>Performance analytics and reporting tools</li>
        <li>Community of like-minded partners</li>
        <li>Opportunities for growth and expansion</li>
      </ul>
    </div>
    {/* Testimonials */}
    <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8 mb-10">
      <h2 className="text-2xl font-semibold text-[#239d62] mb-6 text-center">
        What Our Partners Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-gray-50 rounded-lg p-5 border border-gray-200 flex flex-col gap-2 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              {t.icon}
              <span className="font-semibold text-gray-800">
                {t.name} ({t.org})
              </span>
            </div>
            <div className="text-gray-500 text-base italic">“{t.text}”</div>
          </div>
        ))}
      </div>
    </div>
    {/* Registration Form (disabled) */}
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mb-16 relative">
      <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10 rounded-lg">
        <span className="bg-yellow-400 text-white px-4 py-1 rounded-full font-semibold text-sm mb-4">
          Coming Soon
        </span>
        <span className="text-gray-500 font-semibold text-lg">
          Franchise Registration will open soon!
        </span>
      </div>
      <h2 className="text-2xl font-semibold text-[#239d62] mb-6 text-center">
        Register as a Partner
      </h2>
      <form className="flex flex-col gap-4 opacity-50 pointer-events-none">
        <input
          type="text"
          placeholder="Full Name"
          className="border rounded px-4 py-2"
        />
        <input
          type="email"
          placeholder="Email Address"
          className="border rounded px-4 py-2"
        />
        <input
          type="text"
          placeholder="Business/Organization"
          className="border rounded px-4 py-2"
        />
        <button className="px-6 py-2 bg-[#239d62] text-white rounded font-semibold">
          Register
        </button>
      </form>
    </div>
  </div>
);

export default ExpansionModule;
