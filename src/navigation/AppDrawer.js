// src/navigation/AppDrawer.js
import React from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import CustomHeader from '../components/CustomHeader';
import ProfileScreen from "../features/profile/ProfileScreen";
import DashboardScreen from "../features/dashboard/DashboardScreen";
import RoomsStack from "./RoomsStack";
import TasksStack from "./TasksStack";
import StaffStack from "./StaffStack";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppTheme } from "../context/ThemeContext";

const Drawer = createDrawerNavigator();

export default function AppDrawer({ user }) {
    const { tokens } = useAppTheme();
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            drawerContent={(props) => <CustomDrawer {...props} user={user} />}
            screenOptions={{
                drawerStyle: {
                    backgroundColor: tokens.drawer,
                    width: 280,
                },
                headerStyle: {
                    backgroundColor: tokens.header,
                },
                header: () => <CustomHeader user={user} />, 
                headerTintColor: tokens.text,
                headerTitleStyle: {
                    fontWeight: 'bold',
                    color: tokens.heading,
                },
                // Drawer item styles
                drawerActiveTintColor: tokens.button,
                drawerInactiveTintColor: tokens.text,
                drawerActiveBackgroundColor: tokens.block,
                drawerInactiveBackgroundColor: 'transparent',
                drawerLabelStyle: {
                    fontSize: 14,
                    fontWeight: '400',
                    marginLeft: -16, // Adjust label position
                },
                drawerItemStyle: {
                    borderRadius: 0,
                    marginHorizontal: 0,
                    marginVertical: 4,
                },
            }}
        >
            {["HousekeepingManager", "FrontDesk", "MaintenanceManager"].includes(user.user_role_name) && (
                <Drawer.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={{
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="dashboard" size={size} color={color} />
                        ),
                        drawerLabel: 'Dashboard',
                    }}
                />
            )}
            
            {["HousekeepingManager", "HousekeepingStaff"].includes(user.user_role_name) && (
                <Drawer.Screen
                    name="Rooms"
                    component={RoomsStack}
                    options={{
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="meeting-room" size={size} color={color} />
                        ),
                        drawerLabel: 'Rooms',
                    }}
                />
            )}

            {["HousekeepingManager", "HousekeepingStaff", "MaintenanceManager", "MaintenanceStaff"].includes(user.user_role_name) && (
                <Drawer.Screen
                    name="Tasks"
                    component={TasksStack}
                    options={{
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="task" size={size} color={color} />
                        ),
                        drawerLabel: 'Tasks',
                    }}
                />
            )}

            {["HousekeepingManager", "MaintenanceManager"].includes(user.user_role_name) && (
                <Drawer.Screen
                    name="Staff"
                    component={StaffStack}
                    options={{
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="group" size={size} color={color} />
                        ),
                        drawerLabel: 'Staff',
                    }}
                />
            )}

            <Drawer.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    ),
                    drawerLabel: 'Profile',
                }}
            />
        </Drawer.Navigator>
    );
}
