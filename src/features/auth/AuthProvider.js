// src/features/auth/AuthProvider.js
import React, { createContext, useContext, useState } from "react";
import { decodeToken } from "../../utils/jwt";
import AsyncStorage from '@react-native-async-storage/async-storage';
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
        await AsyncStorage.setItem('token', response?.token);
        const decoded = decodeToken(response.token);
             const userResponse = await fetch(
        "http://192.168.1.111:3001/api/user/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${response.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const userData = await userResponse.json();
       await AsyncStorage.setItem('userProfile', JSON.stringify(userData.user));
      console.log("userData::",userData)
        setUser(decoded);
        console.log("user::details::in:authprovider",user)
        return { success: true };
      }
      return { success: false, error: "No token" };
    } catch (err) {
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  }
  async function logout() {
  try {
    const token = await AsyncStorage.getItem("token");

    // Optional: call backend logout
    if (token) {
      await fetch("http://192.168.1.111:3000/api/authentication/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }

    // Clear local storage
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userProfile");

    // 🔥 THIS is what logs user out in UI
    setUser(null);

  } catch (error) {
    console.error("Logout error:", error);
  }
}

  return (
    <AuthContext.Provider value={{ user, isLoading, login,logout }}>
      {children}
    </AuthContext.Provider>
  );
}


