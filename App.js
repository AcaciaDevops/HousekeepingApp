import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/features/auth/AuthProvider";
import { API_URL } from "@env";
import { ThemeProvider } from "./src/context/ThemeContext";
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        {console.log("ENV LOADED:", API_URL)}

        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
