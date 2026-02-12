import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "İstasyon ara...",
}: Props) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={20}
        color={styles.icon.color}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={styles.placeholder.color}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityLabel="İstasyon arama"
        accessibilityRole="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          style={styles.clearBtn}
          accessibilityLabel="Aramayı temizle"
          accessibilityRole="button"
        >
          <Ionicons name="close-circle" size={20} color={styles.icon.color} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    height: 48,
    backgroundColor: theme.colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  icon: {
    marginRight: theme.spacing.sm,
    color: theme.colors.textMuted,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    color: theme.colors.text,
  },
  placeholder: {
    color: theme.colors.textMuted,
  },
  clearBtn: {
    padding: theme.spacing.xs,
  },
}));
