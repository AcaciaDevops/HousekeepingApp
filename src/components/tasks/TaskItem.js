import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button, Menu } from "react-native-paper";
import { updateTaskStatus } from "../../api/TasksApi";
import useAuth from "../../features/auth/hooks/useAuth";
import { useAppTheme } from "../../context/ThemeContext";
import { useThemedStyles } from "../../utils/useThemedStyles";

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
  MaintenanceManager: TASK_STATUSES,
  HousekeepingManager: TASK_STATUSES,
  Admin: TASK_STATUSES,
  supervisor: TASK_STATUSES,
};

export default function TaskCard({ task, onStatusUpdated }) {
  const { user } = useAuth();
  const userRole = user?.user_role_name;
  const allowedStatuses = ROLE_ALLOWED_STATUSES[userRole] || TASK_STATUSES;
  const [status, setStatus] = useState(task.task_status);
  const [menuVisible, setMenuVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { tokens } = useAppTheme();
  const styles = useThemedStyles(createTaskItemStyles);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) return;

    setUpdatingStatus(true);
    try {
      await updateTaskStatus(task.id, newStatus, task.task_type);
      setStatus(newStatus);
      if (onStatusUpdated) onStatusUpdated(newStatus);
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
    <View style={[styles.taskCard, { borderColor: tokens.border, backgroundColor: tokens.surface }]}>
      <View style={styles.taskHeader}>
        <Text style={[styles.taskName, { color: tokens.text }]}>{task.task_name}</Text>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="contained"
              onPress={() => setMenuVisible(true)}
              style={[styles.taskStatus, getTaskStatusColor(status, tokens)]}
              loading={updatingStatus}
              labelStyle={{ color: tokens.buttonText }}
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
      <Text style={[styles.taskName, { color: tokens.text }]}>Room No: {task.room_id}</Text>
      <Text style={[styles.taskName, { color: tokens.text }]}>Assign to: {task.assigned_to}</Text>
      <Text style={[styles.taskPriority, { color: tokens.info }]}>Priority: {task.priority}</Text>
      {task.notes ? <Text style={[styles.taskNotes, { color: tokens.text }]}>Notes: {task.notes}</Text> : null}
      <Text style={[styles.taskTimestamp, { color: tokens.text }]}>
        Assigned at: {formatDate(task.assigned_at)}
      </Text>
      <Text style={[styles.taskTimestamp, { color: tokens.text }]}>
        Started at: {formatDate(task.started_at)}
      </Text>
      <Text style={[styles.taskTimestamp, { color: tokens.text }]}>
        Completed at: {formatDate(task.completed_at)}
      </Text>
      <Text style={[styles.taskTimestamp, { color: tokens.text }]}>
        Under Review at: {formatDate(task.under_review_at)}
      </Text>
      <Text style={[styles.taskTimestamp, { color: tokens.text }]}>
        Approved at: {formatDate(task.approved_at)}
      </Text>
      <Text style={[styles.taskTimestamp, { color: tokens.text }]}>
        Rejected at: {formatDate(task.rejected_at)}
      </Text>
      <Text style={[styles.taskTimestamp, { color: tokens.text }]}>
        Reassigned at: {formatDate(task.reassigned_at)}
      </Text>
    </View>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return "—";
  return d.toLocaleString();
}

function getTaskStatusColor(status, tokens) {
  return {
    backgroundColor: tokens.taskStatus[status] || tokens.taskStatus.reassigned,
  };
}

const createTaskItemStyles = (tokens) =>
  StyleSheet.create({
    taskCard: {
      padding: 12,
      marginVertical: 6,
      borderRadius: 10,
      borderWidth: 1,
    },
    taskHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    taskName: { fontSize: 16, fontWeight: "600" },
    taskStatus: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 12,
      fontWeight: "600",
    },
    taskPriority: { fontSize: 14 },
    taskNotes: { fontSize: 14 },
    taskTimestamp: { fontSize: 12, marginTop: 4 },
  });
