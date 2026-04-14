// src/features/staff/StaffScreen.js
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import  useAuth  from "../../features/auth/hooks/useAuth";
import { TextInput } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Menu } from "react-native-paper";
import { fetchUserbyRole } from "../../api/UserApi";
import { fetchTasks } from "../../api/TasksApi";

const STAFF_DATA = [
  {
    id: "1",
    name: "John Doe",
    role: "Housekeeper",
    shift: "Morning",
    floor: "2",
    status: "Active",
    rooms: "101, 102, 103",
    completed: 3,
    pending: 2,
  },
  {
    id: "2",
    name: "Maria Smith",
    role: "Housekeeper",
    shift: "Evening",
    floor: "3",
    status: "On Leave",
    rooms: "301, 302",
    completed: 2,
    pending: 0,
  },
];


export default function StaffScreen() {
  const [searchText, setSearchText] = useState("");
  const [filterShift, setFilterShift] = useState("All");
  const [staff, setStaff] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useAuth();
  const userRole = user?.user_role_name;
  const navigation = useNavigation();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
     const roleName = userRole == "MaintenanceManager" ? "MaintenanceStaff": "HousekeepingStaff";
    const staffDetails = await fetchUserbyRole(roleName);
    console.log("staffDetails in staff tab::1", staffDetails)
    const allTasks = await fetchTasks("all", user);
    console.log("all task in screen : ", res)
    setStaff(staffDetails);
    console.log("staffDetails::",staffDetails)
    const staffTasks = allTasks.filter(
      task => task.assigned_to === staffDetails.user_id
    );
    console.log("staffTasks::",staffTasks)
  }
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchTasks(currentTabStatus, user);
      setTasks(res.data || []);
      setTotalTask(res.total);
    } finally {
      setLoading(false);
    }
  };
  const renderStaffCard = ({ item }) => {
    console.log("item::staffscreen", item)
    const statusColor =
      item.status === "Active" ? "#2ecc71" : "#f1c40f";

    return (
      <View style={styles.card}>
        {/* Header */}
        {console.log("staff:: details in staff tab", staff)}
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={[styles.status, { color: statusColor }]}>
            {item.status}
          </Text>
        </View>

        {/* Info */}
        <Text style={styles.info}>
          {item.role} • Shift: {item.shift}
        </Text>
        <Text style={styles.info}>Floor: {item.floor}</Text>

        {/* Rooms */}
        <Text style={styles.rooms}>Rooms: {item.rooms}</Text>

        {/* Task summary */}
        <View style={styles.taskRow}>
          <Text style={styles.task}>✔ {item.completed} Completed</Text>
          <Text style={styles.task}>⏳ {item.pending} Pending</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("StaffDetails", { staffInfo: item })
            }
          >
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() =>
              navigation.navigate("AssignTaskScreen", { staff: item })
            }
          >
            <Text style={styles.buttonPrimaryText}>Assign Task</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  };
  const filteredStaff = STAFF_DATA.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchText.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchText.toLowerCase()) ||
      staff.shift.toLowerCase().includes(searchText.toLowerCase());

    const matchesShift =
      filterShift === "All" || staff.shift === filterShift;

    return matchesSearch && matchesShift;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Staff Management</Text>
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search by name, role or shift..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.search}
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
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setMenuVisible(true)}
          >
            <Text style={styles.filterText}>Filter: {filterShift}</Text>
          </TouchableOpacity>
        }
      >
        <Menu.Item onPress={() => setFilterShift("All")} title="All" />
        <Menu.Item onPress={() => setFilterShift("Morning")} title="Morning" />
        <Menu.Item onPress={() => setFilterShift("Evening")} title="Evening" />
        <Menu.Item onPress={() => setFilterShift("Night")} title="Night" />
      </Menu>

      <FlatList
        data={filteredStaff}
        keyExtractor={(item) => item.id}
        renderItem={renderStaffCard}
        ListEmptyComponent={
          <Text style={styles.empty}>No staff found 😕</Text>
        }
      />


    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    fontWeight: "600",
  },
  info: {
    color: "#555",
    marginBottom: 2,
  },
  rooms: {
    marginTop: 6,
    fontWeight: "500",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  search: {
    flex: 1,
    paddingVertical: 8,
  },

  clear: {
    fontSize: 18,
    color: "#999",
  },

  filterBtn: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },

  filterText: {
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
    fontSize: 16,
  },

  taskRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  task: {
    marginRight: 16,
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-between",
  },
  button: {
    borderWidth: 1,
    borderColor: "#3498db",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  buttonText: {
    color: "#3498db",
    fontWeight: "600",
  },
  buttonPrimary: {
    backgroundColor: "#3498db",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  buttonPrimaryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
