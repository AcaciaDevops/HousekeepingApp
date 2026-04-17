import React, { useState } from "react";
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { fetchTasks } from "../../api/TasksApi";
import TaskItem from "./TaskItem";
import useAuth from "../../features/auth/hooks/useAuth";
import { useFocusEffect } from "@react-navigation/native";
import { useAppTheme } from "../../context/ThemeContext";
import { useThemedStyles } from "../../utils/useThemedStyles";

export default function TaskList({ route }) {
  const { status: currentTabStatus } = route.params;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTask] = useState(0);
  const styles = useThemedStyles(createTaskListStyles);
  const { tokens } = useAppTheme();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchTasks(currentTabStatus, user);
      setTasks(res.data || []);
      setTotalTask(res.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [currentTabStatus, user])
  );

  const handleTaskStatusUpdated = (updatedTask) => {
    if (updatedTask !== currentTabStatus) {
      load();
    }
  };

  if (loading) {
    return (
      <View style={styles.placeholder}>
        <ActivityIndicator size="large" color={tokens.button} />
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.emptyText}>No tasks found</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerPill}>
          <Text style={styles.headerText}>Tasks:</Text>
          <Text style={styles.headerCount}>{totalTasks}</Text>
        </View>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => <TaskItem task={item} onStatusUpdated={handleTaskStatusUpdated} />}
        contentContainerStyle={styles.list}
      />
    </>
  );
}

const createTaskListStyles = (tokens) =>
  StyleSheet.create({
    placeholder: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      color: tokens.text,
      fontSize: 15,
      fontWeight: "600",
    },
    header: {
      paddingTop: 8,
      paddingHorizontal: 16,
      paddingBottom: 4,
      alignItems: "flex-start",
    },
    headerPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      alignSelf: "flex-start",
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    headerText: {
      color: tokens.button,
      fontWeight: "700",
      fontSize: 13,
      letterSpacing: 0.2,
    },
    headerCount: {
      color: tokens.button,
      fontWeight: "700",
      fontSize: 13,
    },
    list: {
      paddingBottom: 24,
      paddingHorizontal: 16,
    },
  });
