import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useAppTheme } from "../../context/ThemeContext";
import { useThemedStyles } from "../../utils/useThemedStyles";
import { ThemedScreen, ThemedScrollView } from "../../components/ui";

export default function AssignTaskScreen({ route, navigation }) {
  const staff = route?.params?.staff;
  const { tokens } = useAppTheme();
  const styles = useThemedStyles(createStyles);

  const [taskType, setTaskType] = useState("");
  const [rooms, setRooms] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");

  const handleAssign = () => {
    if (!taskType || !rooms) {
      Alert.alert("Missing fields", "Task type and rooms are required");
      return;
    }

    console.log({
      staffId: staff.id,
      staffName: staff.name,
      taskType,
      rooms,
      priority,
      notes,
    });

    Alert.alert("Success", "Task assigned successfully");
    navigation.goBack();
  };

  if (!staff) {
    return (
      <ThemedScreen>
        <View style={styles.page}>
          <Text style={styles.emptyText}>No staff data available.</Text>
        </View>
      </ThemedScreen>
    );
  }

  return (
    <ThemedScreen>
      <ThemedScrollView contentContainerStyle={styles.page}>
        <View style={styles.card}>
          <Text style={styles.title}>Assign Task</Text>

          <Text style={styles.label}>Staff</Text>
          <Text style={styles.staffName}>{staff.name}</Text>

          <TextInput
            label="Task Type"
            value={taskType}
            onChangeText={setTaskType}
            mode="outlined"
            style={styles.input}
            textColor={tokens.text}
            outlineColor={tokens.border}
          />

          <TextInput
            label="Rooms"
            value={rooms}
            onChangeText={setRooms}
            mode="outlined"
            style={styles.input}
            textColor={tokens.text}
            outlineColor={tokens.border}
          />

          <TextInput
            label="Priority"
            value={priority}
            onChangeText={setPriority}
            mode="outlined"
            style={styles.input}
            textColor={tokens.text}
            outlineColor={tokens.border}
          />

          <TextInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={[styles.input, styles.multilineInput]}
            textColor={tokens.text}
            outlineColor={tokens.border}
          />

          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              buttonColor={tokens.surface}
              textColor={tokens.text}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAssign}
              style={styles.assignButton}
              buttonColor={tokens.button}
              textColor={tokens.buttonText}
            >
              Assign
            </Button>
          </View>
        </View>
      </ThemedScrollView>
    </ThemedScreen>
  );
}

const createStyles = (tokens) =>
  StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: tokens.background,
      padding: 16,
    },
    card: {
      backgroundColor: tokens.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: tokens.border,
      padding: 18,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: tokens.heading,
      marginBottom: 16,
    },
    label: {
      color: tokens.text,
      fontSize: 14,
      marginBottom: 6,
      fontWeight: "600",
    },
    staffName: {
      color: tokens.text,
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 16,
    },
    input: {
      backgroundColor: tokens.blockSecondary,
      marginBottom: 16,
    },
    multilineInput: {
      minHeight: 100,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    cancelButton: {
      flex: 1,
      borderRadius: 10,
      borderColor: tokens.border,
      borderWidth: 1,
      marginRight: 8,
    },
    assignButton: {
      flex: 1,
      borderRadius: 10,
    },
    emptyText: {
      color: tokens.text,
      padding: 16,
      fontSize: 16,
    },
  });
