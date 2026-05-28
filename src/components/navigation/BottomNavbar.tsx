import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "tasks", label: "Tasks", icon: "✅" },
  { id: "complaints", label: "Complaint", icon: "🧰" },
  { id: "attendance", label: "Attendance", icon: "📍" },
  { id: "notifications", label: "Alerts", icon: "🔔" },
];

export function BottomNavbar({ activePage, onPage }: { activePage: string; onPage: (id: string) => void }) {
  return (
    <View style={styles.dock}>
      <LinearGradient colors={["#2563EB", "#3B82F6", "#38BDF8"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientBorder}>
        <View style={styles.innerWrap}>
          <BlurView intensity={65} tint="light" style={styles.container}>
            <View style={styles.glassEdge} />
            {NAV_ITEMS.map((item) => {
              const active = item.id === activePage;
              return (
                <Pressable key={item.id} onPress={() => onPage(item.id)} style={styles.item}>
                  <View style={[styles.pill, active && styles.pillActive]}>
                    <Text style={[styles.icon, active && styles.iconActive]}>{item.icon}</Text>
                  </View>
                  <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </BlurView>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: "absolute",
    bottom: 20,
    left: 12,
    right: 12,
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  gradientBorder: {
    width: "100%",
    borderRadius: 30,
    padding: 1.5,
  },
  innerWrap: {
    width: "100%",
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 6,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 16,
  },
  glassEdge: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.65)",
  },
  item: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 4,
  },
  pill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  pillActive: {
    backgroundColor: "#2563EB",
    shadowColor: "#2563EB",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
  },
  icon: {
    fontSize: 20,
    opacity: 0.45,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
    letterSpacing: 0,
  },
  labelActive: {
    color: "#2563EB",
    fontWeight: "700",
  },
});
