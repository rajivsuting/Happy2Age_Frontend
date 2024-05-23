import React, { useEffect } from "react";
import AllRoutes from "./Routes/AllRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { getAllParticipants } from "./Redux/AllListReducer/action";
import { getAllCohorts } from "./Redux/AllListReducer/action";
import { getAllActivities } from "./Redux/AllListReducer/action";
import { getAllDomains } from "./Redux/AllListReducer/action";
import { getAllSessions } from "./Redux/AllListReducer/action";
import { getAllEvaluations } from "./Redux/AllListReducer/action";

export const toastConfig = {
  position: "top-center",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  // transition: Bounce,
};

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("one tme ")
    dispatch(getAllParticipants("",""));
    dispatch(getAllCohorts);
    dispatch(getAllActivities);
    dispatch(getAllDomains("All"));
    dispatch(getAllSessions);
    dispatch(getAllEvaluations);
  }, []);

  return (
    <div>
      <AllRoutes />
      <ToastContainer />
    </div>
  );
};

export default App;
