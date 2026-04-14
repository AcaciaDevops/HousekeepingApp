// src/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import AuthStack from "./AuthStack";
import AppDrawer from "./AppDrawer";
import useAuth from "../features/auth/hooks/useAuth.js";

export default function AppNavigator() {
    const { user, authChecked } = useAuth();
    
    // Show loading screen while checking auth
    if (!authChecked) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#58CB92" />
            </View>
        );
    }
    
    return (
        <PaperProvider>
            <NavigationContainer>
                {!user ? <AuthStack /> : <AppDrawer user={user} />}
            </NavigationContainer>
        </PaperProvider>
    );
}