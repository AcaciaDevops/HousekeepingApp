import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";

export default function AssignTaskScreen({ route, navigation }) {
  const  staff  = route?.params?.staff;
  if (!staff) {
    return <Text>No staff data</Text>;
  }
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

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Assign Task</Text> */}

      <Text style={styles.staff}>Staff: {staff.name}</Text>

      <TextInput
        placeholder="Task Type (e.g. Deep Cleaning)"
        value={taskType}
        onChangeText={setTaskType}
        style={styles.input}
      />

      <TextInput
        placeholder="Rooms (e.g. 101,102)"
        value={rooms}
        onChangeText={setRooms}
        style={styles.input}
      />

      <TextInput
        placeholder="Priority (Low / Medium / High)"
        value={priority}
        onChangeText={setPriority}
        style={styles.input}
      />

      <TextInput
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancel} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.assign} onPress={handleAssign}>
          <Text style={styles.assignText}>Assign</Text>
        </TouchableOpacity>
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
    marginBottom: 12,
  },
  staff: {
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancel: {
    padding: 12,
  },
  cancelText: {
    color: "#888",
    fontWeight: "600",
  },
  assign: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
  },
  assignText: {
    color: "#fff",
    fontWeight: "600",
  },
});
