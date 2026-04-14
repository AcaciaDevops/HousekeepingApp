import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HkManagerDashboard from "../features/housekeeping/screens/HkManagerDashboard";
import { useAppTheme } from "../context/ThemeContext";

const Stack = createNativeStackNavigator();

export default function HkStack() {
  const { tokens } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: tokens.header },
        headerTintColor: tokens.text,
        contentStyle: { backgroundColor: tokens.background },
      }}
    >
      <Stack.Screen
        name="HkDashboard"
        component={HkManagerDashboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
