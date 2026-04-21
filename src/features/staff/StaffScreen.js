// src/features/staff/StaffScreen.js
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../../features/auth/hooks/useAuth";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput 
} from "react-native";
import { Menu } from "react-native-paper";
import { fetchUserbyRole } from "../../api/UserApi";
import { fetchTasks } from "../../api/TasksApi";
import { useAppTheme } from "../../context/ThemeContext";
import { useThemedStyles } from "../../utils/useThemedStyles";
import { ThemedScreen } from "../../components/ui";

const STAFF_DATA = [
  { id: "1", name: "John Doe", role: "Housekeeper", shift: "Morning", floor: "2", status: "Active", rooms: "101, 102, 103", completed: 3, pending: 2 },
  { id: "2", name: "Maria Smith", role: "Housekeeper", shift: "Evening", floor: "3", status: "On Leave", rooms: "301, 302", completed: 2, pending: 0 },
];

export default function StaffScreen() {
  const [searchText, setSearchText] = useState("");
  const [filterShift, setFilterShift] = useState("All");
  const [staff, setStaff] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  
  const { user } = useAuth();
  const userRole = user?.user_role_name;
  const navigation = useNavigation();
  const { tokens } = useAppTheme();
  const styles = useThemedStyles((themeTokens) => createStaffStyles(themeTokens));

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const roleName = userRole === "MaintenanceManager" ? "MaintenanceStaff" : "HousekeepingStaff";
      
      // 1. Fetch Staff and Tasks
      const staffDetails = await fetchUserbyRole(roleName);
      const allTasksResponse = await fetchTasks("all", user);
      const allTasks = allTasksResponse?.data || allTasksResponse || [];

      // 2. Map API data to match UI expectations (Normalization)
      const processedStaff = (staffDetails || []).map((member) => {
        // Find tasks assigned to this specific member
        const memberTasks = allTasks.filter(task => task.assigned_to === member.user_id);
        
        return {
          ...member,
          id: member.user_id?.toString() || Math.random().toString(),
          name: member.user_first_name || member.name || "Unknown",
          role: member.user_role_name || member.role || "Staff",
          shift: member.shift || "Morning", // Fallback if API doesn't provide shift
          status: member.status || "Active",
          completed: memberTasks.filter(t => t.status === "Completed").length,
          pending: memberTasks.filter(t => t.status === "Pending" || t.status === "In Progress").length,
        };
      });

      setStaff(processedStaff);
    } catch (error) {
      console.error("Staff load error:", error);
    }
  }

  const renderStaffCard = ({ item }) => {
    const statusColor = item.status === "Active" ? tokens.success : tokens.warning;

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={[styles.status, { color: statusColor }]}>{item.status}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.info}>{item.role}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.info}>Shift: {item.shift}</Text>
        </View>
        
        <Text style={styles.floorText}>Floor: {item.floor || "N/A"}</Text>
        <Text style={styles.roomsText}>Rooms: {item.rooms || "None assigned"}</Text>

        <View style={styles.taskRow}>
          <View style={styles.taskItem}>
            <Text style={[styles.taskIcon, { color: tokens.success }]}>✔</Text>
            <Text style={styles.taskText}>{item.completed} Completed</Text>
          </View>
          <View style={styles.taskItem}>
            <Text style={[styles.taskIcon, { color: tokens.warning }]}>⏳</Text>
            <Text style={styles.taskText}>{item.pending} Pending</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate("StaffDetails", { staffInfo: item })}
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.buttonPrimary} 
            onPress={() => navigation.navigate("AssignTaskScreen", { staff: item })}
          >
            <Text style={styles.buttonPrimaryText}>Assign Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Filter the fetched staff (fall back to mock data if API is empty)
  const availableData = staff.length > 0 ? staff : STAFF_DATA;
  
  const filteredStaff = availableData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.role.toLowerCase().includes(searchText.toLowerCase());

    const matchesShift = filterShift === "All" || item.shift === filterShift;

    return matchesSearch && matchesShift;
  });

  return (
    <ThemedScreen>
      <View style={styles.container}>
        <Text style={styles.title}>Staff Management</Text>
        
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search by name or role..."
            value={searchText}
            onChangeText={setSearchText}
            style={styles.search}
            placeholderTextColor={tokens.info}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Text style={styles.clear}>✖</Text>
            </TouchableOpacity>
          )}
        </View>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity style={styles.filterBtn} onPress={() => setMenuVisible(true)}>
              <Text style={styles.filterText}>Filter: {filterShift}</Text>
            </TouchableOpacity>
          }
        >
          {["All", "Morning", "Evening", "Night"].map((s) => (
            <Menu.Item 
              key={s} 
              onPress={() => { setFilterShift(s); setMenuVisible(false); }} 
              title={s} 
            />
          ))}
        </Menu>

        <FlatList
          data={filteredStaff}
          keyExtractor={(item) => item.id}
          renderItem={renderStaffCard}
          ListEmptyComponent={<Text style={styles.empty}>No staff found 😕</Text>}
        />
      </View>
    </ThemedScreen>
  );
}

const createStaffStyles = (tokens) => StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: tokens.background },
  title: { 
    fontSize: tokens.fonts.titleLarge.fontSize, 
    fontWeight: tokens.fonts.titleLarge.fontWeight,
    fontFamily: tokens.fonts.titleLarge.fontFamily,
    marginBottom: 16, 
    color: tokens.heading,
    textAlign: 'center'
  },
  card: { 
    backgroundColor: tokens.surface, 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: tokens.border, 
    elevation: 2,
    shadowColor: tokens.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 8 
  },
  name: { 
    fontSize: tokens.fonts.titleMedium.fontSize, 
    fontWeight: tokens.fonts.titleMedium.fontWeight,
    fontFamily: tokens.fonts.titleMedium.fontFamily,
    color: tokens.text 
  },
  status: { 
    fontSize: tokens.fonts.labelMedium.fontSize,
    fontWeight: tokens.fonts.labelMedium.fontWeight,
    fontFamily: tokens.fonts.labelMedium.fontFamily,
    textTransform: 'uppercase'
  },
  infoRow: { 
    flexDirection: "row", 
    alignItems: "center",
    marginBottom: 6 
  },
  info: { 
    fontSize: tokens.fonts.bodyMedium.fontSize,
    fontFamily: tokens.fonts.bodyMedium.fontFamily,
    color: tokens.text,
    marginRight: 4
  },
  floorText: { 
    fontSize: tokens.fonts.bodyMedium.fontSize,
    fontFamily: tokens.fonts.bodyMedium.fontFamily,
    color: tokens.text,
    marginBottom: 4,
    fontWeight: '500'
  },
  roomsText: { 
    fontSize: tokens.fonts.bodyMedium.fontSize,
    fontFamily: tokens.fonts.bodyMedium.fontFamily,
    color: tokens.text,
    marginBottom: 8,
    fontWeight: '500'
  },
  taskRow: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: tokens.border
  },
  taskItem: { 
    flexDirection: "row", 
    alignItems: "center",
    flex: 1
  },
  taskIcon: { 
    fontSize: 16, 
    marginRight: 4 
  },
  taskText: { 
    fontSize: tokens.fonts.bodySmall.fontSize,
    fontFamily: tokens.fonts.bodySmall.fontFamily,
    color: tokens.text,
    fontWeight: '500'
  },
  searchRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: tokens.surface, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: tokens.border, 
    paddingHorizontal: 12, 
    marginBottom: 12,
    minHeight: 44
  },
  search: { 
    flex: 1, 
    paddingVertical: 10, 
    color: tokens.text,
    fontSize: tokens.fonts.bodyMedium.fontSize,
    fontFamily: tokens.fonts.bodyMedium.fontFamily
  },
  clear: { 
    fontSize: 18, 
    color: tokens.textSecondary,
    padding: 4
  },
  filterBtn: { 
    backgroundColor: tokens.surface, 
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: tokens.border, 
    marginBottom: 12,
    alignSelf: 'flex-start'
  },
  filterText: { 
    fontSize: tokens.fonts.labelMedium.fontSize,
    fontFamily: tokens.fonts.labelMedium.fontFamily,
    fontWeight: tokens.fonts.labelMedium.fontWeight,
    color: tokens.text 
  },
  empty: { 
    textAlign: "center", 
    marginTop: 40, 
    color: tokens.textSecondary, 
    fontSize: tokens.fonts.bodyLarge.fontSize,
    fontFamily: tokens.fonts.bodyLarge.fontFamily
  },
  actions: { 
    flexDirection: "row", 
    marginTop: 12, 
    justifyContent: "space-between",
    gap: 8
  },
  button: { 
    borderWidth: 1, 
    borderColor: tokens.button, 
    borderRadius: 6, 
    paddingVertical: 8, 
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center'
  },
  buttonText: { 
    color: tokens.button, 
    fontSize: tokens.fonts.labelMedium.fontSize,
    fontFamily: tokens.fonts.labelMedium.fontFamily,
    fontWeight: tokens.fonts.labelMedium.fontWeight
  },
  buttonPrimary: { 
    backgroundColor: tokens.button, 
    borderRadius: 6, 
    paddingVertical: 8, 
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center'
  },
  buttonPrimaryText: { 
    color: tokens.buttonText, 
    fontSize: tokens.fonts.labelMedium.fontSize,
    fontFamily: tokens.fonts.labelMedium.fontFamily,
    fontWeight: tokens.fonts.labelMedium.fontWeight
  },
});