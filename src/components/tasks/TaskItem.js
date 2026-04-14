import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button, Menu } from "react-native-paper";
import { updateTaskStatus } from "../../api/TasksApi";
import  useAuth  from "../../features/auth/hooks/useAuth";

const TASK_STATUSES = [
  "pending",
  "in_progress",
  "completed",
  "under_review",
  "approved",
  "rejected",
  "reassigned",
];
const ROLE_ALLOWED_STATUSES = {
  HousekeepingStaff: ["pending", "in_progress", "completed"],
  MaintenanceStaff: ["pending", "in_progress", "completed"],
  MaintenanceManager:TASK_STATUSES,
  HousekeepingManager: TASK_STATUSES,
  Admin: TASK_STATUSES,
  supervisor: TASK_STATUSES,
};
export default function TaskCard({ task, onStatusUpdated, canComplete }) {
  const { user } = useAuth();
  const userRole = user?.user_role_name; // ensure this matches your user object
console.log("userRole::",userRole)
  const allowedStatuses =
    ROLE_ALLOWED_STATUSES[userRole] || TASK_STATUSES;
  const [status, setStatus] = useState(task.task_status);
  const [menuVisible, setMenuVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) return;

    setUpdatingStatus(true);
    try {
      console.log("task::details::1023",task)
      const updatedTask = await updateTaskStatus(task.id, newStatus, task.task_type);
      {console.log("updated task::12",updatedTask)}
      setStatus(newStatus);
      if (onStatusUpdated) onStatusUpdated(newStatus);
      console.log("status::1",newStatus)
      Alert.alert("Success", `Task status updated to "${newStatus}"`);
    } catch (err) {
      console.error("Failed to update task status:", err);
      Alert.alert("Error", "Failed to update task status");
    } finally {
      setUpdatingStatus(false);
      setMenuVisible(false);
    }
  };

  return (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskName}>{task.task_name}</Text>


        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="contained"
              onPress={() => setMenuVisible(true)}
              style={[styles.taskStatus, getTaskStatusColor(status)]}
              loading={updatingStatus}
            >
              {status.replace("_", " ")}
            </Button>
          }
        >
          {allowedStatuses.map((s) => (
            <Menu.Item
              key={`${task.id}-${s}`}
              title={s.replace("_", " ").toUpperCase()}
              onPress={() => handleStatusChange(s)}
              disabled={s === status}
            />
          ))}
        </Menu>
      </View>
      {console.log("task :: ",task)}
      <Text style={styles.taskName}>Room No: {task.room_id}</Text>
       <Text style={styles.taskName}>Assign to: {task.assigned_to}</Text>
      <Text style={styles.taskPriority}>Priority: {task.priority}</Text>
      {task.notes ? <Text style={styles.taskNotes}>Notes: {task.notes}</Text> : null}
      <Text style={styles.taskTimestamp}>
        Assigned at: {formatDate(task.assigned_at)}
      </Text>
      <Text style={styles.taskTimestamp}>
        Started at: {formatDate(task.started_at)}
      </Text>
      <Text style={styles.taskTimestamp}>
        Completed at: {formatDate(task.completed_at)}
      </Text>
      <Text style={styles.taskTimestamp}>
        Under Review at: {formatDate(task.under_review_at)}
      </Text>
      <Text style={styles.taskTimestamp}>
        Approved at: {formatDate(task.approved_at)}
      </Text>
      <Text style={styles.taskTimestamp}>
        Rejected at: {formatDate(task.rejected_at)}
      </Text>
      <Text style={styles.taskTimestamp}>
        Reassigned at: {formatDate(task.reassigned_at)}
      </Text>


    </View>
  );
}
function formatDate(dateStr) {
  if (!dateStr) return "—";        // fallback for null/undefined
  const d = new Date(dateStr);
  if (isNaN(d)) return "—";        // fallback for invalid date
  return d.toLocaleString();        // format nicely
}

/* Status colors */
function getTaskStatusColor(status) {
  switch (status) {
    case "pending":
      return { backgroundColor: "#FF9800" };
    case "in_progress":
      return { backgroundColor: "#2196F3" };
    case "completed":
      return { backgroundColor: "#4CAF50" };
    case "under_review":
      return { backgroundColor: "#9C27B0" };
    case "approved":
      return { backgroundColor: "#009688" };
    case "rejected":
      return { backgroundColor: "#F44336" };
    case "reassigned":
      return { backgroundColor: "#607D8B" };
    default:
      return { backgroundColor: "#607D8B" };
  }
}

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  taskName: { fontSize: 16, fontWeight: "600", color: "#333" },
  taskStatus: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    color: "#fff",
    fontWeight: "600",
  },
  taskPriority: { fontSize: 14, color: "#555" },
  taskNotes: { fontSize: 14, color: "#444" },
  taskTimestamp: { fontSize: 12, color: "#888", marginTop: 4 },
});
