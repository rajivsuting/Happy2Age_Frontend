import { Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";

export const ActivityList = () => {
  const [activityList, setActivityList] = useState([]);

  useEffect(() => {
    axios.get(`${serverUrl}/activity/all`).then((res) => {
      setActivityList(res.data.message);
    });
  }, []);
  return (
    <Card className="h-full w-full overflow-scroll mt-5 mb-24">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Activity name
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Description
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {activityList?.map(({ name, description }, index) => {
            const isLast = index === activityList.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={name}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {name || "-"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {description.substring(0, 15) + "... ," || "-"}
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
};

export default ActivityList;
