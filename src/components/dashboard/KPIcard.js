// src/components/dashboard/KPIcard.js
import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

export default function KPIcard({ label, value }) {
  return (
    <Card style={styles.card}>
      <Card.Content style={{ alignItems: "center" }}>
        <Text style={styles.value}>{value}</Text>
        <Text>{label}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    marginBottom: 10,
    padding: 10,
  },
  value: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
});
