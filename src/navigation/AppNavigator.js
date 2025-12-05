// src/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import HkStack from "./HkStack.js";
import HkstaffStack from "./HkstaffStack.js";
import FrontdeskStack from "./FrontdeskStack.js";
import AppTabs from "./AppTabs";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import { Provider as PaperProvider } from "react-native-paper";

export default function AppNavigator() {
    const auth = useAuth();
console.log("AUTH VALUE:", auth);
  const { isLoading, user } = useAuth(); // implement hook to read auth state
console.log("AUTH VALUE::isLoading", isLoading);
  if (isLoading) return null; // or <LoadingScreen />

  return (
    <PaperProvider>
      <NavigationContainer>
        {console.log("AppNavigator user:", user)}
        {!user ? (
          <AuthStack />
        ) : (
          <AppTabs user={user} /> // <-- pass user
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}
