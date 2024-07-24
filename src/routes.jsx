import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import {
  Home,
  Profile,
  Tables,
  Notifications,
  AddParticipant,
  AddCohort,
  AddActivity,
  Cohortlist,
  ActivityList,
  Participantlist,
  Sessionlist,
  AddEvaluation,
  Editdomain,
  Evaluationlist,
  Adddomain,
  Cohortreport,
  Cohortreportdetails,
  OxfordHappiness,
  CaspQuestions,
  ParticipantReport,
  Moca,
  SessionAttendence,
  Casplist,
  Oxfordlist,
  Mocalist,
  Domainlist,
} from "./Pages/dashboard";
import { SignIn, SignUp } from "./Pages/auth";
import { MdGroups, MdOutlineSportsKabaddi } from "react-icons/md";
import { GrDomain } from "react-icons/gr";
import { IoListSharp } from "react-icons/io5";
import Addsession from "./Pages/dashboard/addsession";
import Sessiondetails from "./Pages/dashboard/sessiondetails";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "mainpage",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        mainHeading: "member",
        allPages: [
          {
            icon_u: <UserCircleIcon {...icon} />,
            name_u: "add partcipants",
            path_u: "/add-member",
            element_u: <AddParticipant />,
          },
          {
            icon_u: <IoListSharp {...icon} />,
            name_u: "members list",
            path_u: "/members-list",
            element_u: <Participantlist />,
          },
        ],
      },

      {
        mainHeading: "centre",
        allPages: [
          {
            icon_u: <MdGroups {...icon} />,
            name_u: "add centre",
            path_u: "/add-centre",
            element_u: <AddCohort />,
          },
          {
            icon_u: <IoListSharp {...icon} />,
            name_u: "centres list",
            path_u: "/centres-list",
            element_u: <Cohortlist />,
          },
        ],
      },

      {
        mainHeading: "activity",
        allPages: [
          {
            icon_u: <MdOutlineSportsKabaddi {...icon} />,
            name_u: "add activity",
            path_u: "/add-activity",
            element_u: <AddActivity />,
          },
          {
            icon_u: <IoListSharp {...icon} />,
            name_u: "activities list",
            path_u: "/activities-list",
            element_u: <ActivityList />,
          },
        ],
      },

      {
        mainHeading: "domain",
        allPages: [
          {
            icon_u: <GrDomain {...icon} />,
            name_u: "edit domain",
            path_u: "/edit-domain/:domainid",
            element_u: <Editdomain />,
          },
          {
            icon_u: <GrDomain {...icon} />,
            name_u: "add domain",
            path_u: "/add-domain/",
            element_u: <Adddomain />,
          },
          {
            icon_u: <IoListSharp {...icon} />,
            name_u: "domains list",
            path_u: "/domains-list",
            element_u: <Domainlist />,
          },
        ],
      },
      {
        mainHeading: "session",
        allPages: [
          {
            icon_u: <GrDomain {...icon} />,
            name_u: "add session",
            path_u: "/add-session",
            element_u: <Addsession />,
          },

          {
            icon_u: <IoListSharp {...icon} />,
            name_u: "sessions list",
            path_u: "/sessions-list",
            element_u: <Sessionlist />,
          },

          {
            icon_u: <IoListSharp {...icon} />,
            name_u: "sessions details",
            path_u: "/session-details/:sessionid",
            element_u: <Sessiondetails />,
          },
          {
            icon_u: <IoListSharp {...icon} />,
            name_u: "sessions details",
            path_u: "/sessions-attendence",
            element_u: <SessionAttendence />,
          },
        ],
      },
      //  {
      //   icon: <HomeIcon {...icon} />,
      //   name: "evaluation",
      //   path: "/add-evaluation",
      //   element: <AddEvaluation />,
      // },
      {
        mainHeading: "evaluation",
        allPages: [
          {
            icon_u: <GrDomain {...icon} />,
            name_u: "add evaluation",
            path_u: "/add-evaluation",
            element_u: <AddEvaluation />,
          },

          {
            icon_u: <IoListSharp {...icon} />,
            name_u: "evaluation list",
            path_u: "/evaluation-list",
            element_u: <Evaluationlist />,
          },
        ],
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "centre report",
        path: "/centre-report",
        element: <Cohortreport />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "member report",
        path: "/member-report",
        element: <ParticipantReport />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "member report details",
        path: "/member-report-details/:participantid",
        element: <Cohortreportdetails />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Oxford Happiness",
        path: "/add-oxford-happiness-questionnaire/",
        element: <OxfordHappiness />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Oxford Happiness list",
        path: "/oxford-happiness-questionnaire-list/",
        element: <Oxfordlist />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "CASP-19 QUESTIONNAIRE",
        path: "/add-casp-19-questionnaire/",
        element: <CaspQuestions />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "CASP-19 QUESTIONNAIRE list",
        path: "/casp-19-questionnaire-list/",
        element: <Casplist />,
      },
      // {
      //   icon: <HomeIcon {...icon} />,
      //   name: "Admin list",
      //   path: "/adminlist/",
      //   element: <AdminList/>,
      // },
      {
        icon: <HomeIcon {...icon} />,
        name: "MOCA",
        path: "/add-montreal-congitive-assessment/",
        element: <Moca />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "MOCA list",
        path: "/montreal-congitive-assessment-list/",
        element: <Mocalist />,
      }
    ],
  },
  {
    // title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      // {
      //   icon: <RectangleStackIcon {...icon} />,
      //   name: "sign out",
      //   path: "/sign-out",
      //   // element: <SignUp />,
      // },
    ],
  },
];

export default routes;
