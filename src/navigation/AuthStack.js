import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../features/auth/screens/LoginScreen";
import { useAppTheme } from "../context/ThemeContext";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  const { tokens } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: tokens.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* add ForgotPassword, Invite screens as needed */}
    </Stack.Navigator>
  );
}
