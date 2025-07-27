const SESSION_KEY = "happy2age_session";

const session = {
  set: (data) => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving session:", error);
    }
  },

  get: () => {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error reading session:", error);
      return null;
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error("Error clearing session:", error);
    }
  },

  isValid: () => {
    const sessionData = session.get();
    if (!sessionData) return false;

    // Check if session is expired
    const now = new Date().getTime();
    return sessionData.expiresAt > now;
  },
};

export { session };
