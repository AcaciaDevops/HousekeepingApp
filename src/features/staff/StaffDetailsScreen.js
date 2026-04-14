import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemedScreen } from "../../components/ui";
import { useAppTheme } from "../../context/ThemeContext";
import { useThemedStyles } from "../../utils/useThemedStyles";

export default function StaffDetailsScreen({ route }) {
  const staffInfo = route?.params?.staffInfo;
  const { tokens } = useAppTheme();
  const styles = useThemedStyles(createStyles);

  if (!staffInfo) {
    return (
      <ThemedScreen>
        <Text style={{ color: tokens.text, padding: 16 }}>No staff data available.</Text>
      </ThemedScreen>
    );
  }

  return (
    <ThemedScreen>
      <View style={styles.container}>
        <Text style={styles.title}>Staff Details</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <Text style={styles.item}>Name: {staffInfo?.name}</Text>
          <Text style={styles.item}>Role: {staffInfo.role}</Text>
          <Text style={styles.item}>
            Status: <Text style={{ color: staffInfo.status === "Active" ? tokens.button : tokens.info }}>{staffInfo.status}</Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Details</Text>
          <Text style={styles.item}>Shift: {staffInfo.shift}</Text>
          <Text style={styles.item}>Floor: {staffInfo.floor}</Text>
          <Text style={styles.item}>Rooms: {staffInfo.rooms}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Task Summary</Text>
          <Text style={styles.item}>✔ Completed: {staffInfo.completed}</Text>
          <Text style={styles.item}>⏳ Pending: {staffInfo.pending}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>
          <Text style={styles.placeholder}>
            Task history, performance & attendance coming soon.
          </Text>
        </View>
      </View>
    </ThemedScreen>
  );
}

const createStyles = (tokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.background,
      padding: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 16,
      color: tokens.heading,
    },
    section: {
      backgroundColor: tokens.surface,
      borderRadius: 12,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: tokens.border,
    },
    sectionTitle: {
      fontWeight: "bold",
      marginBottom: 8,
      color: tokens.text,
    },
    item: {
      marginBottom: 4,
      color: tokens.text,
    },
    placeholder: {
      color: tokens.info,
      fontStyle: "italic",
    },
  });
