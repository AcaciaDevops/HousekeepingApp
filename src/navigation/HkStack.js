import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HkManagerDashboard from "../features/housekeeping/screens/HkManagerDashboard";

const Stack = createNativeStackNavigator();

export default function HkStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HkDashboard"
        component={HkManagerDashboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
