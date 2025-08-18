import axiosInstance from "../utils/axios";
import storageManager from "../utils/storage";

class AuthService {
  constructor() {
    // Initialize from storage on service creation
    this.authenticated = storageManager.isAuthenticated();
    this.user = storageManager.getCurrentUser();
  }

  isAuthenticated() {
    // Always check storage for current state
    this.authenticated = storageManager.isAuthenticated();
    return this.authenticated;
  }

  async login(email, password) {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        // Store in both cookies (backend handles) and localStorage
        if (response.data.tokens) {
          storageManager.storeAuth(response.data.user, response.data.tokens);
        }

        this.authenticated = true;
        this.user = response.data.user;

        console.log("Login successful, auth data stored");
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
    // Clear both memory and storage
    this.authenticated = false;
    this.user = null;

    // Clear localStorage and sessionStorage
    storageManager.clearAuth();

    console.log("Auth cleared from memory and storage");
  }

  async checkAuth() {
    try {
      console.log("AuthService: Checking authentication...");

      // First, check if we have valid data in localStorage
      if (storageManager.isAuthenticated()) {
        const storedUser = storageManager.getCurrentUser();
        if (storedUser) {
          console.log("AuthService: Found valid auth data in storage");
          this.authenticated = true;
          this.user = storedUser;
          return { success: true, user: storedUser };
        }
      }

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
          // Update localStorage with new tokens
          if (refreshResponse.data.tokens) {
            storageManager.updateTokens(refreshResponse.data.tokens);
          }

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

  // Get storage status for debugging
  getStorageStatus() {
    return storageManager.getStorageStatus();
  }
}

export default new AuthService();
