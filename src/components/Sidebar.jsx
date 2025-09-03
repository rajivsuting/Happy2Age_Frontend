import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  RiDashboardLine,
  RiTeamLine,
  RiBuildingLine,
  RiCalendarLine,
  RiLineChartLine,
  RiCalendarEventLine,
  RiAdminLine,
} from "react-icons/ri";
import {
  MdOutlineAssignment,
  MdOutlinePeople,
  MdOutlineAssessment,
} from "react-icons/md";
import { IoDocumentOutline } from "react-icons/io5";
import { LiaBrainSolid } from "react-icons/lia";
import { BiChevronDown } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { FiBarChart2 } from "react-icons/fi";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, loading: isLoggingOut } = useAuth();

  // Initialize state from localStorage or default to false
  const [isSessionsOpen, setIsSessionsOpen] = useState(() => {
    return JSON.parse(localStorage.getItem("isSessionsOpen")) || false;
  });
  const [isReportsOpen, setIsReportsOpen] = useState(() => {
    return JSON.parse(localStorage.getItem("isReportsOpen")) || false;
  });
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(() => {
    return JSON.parse(localStorage.getItem("isAnalyticsOpen")) || false;
  });

  // Save accordion state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isSessionsOpen", JSON.stringify(isSessionsOpen));
  }, [isSessionsOpen]);

  useEffect(() => {
    localStorage.setItem("isReportsOpen", JSON.stringify(isReportsOpen));
  }, [isReportsOpen]);

  useEffect(() => {
    localStorage.setItem("isAnalyticsOpen", JSON.stringify(isAnalyticsOpen));
  }, [isAnalyticsOpen]);

  const menuItems = [
    { title: "Dashboard", icon: RiDashboardLine, path: "/dashboard" },
    { title: "Members", icon: RiTeamLine, path: "/members" },
    { title: "Centers", icon: RiBuildingLine, path: "/centers" },
    { title: "Activities", icon: RiCalendarLine, path: "/activities" },
    { title: "Calendar", icon: RiCalendarEventLine, path: "/calendar" },
    {
      title: "Evaluation MasterList",
      icon: MdOutlineAssignment,
      path: "/evaluation-master",
    },
    {
      title: "Sessions",
      icon: MdOutlinePeople,
      submenu: [
        { title: "Session List", path: "/sessions/list" },
        { title: "Attendance", path: "/sessions/attendance" },
      ],
      isOpen: isSessionsOpen,
      setIsOpen: setIsSessionsOpen,
    },
    { title: "Evaluations", icon: IoDocumentOutline, path: "/evaluations" },
    // {
    //   title: "Analytics",
    //   icon: RiLineChartLine,
    //   submenu: [
    //     { title: "Performance Trends", path: "/analytics/performance" },
    //     { title: "Center Analytics", path: "/analytics/centers" },
    //   ],
    //   isOpen: isAnalyticsOpen,
    //   setIsOpen: setIsAnalyticsOpen,
    // },
    {
      title: "Reports",
      icon: MdOutlineAssessment,
      submenu: [
        { title: "All Center Report", path: "/reports/all-center" },
        { title: "Center Report", path: "/reports/center" },
        { title: "Member Report", path: "/reports/member" },
        { title: "Report History", path: "/reports/history" },
      ],
      isOpen: isReportsOpen,
      setIsOpen: setIsReportsOpen,
    },
    {
      title: "Oxford Happiness",
      icon: LiaBrainSolid,
      path: "/oxford-happiness",
    },
    { title: "CASP-19", icon: LiaBrainSolid, path: "/casp-19" },
    { title: "MOCA", icon: LiaBrainSolid, path: "/moca" },
  ];

  const handleSignOut = async () => {
    try {
      const result = await logout();
      if (result.success) {
        navigate("/", { replace: true });
      } else {
        console.error("Logout failed:", result.error);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const MenuItem = ({ item }) => {
    const IconComponent = item.icon;
    const isActive = item.path
      ? location.pathname === item.path
      : item.submenu?.some((subItem) => location.pathname === subItem.path);

    const handleClick = () => {
      if (item.submenu) {
        item.setIsOpen(!item.isOpen);
      } else if (item.path) {
        navigate(item.path);
      }
    };

    return (
      <div className="mb-1">
        <div
          className={`flex items-center px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300 ease-in-out
            ${
              isActive
                ? "bg-gradient-to-r from-[#239d62] to-[#239d62]/80 text-white shadow-lg shadow-[#239d62]/20 scale-[1.02]"
                : "text-gray-600 hover:bg-gray-50 hover:scale-[1.02] hover:shadow-sm"
            }`}
          onClick={handleClick}
        >
          <IconComponent
            className={`h-[18px] w-[18px] mr-3 transition-colors ${
              isActive ? "text-white" : "text-[#239d62]"
            }`}
          />
          <span className={`flex-1 text-sm ${isActive ? "font-medium" : ""}`}>
            {item.title}
          </span>
          {item.submenu && (
            <BiChevronDown
              className={`h-5 w-5 transition-transform duration-300 ease-in-out ${
                item.isOpen ? "transform rotate-180" : ""
              } ${isActive ? "text-white" : "text-gray-400"}`}
            />
          )}
        </div>
        {item.submenu && (
          <div
            className={`ml-6 mt-1 space-y-1 border-l-2 border-gray-200 pl-3 overflow-hidden transition-all duration-300 ease-in-out
              ${item.isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
          >
            {item.submenu.map((subItem, index) => (
              <div
                key={index}
                className={`cursor-pointer py-2 px-4 rounded-md transition-all duration-200 text-sm font-medium
                  ${
                    location.pathname === subItem.path
                      ? "text-[#ff2680] bg-pink-50"
                      : "text-gray-600 hover:text-[#ff2680] hover:bg-pink-50/50"
                  }`}
                onClick={() => navigate(subItem.path)}
              >
                {subItem.title}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col shadow-lg">
      <div className="flex items-center justify-center py-6 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Happy2Age Logo" className="h-12 w-auto" />
          <span className="text-xs text-gray-500 mt-1 font-medium">
            Wellness Management
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div>
          <p className="text-[11px] uppercase font-semibold text-gray-400 mb-3 px-4 tracking-wider">
            Main Menu
          </p>
          {menuItems.slice(0, 5).map((item, index) => (
            <MenuItem key={index} item={item} />
          ))}
        </div>

        <div>
          <p className="text-[11px] uppercase font-semibold text-gray-400 mb-3 px-4 tracking-wider">
            Evaluations & Sessions
          </p>
          {menuItems.slice(5, 8).map((item, index) => (
            <MenuItem key={index + 5} item={item} />
          ))}
        </div>

        <div>
          <p className="text-[11px] uppercase font-semibold text-gray-400 mb-3 px-4 tracking-wider">
            Analytics & Reports
          </p>
          {menuItems.slice(8, 10).map((item, index) => (
            <MenuItem key={index + 8} item={item} />
          ))}
        </div>

        <div>
          <p className="text-[11px] uppercase font-semibold text-gray-400 mb-3 px-4 tracking-wider">
            Assessments
          </p>
          {menuItems.slice(9).map((item, index) => (
            <MenuItem key={index + 9} item={item} />
          ))}
        </div>

        {/* Manage Admins link */}
        <div className="mb-1">
          <div
            className={`flex items-center px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300 ease-in-out ${
              location.pathname === "/manage-admins"
                ? "bg-gradient-to-r from-[#239d62] to-[#239d62]/80 text-white shadow-lg shadow-[#239d62]/20 scale-[1.02]"
                : "text-gray-600 hover:bg-gray-50 hover:scale-[1.02] hover:shadow-sm"
            }`}
            onClick={() => navigate("/manage-admins")}
          >
            <RiAdminLine
              className={`h-[18px] w-[18px] mr-3 transition-colors ${
                location.pathname === "/manage-admins"
                  ? "text-white"
                  : "text-[#239d62]"
              }`}
            />
            <span
              className={`flex-1 text-sm ${
                location.pathname === "/manage-admins" ? "font-medium" : ""
              }`}
            >
              Manage Admins
            </span>
          </div>
        </div>

        {/* Upcoming Features link */}
        <div className="mb-1">
          <div
            className={`flex items-center px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300 ease-in-out text-gray-600 hover:bg-gray-50 hover:scale-[1.02] hover:shadow-sm`}
            onClick={() => navigate("/upcoming-features")}
          >
            <FiBarChart2 className="h-[18px] w-[18px] mr-3 text-[#239d62]" />
            <span className="flex-1 text-sm">Upcoming Features</span>
          </div>
        </div>
      </div>

      <div className="px-3 py-4 border-t border-gray-100 bg-gradient-to-t from-gray-50 to-white">
        <div
          className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-red-500 hover:text-white rounded-lg cursor-pointer transition-all duration-300 ease-in-out group hover:shadow-lg hover:shadow-red-500/20"
          onClick={handleSignOut}
          disabled={isLoggingOut}
        >
          <FiLogOut
            className={`h-[18px] w-[18px] mr-3 transition-colors group-hover:text-white text-red-500 ${
              isLoggingOut ? "animate-spin" : ""
            }`}
          />
          <span className="text-sm font-medium">
            {isLoggingOut ? "Signing Out..." : "Sign Out"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
