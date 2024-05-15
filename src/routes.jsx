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
  Adddomain,
  Sessionlist,
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
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "add partcipants",
        path: "/add-participant",
        element: <AddParticipant />,
      },
      {
        icon: <MdGroups {...icon} />,
        name: "add cohort",
        path: "/add-cohort",
        element: <AddCohort />,
      },
      {
        icon: <MdOutlineSportsKabaddi {...icon} />,
        name: "add activity",
        path: "/add-activity",
        element: <AddActivity />,
      },
      {
        icon: <GrDomain {...icon} />,
        name: "add domain",
        path: "/add-domain",
        element: <Adddomain />,
      },
      {
        icon: <GrDomain {...icon} />,
        name: "add session",
        path: "/add-session",
        element: <Addsession />,
      },
      {
        icon: <IoListSharp {...icon} />,
        name: "participants list",
        path: "/participants-list",
        element: <Participantlist />,
      },
      {
        icon: <IoListSharp {...icon} />,
        name: "cohorts list",
        path: "/cohorts-list",
        element: <Cohortlist />,
      },
      {
        icon: <IoListSharp {...icon} />,
        name: "activities list",
        path: "/activities-list",
        element: <ActivityList />,
      },
      {
        icon: <IoListSharp {...icon} />,
        name: "domains list",
        path: "/domains-list",
        element: <Domainlist />,
      },{
        icon: <IoListSharp {...icon} />,
        name: "sessions list",
        path: "/sessions-list",
        element: <Sessionlist />,
      },
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
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
