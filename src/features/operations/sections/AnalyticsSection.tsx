import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Panel } from "../../../components/shared/Panel";
import { theme } from "../../../constants/theme";

export function AnalyticsSection() {
  return (
    <Panel title="Regional Analytics">
      <View style={styles.card}><Text style={styles.label}>SLA Compliance</Text><Text style={styles.value}>91%</Text></View>
      <View style={styles.card}><Text style={styles.label}>Issue Closure (7d)</Text><Text style={styles.value}>84%</Text></View>
      <View style={styles.card}><Text style={styles.label}>Attendance Reliability</Text><Text style={styles.value}>93%</Text></View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: theme.line, borderRadius: 12, padding: 10 },
  label: { color: theme.muted, fontSize: 12 },
  value: { color: theme.ink, fontWeight: "900", fontSize: 20 },
});
