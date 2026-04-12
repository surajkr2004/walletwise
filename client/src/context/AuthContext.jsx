import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("walletwise_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("walletwise_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("walletwise_token", token);
    } else {
      localStorage.removeItem("walletwise_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("walletwise_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("walletwise_user");
    }
  }, [user]);

  const login = async (formData) => {
    const { data } = await api.post("/auth/login", formData);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, isAuthenticated: Boolean(token) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
