import React, { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Divider, Menu } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

const MANAGER_ROLES = ["MaintenanceManager", "HousekeepingManager"];

const formatStatus = (status) =>
  status?.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
};

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

const getStatusColor = (status, tokens) => {
  const statusColors = {
    pending: "#F59E0B",
    in_progress: "#3B82F6",
    completed: "#10B981",
    under_review: "#8B5CF6",
    approved: "#84CC16",
    rejected: "#EF4444",
    reassigned: "#F97316",
  };
  return tokens?.taskStatus?.[status] || statusColors[status] || "#64748B";
};

const getPriorityColor = (priority) => {
  const colors = {
    high: "#EF4444",
    medium: "#F59E0B",
    low: "#10B981",
  };
  return colors[priority?.toLowerCase()] || "#64748B";
};

function DetailRow({ icon, label, value, labelWidth = 88, labelColor, valueColor, iconColor, iconStyle, styles }) {
  return (
    <View style={styles.detailRow}>
      <MaterialCommunityIcons name={icon} size={15} color={iconColor} style={iconStyle} />
      <Text style={[styles.detailLabel, { minWidth: labelWidth, color: labelColor }]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.detailValue, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

export default function TaskCard({ task, onStatusUpdated }) {
  const { user } = useAuth();
  const { tokens } = useAppTheme();
  const styles = useThemedStyles(createTaskItemStyles);

  const [status, setStatus] = useState(task.task_status);
  const [menuVisible, setMenuVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const userRole = user?.user_role_name;
  const isManager = MANAGER_ROLES.includes(userRole);
  const allowedStatuses = ROLE_ALLOWED_STATUSES[userRole] || TASK_STATUSES;

  const statusColor = getStatusColor(status, tokens);
  const priorityColor = getPriorityColor(task.priority);
  const textColor = tokens.text;
  const secondaryColor = tokens.textSecondary || tokens.text;

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

  const managerTimestamps = useMemo(() => {
    if (!isManager) return null;
    return (
      <>
        <DetailRow
          icon="clock-start"
          label="Started at:"
          value={formatDate(task.started_at)}
          labelWidth={100}
          labelColor={textColor}
          valueColor={textColor}
          iconColor={secondaryColor}
          iconStyle={styles.rowIcon}          styles={styles}        />
        <DetailRow
          icon="eye-check"
          label="Under Review at:"
          value={formatDate(task.under_review_at)}
          labelWidth={100}
          labelColor={textColor}
          valueColor={textColor}
          iconColor={secondaryColor}
          iconStyle={styles.rowIcon}          styles={styles}        />
        <DetailRow
          icon="check-decagram"
          label="Approved at:"
          value={formatDate(task.approved_at)}
          labelWidth={100}
          labelColor={textColor}
          valueColor={textColor}
          iconColor={tokens.success}
          iconStyle={styles.rowIcon}
          styles={styles}
        />
        <DetailRow
          icon="refresh"
          label="Reassigned at:"
          value={formatDate(task.reassigned_at)}
          labelWidth={100}
          labelColor={textColor}
          valueColor={textColor}
          iconColor={tokens.warning}
          iconStyle={styles.rowIcon}
          styles={styles}
        />
      </>
    );
  }, [isManager, task, textColor, secondaryColor, tokens]);

  return (
    <View style={styles.taskCard}>
      <View style={styles.headerSection}>
        <View style={styles.titleContainer}>
          <View style={[styles.iconWrap, { backgroundColor: `${tokens.button}18` }]}>
            <MaterialCommunityIcons name="clipboard-list" size={18} color={tokens.button} />
          </View>
          <View style={styles.titleTextBlock}>
            <Text style={styles.taskName} numberOfLines={2}>
              {task.task_name}
            </Text>
            <Text style={styles.taskMeta} numberOfLines={1}>
              Room {task.room_id} · {task.task_type}
            </Text>
          </View>
        </View>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Pressable
              onPress={() => setMenuVisible(true)}
              style={({ pressed }) => [
                styles.statusChip,
                { backgroundColor: `${statusColor}16`, borderColor: statusColor },
                pressed && styles.pressedChip,
              ]}
            >
              <MaterialCommunityIcons name={getStatusIcon(status)} size={14} color={statusColor} />
              <Text style={[styles.statusChipText, { color: statusColor }]}>{formatStatus(status)}</Text>
            </Pressable>
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
                  color={s === status ? tokens.button : tokens.textSecondary}
                />
              )}
              style={s === status ? styles.activeMenuItem : null}
              titleStyle={s === status ? { color: tokens.button } : null}
            />
          ))}
        </Menu>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.detailsSection}>
        <DetailRow
          icon="door"
          label="Room No:"
          labelWidth={100}
          value={task.room_id}
          labelColor={textColor}
          valueColor={textColor}
          iconColor={secondaryColor}
          iconStyle={styles.rowIcon}
          styles={styles}
        />
        <DetailRow
          icon="account"
          label="Assigned to:"
          labelWidth={100}
          value={task.assigned_to}
          labelColor={textColor}
          valueColor={textColor}
          iconColor={secondaryColor}
          iconStyle={styles.rowIcon}
          styles={styles}
        />
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="flag" size={15} color={priorityColor} style={styles.rowIcon} />
          <Text style={[styles.detailLabel, { color: textColor }]} numberOfLines={1}>
            Priority:
          </Text>
          <View style={[styles.priorityChip, { backgroundColor: `${priorityColor}18` }]}>
            <Text style={[styles.priorityText, { color: priorityColor }]}>{task.priority?.toUpperCase() || "MEDIUM"}</Text>
          </View>
        </View>

        {task.notes ? (
          <View style={styles.notesContainer}>
            <MaterialCommunityIcons name="note-text" size={15} color={secondaryColor} style={styles.rowIcon} />
            <Text style={[styles.notesText, { color: textColor }]}>{task.notes}</Text>
          </View>
        ) : null}
      </View>

      <Divider style={styles.divider} />

      <View style={styles.timestampsSection}>
        <DetailRow
          icon="calendar-clock"
          label="Assigned at:"
          value={formatDate(task.assigned_at)}
          labelWidth={100}
          labelColor={textColor}
          valueColor={textColor}
          iconColor={secondaryColor}
          iconStyle={styles.rowIcon}
          styles={styles}
        />
        <DetailRow
          icon="check-circle"
          label="Completed at:"
          value={formatDate(task.completed_at)}
          labelWidth={100}
          labelColor={textColor}
          valueColor={textColor}
          iconColor={tokens.success}
          iconStyle={styles.rowIcon}
          styles={styles}
        />
        <DetailRow
          icon="close-circle"
          label="Rejected at:"
          value={formatDate(task.rejected_at)}
          labelWidth={100}
          labelColor={textColor}
          valueColor={textColor}
          iconColor={tokens.error}
          iconStyle={styles.rowIcon}
          styles={styles}
        />
        {managerTimestamps}
      </View>
    </View>
  );
}

const createTaskItemStyles = (tokens) =>
  StyleSheet.create({
    taskCard: {
      marginBottom: 12,
      borderRadius: 12,
      borderWidth: 1,
      overflow: "hidden",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      backgroundColor: tokens.surface,
      borderColor: tokens.border,
    },
    headerSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingHorizontal: 14,
      paddingTop: 14,
      paddingBottom: 10,
      gap: 12,
    },
    titleContainer: {
      flexDirection: "row",
      flex: 1,
      gap: 10,
      alignItems: "flex-start",
      minWidth: 0,
    },
    iconWrap: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 1,
      flexShrink: 0,
    },
    titleTextBlock: {
      flex: 1,
      minWidth: 0,
    },
    taskName: {
      fontSize: 15,
      fontWeight: "700",
      lineHeight: 20,
      color: tokens.heading,
    },
    taskMeta: {
      marginTop: 2,
      fontSize: 12,
      lineHeight: 16,
      color: tokens.heading,
    },
    statusChip: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
      minHeight: 32,
      gap: 6,
    },
    pressedChip: {
      opacity: 0.8,
    },
    statusChipText: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.2,
      textTransform: "capitalize",
    },
    menuContent: {
      borderRadius: 10,
    },
    activeMenuItem: {
      backgroundColor: `${tokens.button}18`,
    },
    divider: {
      marginHorizontal: 14,
      height: 1,
      backgroundColor: tokens.border,
    },
    detailsSection: {
      paddingHorizontal: 14,
      paddingTop: 10,
      paddingBottom: 10,
      gap: 8,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
    },
    detailLabel: {
      fontSize: 12,
      lineHeight: 18,
      color: tokens.text,
      fontWeight: "600",
      minWidth: 100,
    },
    detailValue: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "500",
      flex: 1,
      color: tokens.text,
    },
    priorityChip: {
      borderRadius: 999,
      alignSelf: "flex-start",
    },
    priorityText: {
      fontSize: 11,
      fontWeight: "700",
    },
    notesContainer: {
      flexDirection: "row",
      marginTop: 4,
      gap: 8,
      alignItems: "flex-start",
    },
    notesText: {
      fontSize: 12,
      lineHeight: 18,
      flex: 1,
      color: tokens.text,
    },
    timestampsSection: {
      paddingHorizontal: 14,
      paddingTop: 10,
      paddingBottom: 14,
      gap: 4,
      backgroundColor: `${tokens.surface}80`,
    },
    rowIcon: {
      marginTop: 1,
      flexShrink: 0,
    },
  });
