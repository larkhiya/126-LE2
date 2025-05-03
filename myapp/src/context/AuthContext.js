import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    let [user, setUser] = useState(() => {
        const tokens = localStorage.getItem("authTokens");
        if (!tokens) return null;
      
        try {
          const parsed = JSON.parse(tokens);
          return jwtDecode(parsed.access);
        } catch (e) {
          console.error("Invalid token in localStorage:", e);
          return null;
        }
      });
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  let loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: e.target.username.value,
          password: e.target.password.value,
        }),
      });

      let data = await response.json();

      if (response.status === 200) {
        localStorage.setItem("authTokens", JSON.stringify(data));
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        navigate("/");
        return { success: true };
      } else {
        // Handle different error cases based on status code or response data
        if (response.status === 401 || data.detail === "No active account found with the given credentials.") {
          return { success: false, message: "Username or password is incorrect!" };
        } else if (data.username) {
          return { success: false, message: data.username[0] };
        } else if (data.password) {
          return { success: false, message: data.password[0] };
        } else if (data.detail) {
          return { success: false, message: data.detail };
        } else {
          return { success: false, message: "Login failed. Please try again." };
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Connection error. Please check your internet connection." };
    }
  };

  let logoutUser = () => {
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null);
    navigate("/");
  };

  const updateToken = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens?.refresh }),
      });

      const data = await response.json();
      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        logoutUser();
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      logoutUser();
    }

    if (loading) {
      setLoading(false);
    }
  };

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    if (loading && authTokens) {
      updateToken();
    }
    
    const REFRESH_INTERVAL = 1000 * 60 * 4; // 4 minutes
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};