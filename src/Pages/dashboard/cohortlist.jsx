import { Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../../api";

export const Cohortlist = () => {
  const [cohortList, setCohortList] = useState([]);

  useEffect(() => {
    axios.get(`${serverUrl}/cohort/all`).then((res) => {
      setCohortList(res.data);
    });
  }, []);
  return (
    <Card className="h-full w-full overflow-scroll mt-5">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Cohort name
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Participants name
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {cohortList?.map(({ name, participants }, index) => {
            const isLast = index === cohortList.length - 1;
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
                    {participants?.map((el) => {
                      return el.name.substring(0, 5) + "... ," || "-";
                    })}
                  </Typography>
                </td>
                {/* <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {date}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    Edit
                  </Typography>
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
};

export default Cohortlist;
