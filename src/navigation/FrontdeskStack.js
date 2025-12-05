import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FrontdeskDashboard from "../features/frontdesk/screens/FrontdeskDashboard";

const Stack = createNativeStackNavigator();

export default function FrontdeskStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FrontdeskDashboard"
        component={FrontdeskDashboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
