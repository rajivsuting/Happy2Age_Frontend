import React, { useEffect, useState } from "react";
import AllRoutes from "./Routes/AllRoutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import {
  getAllAdmins,
  getAllParticipants,
} from "./Redux/AllListReducer/action";
import { getAllCohorts } from "./Redux/AllListReducer/action";
import { getAllActivities } from "./Redux/AllListReducer/action";
import { getAllDomains } from "./Redux/AllListReducer/action";
import { getAllSessions } from "./Redux/AllListReducer/action";
import { getAllEvaluations } from "./Redux/AllListReducer/action";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AdminList from "./Pages/dashboard/AdminList";


//change part to rename
export const taostConfig = {
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

  return (
    <div>
      404 not found
    </div>
  );
};


export default App;
