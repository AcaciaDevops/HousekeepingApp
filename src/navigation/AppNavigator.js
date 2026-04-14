// src/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import AuthStack from "./AuthStack";
import AppDrawer from "./AppDrawer";
import useAuth from "../features/auth/hooks/useAuth.js";
import { useAppTheme } from "../context/ThemeContext";

export default function AppNavigator() {
    const { user, authChecked } = useAuth();
    const { paperTheme, navigationTheme, tokens } = useAppTheme();
    
    // Show loading screen while checking auth
    if (!authChecked) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: tokens.background }}>
                <ActivityIndicator size="large" color={tokens.button} />
            </View>
        );
    }
    
    return (
        <PaperProvider theme={paperTheme}>
            <NavigationContainer theme={navigationTheme}>
                {!user ? <AuthStack /> : <AppDrawer user={user} />}
            </NavigationContainer>
        </PaperProvider>
    );
}
