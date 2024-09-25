import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "../../widgets/cards";
import { StatisticsChart } from "../../widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "../../data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import axios from "axios";

axios.defaults.withCredentials = true;
import { serverUrl } from "../../api";
import { MdGroups, MdOutlineSportsKabaddi } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getLocalData } from "../../Utils/localStorage";
import { toast } from "react-toastify";
import { toastConfig } from "../../App";
import { useSelector } from "react-redux";
import { SiSessionize } from "react-icons/si";

export function Home() {
  const [partcipantsList, setPartcipantList] = useState([]);
  const [cohortsList, setCohortList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [sessionlist, setSessionlist] = useState([]);
 
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${serverUrl}/participant/all/`,
        {
          headers: {
            Authorization: `${getLocalData("token")}`,
          },
        })
      .then((res) => {
        setPartcipantList(res.data.message);
      })
      .catch((err) => {
        // console.log(err)
        if (err.response && err.response.data && err.response.data.jwtExpired) {
          toast.error(err.response.data.message, toastConfig);
          setTimeout(() => {
            navigate("/auth/sign-in");
          }, 3000);
        } else if (err.response && err.response.data) {
          // toast.error(err.response.data.message, toastConfig);
        } else {
          toast.error("An unexpected error occurred.", toastConfig);
        }
      });

    axios
      .get(`${serverUrl}/cohort/all/`,
        {
          headers: {
            Authorization: `${getLocalData("token")}`,
          },
        })
      .then((res) => {
        setCohortList(res.data.data);
      })
      .catch((err) => {
        // console.log(err)
        if (err.response && err.response.data && err.response.data.jwtExpired) {
          toast.error(err.response.data.message, toastConfig);
          setTimeout(() => {
            navigate("/auth/sign-in");
          }, 3000);
        } else if (err.response && err.response.data) {
          // toast.error(err.response.data.message, toastConfig);
        } else {
          toast.error("An unexpected error occurred.", toastConfig);
        }
      });

    axios
      .get(`${serverUrl}/activity/all/`,
        {
          headers: {
            Authorization: `${getLocalData("token")}`,
          },
        })
      .then((res) => {
        setActivityList(res.data.data);
      })
      .catch((err) => {
        // console.log(err)
        if (err.response && err.response.data && err.response.data.jwtExpired) {
          toast.error(err.response.data.message, toastConfig);
          setTimeout(() => {
            navigate("/auth/sign-in");
          }, 3000);
        } else if (err.response && err.response.data) {
          // toast.error(err.response.data.message, toastConfig);
        } else {
          toast.error("An unexpected error occurred.", toastConfig);
        }
      });

      axios
      .get(`${serverUrl}/session/all/`,
        {
          headers: {
            Authorization: `${getLocalData("token")}`,
          },
        })
      .then((res) => {
        setSessionlist(res.data.message);
      })
      .catch((err) => {
        // console.log(err)
        if (err.response && err.response.data && err.response.data.jwtExpired) {
          // toast.error(err.response.data.message, toastConfig);
          setTimeout(() => {
            navigate("/auth/sign-in");
          }, 3000);
        } else if (err.response && err.response.data) {
          toast.error(err.response.data.message, toastConfig);
        } else {
          toast.error("An unexpected error occurred.", toastConfig);
        }
      });
  }, []);
  return (
    <div className="mt-12 mb-24">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {/* {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))} */}

        <StatisticsCard
          title={"Total members"}
          icon={React.createElement(UserCircleIcon, {
            className: "w-6 h-6 text-white",
          })}
          footer={
            <Typography className="font-normal text-blue-gray-600">
              <strong className={"text-gray"}>{partcipantsList?.length}</strong>
            </Typography>
          }
        />

        <StatisticsCard
          title={"Total centres"}
          icon={React.createElement(MdGroups, {
            className: "w-6 h-6 text-white",
          })}
          footer={
            <Typography className="font-normal text-blue-gray-600">
              <strong className={"text-gray"}>{cohortsList?.length}</strong>
            </Typography>
          }
        />

        <StatisticsCard
          title={"Total activities"}
          icon={React.createElement(MdOutlineSportsKabaddi, {
            className: "w-6 h-6 text-white",
          })}
          footer={
            <Typography className="font-normal text-blue-gray-600">
              <strong className={"text-gray"}>{activityList?.length}</strong>
            </Typography>
          }
        />

        <StatisticsCard
          title={"Total sessions"}
          icon={React.createElement(SiSessionize, {
            className: "w-6 h-6 text-white",
          })}
          footer={
            <Typography className="font-normal text-blue-gray-600">
              <strong className={"text-gray"}>{sessionlist?.length}</strong>
            </Typography>
          }
        />
      </div>
      {/* <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon
                  strokeWidth={2}
                  className="h-4 w-4 text-blue-gray-400"
                />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div> */}
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Centres
              </Typography>
              
            </div>
            <Menu placement="left-start">
              
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Centres", "Total members", "Names"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-6 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-medium uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohortsList?.map(({ name, participants }, key) => {
                  const className = `py-3 px-5 ${
                    key === cohortsList?.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {name}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        {
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold ml-10"
                          >
                            {participants.length}
                          </Typography>
                        }
                       
                      </td>
                      <td className={className}>
                        <div className="flex gap-1">
                          {participants.map(({ name }, key) => (
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {name.slice(5).length > 0
                                ? name.slice(0, 5) + "..."
                                : name || "NA"}
                            </Typography>
                          ))}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card> */}
        {/* <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Member list
            </Typography>
          
          </CardHeader>
          <CardBody className="pt-0">
            {partcipantsList?.map(({ name, participantType, email }, key) => (
              <div key={key} className="flex items-start gap-4 py-3">
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block font-medium"
                  >
                    {name}
                  </Typography>
                  <div className="flex gap-3">
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {email}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {participantType}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card> */}
      </div>
    </div>
  );
}

export default Home;
