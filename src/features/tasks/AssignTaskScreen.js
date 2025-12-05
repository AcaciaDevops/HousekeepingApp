import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput, Button, Modal, Portal } from "react-native-paper";
import { fetchAllTasks, assignTasks } from "../../api/TasksApi";
import { fetchRooms } from "../../api/RoomApi";
import { fetchUserbyRole } from "../../api/UserApi";
import { useAuth } from "../auth/hooks/useAuth";

export default function AssignTaskScreen({ navigation }) {
  const { user } = useAuth();
  const userId = user?.user_id;
  const userEmail = user?.user_email;

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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const t = await fetchAllTasks();
    const r = await fetchRooms();
    console.log("rooms::in assign",r)
    const s = await fetchUserbyRole("HousekeepingStaff");

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

    console.log("Assign Task Payload:", payload);

    const res = await assignTasks(payload);
    setLoading(false);

    if (res) {
      alert("Task Assigned Successfully!");
      navigation.goBack();
    }
  }

  return (
    <View style={styles.main}>
      
    

      <ScrollView contentContainerStyle={{ padding: 20 }}>

        {/* Select Task */}
        <TextInput
          label="Select Task"
          value={selectedTask ? tasks.find(t => t.id === selectedTask)?.task_name : ""}
          mode="outlined"
          onPressIn={() => setTaskDropdown(true)}
        />

        {/* Select Room */}
        <TextInput
          label="Select Room"
          value={selectedRoom ? `Room ${selectedRoom}` : ""}
          mode="outlined"
          style={{ marginTop: 15 }}
          onPressIn={() => setRoomDropdown(true)}
        />

        {/* Select Staff */}
        <TextInput
          label="Assign To Staff"
          value={
            selectedStaff
              ? staff.find(u => u.user_id === selectedStaff)?.user_first_name
              : ""
          }
          mode="outlined"
          style={{ marginTop: 15 }}
          onPressIn={() => setStaffDropdown(true)}
        />

        {/* Priority */}
        <TextInput
          label="Priority (low / medium / high)"
          value={priority}
          onChangeText={setPriority}
          mode="outlined"
          style={{ marginTop: 15 }}
        />

        {/* Notes */}
        <TextInput
          label="Notes"
          value={notes}
          multiline
          mode="outlined"
          numberOfLines={3}
          onChangeText={setNotes}
          style={{ marginTop: 15 }}
        />

        <Button
          mode="contained"
          onPress={handleAssign}
          loading={loading}
          style={{ marginTop: 25 }}
        >
          Assign Task
        </Button>
      </ScrollView>

      {/* --- TASK DROPDOWN --- */}
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
            >
              {t.task_name}
            </Button>
          ))}
        </Modal>
      </Portal>

      {/* --- ROOM DROPDOWN --- */}
      <Portal>
        <Modal
          visible={roomDropdown}
          onDismiss={() => setRoomDropdown(false)}
          contentContainerStyle={styles.modalBox}
        >
          <Text style={styles.modalTitle}>Select Room</Text>
          <ScrollView style={{ maxHeight: 250 }}>
            {rooms.map(r => (
              <Button
                key={r.room_id}
                onPress={() => {
                  setSelectedRoom(r.room_id);
                  setRoomDropdown(false);
                }}
              >
                (Room Number: {r.room_number}) (ID: {r.room_id})
              </Button>
            ))}
          </ScrollView>
        </Modal>
      </Portal>

      {/* --- STAFF DROPDOWN --- */}
      <Portal>
        <Modal
          visible={staffDropdown}
          onDismiss={() => setStaffDropdown(false)}
          contentContainerStyle={styles.modalBox}
        >
          <Text style={styles.modalTitle}>Assign To Staff</Text>
          <ScrollView style={{ maxHeight: 250 }}>
            {staff.map(u => (
              <TouchableOpacity
                key={u.user_id}
                style={styles.staffItem}
                onPress={() => {
                  setSelectedStaff(u.user_id);
                  setStaffDropdown(false);
                }}
              >
                <Text style={{ fontWeight: "600" }}>
                  {u.user_first_name}  
                  <Text style={{ color: "blue" }}>   {u.user_email}</Text>
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Modal>
      </Portal>

    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingTop: 25,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },

  modalBox: {
    backgroundColor: "white",
    padding: 15,
    margin: 20,
    borderRadius: 12,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  staffItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});
