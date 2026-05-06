import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppTheme } from "../context/ThemeContext";

export default function CustomDropdown({
  label,
  data,
  selectedValue,
  onSelect,
  visible,
  setVisible,
  renderLabel,
}) {
  const { tokens } = useAppTheme();

  // ✅ FIX: correctly find selected object (IMPORTANT)
  const selectedItem = data?.find((item) => {
    return (
      item.id === selectedValue ||
      item.room_id === selectedValue ||
      item.user_id === selectedValue
    );
  });

  return (
    <View style={{ marginBottom: 12 }}>
      {/* Label */}
      <Text style={[styles.label, { color: tokens.text }]}>
        {label}
      </Text>

      {/* Picker */}
      <TouchableOpacity
        style={[
          styles.customPicker,
          {
            backgroundColor: tokens.surface,
            borderColor: tokens.border,
          },
        ]}
        onPress={() => setVisible(true)}
      >
        {/* ✅ FIX: show actual selected label */}
        <Text style={{ color: tokens.text, fontSize: 16 }}>
          {selectedItem
            ? renderLabel(selectedItem)
            : `Choose ${label}`}
        </Text>

        <MaterialIcons
          name="arrow-drop-down"
          size={24}
          color={tokens.icon}
        />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View
            style={[
              styles.dropdown,
              { backgroundColor: tokens.surface },
            ]}
          >
            {/* Header */}
            <View
              style={[
                styles.header,
                { borderBottomColor: tokens.border },
              ]}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: tokens.heading,
                }}
              >
                {label}
              </Text>

              <TouchableOpacity onPress={() => setVisible(false)}>
                <MaterialIcons
                  name="close"
                  size={24}
                  color={tokens.icon}
                />
              </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
              data={data}
              keyExtractor={(item, index) =>
                item.id?.toString() ||
                item.room_id?.toString() ||
                item.user_id?.toString() ||
                index.toString()
              }
              renderItem={({ item }) => {
                const isSelected =
                  item.id === selectedValue ||
                  item.room_id === selectedValue ||
                  item.user_id === selectedValue;

                return (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      isSelected && {
                        backgroundColor: tokens.button,
                      },
                    ]}
                    onPress={() => {
                      onSelect(item); // ✅ API-safe
                      setVisible(false);
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected
                          ? tokens.buttonText
                          : tokens.text,
                        fontWeight: isSelected ? "600" : "400",
                      }}
                    >
                      {renderLabel(item)}
                    </Text>

                    {isSelected && (
                      <MaterialIcons
                        name="check"
                        size={20}
                        color={tokens.text}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  customPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    width: "85%",
    maxHeight: "80%",
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});