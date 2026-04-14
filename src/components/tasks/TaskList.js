import React, { useEffect, useState } from "react";
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
      setTotalTask(res.total);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [currentTabStatus])
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

  if (tasks && tasks.length === 0) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.emptyText}>No tasks found</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Total Tasks: {totalTasks}</Text>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <TaskItem task={item} onStatusUpdated={handleTaskStatusUpdated} />
        )}
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
      fontSize: 16,
    },
    header: {
      justifyContent: "flex-start",
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    headerText: {
      color: tokens.heading,
      fontWeight: "600",
    },
    list: {
      paddingBottom: 24,
      paddingHorizontal: 16,
    },
  });
