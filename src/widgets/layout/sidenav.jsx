import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "../../context";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] overflow-y-auto w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100 ober`}
      style={{ overflowY: "auto" }}
    >
      <div className={`relative`}>
        <Link to="/" className="py-6 px-8 text-center">
          <img
            className=" w-[200px] m-auto object-cover fixed  object-center"
            src="/img/Happy-2age-logo-1-1.png"
            alt="nature image"
          />
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
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
            {pages.map(({ icon, name, path }) => (
              <li key={name}>
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
            ))}
          </ul>
        ))}
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
