import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useAppTheme } from "../../context/ThemeContext";

export default function ThemedScrollView({
  children,
  style,
  contentContainerStyle,
  ...props
}) {
  const { tokens } = useAppTheme();

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: tokens.background }, style]}
      contentContainerStyle={[
        styles.content,
        { backgroundColor: tokens.background },
        contentContainerStyle,
      ]}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingLeft:40,
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
