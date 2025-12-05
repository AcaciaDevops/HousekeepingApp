import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Menu } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function RoomCard({ room, onStatusChange }) {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

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

  const currentStatus = room.room_status;
  const currentStatusLabel = STATUS_LABELS[currentStatus] || "Unknown";
  const currentStatusStyle =
    STATUS_COLORS[currentStatus] || styles.defaultStatus;

  const statusOptions = Object.keys(STATUS_LABELS);

  // When user selects a new status
  const handleRoomStatus = (id, newStatus) => {
    setVisible(false);
    if (newStatus !== currentStatus) {
      onStatusChange(id, newStatus);
    }
  };

  return (
    <Pressable
      onPress={() => navigation.navigate("RoomDetailsScreen", { room , onStatusChange})}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressedCard, // pressed effect
      ]}
    >
        <Text style={styles.roomNumber}>Room ID{room.room_id}</Text>
      <Text style={styles.roomNumber}>Room {room.room_number}</Text>
      <Text style={styles.roomName}>{room.room_name}</Text>
      <Text style={styles.floor}>Floor: {room.room_floor_id}</Text>
      <Text style={styles.type}>{room.room_type}</Text>

      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Pressable onPress={() => setVisible(true)}>
            <View style={[styles.statusTag, currentStatusStyle]}>
              <Text style={styles.statusText}>{currentStatusLabel}</Text>
            </View>
          </Pressable>
        }
      >
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  pressedCard: {
    opacity: 0.6, // pressed effect
  },
  roomNumber: {
    fontSize: 20,
    fontWeight: "700",
  },
  roomName: {
    fontSize: 16,
    marginTop: 6,
    color: "#333",
  },
  floor: {
    fontSize: 14,
    marginTop: 4,
    color: "#666",
  },
  type: {
    fontSize: 15,
    marginTop: 4,
    color: "gray",
  },
  statusTag: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
  },
  clean: { backgroundColor: "#4CAF50" },
  dirty: { backgroundColor: "#FF9800" },
  inspection: { backgroundColor: "#f321c6ff" },
  occupied_clean: { backgroundColor: "#2196F3" },
  occupied_dirty: { backgroundColor: "#F44336" },
  defaultStatus: { backgroundColor: "#607D8B" },
});
