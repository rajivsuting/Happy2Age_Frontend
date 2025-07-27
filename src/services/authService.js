import axiosInstance from "../utils/axios";
import { session } from "../utils/session";

class AuthService {
  constructor() {
    this.authenticated = false;
    this.user = null;
    this.initializeFromSession();
  }

  initializeFromSession() {
    const savedSession = session.get();
    if (savedSession && session.isValid()) {
      this.authenticated = true;
      this.user = savedSession.user;
    }
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

        // Save session
        session.set({
          user: response.data.user,
          expiresAt: new Date().getTime() + 24 * 60 * 60 * 1000, // 24 hours
        });

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
    session.clear();
  }

  async checkAuth() {
    // First check if we have a valid session
    if (session.isValid()) {
      const savedSession = session.get();
      this.authenticated = true;
      this.user = savedSession.user;
      return { success: true, user: savedSession.user };
    }

    try {
      // Verify token with server
      const response = await axiosInstance.get("/auth/verify");

      if (response.data.success) {
        this.authenticated = true;
        this.user = response.data.user;

        // Update session
        session.set({
          user: response.data.user,
          expiresAt: new Date().getTime() + 24 * 60 * 60 * 1000,
        });

        return { success: true, user: response.data.user };
      }

      // If verify fails, try to refresh
      try {
        const refreshResponse = await axiosInstance.post("/auth/refresh");
        if (refreshResponse.data.success) {
          this.authenticated = true;
          this.user = refreshResponse.data.user;

          // Update session
          session.set({
            user: refreshResponse.data.user,
            expiresAt: new Date().getTime() + 24 * 60 * 60 * 1000,
          });

          return { success: true, user: refreshResponse.data.user };
        }
      } catch (refreshError) {
        this.clearAuth();
        return { success: false };
      }
    } catch (error) {
      this.clearAuth();
      return { success: false };
    }
  }
}

export default new AuthService();
