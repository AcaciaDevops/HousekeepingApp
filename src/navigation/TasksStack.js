// src/navigation/TaskStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import  useAuth  from '../features/auth/hooks/useAuth';
import TasksScreen from "../features/tasks/TasksScreen";
import CreateTaskScreen from "../features/tasks/CreateTaskScreen";
import ViewTasksScreen from "../features/tasks/ViewTaskScreen";
import AssignTaskScreen from "../features/tasks/AssignTaskScreen";
import { useAppTheme } from "../context/ThemeContext";

const Stack = createNativeStackNavigator();

export default function TaskStack() {
  const { user } = useAuth();
  const { tokens } = useAppTheme();

  const isManager =
    user?.user_role_name === "MaintenanceManager" ||
    user?.user_role_name === "HousekeepingManager";

  console.log("user:stack::", user);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: tokens.header },
        headerTintColor: tokens.text,
        contentStyle: { backgroundColor: tokens.background },
      }}
    >
      <Stack.Screen
        name="TasksHome"
        component={TasksScreen}
        options={{ headerShown: false }}
      />

      {isManager && (
        <>
          <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
          <Stack.Screen name="AssignTask" component={AssignTaskScreen} />
        </>
      )}

      <Stack.Screen name="ViewTasks" component={ViewTasksScreen} />
    </Stack.Navigator>
  );
}
