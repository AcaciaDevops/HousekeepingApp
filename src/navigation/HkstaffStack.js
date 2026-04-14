import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HkStaffDashboard from "../features/housekeeping/screens/HkStaffDashboard.js";
import { useAppTheme } from "../context/ThemeContext";

const Stack = createNativeStackNavigator();

export default function HkstaffStack() {
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
        name="HkStaffDashboard"
        component={HkStaffDashboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
