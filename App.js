import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/features/auth/AuthProvider";
import { API_URL } from "@env";
export default function App() {
  return (
    <AuthProvider>
      {console.log("ENV LOADED:", API_URL)}

      <AppNavigator />
    </AuthProvider>
  );
}
