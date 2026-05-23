import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Panel } from "../../../components/shared/Panel";
import { theme } from "../../../constants/theme";

const visits = [
  { id: 1, branch: "Banjara Hills Office", date: "2026-05-24", owner: "Branch Manager" },
  { id: 2, branch: "Gachibowli Office", date: "2026-05-25", owner: "RM" },
];

export function VisitsSection() {
  return (
    <Panel title="Visit Planner">
      {visits.map((visit) => (
        <View key={visit.id} style={styles.rowLine}>
          <Text style={styles.strong}>{visit.branch}</Text>
          <Text style={styles.subtle}>{visit.date} - {visit.owner}</Text>
        </View>
      ))}
    </Panel>
  );
}

const styles = StyleSheet.create({
  rowLine: { borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 8, marginTop: 2 },
  strong: { color: theme.ink, fontWeight: "700", fontSize: 13 },
  subtle: { color: theme.muted, fontSize: 12 },
});
