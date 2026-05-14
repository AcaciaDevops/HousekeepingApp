// src/features/staff/StaffDetailsScreen.js
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { ThemedScreen } from "../../components/ui";
import { useAppTheme } from "../../context/ThemeContext";
import { useThemedStyles } from "../../utils/useThemedStyles";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

/**
 * All task statuses to display in the Task Summary section.
 * Add or remove entries here without touching any other code.
 */
const TASK_BADGES = [
  { key: "completed",   label: "Completed",   icon: "✔",  colorKey: "success" },
  { key: "in_progress", label: "In Progress", icon: "🔄", colorKey: "info"    },
  { key: "pending",     label: "Pending",     icon: "⏳", colorKey: "warning" },
  { key: "approved",    label: "Approved",    icon: "✅", colorKey: "success" },
  { key: "reassigned",  label: "Reassigned",  icon: "↩️", colorKey: "warning" },
  { key: "rejected",    label: "Rejected",    icon: "✖",  colorKey: "error"   },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatRooms(rooms) {
  return Array.isArray(rooms) && rooms.length > 0
    ? rooms.join(", ")
    : "None assigned";
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function Section({ title, children, styles }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function InfoRow({ label, value, styles }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function StatusRow({ label, value, color, styles }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, styles.statusText, { color }]}>{value}</Text>
    </View>
  );
}

function TaskBadge({ icon, label, count, color, styles }) {
  return (
    <View style={styles.badgeCard}>
      <Text style={[styles.badgeIcon, { color }]}>{icon}</Text>
      <Text style={[styles.badgeCount, { color }]}>{count ?? 0}</Text>
      <Text style={styles.badgeLabel}>{label}</Text>
    </View>
  );
}

function TaskSummaryGrid({ staffInfo, tokens, styles }) {
  return (
    <View style={styles.badgeGrid}>
      {TASK_BADGES.map(({ key, label, icon, colorKey }) => (
        <TaskBadge
          key={key}
          icon={icon}
          label={label}
          count={staffInfo[key]}
          color={tokens[colorKey] ?? tokens.text}
          styles={styles}
        />
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────

export default function StaffDetailsScreen({ route }) {
  const staffInfo = route?.params?.staffInfo;
  const { tokens } = useAppTheme();
  const styles = useThemedStyles(createStyles);

  if (!staffInfo) {
    return (
      <ThemedScreen>
        <Text style={{ color: tokens.text, padding: 16 }}>
          No staff data available.
        </Text>
      </ThemedScreen>
    );
  }

  const statusColor =
    staffInfo.status === "Active" ? tokens.success : tokens.warning;

  return (
    <ThemedScreen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* Basic Information */}
        <Section title="Basic Information" styles={styles}>
          <InfoRow label="Name"   value={staffInfo.name}   styles={styles} />
          <InfoRow label="Role"   value={staffInfo.role}   styles={styles} />
          <StatusRow
            label="Status"
            value={staffInfo.status}
            color={statusColor}
            styles={styles}
          />
        </Section>

        {/* Work Details */}
        <Section title="Work Details" styles={styles}>
          <InfoRow
            label="Assigned Rooms"
            value={formatRooms(staffInfo.rooms)}
            styles={styles}
          />
        </Section>

        {/* Task Summary */}
        <Section title="Task Summary" styles={styles}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Tasks</Text>
            <Text style={styles.totalCount}>{staffInfo.totalTasks ?? 0}</Text>
          </View>
          <TaskSummaryGrid staffInfo={staffInfo} tokens={tokens} styles={styles} />
        </Section>

        {/* Upcoming section */}
        <Section title="More" styles={styles}>
          <Text style={styles.placeholder}>
            Task history, performance & attendance coming soon.
          </Text>
        </Section>
      </ScrollView>
    </ThemedScreen>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const createStyles = (tokens) =>
  StyleSheet.create({
    // Layout
    container: {
      flex: 1,
      backgroundColor: tokens.background,
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 32,
    },

    // Title
    title: {
      fontSize: tokens.fonts.titleLarge.fontSize,
      fontWeight: tokens.fonts.titleLarge.fontWeight,
      fontFamily: tokens.fonts.titleLarge.fontFamily,
      color: tokens.heading,
      textAlign: "center",
      marginBottom: 20,
    },

    // Section card
    section: {
      backgroundColor: tokens.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: tokens.border,
      elevation: 2,
      shadowColor: tokens.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    sectionTitle: {
      fontSize: tokens.fonts.titleMedium.fontSize,
      fontWeight: tokens.fonts.titleMedium.fontWeight,
      fontFamily: tokens.fonts.titleMedium.fontFamily,
      color: tokens.text,
      paddingBottom: 8,
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
    },

    // Info rows
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    label: {
      fontSize: tokens.fonts.bodyMedium.fontSize,
      fontFamily: tokens.fonts.bodyMedium.fontFamily,
      color: tokens.textSecondary,
      flex: 1,
    },
    value: {
      fontSize: tokens.fonts.bodyMedium.fontSize,
      fontFamily: tokens.fonts.bodyMedium.fontFamily,
      color: tokens.text,
      flex: 2,
      textAlign: "right",
    },
    statusText: {
      fontWeight: "600",
      textTransform: "uppercase",
    },

    // Total row
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
    },
    totalLabel: {
      fontSize: tokens.fonts.bodyMedium.fontSize,
      fontFamily: tokens.fonts.bodyMedium.fontFamily,
      color: tokens.textSecondary,
      fontWeight: "500",
    },
    totalCount: {
      fontSize: tokens.fonts.titleMedium.fontSize,
      fontWeight: tokens.fonts.titleMedium.fontWeight,
      fontFamily: tokens.fonts.titleMedium.fontFamily,
      color: tokens.text,
    },

    // Badge grid — 3 columns
    badgeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    badgeCard: {
      width: "30%",
      backgroundColor: tokens.background,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: tokens.border,
      padding: 10,
      alignItems: "center",
      gap: 4,
    },
    badgeIcon: {
      fontSize: 20,
    },
    badgeCount: {
      fontSize: tokens.fonts.titleMedium.fontSize,
      fontWeight: tokens.fonts.titleMedium.fontWeight,
      fontFamily: tokens.fonts.titleMedium.fontFamily,
    },
    badgeLabel: {
      fontSize: tokens.fonts.bodySmall.fontSize,
      fontFamily: tokens.fonts.bodySmall.fontFamily,
      color: tokens.textSecondary,
      textAlign: "center",
    },

    // Placeholder
    placeholder: {
      fontSize: tokens.fonts.bodyMedium.fontSize,
      fontFamily: tokens.fonts.bodyMedium.fontFamily,
      color: tokens.textSecondary,
      fontStyle: "italic",
      textAlign: "center",
      marginTop: 8,
    },
  });