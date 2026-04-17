import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/features/auth/AuthProvider";
import { API_URL } from "@env";
import { ThemeProvider } from "./src/context/ThemeContext";
import { ActivePropertyProvider } from "./src/hooks/contexts/ActivePropertyContext";
import { PortfolioProvider } from "./src/hooks/contexts/PortfolioContext";
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>
         <ActivePropertyProvider>
        {console.log("ENV LOADED:", API_URL)}

        <AppNavigator />
        </ActivePropertyProvider>
        </PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
