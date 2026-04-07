import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function StaffDetailsScreen({ route }) {
  const staffInfo  = route?.params?.staffInfo;
  if (!staffInfo) {
    return <Text>No staff data</Text>;
  }
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Staff Details</Text>

      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <Text style={styles.item}>Name: {staffInfo?.name}</Text>
        <Text style={styles.item}>Role: {staffInfo.role}</Text>
        <Text style={styles.item}>Status: {staffInfo.status}</Text>
      </View>

      {/* Work Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Details</Text>
        <Text style={styles.item}>Shift: {staffInfo.shift}</Text>
        <Text style={styles.item}>Floor: {staffInfo.floor}</Text>
        <Text style={styles.item}>Rooms: {staffInfo.rooms}</Text>
      </View>

      {/* Task Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Task Summary</Text>
        <Text style={styles.item}>✔ Completed: {staffInfo.completed}</Text>
        <Text style={styles.item}>⏳ Pending: {staffInfo.pending}</Text>
      </View>

      {/* Placeholder for future */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More</Text>
        <Text style={styles.placeholder}>
          Task history, performance & attendance coming soon
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  item: {
    marginBottom: 4,
    color: "#555",
  },
  placeholder: {
    color: "#999",
    fontStyle: "italic",
  },
});
