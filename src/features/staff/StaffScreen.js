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
    const statusColor = item.status === "Active" ? tokens.button : tokens.info;

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={[styles.status, { color: statusColor }]}>{item.status}</Text>
        </View>

        <Text style={styles.info}>{item.role} • Shift: {item.shift}</Text>
        <Text style={styles.info}>Floor: {item.floor || "N/A"}</Text>
        <Text style={styles.rooms}>Rooms: {item.rooms || "None assigned"}</Text>

        <View style={styles.taskRow}>
          <Text style={styles.task}>✔ {item.completed} Completed</Text>
          <Text style={styles.task}>⏳ {item.pending} Pending</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate("StaffDetails", { staffInfo: item })}
          >
            <Text style={styles.buttonText}>View</Text>
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
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, color: tokens.heading },
  card: { 
    backgroundColor: tokens.surface, 
    borderRadius: 12, padding: 16, marginBottom: 12, 
    borderWidth: 1, borderColor: tokens.border, elevation: 2 
  },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  name: { fontSize: 16, fontWeight: "bold", color: tokens.text },
  status: { fontWeight: "600" },
  info: { color: tokens.text, marginBottom: 2 },
  rooms: { marginTop: 6, fontWeight: "500", color: tokens.text },
  searchRow: { 
    flexDirection: "row", alignItems: "center", backgroundColor: tokens.surface, 
    borderRadius: 8, borderWidth: 1, borderColor: tokens.border, 
    paddingHorizontal: 10, marginBottom: 10 
  },
  search: { flex: 1, paddingVertical: 8, color: tokens.text },
  clear: { fontSize: 18, color: tokens.text },
  filterBtn: { 
    backgroundColor: tokens.surface, padding: 10, borderRadius: 8, 
    borderWidth: 1, borderColor: tokens.border, marginBottom: 12 
  },
  filterText: { fontWeight: "600", color: tokens.text },
  empty: { textAlign: "center", marginTop: 40, color: tokens.text, fontSize: 16 },
  taskRow: { flexDirection: "row", marginTop: 8 },
  task: { marginRight: 16, fontSize: 13, color: tokens.text },
  actions: { flexDirection: "row", marginTop: 12, justifyContent: "space-between" },
  button: { borderWidth: 1, borderColor: tokens.button, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 14 },
  buttonText: { color: tokens.button, fontWeight: "600" },
  buttonPrimary: { backgroundColor: tokens.button, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 14 },
  buttonPrimaryText: { color: tokens.buttonText, fontWeight: "600" },
});