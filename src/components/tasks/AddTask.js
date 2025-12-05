import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "../../features/auth/hooks/useAuth";
import {
  Modal,
  Portal,
  TextInput,
  Button,
  Text
} from "react-native-paper";

import {
  fetchAllTasks,
  assignTasks
} from "../../api/TasksApi";
import { fetchUserbyRole } from "../../api/UserApi";

export default function AddTaskComponent({
  roomId,
  visible,
  onClose,
  onSuccess,
  role_name
}) {
   const { user } = useAuth();
     const userId = user?.user_id;
     const userEmail = user?.user_email
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [priority, setPriority] = useState("medium");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);

  useEffect(() => {
    console.log("role_name::addtaskcomponent", roomId)
    if (visible) loadData();
  }, [visible]);

  async function loadData() {
    const t = await fetchAllTasks();
    const s = await fetchUserbyRole(role_name);
    console.log("all task fetched in add task screen : ", t)
    console.log("all task users in add task screen : ", s)
    setTasks(t.items);
    setStaff(s);
  }
async function handleAssign() {
  if (!selectedTask || !selectedStaff) {
    alert("Please select both task and staff.");
    return;
  }

  setLoading(true);

  // Find selected task object
  const taskObj = tasks.find(t => t.id === selectedTask);
  // Find selected staff object
  const staffObj = staff.find(u => u.user_id === selectedStaff);

  // Assuming the logged-in user info is available somewhere
  // For example, you can pass it as a prop: currentUser
  // or fetch from auth context
  const assignedBy = userId; // replace with actual logged-in user ID
  const assignedByEmail = userEmail; // replace with actual logged-in user email

  const payload = {
    task_id: taskObj.id,
    room_id:roomId,
    assigned_to: staffObj.user_id,
    assigned_by: assignedBy,
    assigned_to_email: staffObj.user_email,
    assigned_by_email: assignedByEmail,
    task_type: taskObj.task_type,
    task_name: taskObj.task_name,
    priority,
    notes,
  };

  console.log("payload :: assign task :: ", payload);

  const res = await assignTasks(payload);

  setLoading(false);

  if (res) {
    onSuccess && onSuccess();
    onClose();
    resetForm();
  }
}


  function resetForm() {
    setSelectedTask(null);
    setSelectedStaff(null);
    setPriority("medium");
    setNotes("");
  }

  return (
    <Portal>
       {console.log("roomId :: 123", roomId)}
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.modalContainer}
      >
        <Text style={styles.title}>Assign Task</Text>

        {/* Task Dropdown */}
        <TextInput
          label="Select Task"
          mode="outlined"
          value={selectedTask ? tasks.find(t => t.id === selectedTask)?.task_name : ""}
          onPressIn={() => setShowTaskDropdown(true)}
        />

        {/* Staff Dropdown */}
        <TextInput
          label="Assign To"
          mode="outlined"
          value={
            selectedStaff
              ? staff.find(u => u.user_id === selectedStaff)?.user_first_name
              : ""
          }
          onPressIn={() => setShowStaffDropdown(true)}
        />

        {/* Priority */}
        <TextInput
          label="Priority (low, medium, high)"
          mode="outlined"
          value={priority}
          onChangeText={setPriority}
          style={{ marginTop: 10 }}
        />

        {/* Notes */}
        <TextInput
          label="Notes"
          mode="outlined"
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
          style={{ marginTop: 10 }}
        />

        <Button
          mode="contained"
          loading={loading}
          style={{ marginTop: 20 }}
          onPress={handleAssign}
        >
          Assign Task
        </Button>
      </Modal>

      {/* Task List Modal */}
      <Modal
        visible={showTaskDropdown}
        onDismiss={() => setShowTaskDropdown(false)}
        contentContainerStyle={styles.listModal}
      >
        {tasks.map(t => (
          <Button
            key={t.id}
            onPress={() => {
              setSelectedTask(t.id);
              setShowTaskDropdown(false);
            }}
          >
            {t.task_name}
          </Button>
        ))}
      </Modal>

      {/* Staff List Modal */}
      <Modal
        visible={showStaffDropdown}
        onDismiss={() => setShowStaffDropdown(false)}
        contentContainerStyle={styles.listModal}
      >
        <Text style={styles.modalTitle}>Select Staff</Text>
        <ScrollView style={{ maxHeight: 300 }}>
          {staff.map(u => (
            <TouchableOpacity
              key={u.user_id}
              style={styles.staffItem}
              onPress={() => {
                setSelectedStaff(u.user_id);
                setShowStaffDropdown(false);
              }}
            >
              <View>
                
                <Text style={{ fontWeight: 'bold' }}>
                 {u.user_first_name}
                  <Text style={{ color: 'blue' }}>   {u.user_email}</Text>
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Modal>

    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  listModal: {
    backgroundColor: "white",
    padding: 10,
    margin: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
});
