import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { convertDateFormat } from "../../Utils/localStorage";

const Sessiondetails = () => {
  const { sessionid } = useParams();
  const [singleSession, setSingleSession] = useState({});

  const { sessionlist, partcipantList } = useSelector((state) => ({
    sessionlist: state.AllListReducer.sessionlist,
    partcipantList: state.AllListReducer.partcipantList,
  }));

  useEffect(() => {
    const session = sessionlist?.find((el) => el._id === sessionid);
    setSingleSession(session || {});
  }, [sessionid, sessionlist]);

  const renderActivities = () => {
    if (!singleSession?.activity?.length) {
      return <div>No activity present</div>;
    }
    return singleSession.activity.map((el, index) => {
      return (
        <div key={el._id}>
          {index + 1}. {el.name}
        </div>
      );
    });
  };

  const renderParticipants = () => {
    if (!singleSession?.participants?.length) {
      return <div>No participant present</div>;
    }
    return singleSession.participants.map((el, index) => {
      const participant = partcipantList.find(
        (pl) => pl._id === el.participantId
      );
      return participant ? (
        <div key={participant._id}>
          {index + 1}. {participant.name}
        </div>
      ) : null;
    });
  };

  return (
    <div className="mt-5">
      <div
              className="w-[70px] border-b cursor-pointer hover:border-b-blue text-maincolor2 mb-5"
              onClick={() => window.history.back()}
            >
              Go back
            </div>
      <table className="min-w-full divide-y divide-gray-200 border">
        <tbody>
          <tr className="border-b-2 p-2">
            <td className="py-2 px-2 font-semibold">Session name</td>
            <td>{singleSession?.name || "N/A"}</td>
          </tr>
          <tr className="border-b-2 p-2">
            <td className="py-2 px-2 font-semibold">Centre name</td>
            <td>{singleSession?.cohort?.name || "N/A"}</td>
          </tr>
          <tr className="border-b-2 p-2">
            <td className="py-2 px-2 font-semibold">Date of session</td>
            <td>{convertDateFormat(singleSession?.date?.split("T")[0]) || "N/A"}</td>
          </tr>
          <tr className="border-b-2 p-2">
            <td className="py-2 px-2 font-semibold">No. of mins</td>
            <td>{singleSession?.numberOfMins || "N/A"}</td>
          </tr>
          <tr className="border-b-2 p-2">
            <td className="py-2 px-2 font-semibold">Activities</td>
            <td>{renderActivities()}</td>
          </tr>
          <tr className="border-b-2 p-2">
            <td className="py-2 px-2 font-semibold">All attended members</td>
            <td>{renderParticipants()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Sessiondetails;
