// src/components/dashboard/KPIcard.js
import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { useAppTheme } from "../../context/ThemeContext";

export default function KPIcard({ label, value }) {
  const { tokens } = useAppTheme();
  return (
    <Card style={[styles.card, { backgroundColor: tokens.surface, borderColor: tokens.button }]}>
      <Card.Content style={{ alignItems: "center" }}>
        <Text style={[styles.label, { color: tokens.heading }]}>{label}</Text>
        <Text style={[styles.value, { color: tokens.text }]}>{value}</Text>

      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    width: "100%",
    marginBottom: 10,
    padding: 5,
  },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 5, textAlign: 'center' },
  value: { fontSize: 14, fontWeight: "500", textAlign: 'center' },
});