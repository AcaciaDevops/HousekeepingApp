// src/features/staff/StaffScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Menu } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import useAuth from "../../features/auth/hooks/useAuth";
import { fetchUserbyRole, fetchStaffStatus } from "../../api/UserApi";
import { fetchTotalCountTaskByStaff } from "../../api/TasksApi";
import { useAppTheme } from "../../context/ThemeContext";
import { useThemedStyles } from "../../utils/useThemedStyles";
import { ThemedScreen } from "../../components/ui";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const SHIFT_FILTERS = ["All", "Morning", "Evening", "Night"];

const ROLE_MAP = {
  MaintenanceManager: "MaintenanceStaff",
  default: "HousekeepingStaff",
};

// Fallback mock data shown when the API returns nothing
const MOCK_STAFF = [
  {
    id: "1",
    name: "John Doe",
    role: "Housekeeper",
    shift: "Morning",
    status: "Active",
    rooms: ["101", "102", "103"],
    completed: 3,
    pending: 2,
    approved: 0,
    in_progress: 0,
    reassigned: 0,
    rejected: 0,
    totalTasks: 5,
  },
  {
    id: "2",
    name: "Maria Smith",
    role: "Housekeeper",
    shift: "Evening",
    status: "On Leave",
    rooms: ["301", "302"],
    completed: 2,
    pending: 0,
    approved: 0,
    in_progress: 0,
    reassigned: 0,
    rejected: 0,
    totalTasks: 2,
  },
];

// ─────────────────────────────────────────────
// Data helpers
// ─────────────────────────────────────────────

/**
 * Merges raw API member data, status, and task counts into a
 * normalised staff object consumed by the UI.
 */
function buildStaffMember(member, matchedStatus, taskResponse) {
  return {
    ...member,
    id: member.user_id?.toString() ?? Math.random().toString(),
    name: member.user_first_name ?? "Unknown",
    role: member.user_role_name ?? "Staff",
    rooms: taskResponse?.assigned_rooms ?? [],
    status: matchedStatus?.status ?? "Available",
    currentTaskId: matchedStatus?.current_task_id ?? null,
    completed: taskResponse?.task_counts?.completed ?? 0,
    pending: taskResponse?.task_counts?.pending ?? 0,
    approved: taskResponse?.task_counts?.approved ?? 0,
    in_progress: taskResponse?.task_counts?.in_progress ?? 0,
    reassigned: taskResponse?.task_counts?.reassigned ?? 0,
    rejected: taskResponse?.task_counts?.rejected ?? 0,
    totalTasks: taskResponse?.task_counts?.total ?? 0,
  };
}

/**
 * Fallback object used when the per-member task fetch fails.
 */
function buildFallbackMember(member) {
  return {
    ...member,
    id: member.user_id?.toString() ?? Math.random().toString(),
    name: member.user_first_name ?? "Unknown",
    role: member.user_role_name ?? "Staff",
    rooms: [],
    status: "Available",
    completed: 0,
    pending: 0,
    approved: 0,
    in_progress: 0,
    reassigned: 0,
    rejected: 0,
    totalTasks: 0,
  };
}

// ─────────────────────────────────────────────
// Custom hook – staff data loading
// ─────────────────────────────────────────────

function useStaffData(userRole) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const roleName = ROLE_MAP[userRole] ?? ROLE_MAP.default;
      const [staffDetails, staffStatus] = await Promise.all([
        fetchUserbyRole(roleName),
        fetchStaffStatus(),
      ]);

      const processed = await Promise.all(
        (staffDetails ?? []).map(async (member) => {
          try {
            const taskResponse = await fetchTotalCountTaskByStaff(member.user_id);
            const matchedStatus = staffStatus?.find(
              (s) => s.user_id === member.user_id
            );
            return buildStaffMember(member, matchedStatus, taskResponse);
          } catch (memberError) {
            console.error(`Task fetch failed for user ${member.user_id}:`, memberError);
            return buildFallbackMember(member);
          }
        })
      );

      setStaff(processed);
    } catch (err) {
      console.error("Staff load error:", err);
      setError("Failed to load staff. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  useEffect(() => {
    load();
  }, [load]);

  return { staff, loading, error, reload: load };
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function SearchBar({ value, onChange, tokens, styles }) {
  return (
    <View style={styles.searchRow}>
      <TextInput
        placeholder="Search by name or role…"
        value={value}
        onChangeText={onChange}
        style={styles.search}
        placeholderTextColor={tokens.info}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.clear}>✖</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function ShiftFilterMenu({ activeFilter, onSelect, styles }) {
  const [visible, setVisible] = useState(false);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <TouchableOpacity style={styles.filterBtn} onPress={() => setVisible(true)}>
          <Text style={styles.filterText}>Filter: {activeFilter}</Text>
        </TouchableOpacity>
      }
    >
      {SHIFT_FILTERS.map((shift) => (
        <Menu.Item
          key={shift}
          title={shift}
          onPress={() => {
            onSelect(shift);
            setVisible(false);
          }}
        />
      ))}
    </Menu>
  );
}

function TaskBadge({ icon, count, label, color, styles }) {
  return (
    <View style={styles.taskItem}>
      <Text style={[styles.taskIcon, { color }]}>{icon}</Text>
      <Text style={styles.taskText}>
        {count} {label}
      </Text>
    </View>
  );
}

function StaffCard({ item, tokens, styles, onViewDetails, onAssignTask }) {
  const statusColor =
    item.status === "Active" ? tokens.success : tokens.warning;

  const roomsLabel = Array.isArray(item.rooms) && item.rooms.length > 0
    ? item.rooms.join(", ")
    : "None assigned";

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={[styles.status, { color: statusColor }]}>{item.status}</Text>
      </View>

      {/* Role */}
      <View style={styles.infoRow}>
        <Text style={styles.info}>{item.role}</Text>
      </View>

      {/* Assigned rooms */}
      <Text style={styles.roomsText}>Rooms: {roomsLabel}</Text>

      {/* Task summary */}
      <View style={styles.taskRow}>
        <TaskBadge
          icon="✔"
          count={item.completed}
          label="Completed"
          color={tokens.success}
          styles={styles}
        />
        <TaskBadge
          icon="⏳"
          count={item.pending}
          label="Pending"
          color={tokens.warning}
          styles={styles}
        />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={onViewDetails}>
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonPrimary} onPress={onAssignTask}>
          <Text style={styles.buttonPrimaryText}>Assign Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────

export default function StaffScreen() {
  const [searchText, setSearchText] = useState("");
  const [filterShift, setFilterShift] = useState("All");

  const { user } = useAuth();
  const navigation = useNavigation();
  const { tokens } = useAppTheme();
  const styles = useThemedStyles((t) => createStaffStyles(t));

  const { staff, loading, error, reload } = useStaffData(user?.user_role_name);

  // Fall back to mock data if API returned nothing
  const sourceData = staff.length > 0 ? staff : MOCK_STAFF;

  const filteredStaff = sourceData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.role.toLowerCase().includes(searchText.toLowerCase());

    const matchesShift = filterShift === "All" || item.shift === filterShift;

    return matchesSearch && matchesShift;
  });

  const renderItem = useCallback(
    ({ item }) => (
      <StaffCard
        item={item}
        tokens={tokens}
        styles={styles}
        onViewDetails={() => navigation.navigate("StaffDetails", { staffInfo: item })}
        onAssignTask={() => navigation.navigate("AssignTaskScreen", { staff: item })}
      />
    ),
    [tokens, styles, navigation]
  );

  return (
    <ThemedScreen>
      <View style={styles.container}>
        <Text style={styles.title}>Staff Management</Text>

        <SearchBar
          value={searchText}
          onChange={setSearchText}
          tokens={tokens}
          styles={styles}
        />

        <ShiftFilterMenu
          activeFilter={filterShift}
          onSelect={setFilterShift}
          styles={styles}
        />

        {loading && (
          <ActivityIndicator
            size="large"
            color={tokens.button}
            style={styles.loader}
          />
        )}

        {!!error && !loading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={reload}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && (
          <FlatList
            data={filteredStaff}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.empty}>No staff found 😕</Text>
            }
            contentContainerStyle={filteredStaff.length === 0 && styles.emptyContainer}
          />
        )}
      </View>
    </ThemedScreen>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const createStaffStyles = (tokens) =>
  StyleSheet.create({
    // Layout
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: tokens.background,
    },
    loader: {
      marginTop: 40,
    },
    emptyContainer: {
      flexGrow: 1,
      justifyContent: "center",
    },

    // Typography
    title: {
      fontSize: tokens.fonts.titleLarge.fontSize,
      fontWeight: tokens.fonts.titleLarge.fontWeight,
      fontFamily: tokens.fonts.titleLarge.fontFamily,
      color: tokens.heading,
      textAlign: "center",
      marginBottom: 16,
    },
    empty: {
      textAlign: "center",
      marginTop: 40,
      color: tokens.textSecondary,
      fontSize: tokens.fonts.bodyLarge.fontSize,
      fontFamily: tokens.fonts.bodyLarge.fontFamily,
    },

    // Search
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: tokens.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: tokens.border,
      paddingHorizontal: 12,
      marginBottom: 12,
      minHeight: 44,
    },
    search: {
      flex: 1,
      paddingVertical: 10,
      color: tokens.text,
      fontSize: tokens.fonts.bodyMedium.fontSize,
      fontFamily: tokens.fonts.bodyMedium.fontFamily,
    },
    clear: {
      fontSize: 18,
      color: tokens.textSecondary,
      padding: 4,
    },

    // Filter
    filterBtn: {
      backgroundColor: tokens.surface,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: tokens.border,
      marginBottom: 12,
      alignSelf: "flex-start",
    },
    filterText: {
      fontSize: tokens.fonts.labelMedium.fontSize,
      fontFamily: tokens.fonts.labelMedium.fontFamily,
      fontWeight: tokens.fonts.labelMedium.fontWeight,
      color: tokens.text,
    },

    // Card
    card: {
      backgroundColor: tokens.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: tokens.border,
      elevation: 2,
      shadowColor: tokens.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    name: {
      fontSize: tokens.fonts.titleMedium.fontSize,
      fontWeight: tokens.fonts.titleMedium.fontWeight,
      fontFamily: tokens.fonts.titleMedium.fontFamily,
      color: tokens.text,
    },
    status: {
      fontSize: tokens.fonts.labelMedium.fontSize,
      fontWeight: tokens.fonts.labelMedium.fontWeight,
      fontFamily: tokens.fonts.labelMedium.fontFamily,
      textTransform: "uppercase",
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    info: {
      fontSize: tokens.fonts.bodyMedium.fontSize,
      fontFamily: tokens.fonts.bodyMedium.fontFamily,
      color: tokens.text,
      marginRight: 4,
    },
    roomsText: {
      fontSize: tokens.fonts.bodyMedium.fontSize,
      fontFamily: tokens.fonts.bodyMedium.fontFamily,
      color: tokens.text,
      marginBottom: 8,
      fontWeight: "500",
    },

    // Task row
    taskRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: tokens.border,
    },
    taskItem: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    taskIcon: {
      fontSize: 16,
      marginRight: 4,
    },
    taskText: {
      fontSize: tokens.fonts.bodySmall.fontSize,
      fontFamily: tokens.fonts.bodySmall.fontFamily,
      color: tokens.text,
      fontWeight: "500",
    },

    // Actions
    actions: {
      flexDirection: "row",
      marginTop: 12,
      justifyContent: "space-between",
      gap: 8,
    },
    button: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: tokens.button,
    },
    buttonText: {
      color: tokens.button,
      fontSize: tokens.fonts.labelMedium.fontSize,
      fontFamily: tokens.fonts.labelMedium.fontFamily,
      fontWeight: tokens.fonts.labelMedium.fontWeight,
    },
    buttonPrimary: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
      backgroundColor: tokens.button,
    },
    buttonPrimaryText: {
      color: tokens.buttonText,
      fontSize: tokens.fonts.labelMedium.fontSize,
      fontFamily: tokens.fonts.labelMedium.fontFamily,
      fontWeight: tokens.fonts.labelMedium.fontWeight,
    },

    // Error state
    errorContainer: {
      alignItems: "center",
      marginTop: 40,
      gap: 12,
    },
    errorText: {
      color: tokens.error ?? "#e53e3e",
      fontSize: tokens.fonts.bodyMedium.fontSize,
      fontFamily: tokens.fonts.bodyMedium.fontFamily,
      textAlign: "center",
    },
    retryBtn: {
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: tokens.button,
    },
    retryText: {
      color: tokens.button,
      fontSize: tokens.fonts.labelMedium.fontSize,
      fontFamily: tokens.fonts.labelMedium.fontFamily,
      fontWeight: tokens.fonts.labelMedium.fontWeight,
    },
  });