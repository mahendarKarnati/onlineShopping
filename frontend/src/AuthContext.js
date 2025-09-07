// Finalcode 
import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser || storedUser === "undefined" || storedUser === "null") {
        return null;
      }
      else{
      return JSON.parse(storedUser);
      }
    } catch (e) {
      console.error("Invalid user in localStorage:", e);
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(0);
  const [role,setRole]=useState('')
  const [name,setName]=useState('')


  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        setUsername(decoded.sub || "User");
        setUserId(decoded.userId || "unknown");
        setRole(decoded.role || "");
        setName(decoded.name || "");
        setName(decoded.name || "");

        // console.log('token from backend ',token)
        // console.log('jwt token decoded details: ',decoded.token)
        

      } catch (e) {
        console.error("Invalid token:", e);
        setUsername("");
      }
    } 
    else {
    logout();
      
    }
  }, [token]);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUsername("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // api.post("/api/auth/logout");
    //   window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, token, username, login, logout,userId, role, name }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
