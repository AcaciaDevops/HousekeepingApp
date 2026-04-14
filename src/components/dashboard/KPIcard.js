// src/components/dashboard/KPIcard.js
import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

export default function KPIcard({ label, value }) {
  return (
    <Card style={styles.card}>
      <Card.Content style={{ alignItems: "center" }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>

      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#134234',
    borderColor: '#4bc78a',
    borderWidth: 1,
    width: "48%",
    marginBottom: 10,
    padding: 5,
  },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 5, color: '#d6e07e' },
  value: { fontSize: 14, fontWeight: "500", color: '#ffff' },
});
