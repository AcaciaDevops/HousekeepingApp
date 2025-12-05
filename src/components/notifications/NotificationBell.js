import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { fetchUnReadNotifications,markReadNotifications } from "../../api/NotificationApi";
import axios from "axios";

export default function NotificationBell() {
    const { user } = useAuth();
     const userId = user?.user_id;
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);

  // Fetch unread notifications for this user
  const loadNotifications = async () => {
    try {
        console.log("user::notifications::",user)
      const res = await fetchUnReadNotifications(userId)
      console.log("res::notifications::",res)
      setNotifs(res); // expects array of { id, title, message, is_read, created_at }
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  // Toggle popup
  const handleToggle = () => {
    if (!open) loadNotifications();
    setOpen(!open);
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await markReadNotifications(id)
      setNotifs((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleToggle} style={styles.bell}>
        <Text style={styles.bellText}>🔔</Text>
        {notifs?.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notifs?.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      {open && (
        <View style={styles.popup}>
          <Text style={styles.popupTitle}>Notifications</Text>
          <ScrollView style={{ maxHeight: 250 }}>
            {notifs?.length === 0 ? (
              <Text style={styles.popupText}>No unread notifications</Text>
            ) : (
             notifs && notifs.map((n) => (
                <TouchableOpacity
                  key={n.id}
                  onPress={() => markAsRead(n.id)}
                  style={styles.notifItem}
                >
                  <Text style={styles.notifTitle}>{n.title}</Text>
                  <Text style={styles.notifMessage}>{n.message}</Text>
                  <Text style={styles.notifTime}>
                    {new Date(n.created_at).toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    padding: 10,
  },
  bell: {
    position: "relative",
    alignSelf: "flex-end",
  },
  bellText: {
    fontSize: 30,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
  popup: {
    position: "absolute",
    top: 40,
    right: 0,
    width: 280,
    backgroundColor: "white",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  popupTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  popupText: {
    paddingVertical: 5,
  },
  notifItem: {
    paddingVertical: 8,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  notifTitle: {
    fontWeight: "bold",
  },
  notifMessage: {
    color: "#333",
  },
  notifTime: {
    color: "#999",
    fontSize: 10,
    marginTop: 2,
  },
});
