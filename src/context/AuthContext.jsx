import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import authService from "../services/authService";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const clearAuth = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      console.log("Checking authentication...");
      const response = await authService.checkAuth();
      console.log("Auth check response:", response);
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
        setError(null);
        console.log("Authentication successful");
      } else {
        console.log("Authentication failed - no success");
        clearAuth();
      }
    } catch (error) {
      console.error("Auth check error:", error);
      console.log("Error response:", error.response);
      // For 401 errors, try to logout properly to clear cookies
      if (error.response?.status === 401) {
        try {
          await authService.logout();
        } catch (logoutError) {
          console.error("Logout error:", logoutError);
        }
        // Only show toast if we're not on the login page (to avoid showing on refresh)
        if (window.location.pathname !== "/") {
          toast.error("Your session has expired. Please log in again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Always check with server since we're using cookies
        await checkAuth();
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) {
          clearAuth();
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [checkAuth, clearAuth]);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
        setError(null);
        return response;
      } else {
        setError(response.message || "Login failed");
        return response;
      }
    } catch (error) {
      setError(error.message || "An error occurred during login");
      clearAuth();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      clearAuth();
    } catch (error) {
      console.error("Logout error:", error);
      clearAuth(); // Clear auth state even if server logout fails
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        error,
        login,
        logout,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
