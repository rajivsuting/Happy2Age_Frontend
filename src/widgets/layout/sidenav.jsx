import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import {
  HomeIcon,
  RectangleStackIcon,
  ServerStackIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "../../context";
import { IoIosArrowDown, IoMdHome } from "react-icons/io";
import { useEffect, useState } from "react";
import { getLocalData, saveLocalData } from "../../Utils/localStorage";
import { FaUserAlt } from "react-icons/fa";
import { IoList } from "react-icons/io5";
import { GrGroup } from "react-icons/gr";
import {
  MdDomainVerification,
  MdEditNote,
  MdSportsKabaddi,
} from "react-icons/md";
import { AiOutlineFieldTime } from "react-icons/ai";
import { TiUser } from "react-icons/ti";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };
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

  const toggleSection = (section) => {
    console.log(section);
    switch (section) {
      case "participant":
        setParticipantOpen(!participantOpen);
        break;
      case "cohort":
        setcohortOpen(!cohortOpen);
        break;
      case "activity":
        setActivityOpen(!activityOpen);
        break;
      case "evaluation":
        setEvaluationOpen(!evaluationOpen);
        break;
      case "domain":
        setdomainpen(!domainOpen);
        break;
      case "session":
        setsessionOpen(!sessionOpen);
        break;
      default:
        break;
    }
  };

  const icon = {
    className: "w-5 h-5 text-inherit",
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-y-0 left-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100 ober`}
      style={{ overflowY: "auto" }}
    >
      <div className={`relative h-full flex flex-col`}>
        <div className="py-6 px-8 text-center">
          <img
            className="w-[200px] m-auto object-cover object-center"
            src="/img/Happy-2age-logo-1-1.png"
            alt={brandName}
          />
        </div>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute top-0 right-0 m-4 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
        <div className="overflow-y-auto overscroll-y-auto flex-1">
          <div className="m-4 mt-0">
            <ul className="mb-4 flex flex-col gap-1">
              <li>
                <NavLink to={`/mainpage/home`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "yellow" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "dark"
                          ? "white"
                          : "blue-gray"
                      }
                      className={`flex items-center gap-4 px-4 capitalize ${
                        isActive ? "bg-maincolor" : "bg-white"
                      }`}
                      fullWidth
                    >
                      <span
                        className={`${
                          isActive ? "text-white" : "text-maincolor2"
                        }`}
                      >
                        <IoMdHome {...icon} />
                      </span>
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        dashboard
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
              {/* partcipanst-------------------------- */}
              <li className="" onClick={() => toggleSection("participant")}>
                <Button
                  variant={"text"}
                  className="mb-2 flex justify-between items-center px-4"
                  fullWidth
                >
                  <Typography
                    variant="small"
                    color="inherit"
                    className="text-[16px] font-medium capitalize flex justify-between gap-4 items-center"
                  >
                    <div className="text-maincolor2">
                      <TiUser {...icon} />
                    </div>
                    Participant
                  </Typography>

                  <IoIosArrowDown fontSize={15} />
                </Button>
              </li>
              {participantOpen ? (
                <>
                  <li>
                    <NavLink to={`/mainpage/add-participant`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "yellow" : "text"}
                          color={
                            isActive
                              ? sidenavColor
                              : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                          }
                          className={`flex items-center gap-4 px-8 capitalize ${
                            isActive ? "bg-maincolor" : "bg-white"
                          }`}
                          fullWidth
                        >
                          <span
                            className={`${
                              isActive ? "text-white" : "text-maincolor2"
                            }`}
                          >
                            {/* <FaUserAlt {...icon} /> */}
                          </span>
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            add partcipant
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/mainpage/participants-list`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "yellow" : "text"}
                          color={
                            isActive
                              ? sidenavColor
                              : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                          }
                          className={`flex items-center gap-4 px-8 capitalize ${
                            isActive ? "bg-maincolor" : "bg-white"
                          }`}
                          fullWidth
                        >
                          <span
                            className={`${
                              isActive ? "text-white" : "text-maincolor2"
                            }`}
                          >
                            {/* <IoList {...icon} /> */}
                          </span>
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            partcipants list
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  </li>
                </>
              ) : null}
              {/* cohort------------------------------------ */}
              <li onClick={() => toggleSection("cohort")}>
                <Button
                  variant={"text"}
                  className="mb-2 flex justify-between items-center px-4"
                  fullWidth
                >
                  <Typography
                    variant="small"
                    color="inherit"
                    className="text-[16px] flex justify-between items-center gap-4 font-medium capitalize"
                  >
                    <div className="text-maincolor2">
                      <GrGroup {...icon} />
                    </div>
                    Cohort
                  </Typography>

                  <IoIosArrowDown fontSize={15} />
                </Button>
              </li>
              {cohortOpen ? (
                <>
                  <li>
                    <NavLink to={`/mainpage/add-cohort`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "yellow" : "text"}
                          color={
                            isActive
                              ? sidenavColor
                              : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                          }
                          className={`flex items-center gap-4 px-8 capitalize ${
                            isActive ? "bg-maincolor" : "bg-white"
                          }`}
                          fullWidth
                        >
                          <span
                            className={`${
                              isActive ? "text-white" : "text-maincolor2"
                            }`}
                          ></span>
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            add cohort
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/mainpage/cohorts-list`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "yellow" : "text"}
                          color={
                            isActive
                              ? sidenavColor
                              : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                          }
                          className={`flex items-center gap-4 px-8 capitalize ${
                            isActive ? "bg-maincolor" : "bg-white"
                          }`}
                          fullWidth
                        >
                          <span
                            className={`${
                              isActive ? "text-white" : "text-maincolor2"
                            }`}
                          >
                            {/* <IoList {...icon} /> */}
                          </span>
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            cohorts list
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  </li>
                </>
              ) : null}
              {/* activity---------------------------------------- */}
              <li onClick={() => toggleSection("activity")}>
                <Button
                  variant={"text"}
                  className="mb-2 flex justify-between items-center px-4"
                  fullWidth
                >
                  <Typography
                    variant="small"
                    color="inherit"
                    className="text-[16px] flex justify-between items-center gap-4 font-medium capitalize"
                  >
                    <div className="text-maincolor2">
                    <MdSportsKabaddi {...icon} />
                    </div>
                    Activity
                  </Typography>

                  <IoIosArrowDown fontSize={15} />
                </Button>
              </li>
              {activityOpen ? (
                <>
                  <li>
                    <NavLink to={`/mainpage/add-activity`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "yellow" : "text"}
                          color={
                            isActive
                              ? sidenavColor
                              : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                          }
                          className={`flex items-center gap-4 px-8 capitalize ${
                            isActive ? "bg-maincolor" : "bg-white"
                          }`}
                          fullWidth
                        >
                          <span
                            className={`${
                              isActive ? "text-white" : "text-maincolor2"
                            }`}
                          >
                            
                          </span>
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            add activity
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/mainpage/activities-list`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "yellow" : "text"}
                          color={
                            isActive
                              ? sidenavColor
                              : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                          }
                          className={`flex items-center gap-4 px-8 capitalize ${
                            isActive ? "bg-maincolor" : "bg-white"
                          }`}
                          fullWidth
                        >
                          <span
                            className={`${
                              isActive ? "text-white" : "text-maincolor2"
                            }`}
                          >
                            {/* <IoList {...icon} /> */}
                          </span>
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            activities list
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  </li>
                </>
              ) : null}
              {/* domain------------------------------------- */}
              <li onClick={() => toggleSection("domain")}>
                <Button
                  variant={"text"}
                  className="mb-2 flex justify-between items-center px-4"
                  fullWidth
                >
                  <Typography
                    variant="small"
                    color="inherit"
                    className="text-[16px] font-medium capitalize  flex justify-between items-center gap-4"
                  >
                    <div className="text-maincolor2"><MdDomainVerification {...icon} /></div>
                    Domain
                  </Typography>

                  <IoIosArrowDown fontSize={15} />
                </Button>
              </li>
              {domainOpen ? (
                <>
                  <li>
                    <NavLink to={`/mainpage/add-domain`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "yellow" : "text"}
                          color={
                            isActive
                              ? sidenavColor
                              : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                          }
                          className={`flex items-center gap-4 px-8 capitalize ${
                            isActive ? "bg-maincolor" : "bg-white"
                          }`}
                          fullWidth
                        >
                          <span
                            className={`${
                              isActive ? "text-white" : "text-maincolor2"
                            }`}
                          >
                            
                          </span>
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            add domain
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/mainpage/domains-list`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "yellow" : "text"}
                          color={
                            isActive
                              ? sidenavColor
                              : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                          }
                          className={`flex items-center gap-4 px-8 capitalize ${
                            isActive ? "bg-maincolor" : "bg-white"
                          }`}
                          fullWidth
                        >
                          <span
                            className={`${
                              isActive ? "text-white" : "text-maincolor2"
                            }`}
                          >
                            {/* <IoList {...icon} /> */}
                          </span>
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            domains list
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  </li>
                </>
              ) : null}
              {/* session----------------------------------------- */}
              <li onClick={() => toggleSection("session")}>
                <Button
                  variant={"text"}
                  className="mb-2 flex justify-between items-center px-4"
                  fullWidth
                >
                  <Typography
                    variant="small"
                    color="inherit"
                    className="text-[16px] flex justify-between items-center gap-4 font-medium capitalize"
                  >
                    <div className="text-maincolor2"> <AiOutlineFieldTime {...icon} /></div>
                    Session
                  </Typography>

                  <IoIosArrowDown fontSize={15} />
                </Button>
              </li>
              {sessionOpen ? (
                <>
                  <li>
                    <NavLink to={`/mainpage/add-session`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "yellow" : "text"}
                          color={
                            isActive
                              ? sidenavColor
                              : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                          }
                          className={`flex items-center gap-4 px-8 capitalize ${
                            isActive ? "bg-maincolor" : "bg-white"
                          }`}
                          fullWidth
                        >
                          <span
                            className={`${
                              isActive ? "text-white" : "text-maincolor2"
                            }`}
                          >
                           
                          </span>
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            add session
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/mainpage/sessions-list`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "yellow" : "text"}
                          color={
                            isActive
                              ? sidenavColor
                              : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                          }
                          className={`flex items-center gap-4 px-8 capitalize ${
                            isActive ? "bg-maincolor" : "bg-white"
                          }`}
                          fullWidth
                        >
                          <span
                            className={`${
                              isActive ? "text-white" : "text-maincolor2"
                            }`}
                          >
                            {/* <IoList {...icon} /> */}
                          </span>
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            sessions list
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  </li>
                </>
              ) : null}
              {/* evaluation-------------------------------------- */}
              <li>
                <NavLink to={`/mainpage/add-evaluation`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "yellow" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "dark"
                          ? "white"
                          : "blue-gray"
                      }
                      className={`flex items-center gap-4 px-4 capitalize ${
                        isActive ? "bg-maincolor" : "bg-white"
                      }`}
                      fullWidth
                    >
                      <span
                        className={`${
                          isActive ? "text-white" : "text-maincolor2"
                        }`}
                      >
                        <MdEditNote {...icon} />
                      </span>
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        evaluation
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to={`/auth/sign-in`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "yellow" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "dark"
                          ? "white"
                          : "blue-gray"
                      }
                      className={`flex items-center gap-4 px-4 capitalize ${
                        isActive ? "bg-maincolor" : "bg-white"
                      }`}
                      fullWidth
                    >
                      <span
                        className={`${
                          isActive ? "text-white" : "text-maincolor2"
                        }`}
                      >
                        <ServerStackIcon {...icon} />
                      </span>
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        sign in
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to={`/auth/sign-up`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "yellow" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "dark"
                          ? "white"
                          : "blue-gray"
                      }
                      className={`flex items-center gap-4 px-4 capitalize ${
                        isActive ? "bg-maincolor" : "bg-white"
                      }`}
                      fullWidth
                    >
                      <span
                        className={`${
                          isActive ? "text-white" : "text-maincolor2"
                        }`}
                      >
                        <RectangleStackIcon {...icon} />
                      </span>
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        sign up
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            </ul>

            {/* {routes.map(({ layout, title, pages }, key1) => (
              <ul key={key1} className="mb-4 flex flex-col gap-1">
                {title && (
                  <li className="mx-3.5 mt-2 mb-2">
                    <Typography
                      variant="small"
                      color={sidenavType === "dark" ? "white" : "blue-gray"}
                      className="font-black uppercase opacity-75"
                    >
                      {title}
                    </Typography>
                  </li>
                )}
                {pages.map(
                  ({ icon, name, path, mainHeading, allPages }, key2) => {
                    if (!mainHeading) {
                      return (
                        <li key={key2}>
                          <NavLink to={`/${layout}${path}`}>
                            {({ isActive }) => (
                              <Button
                                variant={isActive ? "yellow" : "text"}
                                color={
                                  isActive
                                    ? sidenavColor
                                    : sidenavType === "dark"
                                    ? "white"
                                    : "blue-gray"
                                }
                                className={`flex items-center gap-4 px-4 capitalize ${
                                  isActive ? "bg-maincolor" : "bg-white"
                                }`}
                                fullWidth
                              >
                                <span
                                  className={`${
                                    isActive ? "text-white" : "text-maincolor2"
                                  }`}
                                >
                                  {icon}
                                </span>
                                <Typography
                                  color="inherit"
                                  className="font-medium capitalize"
                                >
                                  {name}
                                </Typography>
                              </Button>
                            )}
                          </NavLink>
                        </li>
                      );
                    } else {
                      return (
                        <>
                          <li
                            className="w-[200px] mb-2 flex justify-between items-center px-5 cursor-pointer"
                            onClick={() => toggleSection(mainHeading)}
                          >
                            <Typography
                              variant="small"
                              color="inherit"
                              className="text-[16px] font-medium capitalize"
                            >
                              {mainHeading}
                            </Typography>
                            <IoIosArrowDown />
                          </li>
                        </>
                      );
                    }
                  }
                )}
                {pages.map(
                  ({ icon, name, path, mainHeading, allPages }, key2) => {
                    if (mainHeading) {
                      <li
                        className="w-[200px] mb-2 flex justify-between items-center px-5 cursor-pointer"
                        onClick={() => toggleSection(mainHeading)}
                      >
                        <Typography
                          variant="small"
                          color="inherit"
                          className="text-[16px] font-medium capitalize"
                        >
                          {mainHeading}
                        </Typography>
                        <IoIosArrowDown />
                      </li>;
                    }
                  }
                )}
                {participantOpen
                  ? pages[1]?.allPages?.map(
                      ({ icon_u, name_u, path_u }, key3) => {
                        return (
                          <li key={key3}>
                            <NavLink to={`/${layout}${path_u}`}>
                              {({ isActive }) => (
                                <Button
                                  variant={isActive ? "yellow" : "text"}
                                  color={
                                    isActive
                                      ? sidenavColor
                                      : sidenavType === "dark"
                                      ? "white"
                                      : "blue-gray"
                                  }
                                  className={`flex items-center gap-4 px-4 capitalize ${
                                    isActive ? "bg-maincolor" : "bg-white"
                                  }`}
                                  fullWidth
                                >
                                  <span
                                    className={`${
                                      isActive
                                        ? "text-white"
                                        : "text-maincolor2"
                                    }`}
                                  >
                                    {icon_u}
                                  </span>
                                  <Typography
                                    color="inherit"
                                    className="font-medium capitalize"
                                  >
                                    {name_u}
                                  </Typography>
                                </Button>
                              )}
                            </NavLink>
                          </li>
                        );
                      }
                    )
                  : null}
                {cohortOpen
                  ? pages[2]?.allPages?.map(
                      ({ icon_u, name_u, path_u }, key3) => {
                        return (
                          <li key={key3}>
                            <NavLink to={`/${layout}${path_u}`}>
                              {({ isActive }) => (
                                <Button
                                  variant={isActive ? "yellow" : "text"}
                                  color={
                                    isActive
                                      ? sidenavColor
                                      : sidenavType === "dark"
                                      ? "white"
                                      : "blue-gray"
                                  }
                                  className={`flex items-center gap-4 px-4 capitalize ${
                                    isActive ? "bg-maincolor" : "bg-white"
                                  }`}
                                  fullWidth
                                >
                                  <span
                                    className={`${
                                      isActive
                                        ? "text-white"
                                        : "text-maincolor2"
                                    }`}
                                  >
                                    {icon_u}
                                  </span>
                                  <Typography
                                    color="inherit"
                                    className="font-medium capitalize"
                                  >
                                    {name_u}
                                  </Typography>
                                </Button>
                              )}
                            </NavLink>
                          </li>
                        );
                      }
                    )
                  : null}
              </ul>
            ))} */}
          </div>
        </div>
      </div>
      <style>
        {`
          /* Hide scrollbar for WebKit browsers (Chrome, Safari) */
          .overflow-y-auto::-webkit-scrollbar {
            width: 0 !important;
          }

          /* Optional: Style the scrollbar track, thumb, etc. */
          .overflow-y-auto::-webkit-scrollbar-track {
            background-color: transparent;
          }

          .overflow-y-auto::-webkit-scrollbar-thumb {
            background-color: transparent;
          }
        `}
      </style>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg:
    "https://demos.creative-tim.com/material-tailwind-dashboard-react/img/team-3.jpeg",
  brandName: "Material Tailwind React",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
