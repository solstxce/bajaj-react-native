import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Panel } from "../../components/common/Panel";

export function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.profileCard}>
        <View style={styles.glassEdge} />
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.name}>User Profile</Text>
        <Text style={styles.role}>Regional Manager</Text>
      </View>

      <Panel title="Profile & Control">
        <Text style={styles.text}>User profile, permissions, settings, visit logs, and user management belong to this module group.</Text>
      </Panel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 14, paddingBottom: 100, gap: 10, paddingTop: 4 },
  profileCard: {
    backgroundColor: "rgba(255,255,255,0.78)",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    overflow: "hidden",
  },
  glassEdge: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(241,245,249,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 28 },
  name: { color: "#0F172A", fontSize: 18, fontWeight: "800", marginTop: 12 },
  role: { color: "#64748B", fontSize: 13, marginTop: 2 },
  text: { color: "#64748B", fontSize: 13, lineHeight: 20 },
});
