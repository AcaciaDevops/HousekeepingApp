// src/features/tasks/TaskTabs.js
import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import TaskList from "./TaskList";
import { useAppTheme } from "../../context/ThemeContext";
import { useThemedStyles } from "../../utils/useThemedStyles";

const TABS = [
    { key: "all", label: "All Tasks", status: "all" },
    { key: "pending", label: "Pending", status: "pending" },
    { key: "in_progress", label: "In Progress", status: "in_progress" },
    { key: "completed", label: "Completed", status: "completed" },
    { key: "under_review", label: "Awaiting Confirmation", status: "under_review" },
    { key: "approved", label: "Approved", status: "approved" },
    { key: "rejected", label: "Rejected", status: "rejected" },
    { key: "reassigned", label: "Re Assign", status: "reassigned" },
];

export default function TaskTabs() {
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const { tokens } = useAppTheme();
    const styles = useThemedStyles(createTaskTabsStyles);
    
    const currentLabel = TABS.find(tab => tab.status === selectedStatus)?.label || "All Tasks";

    const handleSelect = (status) => {
        setSelectedStatus(status);
        setDropdownVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Filter Tasks:</Text>
                
                {/* Custom dropdown button */}
                <TouchableOpacity 
                    style={styles.customPicker}
                    onPress={() => setDropdownVisible(true)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.selectedValue}>{currentLabel}</Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color={tokens.icon} />
                </TouchableOpacity>
            </View>

            {/* Custom Dropdown Modal */}
            <Modal
                visible={dropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setDropdownVisible(false)}
                >
                    <View style={styles.dropdown}>
                        <View style={styles.dropdownHeader}>
                            <Text style={styles.dropdownTitle}>Select Task Status</Text>
                            <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                                <MaterialIcons name="close" size={24} color={tokens.icon} />
                            </TouchableOpacity>
                        </View>
                        
                        <FlatList
                            data={TABS}
                            keyExtractor={(item) => item.key}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.dropdownItem,
                                        selectedStatus === item.status && styles.dropdownItemSelected
                                    ]}
                                    onPress={() => handleSelect(item.status)}
                                >
                                    <Text style={[
                                        styles.dropdownItemText,
                                        selectedStatus === item.status && styles.dropdownItemTextSelected
                                    ]}>
                                        {item.label}
                                    </Text>
                                    {selectedStatus === item.status && (
                                        <MaterialIcons name="check" size={20} color={tokens.text} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
            
            <TaskList route={{ params: { status: selectedStatus } }} />
        </View>
    );
}

const createTaskTabsStyles = (tokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.blockSecondary,
    },
    pickerContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
      elevation: 2,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: tokens.text,
      marginBottom: 8,
    },
    customPicker: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: tokens.surface,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: tokens.border,
    },
    selectedValue: {
      fontSize: 16,
      color: tokens.text,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    dropdown: {
      backgroundColor: tokens.surface,
      borderRadius: 12,
      width: "85%",
      maxHeight: "80%",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      overflow: "hidden",
    },
    dropdownHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
      backgroundColor: tokens.header,
    },
    dropdownTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: tokens.heading,
    },
    dropdownItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
    },
    dropdownItemSelected: {
      backgroundColor: tokens.button,
    },
    dropdownItemText: {
      fontSize: 16,
      color: tokens.text,
    },
    dropdownItemTextSelected: {
      color: tokens.buttonText,
      fontWeight: "600",
    },
  });
