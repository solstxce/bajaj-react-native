import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Panel } from "../../../components/shared/Panel";
import { theme } from "../../../constants/theme";
import { Branch } from "../../../types/domain";

export function BranchSection({ branches }: { branches: Branch[] }) {
  return (
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
  );
}

const styles = StyleSheet.create({
  rowLine: { borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 8, marginTop: 2, flexDirection: "row", justifyContent: "space-between" },
  strong: { color: theme.ink, fontWeight: "700", fontSize: 13 },
  subtle: { color: theme.muted, fontSize: 12 },
  metric: { color: theme.navy, fontWeight: "700", fontSize: 12 },
});
