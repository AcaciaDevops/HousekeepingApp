import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FrontdeskDashboard from "../features/frontdesk/screens/FrontdeskDashboard";
import { useAppTheme } from "../context/ThemeContext";

const Stack = createNativeStackNavigator();

export default function FrontdeskStack() {
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
        name="FrontdeskDashboard"
        component={FrontdeskDashboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
