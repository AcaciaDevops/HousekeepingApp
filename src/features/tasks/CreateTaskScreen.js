import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { createTask } from "../../api/TasksApi";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function CreateTaskScreen({ navigation }) {
    const { user } = useAuth();
    const userId = user?.user_id;
    const userEmail = user?.user_email;
    const taskType = user?.user_role_name == "HousekeepingManager" ? "housekeeping" : "maintance"
    const [task_name, setTaskName] = useState("");
    const [task_description, setTaskDescription] = useState("");
    const [task_notes, setTaskNotes] = useState("");

    const handleCreateTask = async () => {
        if (!task_name.trim()) {
            Alert.alert("Validation", "Task name is required.");
            return;
        }

        try {
            const payload = {
                task_name,
                task_description,
                task_notes,
                task_created_by: userId,                    // Optional: replace with actual logged-in user
                task_created_by_email: userEmail,
                task_type: taskType
            };

            const res = await createTask(payload);

            Alert.alert("Success", "Task created successfully!");
            navigation.goBack();

        } catch (err) {
            Alert.alert("Error", err.message || "Failed to create task");
        }
    };

    return (
        <View style={styles.container}>
            {console.log("user::task screen", user)}
            <Text style={styles.label}>Task Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter task name"
                value={task_name}
                onChangeText={setTaskName}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                placeholder="Short task description"
                value={task_description}
                onChangeText={setTaskDescription}
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
                style={styles.input}
                placeholder="Notes (optional)"
                value={task_notes}
                onChangeText={setTaskNotes}
            />

            <TouchableOpacity style={styles.button} onPress={handleCreateTask}>
                <Text style={styles.buttonText}>Create Task</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        marginTop: 15,
        fontWeight: "bold",
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginTop: 5,
        borderRadius: 8,
    },
    button: {
        backgroundColor: "#1976D2",
        padding: 15,
        marginTop: 30,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
