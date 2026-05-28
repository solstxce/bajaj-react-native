import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { Panel } from "../../components/common/Panel";
import { Branch, RoleId } from "../../types/domain";

const ROLE_DASHBOARD: Record<RoleId, { title: string; description: string }> = {
  worker: {
    title: "Worker Operations Dashboard",
    description: "Track assigned tasks, attendance, device reports, and urgent field actions efficiently.",
  },
  employee: {
    title: "Employee Activity Overview",
    description: "Monitor attendance, pending tasks, complaints, and daily operational updates.",
  },
  am: {
    title: "Administrative Operations Center",
    description: "Manage complaints, coordinate branch operations, and monitor task escalations.",
  },
  branchManager: {
    title: "Branch Performance Dashboard",
    description: "Supervise branch health, approvals, escalations, and operational performance metrics.",
  },
  rm: {
    title: "Regional Monitoring & Analytics",
    description: "Analyze multi-branch operations, escalations, regional alerts, and overall performance insights.",
  },
};

type Props = {
  stats: { avgHealth: number; openTasks: number; activeComplaints: number; unread: number };
  branches: Branch[];
  page: string;
  role: RoleId;
};

export function HomeScreen({ stats, branches, role }: Props) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const prevRole = useRef(role);

  useEffect(() => {
    if (prevRole.current !== role) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      prevRole.current = role;
    }
  }, [role]);

  const content = ROLE_DASHBOARD[role];

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.sectionHeader, { opacity: fadeAnim }]}>
        <Text style={styles.sectionHeading}>{content.title}</Text>
        <Text style={styles.sectionSub}>{content.description}</Text>
      </Animated.View>

      <View style={styles.overviewRow}>
        <View style={styles.glassCard}>
          <Text style={styles.ovTitle}>Avg Health</Text>
          <Text style={styles.ovValue}>{stats.avgHealth}%</Text>
          <Text style={styles.ovNote}>vs last week</Text>
        </View>
        <View style={styles.glassCard}>
          <Text style={styles.ovTitle}>Open Tasks</Text>
          <Text style={styles.ovValue}>{stats.openTasks}</Text>
          <Text style={styles.ovNote}>1 new</Text>
        </View>
        <View style={styles.glassCard}>
          <Text style={styles.ovTitle}>Complaints</Text>
          <Text style={styles.ovValue}>{stats.activeComplaints}</Text>
          <Text style={styles.ovNote}>1 urgent</Text>
        </View>
        <View style={styles.glassCard}>
          <Text style={styles.ovTitle}>Unread</Text>
          <Text style={styles.ovValue}>{stats.unread}</Text>
          <Text style={styles.ovNote}>new</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeading}>Quick Actions</Text>
      </View>
      <View style={styles.quickActionsRow}>
        <View style={styles.quickPrimary}>
          <Text style={styles.quickPrimaryText}>+ Raise Task</Text>
        </View>
        <View style={styles.quickSecondary}>
          <Text style={styles.quickSecondaryText}>Raise Complaint</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeading}>Device Health</Text>
      </View>
      <View style={styles.deviceRow}>
        <View style={styles.glassDeviceCard}><Text style={styles.deviceLabel}>AC Units</Text><Text style={styles.deviceCount}>12</Text></View>
        <View style={styles.glassDeviceCard}><Text style={styles.deviceLabel}>UPS</Text><Text style={styles.deviceCount}>7</Text></View>
        <View style={styles.glassDeviceCard}><Text style={styles.deviceLabel}>Inverters</Text><Text style={styles.deviceCount}>5</Text></View>
        <View style={styles.glassDeviceCard}><Text style={styles.deviceLabel}>Other</Text><Text style={styles.deviceCount}>8</Text></View>
      </View>

      <View style={styles.alertsRow}>
        <View style={styles.glassAlertCard}>
          <Text style={styles.alertIcon}>🚨</Text>
          <View>
            <Text style={styles.alertTitle}>Active Alerts</Text>
            <Text style={styles.alertCount}>2 Critical</Text>
          </View>
        </View>
        <View style={styles.glassTaskCard}>
          <Text style={styles.alertIcon}>✅</Text>
          <View>
            <Text style={styles.alertTitle}>Tasks Due Today</Text>
            <Text style={[styles.alertCount, { color: "#2563EB" }]}>3 Tasks</Text>
          </View>
        </View>
      </View>

      <Panel title="Branch Snapshot">
        {branches.map((branch) => (
          <View key={branch.id} style={styles.rowLine}>
            <View>
              <Text style={styles.strong}>{branch.name}</Text>
              <Text style={styles.subtle}>{branch.code} - {branch.city}</Text>
            </View>
            <Text style={styles.metric}>H {branch.health}% | A {branch.attendance}%</Text>
          </View>
        ))}
      </Panel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 14, paddingBottom: 100, gap: 10, paddingTop: 4 },
  sectionHeader: { marginTop: 10, marginBottom: 2 },
  sectionHeading: { color: "#0F172A", fontSize: 16, fontWeight: "900", letterSpacing: -0.02 },
  sectionSub: { color: "#64748B", fontSize: 12, marginTop: 1, lineHeight: 18 },

  overviewRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  glassCard: {
    flexBasis: "47%",
    backgroundColor: "rgba(255,255,255,0.78)",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    marginBottom: 8,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    overflow: "hidden",
  },
  ovTitle: { color: "#64748B", fontSize: 12, fontWeight: "600", letterSpacing: 0.3 },
  ovValue: { color: "#0F172A", fontSize: 22, fontWeight: "900", marginTop: 6 },
  ovNote: { color: "#64748B", fontSize: 12, marginTop: 4 },

  quickActionsRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  quickPrimary: {
    flex: 1,
    backgroundColor: "#2563EB",
    padding: 13,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  quickPrimaryText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  quickSecondary: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.78)",
    padding: 13,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  quickSecondaryText: { color: "#0F172A", fontWeight: "700", fontSize: 14 },

  deviceRow: { flexDirection: "row", gap: 10, flexWrap: "wrap", marginBottom: 8 },
  glassDeviceCard: {
    flexBasis: "47%",
    backgroundColor: "rgba(255,255,255,0.76)",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  deviceLabel: { color: "#64748B", fontSize: 12, fontWeight: "600" },
  deviceCount: { color: "#0F172A", fontSize: 20, fontWeight: "900", marginTop: 6 },

  alertsRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  glassAlertCard: {
    flex: 1,
    backgroundColor: "rgba(254,242,242,0.85)",
    padding: 14,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.12)",
  },
  glassTaskCard: {
    flex: 1,
    backgroundColor: "rgba(239,246,255,0.85)",
    padding: 14,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.12)",
  },
  alertIcon: { fontSize: 20 },
  alertTitle: { color: "#0F172A", fontWeight: "700", fontSize: 12 },
  alertCount: { color: "#EF4444", fontWeight: "900", fontSize: 16, marginTop: 2 },

  rowLine: {
    borderTopWidth: 1,
    borderTopColor: "rgba(15,23,42,0.06)",
    paddingTop: 10,
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  strong: { color: "#0F172A", fontWeight: "700", fontSize: 13 },
  subtle: { color: "#64748B", fontSize: 12 },
  metric: { color: "#2563EB", fontWeight: "700", fontSize: 12 },
});
