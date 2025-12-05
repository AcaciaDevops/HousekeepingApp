import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { fetchAllTasks } from "../../api/TasksApi"; // <-- your API function

export default function ViewTasksScreen() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await fetchAllTasks("housekeeping"); // your GET API
      setTasks(response.items || []);
    } catch (err) {
      console.log("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const renderTask = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.name}>{item.task_name}</Text>
      <Text style={styles.desc}>{item.task_description}</Text>

      <View style={{ marginTop: 5 }}>
        <Text style={styles.label}>Notes:</Text>
        <Text style={styles.value}>{item.task_notes}</Text>
      </View>

      <View style={{ marginTop: 5 }}>
        <Text style={styles.label}>Task Type:</Text>
        <Text style={styles.value}>{item.task_type}</Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.createdBy}>Created By: {item.task_created_by}</Text>
        <Text style={styles.time}>{formatDate(item.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2c6bed" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 15 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#222",
  },

  desc: {
    fontSize: 14,
    color: "#555",
  },

  label: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },

  value: {
    fontSize: 13,
    color: "#555",
  },

  bottomRow: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  createdBy: {
    fontSize: 12,
    color: "#888",
  },

  time: {
    fontSize: 12,
    color: "#999",
  },
});
