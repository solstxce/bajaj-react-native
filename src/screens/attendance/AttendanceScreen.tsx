import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Panel } from "../../components/common/Panel";
import { Branch } from "../../types/domain";

type Props = {
  branches: Branch[];
};

export function AttendanceScreen({ branches }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Panel title="Attendance Monitor">
        {branches.map((branch) => (
          <View key={branch.id} style={styles.rowLine}>
            <Text style={styles.strong}>{branch.name}</Text>
            <Text style={styles.metric}>{branch.attendance}% today</Text>
          </View>
        ))}
      </Panel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 14, paddingBottom: 100, gap: 10, paddingTop: 4 },
  rowLine: {
    borderTopWidth: 1,
    borderTopColor: "rgba(15,23,42,0.06)",
    paddingTop: 10,
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  strong: { color: "#0F172A", fontWeight: "700", fontSize: 13 },
  metric: { color: "#2563EB", fontWeight: "700", fontSize: 12 },
});
