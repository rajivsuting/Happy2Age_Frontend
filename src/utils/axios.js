import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://happy2age-backend-gn8ln.ondigitalocean.app",
  withCredentials: true, // This is important for cookies
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Don't add Authorization header - we're using cookies
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
      // Instead of redirecting here, we'll let the ProtectedRoute handle it
      // This prevents the infinite redirect loop
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
