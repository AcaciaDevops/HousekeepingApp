// src/navigation/AppDrawer.js
import React, { useState } from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, StyleSheet } from 'react-native';
import CustomDrawer from '../components/CustomDrawer';
import CustomHeader from '../components/CustomHeader';
import ProfileScreen from "../features/profile/ProfileScreen";
import DashboardScreen from "../features/dashboard/DashboardScreen";
import PlantRoomHeating from "../features/plantroom/HeatingScreen";
import RoomsStack from "./RoomsStack";
import TasksStack from "./TasksStack";
import StaffStack from "./StaffStack";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppTheme } from "../context/ThemeContext";

const Drawer = createDrawerNavigator();

export default function AppDrawer({ user }) {
    const { tokens } = useAppTheme();
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <View style={styles.container}>
            {/* Header - Fixed at top */}
            <CustomHeader user={user} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

            {/* Drawer and Content Container */}
            <View style={styles.mainContainer}>
                <Drawer.Navigator
                    initialRouteName="Home"
                    drawerContent={(props) => <CustomDrawer {...props} user={user} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />}
                    screenOptions={{
                        drawerType: 'permanent', // Make drawer permanent
                        drawerStyle: {
                            // position:'absolute',
                            // left:0,
                            backgroundColor: tokens.drawer,
                            width: isExpanded ? 180 : 40
                        },
                        headerShown: false,
                        headerStyle: {
                            backgroundColor: tokens.header,
                        },
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
                            marginLeft: -16,
                            fontSize: 14,
                            fontWeight: '400',
                            display: isExpanded ? 'flex' : 'none', // Hide labels when collapsed
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
                    {["HousekeepingManager", "FrontDesk", "MaintenanceManager"].includes(user.user_role_name) && (
                        <Drawer.Screen
                            name="PlantRoom"
                            component={PlantRoomHeating}
                            options={{
                                drawerIcon: ({ color, size }) => (
                                    <MaterialIcons name="dashboard" size={size} color={color} />
                                ),
                                drawerLabel: 'PlantRoom',
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
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    mainContainer: {
        // position:'absolute',
        flex: 1,
        flexDirection: 'row',
    },

});
