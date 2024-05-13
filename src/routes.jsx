import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications, AddParticipant,AddCohort, AddActivity, Cohortlist, ActivityList,Participantlist, Domainlist, Adddomain } from "./Pages/dashboard";
import { SignIn, SignUp } from "./Pages/auth";
import { MdGroups, MdOutlineSportsKabaddi } from "react-icons/md";
import { GrDomain } from "react-icons/gr";
import { IoListSharp } from "react-icons/io5";

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
      },{
        icon: <IoListSharp {...icon} />,
        name: "participant",
        path: "/participant-list",
        element: <Participantlist />,
      },
      {
        icon: <IoListSharp {...icon} />,
        name: "cohort list",
        path: "/cohort-list",
        element: <Cohortlist />,
      },
      {
        icon: <IoListSharp {...icon} />,
        name: "activity list",
        path: "/activity-list",
        element: <ActivityList />,
      },
      {
        icon: <IoListSharp {...icon} />,
        name: "domain list",
        path: "/domain-list",
        element: <Domainlist />,
      }
    ],
  },
  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <ServerStackIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     {
  //       icon: <RectangleStackIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
];

export default routes;
