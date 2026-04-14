// src/features/tasks/TaskTabs.js
import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import TaskList from "./TaskList";

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
                    <MaterialIcons name="arrow-drop-down" size={24} color="#62ce99" />
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
                                <MaterialIcons name="close" size={24} color="#666" />
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
                                        <MaterialIcons name="check" size={20} color="#000000" />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    pickerContainer: {
        backgroundColor: '#edf9f3',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        elevation: 2,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    customPicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    selectedValue: {
        fontSize: 16,
        color: '#000000',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        backgroundColor: '#134234',
        borderRadius: 12,
        width: '85%',
        maxHeight: '80%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        overflow: 'hidden',
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#134234',
    },
    dropdownTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#d6e07e',
        
    },
    dropdownItem: {
         flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    // This is the key style - background color for selected item in dropdown
    dropdownItemSelected: {
        backgroundColor: '#d6e07e',  // Light green background for selected item
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#4bc78a',
    },
    dropdownItemTextSelected: {
        color: '#000000',  // Green text for selected item
        fontWeight: '600',
    },
});