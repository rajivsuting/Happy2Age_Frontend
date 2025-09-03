import axios from "axios";
import { toast } from "react-toastify";
import storageManager from "./storage";

// Environment-aware backend URL
const getBackendURL = () => {
  if (import.meta.env.DEV) {
    // Development - use local backend
    return "http://localhost:8000";
  }
  // Production - use production backend
  return "http://localhost:8000";
};

const axiosInstance = axios.create({
  baseURL: getBackendURL(),
  withCredentials: true, // This is important for cookies
});

// Flag to track if this is the initial page load
let isInitialLoad = true;

// Set the flag to false after a short delay
setTimeout(() => {
  isInitialLoad = false;
}, 3000); // 3 seconds should be enough for initial auth check

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Try to get access token from localStorage as fallback
    const accessToken = storageManager.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log(
        "Axios: Adding Authorization header:",
        `Bearer ${accessToken.substring(0, 20)}...`
      );
    } else {
      console.log("Axios: No access token found in localStorage");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Get the specific error message from the backend
      const errorMessage =
        error.response.data?.message ||
        "Your session has expired. Please log in again.";

      // Only show toast and redirect if we're not already on the login page and not during initial load
      if (window.location.pathname !== "/" && !isInitialLoad) {
        // Show session expired notification
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Redirect to login page after a short delay
        setTimeout(() => {
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
        }, 2000); // 2 second delay to show the toast
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
