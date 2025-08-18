// Storage utility for handling both localStorage and cookies
// Provides fallback mechanisms for better cross-browser compatibility

class StorageManager {
  constructor() {
    this.storageKey = "happy2age_auth";
    this.tokenKey = "happy2age_tokens";
    this.userKey = "happy2age_user";
    this.settingsKey = "happy2age_settings";
  }

  // Check if localStorage is available
  isLocalStorageAvailable() {
    try {
      const test = "__localStorage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Check if cookies are available
  areCookiesAvailable() {
    try {
      document.cookie = "testCookie=test";
      const hasCookie = document.cookie.indexOf("testCookie=") !== -1;
      document.cookie = "testCookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      return hasCookie;
    } catch (e) {
      return false;
    }
  }

  // Store authentication data
  storeAuth(user, tokens) {
    try {
      // Store in localStorage if available
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
        localStorage.setItem(this.tokenKey, JSON.stringify(tokens));

        // Store timestamp for token expiration tracking
        localStorage.setItem("happy2age_auth_timestamp", Date.now().toString());
      }

      // Also store in sessionStorage as backup
      try {
        sessionStorage.setItem(this.userKey, JSON.stringify(user));
        sessionStorage.setItem(this.tokenKey, JSON.stringify(tokens));
      } catch (e) {
        console.warn("SessionStorage not available:", e);
      }

      console.log("Auth data stored successfully");
      return true;
    } catch (error) {
      console.error("Error storing auth data:", error);
      return false;
    }
  }

  // Retrieve authentication data
  getAuth() {
    try {
      let user = null;
      let tokens = null;

      // Try localStorage first
      if (this.isLocalStorageAvailable()) {
        const storedUser = localStorage.getItem(this.userKey);
        const storedTokens = localStorage.getItem(this.tokenKey);

        if (storedUser && storedTokens) {
          user = JSON.parse(storedUser);
          tokens = JSON.parse(storedTokens);
        }
      }

      // Fallback to sessionStorage if localStorage failed
      if (!user || !tokens) {
        try {
          const sessionUser = sessionStorage.getItem(this.userKey);
          const sessionTokens = sessionStorage.getItem(this.tokenKey);

          if (sessionUser && sessionTokens) {
            user = JSON.parse(sessionUser);
            tokens = JSON.parse(sessionTokens);
          }
        } catch (e) {
          console.warn("SessionStorage fallback failed:", e);
        }
      }

      return { user, tokens };
    } catch (error) {
      console.error("Error retrieving auth data:", error);
      return { user: null, tokens: null };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    try {
      const { user, tokens } = this.getAuth();

      if (!user || !tokens) {
        return false;
      }

      // Check if tokens are expired
      if (tokens.expiresAt && Date.now() > tokens.expiresAt) {
        console.log("Tokens expired, clearing auth");
        this.clearAuth();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }

  // Get current user
  getCurrentUser() {
    try {
      const { user } = this.getAuth();
      return user;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // Get access token
  getAccessToken() {
    try {
      const { tokens } = this.getAuth();
      const token = tokens?.accessToken || null;
      console.log(
        "StorageManager: getAccessToken called, token:",
        token ? token.substring(0, 20) + "..." : "null"
      );
      return token;
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  }

  // Get refresh token
  getRefreshToken() {
    try {
      const { tokens } = this.getAuth();
      return tokens?.refreshToken || null;
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  }

  // Update tokens (for refresh scenarios)
  updateTokens(newTokens) {
    try {
      const { user } = this.getAuth();
      if (user) {
        this.storeAuth(user, newTokens);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating tokens:", error);
      return false;
    }
  }

  // Store user preferences and settings
  storeSettings(settings) {
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem(this.settingsKey, JSON.stringify(settings));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error storing settings:", error);
      return false;
    }
  }

  // Get user preferences and settings
  getSettings() {
    try {
      if (this.isLocalStorageAvailable()) {
        const settings = localStorage.getItem(this.settingsKey);
        return settings ? JSON.parse(settings) : {};
      }
      return {};
    } catch (error) {
      console.error("Error getting settings:", error);
      return {};
    }
  }

  // Clear all authentication data
  clearAuth() {
    try {
      // Clear localStorage
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem("happy2age_auth_timestamp");
      }

      // Clear sessionStorage
      try {
        sessionStorage.removeItem(this.userKey);
        sessionStorage.removeItem(this.tokenKey);
      } catch (e) {
        console.warn("SessionStorage clear failed:", e);
      }

      console.log("Auth data cleared successfully");
      return true;
    } catch (error) {
      console.error("Error clearing auth data:", error);
      return false;
    }
  }

  // Get storage status for debugging
  getStorageStatus() {
    return {
      localStorage: this.isLocalStorageAvailable(),
      sessionStorage: true, // sessionStorage is generally available
      cookies: this.areCookiesAvailable(),
      hasAuth: this.isAuthenticated(),
      user: this.getCurrentUser(),
      tokens: this.getAuth().tokens,
    };
  }
}

// Export singleton instance
export default new StorageManager();
