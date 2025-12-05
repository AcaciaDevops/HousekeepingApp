// src/features/auth/AuthProvider.js
import React, { createContext, useContext, useState } from "react";
import { decodeToken } from "../../utils/jwt";
import { login as apiLogin } from "../../services/AuthService";
import { AuthContext } from "./AuthContext";


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function login(credentials) {
    setIsLoading(true);
    try {
      const response = await apiLogin(credentials);
      if (response?.token) {
        const decoded = decodeToken(response.token);
        setUser(decoded);
        return { success: true };
      }
      return { success: false, error: "No token" };
    } catch (err) {
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login }}>
      {children}
    </AuthContext.Provider>
  );
}


