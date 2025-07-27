import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import authService from "../services/authService";
import { session } from "../utils/session";
import LoadingSpinner from "../components/LoadingSpinner";

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
    session.clear();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await authService.checkAuth();
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
        setError(null);
      } else {
        clearAuth();
      }
    } catch (error) {
      console.error("Auth check error:", error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Check if we have a valid session first
        const savedSession = session.get();
        if (savedSession && session.isValid()) {
          if (isMounted) {
            setIsAuthenticated(true);
            setUser(savedSession.user);
            setIsLoading(false);
          }
        } else {
          // If no valid session, check with server
          await checkAuth();
        }
      } catch (error) {
        console.error("Session initialization error:", error);
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
