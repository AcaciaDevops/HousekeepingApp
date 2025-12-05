import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, FlatList, ActivityIndicator } from "react-native";
import { Menu, Button } from "react-native-paper";
import { fetchTaskInfo } from "../../api/TasksApi";
import { updateRoomStatus } from "../../api/RoomApi";
import AddTaskComponent from "../../components/tasks/AddTask"

export default function RoomDetailsScreen({ route }) {
    const { room } = route.params;
    const{onStatusChange} = route.params;
{console.log(" route.params:", route.params)}
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [currentStatus, setCurrentStatus] = useState(room.room_status);
    const [statusMenuVisible, setStatusMenuVisible] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [taskModalVisible, setTaskModalVisible] = useState(false);

    async function loadRoomTasks() {
        try {
            setLoadingTasks(true);
            const res = await fetchTaskInfo(room.room_id);
            setTasks(res.data || []);
        } catch (err) {
            console.error("Failed to load tasks:", err);
        } finally {
            setLoadingTasks(false);
        }
    }

    useEffect(() => {
        loadRoomTasks();
    }, [room.room_id]);
    // Status colors for UI
  // Status colors for UI
  const STATUS_COLORS = {
    vacant_clean: styles.clean,
    vacant_dirty: styles.dirty,
    inspection: styles.inspection,
    occupied_clean: styles.occupied_clean,
    occupied_dirty: styles.occupied_dirty,
  };
  // Label mapping for display
  const STATUS_LABELS = {
    vacant_clean: "Vacant Clean",
    vacant_dirty: "Vacant Dirty",
    inspection: "Inspection",
    occupied_clean: "Occupied Clean",
    occupied_dirty: "Occupied Dirty",
  };

  const currentroomStatus = room.room_status;
  const currentStatusLabel = STATUS_LABELS[currentroomStatus] || "Unknown";
  const currentStatusStyle =
    STATUS_COLORS[currentroomStatus] || styles.defaultStatus;

  const statusOptions = Object.keys(STATUS_LABELS);

    /* Handle room status change */
    async function handleStatusChange(room_id, newStatus) {
        if (newStatus === currentroomStatus) return;

        setUpdatingStatus(true);
        try {
            await updateRoomStatus(room_id, newStatus); // call your API
            setCurrentStatus(newStatus); // update local state
            setStatusMenuVisible(false);
        } catch (err) {
            console.error("Failed to update room status:", err);
        } finally {
            setUpdatingStatus(false);
        }
    }
 
const handleRoomStatus = (id, newStatus) => {
    setStatusMenuVisible(false);
    if (newStatus !== currentStatus) {
      onStatusChange(id, newStatus);
       setCurrentStatus(newStatus); // update local state
       setStatusMenuVisible(false);
    }
  };

    return (
        <ScrollView style={styles.container}>

            {/* Room Header */}
            <View style={styles.header}>
                <Text style={styles.roomName}>{room.room_name}</Text>

                {/* Status Badge + Dropdown */}
                <Menu
                    visible={statusMenuVisible}
                    onDismiss={() => setStatusMenuVisible(false)}
                    anchor={
                        <Button
                            mode="contained"
                            style={[styles.statusBadge, getStatusColor(currentStatus)]}
                            onPress={() => setStatusMenuVisible(true)}
                            loading={updatingStatus}
                        >
                            {currentStatus.replace("_", " ")}
                        </Button>
                    }
                >
                    {/* {["vacant_clean", "vacant_dirty", "occupied_clean", "occupied_dirty"].map((s) => (
                        <Menu.Item
                            key={s}
                            title={s.replace("_", " ")}
                            onPress={() => handleStatusChange(s)}
                            disabled={s === currentStatus}
                        />
                    ))} */}
                     {statusOptions.map((option) => (
                              <Menu.Item
                                key={option}
                                onPress={() => handleRoomStatus(room.room_id, option)}
                                title={
                                  STATUS_LABELS[option] +
                                  (option === currentStatus ? " (current)" : "")
                                }
                                disabled={option === currentStatus}
                              />
                            ))}
                </Menu>
            </View>

            {/* Room Details */}
            <View style={styles.section}>
                <DetailRow label="Room ID" value={room.room_id} />
                <DetailRow label="Room Number" value={room.room_number} />
                <DetailRow label="Room Type" value={room.room_type} />
                <DetailRow label="Floor ID" value={room.room_floor_id} />
            </View>

            {/* Room Coordinates */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Room Coordinates</Text>
                <Text style={styles.coordinates}>{room.room_coordinates}</Text>
            </View>

            {/* Room Notes */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Room Notes</Text>
                <Text style={styles.notes}>{room.room_notes || "No notes added"}</Text>
            </View>

            {/* Room Plan Image */}
            {room.room_roomplan_location && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Room Plan</Text>
                    <Image
                        source={{ uri: `https://your-server-url.com/roomplans/${room.room_roomplan_location}` }}
                        style={styles.roomImage}
                        resizeMode="contain"
                    />
                </View>
            )}

            {/* Room Tasks */}
            <View style={styles.section}>
                <Button
                    mode="contained"
                    icon="plus"
                    style={{ marginVertical: 10 }}
                    onPress={() => setTaskModalVisible(true)}
                >
                    Add Task
                </Button>
                <AddTaskComponent
                    roomId={room.room_id}
                    visible={taskModalVisible}
                    onClose={() => setTaskModalVisible(false)}
                    onSuccess={() => {
                        // Refresh tasks list in this screen
                        loadRoomTasks();
                    }}
                    role_name={"HousekeepingStaff"}

                />
                {console.log("room details in room detail screen: ", room.room_id)}
                <Text style={styles.sectionTitle}>Tasks</Text>
                {loadingTasks ? (
                    <ActivityIndicator size="small" color="#2196F3" style={{ marginTop: 10 }} />
                ) : tasks.length === 0 ? (
                    <Text style={{ color: "#555", marginTop: 10 }}>No tasks assigned for this room.</Text>
                ) : (
                    <FlatList
                        data={tasks}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false} // inside ScrollView
                        renderItem={({ item }) => <TaskCard task={item} />}
                    />
                )}
            </View>

        </ScrollView>
    );
}

/* Detail row reusable component */
function DetailRow({ label, value }) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );
}

/* Task Card component */
function TaskCard({ task }) {
    return (
        <View style={styles.taskCard}>
            <View style={styles.taskHeader}>
                <Text style={styles.taskName}>{task.task_name}</Text>
                <View style={[styles.taskStatus, getTaskStatusColor(task.task_status)]}>
                    <Text style={styles.taskStatusText}>{task.task_status}</Text>
                </View>
            </View>
            <Text style={styles.taskPriority}>Priority: {task.priority}</Text>
            {task.notes ? <Text style={styles.taskNotes}>Notes: {task.notes}</Text> : null}
            <Text style={styles.taskTimestamp}>Assigned at: {new Date(task.assigned_at).toLocaleString()}</Text>
        </View>
    );
}

/* Room status colors */
function getStatusColor(status) {
    switch (status) {
        case "vacant_clean": return { backgroundColor: "#4CAF50" };
        case "vacant_dirty": return { backgroundColor: "#FF9800" };
        case "occupied_dirty": return { backgroundColor: "#F44336" };
        case "occupied_clean": return { backgroundColor: "#2196F3" };
         case "inspection": return { backgroundColor: "#f321c6ff" };
        default: return { backgroundColor: "#607D8B" };
    }
}

/* Task status colors */
function getTaskStatusColor(status) {
    switch (status) {
        case "pending": return { backgroundColor: "#FF9800" };
        case "started": return { backgroundColor: "#2196F3" };
        case "completed": return { backgroundColor: "#4CAF50" };
        case "under_review": return { backgroundColor: "#9C27B0" };
        case "approved": return { backgroundColor: "#009688" };
        case "rejected": return { backgroundColor: "#F44336" };
        default: return { backgroundColor: "#607D8B" };
    }
}

/* Styles */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F7F7" },
    header: { padding: 20, backgroundColor: "white", borderBottomWidth: 1, borderColor: "#eee" },
    roomName: { fontSize: 26, fontWeight: "700", marginBottom: 10, color: "#333" },
    statusBadge: { alignSelf: "flex-start", borderRadius: 20 },
    statusText: { color: "white", fontWeight: "600", textTransform: "capitalize" },
    section: { backgroundColor: "white", padding: 16, marginTop: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#eee" },
    sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
    detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
    detailLabel: { fontSize: 16, color: "#555" },
    detailValue: { fontSize: 16, fontWeight: "500", color: "#222" },
    coordinates: { color: "#444", lineHeight: 22 },
    notes: { color: "#555", fontSize: 15, lineHeight: 22 },
    roomImage: { width: "100%", height: 250, marginTop: 10, borderRadius: 10, backgroundColor: "#ddd" },
    taskCard: { backgroundColor: "#f9f9f9", padding: 12, marginVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: "#eee" },
    taskHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
    taskName: { fontSize: 16, fontWeight: "600", color: "#333" },
    taskStatus: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 12 },
    taskStatusText: { color: "#fff", fontSize: 12, fontWeight: "600", textTransform: "capitalize" },
    taskPriority: { fontSize: 14, color: "#555" },
    taskNotes: { fontSize: 14, color: "#444" },
    taskTimestamp: { fontSize: 12, color: "#888", marginTop: 4 },
});
