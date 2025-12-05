// src/features/dashboard/DashboardScreen.js
import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import KPIcard from "../../components/dashboard/KPIcard.js";
import NotificationBell from "../../components/notifications/NotificationBell.js";
import { fetchTotalRooms, fetchTotalVacantCleanRooms, fetchTotalVacantDirtyRooms, fetchTotalInspectionRooms } from "../../api/RoomApi";
import { fetchTotalProgressTaskRooms, fetchTotalPendingTaskRooms } from "../../api/TasksApi.js";

export default function DashboardScreen() {
  const [totalRooms, setTotalRooms] = useState();
  const [totalCleanRooms, setTotalCleanRooms] = useState();
  const [totalDirtyRooms, setTotalDirtyRooms] = useState();
  const [totalInspectionRooms, setTotalInspectionRooms] = useState();
  const [totalProgressTaskRooms, setTotalProgressTaskRooms] = useState();
  const [totalPendingTaskRooms, setTotalPendingTaskRooms] = useState();
  useEffect(() => {
    loadTotalRooms();
    loadTotalVacantDirtyRooms();
    loadTotalVacantCleanRooms();
    loadTotalInspectionRooms();
    loadTotalProgressTaskRooms();
    loadTotalPendingTaskRooms();
  }, []);

  const kpis = [
    { label: "Total Rooms", value: totalRooms ? totalRooms : 0 },
    { label: "Clean Rooms", value: totalCleanRooms ? totalCleanRooms : 0 },
    { label: "Dirty Rooms", value: totalDirtyRooms ? totalDirtyRooms : 0 },
    { label: "In Progress", value: totalProgressTaskRooms ? totalProgressTaskRooms : 0 },
    { label: "Pending Inspections", value: totalInspectionRooms ? totalInspectionRooms : 0 },
    { label: "Staff Active Today", value: 6 },
    { label: "Pending Tasks", value: totalPendingTaskRooms ? totalPendingTaskRooms : 0 },
    { label: "Alerts", value: 1 },
  ];

  async function loadTotalRooms() {
    try {
      const data = await fetchTotalRooms();
      console.log("Total Rooms loaded in room screen:", data);
      setTotalRooms(data || 0);

    } catch (err) {
      console.error("Failed to load rooms:", err);
    } finally {
      setLoading(false);
    }
  }
  async function loadTotalVacantCleanRooms() {
    try {
      const data = await fetchTotalVacantCleanRooms();
      console.log("Total Rooms loaded in room screen:", data);
      setTotalCleanRooms(data || 0);

    } catch (err) {
      console.error("Failed to load rooms:", err);
    } finally {
      setLoading(false);
    }
  }
  async function loadTotalVacantDirtyRooms() {
    try {
      const data = await fetchTotalVacantDirtyRooms();
      console.log("Total Rooms loaded in room screen:", data);
      setTotalDirtyRooms(data || 0);

    } catch (err) {
      console.error("Failed to load rooms:", err);
    } finally {
      setLoading(false);
    }
  }
  async function loadTotalInspectionRooms() {
    try {
      const data = await fetchTotalInspectionRooms();
      console.log("Total Rooms loaded in room screen:", data);
      setTotalInspectionRooms(data || 0);

    } catch (err) {
      console.error("Failed to load rooms:", err);
    } finally {
      setLoading(false);
    }
  }
  async function loadTotalProgressTaskRooms() {
    try {
      const data = await fetchTotalProgressTaskRooms();
      console.log("Total Rooms loaded in room screen:", data);
      setTotalProgressTaskRooms(data && data.total_progress_task_rooms || 0);

    } catch (err) {
      console.error("Failed to load Progress Task rooms:", err);
    } finally {
      setLoading(false);
    }
  }
  async function loadTotalPendingTaskRooms() {
    try {
      const data = await fetchTotalPendingTaskRooms();
      console.log("Total Rooms pending in room screen:", data);
      setTotalPendingTaskRooms(data && data.total_pending_task_rooms || 0);

    } catch (err) {
      console.error("Failed to load Progress Task rooms:", err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 20, display: "flex", justifyContent: "flex-end" }}>
        <NotificationBell />
      </View>
      <View style={styles.grid}>
        {kpis.map((kpi, index) => (
          <KPIcard key={index} label={kpi.label} value={kpi.value} />
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
});
