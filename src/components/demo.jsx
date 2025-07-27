import PropTypes from "prop-types";
import {
  Link,
  NavLink,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  RiDashboardLine,
  RiTeamLine,
  RiBuildingLine,
  RiCalendarLine,
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
import { useEffect, useState } from "react";
import { getLocalData, saveLocalData } from "../../Utils/localStorage";
import { toast } from "react-toastify";
import { toastConfig } from "../../Utils/config";

export function Sidenav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [participantOpen, setParticipantOpen] = useState(
    getLocalData("participantOpen") || false
  );
  const [cohortOpen, setcohortOpen] = useState(
    getLocalData("cohortOpen") || false
  );
  const [activityOpen, setActivityOpen] = useState(
    getLocalData("activityOpen") || false
  );
  const [evaluationOpen, setEvaluationOpen] = useState(
    getLocalData("evaluationOpen") || false
  );
  const [domainOpen, setdomainpen] = useState(
    getLocalData("domainOpen") || false
  );
  const [sessionOpen, setsessionOpen] = useState(
    getLocalData("sessionOpen") || false
  );

  useEffect(() => {
    saveLocalData("participantOpen", participantOpen);
    saveLocalData("cohortOpen", cohortOpen);
    saveLocalData("activityOpen", activityOpen);
    saveLocalData("evaluationOpen", evaluationOpen);
    saveLocalData("domainOpen", domainOpen);
    saveLocalData("sessionOpen", sessionOpen);
  }, [
    participantOpen,
    cohortOpen,
    activityOpen,
    evaluationOpen,
    domainOpen,
    sessionOpen,
  ]);

  const menuItems = [
    { title: "Dashboard", icon: RiDashboardLine, path: "/mainpage/home" },
    {
      title: "Members",
      icon: RiTeamLine,
      submenu: [
        { title: "Add Member", path: "/mainpage/add-member" },
        { title: "Members List", path: "/mainpage/members-list" },
      ],
      isOpen: participantOpen,
      setIsOpen: setParticipantOpen,
    },
    {
      title: "Centers",
      icon: RiBuildingLine,
      submenu: [
        { title: "Add Centre", path: "/mainpage/add-centre" },
        { title: "Centres List", path: "/mainpage/centres-list" },
      ],
      isOpen: cohortOpen,
      setIsOpen: setcohortOpen,
    },
    {
      title: "Activities",
      icon: RiCalendarLine,
      submenu: [
        { title: "Add Activity", path: "/mainpage/add-activity" },
        { title: "Activities List", path: "/mainpage/activities-list" },
      ],
      isOpen: activityOpen,
      setIsOpen: setActivityOpen,
    },
    {
      title: "Evaluation MasterList",
      icon: MdOutlineAssignment,
      submenu: [
        { title: "Add Domain", path: "/mainpage/add-domain" },
        { title: "Domain List", path: "/mainpage/domains-list" },
      ],
      isOpen: domainOpen,
      setIsOpen: setdomainpen,
    },
    {
      title: "Sessions",
      icon: MdOutlinePeople,
      submenu: [
        { title: "Add Session", path: "/mainpage/add-session" },
        { title: "Sessions List", path: "/mainpage/sessions-list" },
        { title: "Sessions Attendance", path: "/mainpage/sessions-attendence" },
      ],
      isOpen: sessionOpen,
      setIsOpen: setsessionOpen,
    },
    {
      title: "Evaluations",
      icon: IoDocumentOutline,
      submenu: [
        { title: "Add Evaluation", path: "/mainpage/add-evaluation" },
        { title: "Evaluation List", path: "/mainpage/evaluation-list" },
      ],
      isOpen: evaluationOpen,
      setIsOpen: setEvaluationOpen,
    },
    {
      title: "Reports",
      icon: MdOutlineAssessment,
      submenu: [
        { title: "All Centre Report", path: "/mainpage/all-centre-report" },
        { title: "Centre Report", path: "/mainpage/centre-report" },
        { title: "Member Report", path: "/mainpage/member-report" },
      ],
    },
    {
      title: "Oxford Happiness",
      icon: LiaBrainSolid,
      submenu: [
        {
          title: "Add Oxford Happiness",
          path: "/mainpage/add-oxford-happiness-questionnaire",
        },
        {
          title: "Oxford Happiness List",
          path: "/mainpage/oxford-happiness-questionnaire-list",
        },
      ],
    },
    {
      title: "CASP-19",
      icon: LiaBrainSolid,
      submenu: [
        { title: "Add CASP-19", path: "/mainpage/add-casp-19-questionnaire" },
        { title: "CASP-19 List", path: "/mainpage/casp-19-questionnaire-list" },
      ],
    },
    {
      title: "MOCA",
      icon: LiaBrainSolid,
      submenu: [
        {
          title: "Add MOCA",
          path: "/mainpage/add-montreal-congitive-assessment",
        },
        {
          title: "MOCA List",
          path: "/mainpage/montreal-congitive-assessment-list",
        },
      ],
    },
  ];

  const handleSignOut = () => {
    toast.success("Logout successfully", toastConfig);
    localStorage.clear();
    navigate("/auth/sign-in");
  };

  const MenuItem = ({ item }) => {
    const IconComponent = item.icon;
    const isActive = item.path
      ? location.pathname === item.path
      : item.submenu?.some((subItem) => location.pathname === subItem.path);

    const handleClick = () => {
      if (item.submenu) {
        item.setIsOpen?.(!item.isOpen);
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
            className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out pl-9
              ${item.isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
          >
            {item.submenu.map((subItem, index) => (
              <div
                key={index}
                className={`cursor-pointer py-2 px-3 rounded-md transition-all duration-200 text-sm
                  ${
                    location.pathname === subItem.path
                      ? "text-[#ff2680] font-medium bg-pink-50"
                      : "text-gray-500 hover:text-[#ff2680] hover:bg-gray-50"
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
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col shadow-lg fixed inset-y-0 left-0 z-50">
      <div className="flex items-center justify-center py-6 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50">
        <div className="flex flex-col items-center">
          <img
            className="w-[200px] m-auto object-cover object-center"
            src="/img/Happy-2age-logo-1-1.png"
            alt="Happy2Age"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-8 scrollbar-hide">
        <div>
          <p className="text-[11px] uppercase font-semibold text-gray-400 mb-3 px-4 tracking-wider">
            Main Menu
          </p>
          {menuItems.slice(0, 4).map((item, index) => (
            <MenuItem key={index} item={item} />
          ))}
        </div>

        <div>
          <p className="text-[11px] uppercase font-semibold text-gray-400 mb-3 px-4 tracking-wider">
            Evaluations & Sessions
          </p>
          {menuItems.slice(4, 7).map((item, index) => (
            <MenuItem key={index + 4} item={item} />
          ))}
        </div>

        <div>
          <p className="text-[11px] uppercase font-semibold text-gray-400 mb-3 px-4 tracking-wider">
            Reports & Assessments
          </p>
          {menuItems.slice(7).map((item, index) => (
            <MenuItem key={index + 7} item={item} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="px-3 py-4 border-t border-gray-100 bg-gradient-to-t from-gray-50 to-white">
        <div
          className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-red-500 hover:text-white rounded-lg cursor-pointer transition-all duration-300 ease-in-out group hover:shadow-lg hover:shadow-red-500/20"
          onClick={handleSignOut}
        >
          <FiLogOut className="h-[18px] w-[18px] mr-3 transition-colors group-hover:text-white text-red-500" />
          <span className="text-sm font-medium">Sign Out</span>
        </div>
      </div>
    </div>
  );
}

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
