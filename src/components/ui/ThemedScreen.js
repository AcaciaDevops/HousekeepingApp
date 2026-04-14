import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useAppTheme } from "../../context/ThemeContext";

export default function ThemedScreen({ children, style }) {
  const { tokens } = useAppTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: tokens.background }, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
