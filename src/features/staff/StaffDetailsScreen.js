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
            Status: <Text style={[styles.statusText, { color: staffInfo.status === "Active" ? tokens.success : tokens.warning }]}>
              {staffInfo.status}
            </Text>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={[styles.statusText, { color: tokens.success, marginRight: 8 }]}>✔</Text>
            <Text style={styles.item}>Completed: {staffInfo.completed}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.statusText, { color: tokens.warning, marginRight: 8 }]}>⏳</Text>
            <Text style={styles.item}>Pending: {staffInfo.pending}</Text>
          </View>
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
      fontSize: tokens.fonts.titleLarge.fontSize,
      fontWeight: tokens.fonts.titleLarge.fontWeight,
      fontFamily: tokens.fonts.titleLarge.fontFamily,
      marginBottom: 20,
      color: tokens.heading,
      textAlign: 'center',
    },
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
      marginBottom: 12,
      color: tokens.text,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
      paddingBottom: 8,
    },
    item: {
      fontSize: tokens.fonts.bodyMedium.fontSize,
      fontFamily: tokens.fonts.bodyMedium.fontFamily,
      marginBottom: 8,
      color: tokens.text,
      lineHeight: 20,
    },
    statusText: {
      fontSize: tokens.fonts.bodyMedium.fontSize,
      fontFamily: tokens.fonts.bodyMedium.fontFamily,
      fontWeight: '600',
    },
    placeholder: {
      fontSize: tokens.fonts.bodyMedium.fontSize,
      fontFamily: tokens.fonts.bodyMedium.fontFamily,
      color: tokens.textSecondary,
      fontStyle: "italic",
      textAlign: 'center',
      marginTop: 8,
    },
  });
