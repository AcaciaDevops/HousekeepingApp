import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { TextInput, Button, Modal, Portal } from "react-native-paper";
import { fetchAllTasks, assignTasks } from "../../api/TasksApi";
import { fetchRooms } from "../../api/RoomApi";
import { fetchUserbyRole } from "../../api/UserApi";
import useAuth from "../auth/hooks/useAuth";
import { useAppTheme } from "../../context/ThemeContext";
import { useThemedStyles } from "../../utils/useThemedStyles";
import { ThemedScreen, ThemedScrollView } from "../../components/ui";

export default function AssignTaskScreen({ navigation }) {
  const { user } = useAuth();
  const userId = user?.user_id;
  const userEmail = user?.user_email;
  const userRole = user?.user_role_name;

  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [staff, setStaff] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [priority, setPriority] = useState("medium");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  const [taskDropdown, setTaskDropdown] = useState(false);
  const [roomDropdown, setRoomDropdown] = useState(false);
  const [staffDropdown, setStaffDropdown] = useState(false);

  const { tokens } = useAppTheme();
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
     const task_type = userRole === "MaintenanceManager" ? "maintenance": "housekeeping";
    const t = await fetchAllTasks(task_type);
    const r = await fetchRooms();
    const roleName = userRole === "MaintenanceManager" ? "MaintenanceStaff" : "HousekeepingStaff";
    const s = await fetchUserbyRole(roleName);

    setTasks(t.items || []);
    setRooms(r || []);
    setStaff(s || []);
  }

  async function handleAssign() {
    if (!selectedTask || !selectedRoom || !selectedStaff) {
      alert("Please select task, room and staff.");
      return;
    }

    setLoading(true);

    const taskObj = tasks.find(t => t.id === selectedTask);
    const staffObj = staff.find(u => u.user_id === selectedStaff);

    const payload = {
      task_id: taskObj.id,
      room_id: selectedRoom,
      assigned_to: staffObj.user_id,
      assigned_by: userId,
      assigned_to_email: staffObj.user_email,
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
        <Text style={styles.title}>Assign Task</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Task details</Text>

          <TextInput
            label="Select Task"
            value={selectedTask ? tasks.find((t) => t.id === selectedTask)?.task_name : ""}
            mode="outlined"
            onPressIn={() => setTaskDropdown(true)}
            style={styles.input}
            textColor={tokens.text}
            outlineColor={tokens.border}
            editable={false}
            showSoftInputOnFocus={false}
          />

          <TextInput
            label="Select Room"
            value={selectedRoom ? `Room ${selectedRoom}` : ""}
            mode="outlined"
            style={styles.input}
            onPressIn={() => setRoomDropdown(true)}
            textColor={tokens.text}
            outlineColor={tokens.border}
            editable={false}
            showSoftInputOnFocus={false}
          />

          <TextInput
            label="Assign To Staff"
            value={
              selectedStaff
                ? staff.find((u) => u.user_id === selectedStaff)?.user_first_name
                : ""
            }
            mode="outlined"
            style={styles.input}
            onPressIn={() => setStaffDropdown(true)}
            textColor={tokens.text}
            outlineColor={tokens.border}
            editable={false}
            showSoftInputOnFocus={false}
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
            multiline
            mode="outlined"
            numberOfLines={3}
            onChangeText={setNotes}
            style={[styles.input, styles.multilineInput]}
            textColor={tokens.text}
            outlineColor={tokens.border}
          />

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

      <Portal>
        <Modal
          visible={taskDropdown}
          onDismiss={() => setTaskDropdown(false)}
          contentContainerStyle={styles.modalBox}
        >
          <Text style={styles.modalTitle}>Select Task</Text>
          {tasks.map(t => (
            <Button
              key={t.id}
              onPress={() => {
                setSelectedTask(t.id);
                setTaskDropdown(false);
              }}
              textColor={tokens.text}
            >
              {t.task_name}
            </Button>
          ))}
        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={roomDropdown}
          onDismiss={() => setRoomDropdown(false)}
          contentContainerStyle={styles.modalBox}
        >
          <Text style={styles.modalTitle}>Select Room</Text>
          <ScrollView style={styles.dropdownScroll}>
            {rooms.map(r => (
              <Button
                key={r.room_id}
                onPress={() => {
                  setSelectedRoom(r.room_id);
                  setRoomDropdown(false);
                }}
                textColor={tokens.text}
              >
                (Room Number: {r.room_number}) (ID: {r.room_id})
              </Button>
            ))}
          </ScrollView>
        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={staffDropdown}
          onDismiss={() => setStaffDropdown(false)}
          contentContainerStyle={styles.modalBox}
        >
          <Text style={styles.modalTitle}>Assign To Staff</Text>
          <ScrollView style={styles.dropdownScroll}>
            {staff.map(u => (
              <TouchableOpacity
                key={u.user_id}
                style={styles.staffItem}
                onPress={() => {
                  setSelectedStaff(u.user_id);
                  setStaffDropdown(false);
                }}
              >
                <Text style={[styles.staffName, { color: tokens.text }]}>
                  {u.user_first_name}  
                  <Text style={[styles.staffEmail, { color: tokens.link }]}>   {u.user_email}</Text>
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Modal>
      </Portal>
    </ThemedScreen>
  );
}

const createStyles = (tokens) =>
  StyleSheet.create({
    main: {
      padding: 20,
      backgroundColor: tokens.background,
    },
    spacing: {
      marginTop: 15,
    },
    input: {
      backgroundColor: tokens.surface,
    },
    assignButton: {
      borderRadius: 8,
    },
    modalBox: {
      backgroundColor: tokens.surface,
      padding: 15,
      margin: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: tokens.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 10,
      color: tokens.heading,
    },
    dropdownScroll: {
      maxHeight: 320,
    },
    staffItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
    },
    staffName: {
      fontWeight: "600",
      fontSize: 15,
    },
    staffEmail: {
      color: tokens.link,
      fontSize: 13,
      fontWeight: "400",
    },
  });
