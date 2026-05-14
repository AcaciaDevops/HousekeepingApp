// src/features/staff/AssignTaskScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { TextInput, Button } from "react-native-paper";

import { fetchAllTasks, assignTasks } from "../../api/TasksApi";
import { fetchRooms } from "../../api/RoomApi";
import { fetchUserbyRole } from "../../api/UserApi";

import useAuth from "../auth/hooks/useAuth";
import { useAppTheme } from "../../context/ThemeContext";
import { useThemedStyles } from "../../utils/useThemedStyles";
import { ThemedScreen, ThemedScrollView } from "../../components/ui";

import CustomDropdown from "../../components/CustomDropdown";

export default function AssignTaskScreen({ navigation, route }) {
  const preselectedStaff = route?.params?.staff ?? null;
  const { user } = useAuth();

  const userId = user?.user_id;
  const userEmail = user?.user_email;
  const userRole = user?.user_role_name;

  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [priority, setPriority] = useState("medium");
  const [priorityDropdown, setPriorityDropdown] = useState(false);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  // dropdown states
  const [taskDropdown, setTaskDropdown] = useState(false);
  const [roomDropdown, setRoomDropdown] = useState(false);

  const { tokens } = useAppTheme();
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const task_type = userRole === "MaintenanceManager" ? "maintenance" : "housekeeping";
    const t = await fetchAllTasks(task_type);
    const r = await fetchRooms();
    setTasks(t.items || []);
    setRooms(r || []);
  }

  async function handleAssign() {
    if (!selectedTask || !selectedRoom ) {
      alert("Please select task, room and staff.");
      return;
    }

    setLoading(true);

    const taskObj = tasks.find((t) => t.id === selectedTask);

    const payload = {
      task_id: taskObj.id,
      room_id: selectedRoom,
      assigned_to: preselectedStaff.user_id,
      assigned_by: userId,
      assigned_to_email: preselectedStaff.user_email,
      assigned_by_email: userEmail,
      task_type: taskObj.task_type,
      task_name: taskObj.task_name,
      priority,
      notes,
    };

    const res = await assignTasks(payload);
    setLoading(false);

    if (res) {
      alert("Task Assigned Successfully!");
      navigation.goBack();
    }
  }

  return (
    <ThemedScreen>
      <ThemedScrollView contentContainerStyle={styles.page}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Task Details</Text>

          {/* Staff Info — static, no dropdown */}
          <View style={styles.staffInfoBox}>
            <Text style={styles.staffInfoLabel}>Assigning To</Text>
            <Text style={styles.staffInfoValue}>
              {preselectedStaff?.user_first_name} ({preselectedStaff?.user_email})
            </Text>
          </View>

          {/* Task Dropdown */}
          <CustomDropdown
            label="Select Task"
            data={tasks}
            selectedValue={selectedTask}
            visible={taskDropdown}
            setVisible={setTaskDropdown}
            onSelect={(item) => setSelectedTask(item.id)}
            renderLabel={(item) => item.task_name}
          />

          {/* Room Dropdown */}
          <CustomDropdown
            label="Select Room"
            data={rooms}
            selectedValue={selectedRoom}
            visible={roomDropdown}
            setVisible={setRoomDropdown}
            onSelect={(item) => setSelectedRoom(item.room_id)}
            renderLabel={(item) =>
              `Room ${item.room_number} (ID: ${item.room_id})`
            }
          />

          <CustomDropdown
            label="Priority"
            data={[
              { id: "high", label: "High" },
              { id: "medium", label: "Medium" },
              { id: "low", label: "Low" },
            ]}
            selectedValue={priority}
            visible={priorityDropdown}
            setVisible={setPriorityDropdown}
            onSelect={(item) => setPriority(item.id)}
            renderLabel={(item) => item.label}
          />

          {/* Notes */}
          <TextInput
            label="Notes"
            value={notes}
            multiline
            mode="outlined"
            numberOfLines={3}
            onChangeText={setNotes}
            style={[styles.input, styles.multilineInput]}
            textColor={tokens.text}
            outlineColor={tokens.border}
          />

          {/* Button */}
          <Button
            mode="contained"
            onPress={handleAssign}
            loading={loading}
            style={styles.assignButton}
            buttonColor={tokens.button}
            textColor={tokens.buttonText}
          >
            Assign Task
          </Button>
        </View>
      </ThemedScrollView>
    </ThemedScreen>
  );
}

const createStyles = (tokens) =>
  StyleSheet.create({
    page: {
      padding: 15,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 16,
      color: tokens.heading,
    },
    card: {
      backgroundColor: tokens.surface,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: tokens.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
      color: tokens.text,
    },
      staffInfoBox: {
      backgroundColor: tokens.background,
      borderWidth: 1,
      borderColor: tokens.border,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
    },
    staffInfoLabel: {
      fontSize: 12,
      color: tokens.text,
      marginBottom: 4,
    },
    staffInfoValue: {
      fontSize: 15,
      fontWeight: "600",
      color: tokens.text,
    },
    input: {
      marginBottom: 12,
      backgroundColor: tokens.surface,
    },
    multilineInput: {
      height: 90,
    },
    assignButton: {
      marginTop: 10,
      borderRadius: 8,
    },
  });