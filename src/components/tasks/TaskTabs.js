import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TaskList from "./TaskList"; // This is your component that loads tasks

const Tab = createMaterialTopTabNavigator();

export default function TaskTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarScrollEnabled: true,
                tabBarIndicatorStyle: { backgroundColor: "#1976D2" },
                tabBarActiveTintColor: "#1976D2",
                tabBarInactiveTintColor: "#000",
                tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
                lazy: true, // ensures tabs mount only when focused
            }}
        >
            <Tab.Screen
                name="all"
                options={{ title: "All Tasks" }}
                component={TaskList}
                initialParams={{ status: "all" }}
            />
            <Tab.Screen
                name="pending"
                options={{ title: "Pending" }}
                component={TaskList}
                initialParams={{ status: "pending" }} // pending = assigned in backend
            />
            <Tab.Screen
                name="in_progress"
                options={{ title: "In Progress" }}
                component={TaskList}
                initialParams={{ status: "in_progress" }}
            />
            <Tab.Screen
                name="completed"
                options={{ title: "Completed" }}
                component={TaskList}
                initialParams={{ status: "completed" }}
            />
            <Tab.Screen
                name="under_review"
                options={{ title: "Awaiting Confirmation" }}
                component={TaskList}
                initialParams={{ status: "under_review" }}
            />
            <Tab.Screen
                name="approved"
                options={{ title: "Approved" }}
                component={TaskList}
                initialParams={{ status: "approved" }}
            />
            <Tab.Screen
                name="rejected"
                options={{ title: "Rejected" }}
                component={TaskList}
                initialParams={{ status: "rejected" }}
            />
            <Tab.Screen
                name="reassigned"
                options={{ title: "Re Assign" }}
                component={TaskList}
                initialParams={{ status: "reassigned" }}
            />
        </Tab.Navigator>
    );
}
