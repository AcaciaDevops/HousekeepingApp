import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Menu } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../context/ThemeContext";
import { useThemedStyles } from "../../utils/useThemedStyles";

export default function RoomCard({ room, onStatusChange }) {
  const navigation = useNavigation();
  const { tokens } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const [visible, setVisible] = useState(false);

  // Status colors for UI
  const STATUS_COLORS = {
    vacant_clean: tokens.status.vacantClean,
    vacant_dirty: tokens.status.vacantDirty,
    inspection: tokens.status.inspection,
    occupied_clean: tokens.status.occupiedClean,
    occupied_dirty: tokens.status.occupiedDirty,
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
  const currentStatusColor = STATUS_COLORS[currentStatus] || tokens.status.inspection;

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
      onPress={() => navigation.navigate("RoomDetailsScreen", { room, onStatusChange })}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressedCard,
      ]}
    >
      <Text style={styles.roomNumber}>Room {room.room_number}</Text>
      <Text style={styles.roomName}>{room.room_name}</Text>
      <Text style={styles.floor}>Floor: {room.room_floor_id}</Text>
      <Text style={styles.type}>{room.room_type}</Text>

      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Pressable onPress={() => setVisible(true)}>
            <View style={[styles.statusTag, { backgroundColor: currentStatusColor }]}>
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

const createStyles = (tokens) =>
  StyleSheet.create({
    card: {
      backgroundColor: tokens.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: tokens.border,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    pressedCard: {
      opacity: 0.7,
    },
    roomNumber: {
      fontSize: 18,
      fontWeight: "700",
      color: tokens.heading,
    },
    roomName: {
      fontSize: 16,
      marginTop: 6,
      color: tokens.text,
      fontWeight: "600",
    },
    floor: {
      fontSize: 14,
      marginTop: 4,
      color: tokens.text,
    },
    type: {
      fontSize: 14,
      marginTop: 4,
      color: tokens.info,
    },
    statusTag: {
      alignSelf: "flex-start",
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 8,
      marginTop: 12,
    },
    statusText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 13,
    },
  });
