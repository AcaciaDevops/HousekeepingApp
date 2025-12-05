// src/navigation/TaskStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TasksScreen from "../features/tasks/TasksScreen";
import CreateTaskScreen from "../features/tasks/CreateTaskScreen";
import ViewTasksScreen from "../features/tasks/ViewTaskScreen";
import AssignTaskScreen from "../features/tasks/AssignTaskScreen";

const Stack = createNativeStackNavigator();

export default function TaskStack() {
  return (
    <Stack.Navigator >
      <Stack.Screen name="TasksHome" component={TasksScreen}  options={{ headerShown: false }}/>
      <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
      <Stack.Screen name="ViewTasks" component={ViewTasksScreen} />
      <Stack.Screen name="AssignTask" component={AssignTaskScreen} />
    </Stack.Navigator>
  );
}
