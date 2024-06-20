import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

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
    return singleSession.activity.map((el) => (
      <li key={el._id}>{el.name}</li>
    ));
  };

  const renderParticipants = () => {
    if (!singleSession?.participants?.length) {
      return <li>No participant present</li>;
    }
    return singleSession.participants.map((el) => {
      const participant = partcipantList.find((pl) => pl._id === el.participantId);
      return participant ? (
        <li key={participant._id}>{participant.name}</li>
      ) : null;
    });
  };

  return (
    <div className="">
      <div><b>Session name:</b> {singleSession?.name || "N/A"}</div>
      <div><b>Cohort name:</b> {singleSession?.cohort?.name || "N/A"}</div>
      <div><b>Date of session:</b> {singleSession?.date?.split("T")[0] || "N/A"}</div>
      <div>
      <span className="font-bold"> Activities: </span>
        <ul className="list-disc">
          {renderActivities()}
        </ul>
      </div>
      <div>
        <span className="font-bold">All attended participants:</span>
        <ul className="list-disc ml-5">
          {renderParticipants()}
        </ul>
      </div>
    </div>
  );
};

export default Sessiondetails;
