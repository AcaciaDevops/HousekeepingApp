// src/features/tasks/TasksScreen.js
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import TaskTabs from "../../components/tasks/TaskTabs";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../auth/hooks/useAuth";

export default function TasksScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const allowedRoles = ["MaintenanceManager", "HousekeepingManager"];
  const isManager = allowedRoles.includes(user?.user_role_name);

  console.log("user in TasksScreen::", user);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TaskTabs />

      {/* Bottom Buttons */}
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ViewTasks")}
        >
          <Text style={styles.buttonText}>View Tasks</Text>
        </TouchableOpacity>

        {/* Show only for managers */}
        {isManager && (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("CreateTask")}
            >
              <Text style={styles.buttonText}>Create Task</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("AssignTask")}
            >
              <Text style={styles.buttonText}>Assign Task</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  button: {
    backgroundColor: "#1976D2",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});