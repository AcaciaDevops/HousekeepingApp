// src/features/tasks/TaskList.js
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { fetchTasks } from "../../api/TasksApi";
import TaskItem from "./TaskItem"
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useFocusEffect } from "@react-navigation/native";

export default function TaskList({ route }) {
  const { status: currentTabStatus } = route.params; // e.g., "completed"
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTask] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchTasks(currentTabStatus, user);
      console.log("res::task::",res)
      setTasks(res.data || []);
      setTotalTask(res.total);
    } finally {
      setLoading(false);
    }
  };

  // ❗ Call API whenever the tab becomes active
  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [currentTabStatus])
  );

  const handleTaskStatusUpdated = (updatedTask) => {
      if (updatedTask !== currentTabStatus) {
         load()
      }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (tasks &&  tasks.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No tasks found</Text>
      </View>
    );
  }

  return (
    <>
    <View style={{ justifyContent: "left"}}>
        <Text> Total Task {totalTasks}</Text>
      </View>
     <FlatList
      data={tasks}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onStatusUpdated={handleTaskStatusUpdated} // <-- pass callback
        />
      )}
    />
    </>
   
  );
}

