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
  const navigate = useNavigate();
  const [chartImage, setChartImage] = useState('');


  useEffect(() => {
    dispatch(getAllParticipants("", ""))
      .then((res) => {
        return true;
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.jwtExpired) {
          toast.error(err.response.data.message, toastConfig);
          setTimeout(() => {
            navigate("/auth/sign-in");
          }, 3000);
        } else if (err.response && err.response.data) {
          toast.error(err.response.data.message, toastConfig);
        } else {
          toast.error("An unexpected error occurred.", toastConfig);
        }
      });
    dispatch(getAllCohorts("", ""))
      .then((res) => {
        return true;
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.jwtExpired) {
          toast.error(err.response.data.message, toastConfig);
          setTimeout(() => {
            navigate("/auth/sign-in");
          }, 3000);
        } else if (err.response && err.response.data) {
          toast.error(err.response.data.message, toastConfig);
        } else {
          toast.error("An unexpected error occurred.", toastConfig);
        }
      });
    // dispatch(getAllAdmins);
    dispatch(getAllActivities("", ""))
      .then((res) => {
        return true;
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.jwtExpired) {
          toast.error(err.response.data.message, toastConfig);
          setTimeout(() => {
            navigate("/auth/sign-in");
          }, 3000);
        } else if (err.response && err.response.data) {
          toast.error(err.response.data.message, toastConfig);
        } else {
          toast.error("An unexpected error occurred.", toastConfig);
        }
      });
    dispatch(getAllDomains("All"))
      .then((res) => {
        return true;
      })
     .catch((err) => {
        if (err.response && err.response.data && err.response.data.jwtExpired) {
          toast.error(err.response.data.message, toastConfig);
          setTimeout(() => {
            navigate("/auth/sign-in");
          }, 3000);
        } else if (err.response && err.response.data) {
          toast.error(err.response.data.message, toastConfig);
        } else {
          toast.error("An unexpected error occurred.", toastConfig);
        }
      });
    dispatch(getAllSessions("", ""))
      .then((res) => {
        return true;
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.jwtExpired) {
          toast.error(err.response.data.message, toastConfig);
          setTimeout(() => {
            navigate("/auth/sign-in");
          }, 3000);
        } else if (err.response && err.response.data) {
          toast.error(err.response.data.message, toastConfig);
        } else {
          toast.error("An unexpected error occurred.", toastConfig);
        }
      });
    dispatch(getAllEvaluations)
      .then((res) => {
        return true;
      })
     .catch((err) => {
        if (err.response && err.response.data && err.response.data.jwtExpired) {
          toast.error(err.response.data.message, toastConfig);
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
    <div>
      <AllRoutes />
      <ToastContainer />
      {/* <ChartComponent setChartImage={setChartImage} />
      {chartImage && (
        <PDFDownloadLink document={<PDFDocument chartImage={chartImage} />} fileName="chart.pdf">
          {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
        </PDFDownloadLink>
      )} */}
    </div>
  );
};


export default App;
