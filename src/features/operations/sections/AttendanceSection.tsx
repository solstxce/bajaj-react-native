import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Panel } from "../../../components/shared/Panel";
import { theme } from "../../../constants/theme";
import { Branch } from "../../../types/domain";

export function AttendanceSection({ branches }: { branches: Branch[] }) {
  return (
    <Panel title="Attendance Monitor">
      {branches.map((branch) => (
        <View key={branch.id} style={styles.rowLine}>
          <Text style={styles.strong}>{branch.name}</Text>
          <Text style={styles.metric}>{branch.attendance}% today</Text>
        </View>
      ))}
    </Panel>
  );
}

const styles = StyleSheet.create({
  rowLine: { borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 8, marginTop: 2, flexDirection: "row", justifyContent: "space-between" },
  strong: { color: theme.ink, fontWeight: "700", fontSize: 13 },
  metric: { color: theme.navy, fontWeight: "700", fontSize: 12 },
});
