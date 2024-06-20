import { Card, List, ListItem, Typography } from "@material-tailwind/react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const SeeDeatailsSessionAttendence = ({ isOpen, onClose, singleSession }) => {
  if (!isOpen) return null;

  // const {
  //   partcipantList
  // } = useSelector((state) => {
  //   return {
  //     partcipantList: state.AllListReducer.partcipantList,
  //   };
  // });


  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative m-4 w-2/5 min-w-[50%] max-w-[50%] max-h-[80vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl p-8">
        <div className="flex items-center font-sans text-2xl font-semibold text-blue-gray-900">
          Attendence details
        </div>
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
                Session name
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Present/Absent
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Date
              </Typography>
            </th>
           
          </tr>
        </thead>
        <tbody>
          {singleSession?.sessions?.map((el, index) => {
            const isLast = index === singleSession?.sessions?.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={el.name}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.name || "-"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.present ? "Present" : "Absent" || "-"}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {el.date.split("T")[0] || "-"}
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
        <div className="flex flex-wrap items-center justify-center p-4 text-blue-gray-500">
          <button
            onClick={onClose}
            className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg hover:bg-red-500/10 active:bg-red-500/30  border border-red-300"
          >
            Close
          </button>
          {/* <button
            onClick={onClose}
            className="rounded-lg bg-gradient-to-tr from-green-600 to-green-400 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 active:opacity-[0.85]"
          >
            Confirm
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default SeeDeatailsSessionAttendence;
