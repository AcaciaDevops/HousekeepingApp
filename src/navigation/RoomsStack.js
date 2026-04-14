// src/navigation/RoomsStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RoomsScreen from "../features/rooms/RoomsScreen";
import RoomDetailsScreen from "../features/rooms/RoomDetailsScreen";
import { useAppTheme } from "../context/ThemeContext";

const Stack = createNativeStackNavigator();

export default function RoomsStack() {
  const { tokens } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: tokens.header },
        headerTintColor: tokens.text,
        contentStyle: { backgroundColor: tokens.background },
      }}
    >
      <Stack.Screen
        name="RoomsScreen"
        component={RoomsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RoomDetailsScreen"
        component={RoomDetailsScreen}
        options={{ title: "Room Details", headerShadowVisible: false }}
      />
    </Stack.Navigator>
  );
}
