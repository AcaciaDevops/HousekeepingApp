import React from "react";
import { useFonts } from "expo-font";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/features/auth/AuthProvider";
import { API_URL } from "@env";
import { ThemeProvider } from "./src/context/ThemeContext";
import { ActivePropertyProvider } from "./src/hooks/contexts/ActivePropertyContext";
import { PortfolioProvider } from "./src/hooks/contexts/PortfolioContext";
export default function App() {
  const [fontsLoaded] = useFonts({
    "Mluvka-Bold": require("./assets/fonts/Mluvka-Bold-BF65518ac8cff8c.otf"),
    "Mluvka-Regular": require("./assets/fonts/Mluvka-Regular-BF65518ac8463f5.otf"),
    "Nulshock-Regular": require("./assets/fonts/nulshockbk-regular.otf"),
    "Raleway-Regular": require("./assets/fonts/Raleway-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null; // or a loading screen
  }

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
