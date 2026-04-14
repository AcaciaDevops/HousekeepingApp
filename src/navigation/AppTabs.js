// src/navigation/AppTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../features/dashboard/DashboardScreen";
import RoomsStack from "./RoomsStack";
import TasksStack from "./TasksStack";
import StaffStack from "./StaffStack";
import ProfileScreen from "../features/profile/ProfileScreen";
import { MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function AppTabs({ user }) {
  console.log("user:1234",user)
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      {["HousekeepingManager", "FrontDesk", "MaintenanceManager"].includes(user.user_role_name) && (
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={size} color={color} /> }}
        />
      )}

      {["HousekeepingManager", "HousekeepingStaff"].includes(user.user_role_name) && (
        <Tab.Screen
          name="Rooms"
          component={RoomsStack}
          options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="meeting-room" size={size} color={color} /> }}
        />
      )}

      {["HousekeepingManager", "HousekeepingStaff", "MaintenanceManager","MaintenanceStaff"].includes(user.user_role_name) && (
        <Tab.Screen
          name="Tasks"
          component={TasksStack}
          options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="task" size={size} color={color} /> }}
        />
      )}

      {["HousekeepingManager","MaintenanceManager"].includes(user.user_role_name) && (
        <Tab.Screen
          name="Staff"
          component={StaffStack}
          options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="group" size={size} color={color} /> }}
        />
      )}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}
