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
  Domainlist,
  Sessionlist,
  AddEvaluation,
  Editdomain,
  Evaluationlist,
} from "./Pages/dashboard";
import { SignIn, SignUp } from "./Pages/auth";
import { MdGroups, MdOutlineSportsKabaddi } from "react-icons/md";
import { GrDomain } from "react-icons/gr";
import { IoListSharp } from "react-icons/io5";
import Addsession from "./Pages/dashboard/addsession";

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
        mainHeading: "participant",
        allPages: [
          {
            icon_u: <UserCircleIcon {...icon} />,
            name_u: "add partcipants",
            path_u: "/add-participant",
            element_u: <AddParticipant />,
          },
          {
            icon_u: <IoListSharp {...icon} />,
            name_u: "participants list",
            path_u: "/participants-list",
            element_u: <Participantlist />,
          },
        ],
      },

      {
        mainHeading: "cohort",
        allPages: [
          {
            icon_u: <MdGroups {...icon} />,
            name_u: "add cohort",
            path_u: "/add-cohort",
            element_u: <AddCohort />,
          },
          {
            icon_u: <IoListSharp {...icon} />,
            name_u: "cohorts list",
            path_u: "/cohorts-list",
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
            name_u: "add domain",
            path_u: "/edit-domain/:domainid",
            element_u: <Editdomain />,
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
          }
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
          }
        ],
      }, 
      // {
      //   icon: <HomeIcon {...icon} />,
      //   name: "evaluation",
      //   path: "/add-evaluation",
      //   element: <AddEvaluation />,
      // }
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
