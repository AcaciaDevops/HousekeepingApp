import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Ensure this matches your project setup
import useAuth from "../../features/auth/hooks/useAuth";
import { fetchUnReadNotifications, markReadNotifications } from "../../api/NotificationApi";
import { useAppTheme } from "../../context/ThemeContext";

export default function NotificationBell() {
  const { user } = useAuth();
  const userId = user?.user_id;
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const { tokens } = useAppTheme();
  const styles = useMemo(() => makeStyles(tokens), [tokens]);

  const loadNotifications = async () => {
    try {
      const res = await fetchUnReadNotifications(userId);
      setNotifs(res);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const handleToggle = () => {
    if (!open) loadNotifications();
    setOpen(!open);
  };

  const markAsRead = async (id) => {
    try {
      await markReadNotifications(id);
      setNotifs((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleToggle} style={styles.bell}>
        <Icon name="notifications-outline" size={28} color={tokens.icon} />
        {notifs?.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notifs?.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      {open && (
        <View style={styles.popup}>
          <Text style={styles.popupTitle}>Notifications</Text>
          <ScrollView style={styles.scroll}>
            {notifs?.length === 0 ? (
              <Text style={styles.popupText}>No unread notifications</Text>
            ) : (
              notifs.map((n) => (
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

const makeStyles = (tokens) =>
  StyleSheet.create({
    container: {
      position: "relative",
      padding: 5,
    },
    bell: {
      position: "relative",
      padding: 5,
    },
    badge: {
      position: "absolute",
      top: 0,
      right: 0,
      backgroundColor: tokens.buttonHover, // Or use a 'danger' color like Red if available
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
    },
    badgeText: {
      color: "#FFFFFF", // Hardcoded white usually looks best on red/bright badges
      fontSize: 10,
      fontWeight: "bold",
    },
    popup: {
      position: "absolute",
      top: 50,
      right: 0,
      width: 280,
      backgroundColor: tokens.surface,
      borderColor: tokens.border,
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
      color: tokens.heading,
    },
    popupText: {
      paddingVertical: 5,
      color: tokens.text,
    },
    scroll: {
      maxHeight: 250,
    },
    notifItem: {
      paddingVertical: 8,
      borderBottomColor: tokens.border,
      borderBottomWidth: 1,
    },
    notifTitle: {
      fontWeight: "bold",
      color: tokens.text,
    },
    notifMessage: {
      color: tokens.text,
    },
    notifTime: {
      color: tokens.info,
      fontSize: 10,
      marginTop: 2,
    },
  });