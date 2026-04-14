// src/navigation/AppDrawer.js
import React, { useState } from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, StyleSheet } from 'react-native';
import CustomDrawer from '../components/CustomDrawer';
import CustomHeader from '../components/CustomHeader';
import ProfileScreen from "../features/profile/ProfileScreen";
import DashboardScreen from "../features/dashboard/DashboardScreen";
import RoomsStack from "./RoomsStack";
import TasksStack from "./TasksStack";
import StaffStack from "./StaffStack";
import { MaterialIcons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

export default function AppDrawer({ user }) {
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
                    backgroundColor: '#ffffff',
                    width: isExpanded ? 280 : 50, // Dynamic width
                },
                 headerShown: false, 
                headerStyle: {
                    backgroundColor: '#fff',
                },
                // header: () => <CustomHeader user={user} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />,
                headerTintColor: '#000000',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                drawerActiveTintColor: '#62ce99',
                drawerInactiveTintColor: '#000000',
                drawerActiveBackgroundColor: '#edf9f3',
                drawerInactiveBackgroundColor: 'transparent',
                drawerLabelStyle: {
                    fontSize: 14,
                    fontWeight: '400',
                    marginLeft: -16,
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
        flex: 1,
        flexDirection: 'row',
    },
});