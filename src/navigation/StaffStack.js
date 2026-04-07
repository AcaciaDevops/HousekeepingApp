// src/navigation/StaffStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StaffScreen from "../features/staff/StaffScreen";
import AssignTaskScreen from "../features/staff/AssignTaskScreen";
import StaffDetailsScreen from "../features/staff/StaffDetailsScreen";
const Stack = createNativeStackNavigator();

export default function StaffStack() {
  return (
    <Stack.Navigator>
     <Stack.Screen
        name="StaffScreen"
        component={StaffScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StaffDetails"
        component={StaffDetailsScreen}
        options={{ title: "Staff Details" }}
      />
      <Stack.Screen
        name="AssignTaskScreen"
        component={AssignTaskScreen}
        options={{ title: "Assign Task" }}
      />
       
    </Stack.Navigator>
  );
}
