// src/features/tasks/TasksScreen.js
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import TaskTabs from "../../components/tasks/TaskTabs";
import { useNavigation } from "@react-navigation/native";
import  useAuth  from "../auth/hooks/useAuth";
import { ThemedScreen } from "../../components/ui";
import { useAppTheme } from "../../context/ThemeContext";
import { useThemedStyles } from "../../utils/useThemedStyles";

export default function TasksScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { tokens } = useAppTheme();
  const styles = useThemedStyles(createTasksScreenStyles);

  const allowedRoles = ["MaintenanceManager", "HousekeepingManager"];
  const isManager = allowedRoles.includes(user?.user_role_name);

  console.log("user in TasksScreen::", user);

  return (
    <ThemedScreen>
      <View style={styles.wrapper}>
        <TaskTabs />
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("ViewTasks")}
          >
            <Text style={styles.buttonText}>View Tasks</Text>
          </TouchableOpacity>

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
      </View>
    </ThemedScreen>
  );
}

const createTasksScreenStyles = (tokens) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    bottomButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 10,
      backgroundColor: tokens.blockSecondary,
      borderTopWidth: 1,
      borderTopColor: tokens.border,
    },
    button: {
      backgroundColor: tokens.button,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 8,
      flex: 1,
      marginHorizontal: 5,
      alignItems: "center",
    },
    buttonText: {
      color: tokens.buttonText,
      fontWeight: "bold",
      fontSize: 14,
    },
  });
