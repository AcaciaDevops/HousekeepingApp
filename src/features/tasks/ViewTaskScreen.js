// src/features/tasks/ViewTasksScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { fetchAllTasks } from "../../api/TasksApi";

export default function ViewTasksScreen() {
  const { user } = useAuth();
  const userRole = user?.user_role_name;
  const userRoleID = user?.user_id;

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const managerRoles = {
    MaintenanceManager: "maintenance",
    HousekeepingManager: "housekeeping",
  };

  const staffRoles = ["MaintenanceStaff", "HousekeepingStaff"];

  const loadTasks = async () => {
    try {
      let task_type = null;
      let assigned_to = null;

      if (managerRoles[userRole]) {
        task_type = managerRoles[userRole];
      } else if (staffRoles.includes(userRole)) {
        assigned_to = userRoleID;
      }

      const response = await fetchAllTasks({
        task_type,
        assigned_to,
      });

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

  // 🎨 Status Color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#2ecc71";
      case "in_progress":
        return "#3498db";
      case "pending":
        return "#f39c12";
      case "rejected":
        return "#e74c3c";
      default:
        return "#7f8c8d";
    }
  };

  // 🚨 Priority Color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#e74c3c";
      case "medium":
        return "#f39c12";
      case "low":
        return "#2ecc71";
      default:
        return "#7f8c8d";
    }
  };

  const renderTask = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{item.task_name}</Text>
          <Text style={styles.type}>{item.task_type}</Text>
        </View>

        {/* Description */}
        <Text style={styles.desc}>{item.task_description}</Text>

        {/* Notes */}
        {item.task_notes ? (
          <View style={styles.section}>
            <Text style={styles.label}>Notes:</Text>
            <Text style={styles.value}>{item.task_notes}</Text>
          </View>
        ) : null}

        {/* 🔥 Assignments */}
        {item.assignments?.map((assignment, index) => (
          <View key={index} style={styles.assignmentBox}>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Assigned To:</Text>
              <Text style={styles.value}>{assignment.assigned_to}</Text>
            </View>

            <View style={styles.rowBetween}>
              <Text style={styles.label}>Room:</Text>
              <Text style={styles.value}>{assignment.room_id}</Text>
            </View>

            <View style={styles.rowBetween}>
              <Text style={styles.label}>Status:</Text>
              <Text
                style={[
                  styles.badge,
                  { backgroundColor: getStatusColor(assignment.task_status) },
                ]}
              >
                {assignment.task_status}
              </Text>
            </View>

            <View style={styles.rowBetween}>
              <Text style={styles.label}>Priority:</Text>
              <Text
                style={[
                  styles.badge,
                  { backgroundColor: getPriorityColor(assignment.priority) },
                ]}
              >
                {assignment.priority}
              </Text>
            </View>
             {assignment.notes ? (
            <View style={{ marginTop: 5 }}>
              <Text style={styles.label}>Notes:</Text>
              <Text style={styles.value}>{assignment.notes}</Text>
            </View>
          ) : null}
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.createdBy}>
            Created By: {item.task_created_by}
          </Text>
          <Text style={styles.time}>{formatDate(item.timestamp)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
    backgroundColor: "#f4f6f8",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },

  type: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  desc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },

  section: {
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  value: {
    fontSize: 13,
    color: "#555",
  },

  assignmentBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f9fafb",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },

  badge: {
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    fontSize: 12,
    overflow: "hidden",
  },

  footer: {
    marginTop: 12,
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