import React from "react";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { theme } from "../../constants/theme";

export function AppHeader({ roleName, hierarchy, onSwitchRole, unreadCount }: { roleName: string; hierarchy: string; onSwitchRole: () => void; unreadCount: number }) {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Pressable style={styles.switchButton} onPress={onSwitchRole}>
          <Text style={styles.switchIcon}>⚡</Text>
          <Text style={styles.switchText}>Switch roles</Text>
          <Text style={styles.switchArrow}>▾</Text>
        </Pressable>
        <View style={styles.searchBox}>
          <TextInput placeholder="Search tasks, alerts, branches..." placeholderTextColor={theme.secondary} style={styles.searchInput} />
        </View>
        <View style={styles.rightGroup}>
          <Pressable style={styles.iconButton}>
            <Text style={styles.icon}>🔔</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </Pressable>
          <Pressable style={styles.profileButton}>
            <Text style={styles.profileIcon}>👤</Text>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{roleName}</Text>
              <Text style={styles.profileRole}>{hierarchy}</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { margin: 12, borderRadius: 18, padding: 12, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line },
  topRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  switchButton: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: theme.primary },
  switchIcon: { color: "#fff", fontSize: 16 },
  switchText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  switchArrow: { color: "#fff", fontSize: 12 },
  searchBox: { flex: 1, backgroundColor: theme.bg, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: theme.line },
  searchInput: { color: theme.textPrimary, fontSize: 14 },
  rightGroup: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: theme.bg, alignItems: "center", justifyContent: "center", position: "relative" },
  icon: { fontSize: 20 },
  badge: { position: "absolute", top: 6, right: 6, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: theme.critical, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "900" },
  profileButton: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 18, backgroundColor: theme.bg },
  profileIcon: { fontSize: 20 },
  profileInfo: { flexShrink: 1 },
  profileName: { color: theme.textPrimary, fontWeight: "800", fontSize: 12 },
  profileRole: { color: theme.secondary, fontSize: 10 },
});
