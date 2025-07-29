import axiosInstance from "../utils/axios";

class AuthService {
  constructor() {
    this.authenticated = false;
    this.user = null;
  }

  isAuthenticated() {
    return this.authenticated;
  }

  async login(email, password) {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        this.authenticated = true;
        this.user = response.data.user;
        return response.data;
      }
      return response.data;
    } catch (error) {
      this.clearAuth();
      throw (
        error.response?.data || { success: false, message: "Network error" }
      );
    }
  }

  async logout() {
    try {
      await axiosInstance.post("/auth/logout");
    } finally {
      this.clearAuth();
    }
  }

  clearAuth() {
    this.authenticated = false;
    this.user = null;
  }

  async checkAuth() {
    try {
      console.log("AuthService: Verifying token with server...");
      // Verify token with server
      const response = await axiosInstance.get("/auth/verify");
      console.log("AuthService: Verify response:", response.data);

      if (response.data.success) {
        this.authenticated = true;
        this.user = response.data.user;
        console.log("AuthService: Authentication successful");
        return { success: true, user: response.data.user };
      }

      console.log("AuthService: Verify failed, trying refresh...");
      // If verify fails, try to refresh
      try {
        const refreshResponse = await axiosInstance.post("/auth/refresh");
        console.log("AuthService: Refresh response:", refreshResponse.data);
        if (refreshResponse.data.success) {
          this.authenticated = true;
          this.user = refreshResponse.data.user;
          console.log("AuthService: Refresh successful");
          return { success: true, user: refreshResponse.data.user };
        }
      } catch (refreshError) {
        console.log("AuthService: Token refresh failed:", refreshError);
        this.clearAuth();
        return { success: false };
      }
    } catch (error) {
      console.log("AuthService: Auth verification failed:", error);
      this.clearAuth();
      return { success: false };
    }
  }
}

export default new AuthService();
