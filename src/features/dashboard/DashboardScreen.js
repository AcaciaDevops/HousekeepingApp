// src/features/dashboard/DashboardScreen.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import KPIcard from "../../components/dashboard/KPIcard.js";
import { useAppTheme } from "../../context/ThemeContext";
import { ThemedScrollView } from "../../components/ui";

import { fetchTotalRooms, fetchTotalVacantCleanRooms, fetchTotalVacantDirtyRooms, fetchTotalInspectionRooms } from "../../api/RoomApi";
import { fetchTotalProgressTaskRooms, fetchTotalPendingTaskRooms } from "../../api/TasksApi.js";

export default function DashboardScreen() {
  const [totalRooms, setTotalRooms] = useState();
    const [loading, setLoading] = useState(false);
  const [totalCleanRooms, setTotalCleanRooms] = useState();
  const [totalDirtyRooms, setTotalDirtyRooms] = useState();
  const [totalInspectionRooms, setTotalInspectionRooms] = useState();
  const [totalProgressTaskRooms, setTotalProgressTaskRooms] = useState();
  const [totalPendingTaskRooms, setTotalPendingTaskRooms] = useState();
  const { tokens } = useAppTheme();
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
    <ThemedScrollView contentContainerStyle={styles.page}>
      <View style={styles.grid}>
        {kpis.map((kpi, index) => (
          <View key={index} style={styles.kpiItem}>
            <KPIcard label={kpi.label} value={kpi.value} />
          </View>
        ))}
      </View>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  kpiItem: {
    flexBasis: "48%",
    maxWidth: "48%",
    marginBottom: 16,
  },
});
