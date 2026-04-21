// src/features/auth/AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { decodeToken } from "../../utils/jwt";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin } from "../../services/AuthService";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check for existing token on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    try {
      const token = await AsyncStorage.getItem('token');
      const userProfile = await AsyncStorage.getItem('userProfile');
      
      if (token && userProfile) {
        const decoded = decodeToken(token);
        setUser(decoded);
        setIsAuthenticated(true);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setAuthChecked(true);
    }
  }

  async function login(credentials) {
    // setIsLoading(true);
    
    try {
      const response = await apiLogin(credentials);
      console.log("response::12", response);
      
      // Check if login was successful
      if (response && response.success === true && response.token) {
        // Save token
        await AsyncStorage.setItem('token', response.token);
        
        // Decode token
        const decoded = decodeToken(response.token);
        
        // Fetch user profile (optional, don't fail if this doesn't work)
        try {
          const userResponse = await fetch(
            "http://172.26.64.1:3001/api/user/me",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${response.token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (userResponse.ok) {
            const userData = await userResponse.json();
            await AsyncStorage.setItem('userProfile', JSON.stringify(userData.user));
             await AsyncStorage.setItem('lastActivePropertyId', 'PROPHOT0001');
            console.log("userData::", userData);
          }
        } catch (profileError) {
          console.error("Error fetching user profile:", profileError);
          // Don't fail the login if profile fetch fails
        }
        
        // Update state ONLY on success
        setUser(decoded);
        setIsAuthenticated(true);
         setIsInitialized(true);
        setIsLoading(false);
        
        return { success: true, user: decoded };
      }
      
      // Handle failed login - IMPORTANT: Return immediately without changing state
      const errorMessage = response?.message || response?.error || "Login failed";
      console.log("Login failed with message:", errorMessage);
      
      // DO NOT modify user or isAuthenticated state here
      // This prevents component remounting
      setIsLoading(false);
      return { 
        success: false, 
        error: { message: errorMessage } 
      };
      
    } catch (err) {
      console.error("Login error:", err);
      
      // Format error message based on error type
      let errorMessage = "Login failed. Please try again.";
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (err.response?.status === 404) {
        errorMessage = "Server not found. Please check your connection.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }
      
      // IMPORTANT: Do NOT modify user or isAuthenticated state here
      setIsLoading(false);
      return { 
        success: false, 
        error: { message: errorMessage }
      };
    }
  }

  async function logout() {
    try {
      const token = await AsyncStorage.getItem("token");

      // Optional: call backend logout
      if (token) {
        try {
          await fetch("http://172.26.64.1:3000/api/authentication/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        } catch (logoutError) {
          console.error("Backend logout error:", logoutError);
          // Continue with local logout even if backend fails
        }
      }

      // Clear local storage
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userProfile");

      // Clear state - this will trigger unmount of protected screens
      setUser(null);
      setIsAuthenticated(false);
       setIsInitialized(false);

    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // Provide auth context value
  const authContextValue = {
    user,
    isLoading:false,
    isAuthenticated,
    isInitialized,
    authChecked,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}