import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button, Menu, Chip, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { updateTaskStatus } from "../../api/TasksApi";
import useAuth from "../../features/auth/hooks/useAuth";
import { useAppTheme } from "../../context/ThemeContext";
import { useThemedStyles } from "../../utils/useThemedStyles";

// Constants
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

const MANAGER_ROLES = ["MaintenanceManager", "HousekeepingManager"];

// Helper function to format status display
const formatStatus = (status) => 
  status?.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());

// Helper function to format date
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString();
};

// Status icon mapping
const getStatusIcon = (status) => {
  const icons = {
    pending: "clock-outline",
    in_progress: "progress-clock",
    completed: "check-circle",
    under_review: "eye-check",
    approved: "check-decagram",
    rejected: "close-circle",
    reassigned: "refresh",
  };
  return icons[status] || "help-circle";
};

// Get status color with fallback
const getStatusColor = (status, tokens) => {
  const statusColors = {
    pending: "#FFA500",
    in_progress: "#2196F3",
    completed: "#4CAF50",
    under_review: "#9C27B0",
    approved: "#8BC34A",
    rejected: "#F44336",
    reassigned: "#FF9800",
  };
  return tokens?.taskStatus?.[status] || statusColors[status] || "#757575";
};

// Priority color mapping with fallbacks
const getPriorityColor = (priority, tokens) => {
  const colors = {
    high: "#F44336",
    medium: "#FF9800",
    low: "#4CAF50",
  };
  return colors[priority?.toLowerCase()] || "#757575";
};

export default function TaskCard({ task, onStatusUpdated }) {
  
  const { user } = useAuth();
  console.log("user:::123",user)
  const { tokens } = useAppTheme();
  const styles = useThemedStyles(createTaskItemStyles);
  
  const [status, setStatus] = useState(task.task_status);
  const [menuVisible, setMenuVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const userRole = user?.user_role_name;
  const isManager = MANAGER_ROLES.includes(userRole);
  const allowedStatuses = ROLE_ALLOWED_STATUSES[userRole] || TASK_STATUSES;

  // Safe token access with fallbacks
  const safeTokens = {
    surface: tokens?.surface || "#FFFFFF",
    text: tokens?.text || "#000000",
    textSecondary: tokens?.textSecondary || "#666666",
    border: tokens?.border || "#E0E0E0",
    primary: tokens?.primary || "#2196F3",
    buttonText: tokens?.buttonText || "#FFFFFF",
    error: tokens?.error || "#F44336",
    warning: tokens?.warning || "#FF9800",
    success: tokens?.success || "#4CAF50",
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) return;

    setUpdatingStatus(true);
    try {
      await updateTaskStatus(task.id, newStatus, task.task_type);
      setStatus(newStatus);
      onStatusUpdated?.(newStatus);
      Alert.alert("Success", `Task status updated to "${formatStatus(newStatus)}"`);
    } catch (err) {
      console.error("Failed to update task status:", err);
      Alert.alert("Error", "Failed to update task status");
    } finally {
      setUpdatingStatus(false);
      setMenuVisible(false);
    }
  };

  // Memoized timestamp fields for managers
  const managerTimestamps = useMemo(() => {
    if (!isManager) return null;
    return (
      <>
        <View style={styles.timestampRow}>
          <MaterialCommunityIcons name="clock-start" size={14} color={safeTokens.textSecondary} />
          <Text style={styles.detailLabel}>Started at:</Text>
          <Text style={styles.timestampValue}>{formatDate(task.started_at)}</Text>
        </View>
        <View style={styles.timestampRow}>
          <MaterialCommunityIcons name="eye-check" size={14} color={safeTokens.textSecondary} />
          <Text style={styles.detailLabel}>Under Review at:</Text>
          <Text style={styles.timestampValue}>{formatDate(task.under_review_at)}</Text>
        </View>
        <View style={styles.timestampRow}>
          <MaterialCommunityIcons name="check-decagram" size={14} color={safeTokens.success} />
          <Text style={styles.detailLabel}>Approved at:</Text>
          <Text style={styles.timestampValue}>{formatDate(task.approved_at)}</Text>
        </View>
        <View style={styles.timestampRow}>
          <MaterialCommunityIcons name="refresh" size={14} color={safeTokens.warning} />
          <Text style={styles.detailLabel}>Reassigned at:</Text>
          <Text style={styles.timestampValue}>{formatDate(task.reassigned_at)}</Text>
        </View>
      </>
    );
  }, [isManager, task, safeTokens]);

  const statusColor = getStatusColor(status, tokens);

  return (
    <View style={[styles.taskCard, { 
      borderLeftColor: safeTokens.primary,
      backgroundColor: safeTokens.surface,
      borderColor: safeTokens.border,
    }]}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons 
            name="clipboard-list" 
            size={20} 
            color={safeTokens.primary} 
          />
          <Text style={[styles.taskName, { color: safeTokens.text }]}>
            {task.task_name}
          </Text>
        </View>
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="contained"
              onPress={() => setMenuVisible(true)}
              style={[
                styles.statusButton,
                { backgroundColor: statusColor }
              ]}
              loading={updatingStatus}
              labelStyle={styles.statusButtonLabel}
              icon={() => (
                <MaterialCommunityIcons 
                  name={getStatusIcon(status)} 
                  size={16} 
                  color="#FFFFFF" 
                />
              )}
            >
              {formatStatus(status)}
            </Button>
          }
          contentStyle={styles.menuContent}
        >
          {allowedStatuses.map((s) => (
            <Menu.Item
              key={`${task.id}-${s}`}
              title={formatStatus(s)}
              onPress={() => handleStatusChange(s)}
              disabled={s === status}
              leadingIcon={() => (
                <MaterialCommunityIcons 
                  name={getStatusIcon(s)} 
                  size={18} 
                  color={s === status ? safeTokens.primary : safeTokens.textSecondary}
                />
              )}
              style={s === status && styles.activeMenuItem}
              titleStyle={s === status && { color: safeTokens.primary }}
            />
          ))}
        </Menu>
      </View>

      <Divider style={[styles.divider, { backgroundColor: safeTokens.border }]} />

      {/* Details Section */}
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="door" size={16} color={safeTokens.textSecondary} />
          <Text style={styles.detailLabel}>Room No:</Text>
          <Text style={[styles.detailValue, { color: safeTokens.text }]}>{task.room_id}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="account" size={16} color={safeTokens.textSecondary} />
          <Text style={styles.detailLabel}>Assigned to:</Text>
          <Text style={[styles.detailValue, { color: safeTokens.text }]}>{task.assigned_to}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="flag" size={16} color={getPriorityColor(task.priority, tokens)} />
          <Text style={styles.detailLabel}>Priority:</Text>
          <View style={[
            styles.priorityChip,
            { backgroundColor: getPriorityColor(task.priority, tokens) + "20" }
          ]}>
            <Text style={[
              styles.priorityText,
              { color: getPriorityColor(task.priority, tokens) }
            ]}>
              {task.priority?.toUpperCase() || "MEDIUM"}
            </Text>
          </View>
        </View>

        {task.notes ? (
          <View style={styles.notesContainer}>
            <MaterialCommunityIcons name="note-text" size={16} color={safeTokens.textSecondary} />
            <Text style={[styles.notesText, { color: safeTokens.textSecondary }]}>
              {task.notes}
            </Text>
          </View>
        ) : null}
      </View>

      <Divider style={[styles.divider, { backgroundColor: safeTokens.border }]} />

      {/* Timestamps Section */}
      <View style={styles.timestampsSection}>
        <View style={styles.timestampRow}>
          <MaterialCommunityIcons name="calendar-clock" size={14} color={safeTokens.textSecondary} />
          <Text style={styles.detailLabel}>Assigned at:</Text>
          <Text style={styles.timestampValue}>{formatDate(task.assigned_at)}</Text>
        </View>

        <View style={styles.timestampRow}>
          <MaterialCommunityIcons name="check-circle" size={14} color={safeTokens.success} />
          <Text style={styles.detailLabel}>Completed at:</Text>
          <Text style={styles.timestampValue}>{formatDate(task.completed_at)}</Text>
        </View>

        <View style={styles.timestampRow}>
          <MaterialCommunityIcons name="close-circle" size={14} color={safeTokens.error} />
          <Text style={styles.detailLabel}>Rejected at:</Text>
          <Text style={styles.timestampValue}>{formatDate(task.rejected_at)}</Text>
        </View>

        {managerTimestamps}
      </View>
    </View>
  );
}

const createTaskItemStyles = (tokens) =>
  StyleSheet.create({
    taskCard: {
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderLeftWidth: 4,
      overflow: "hidden",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    headerSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 12,
      paddingBottom: 8,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      gap: 8,
    },
    taskName: {
      fontSize: 16,
      fontWeight: "600",
      flex: 1,
    },
    statusButton: {
      borderRadius: 20,
      minWidth: 80,
    },
    statusButtonLabel: {
      fontSize: 12,
      fontWeight: "600",
      letterSpacing: 0.5,
      color: "#FFFFFF",
    },
    menuContent: {
      borderRadius: 8,
    },
    activeMenuItem: {
      backgroundColor: "#2196F320",
    },
    divider: {
      marginHorizontal: 12,
      height: 1,
    },
    detailsSection: {
      padding: 12,
      gap: 8,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    detailLabel: {
      fontSize: 13,
      color: "#666666",
      fontWeight: "500",
      minWidth: 85,
    },
    detailValue: {
      fontSize: 13,
      fontWeight: "400",
      flex: 1,
    },
    priorityChip: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: "#FF980020",
    },
    priorityText: {
      fontSize: 11,
      fontWeight: "600",
    },
    notesContainer: {
      flexDirection: "row",
      marginTop: 4,
      paddingTop: 4,
      gap: 8,
    },
    notesText: {
      fontSize: 12,
      flex: 1,
      fontStyle: "italic",
    },
    timestampsSection: {
      padding: 12,
      paddingTop: 8,
      gap: 4,
    },
    timestampRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    detailLabel: {
      fontSize: 11,
      color: "#666666",
      minWidth: 85,
    },
    timestampValue: {
      fontSize: 11,
      color: "#000000",
      flex: 1,
    },
  });