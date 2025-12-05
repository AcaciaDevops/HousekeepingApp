// src/navigation/RoomsStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RoomsScreen from "../features/rooms/RoomsScreen";
import RoomDetailsScreen from "../features/rooms/RoomDetailsScreen";

const Stack = createNativeStackNavigator();

export default function RoomsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RoomsScreen"
        component={RoomsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RoomDetailsScreen"
        component={RoomDetailsScreen}
        options={{ title: "Room Details" }}
      />
    </Stack.Navigator>
  );
}
