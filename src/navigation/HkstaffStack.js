import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HkStaffDashboard from "../features/housekeeping/screens/HkStaffDashboard.js";

const Stack = createNativeStackNavigator();

export default function HkstaffStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HkStaffDashboard"
        component={HkStaffDashboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
