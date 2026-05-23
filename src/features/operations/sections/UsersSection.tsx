import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Panel } from "../../../components/shared/Panel";
import { theme } from "../../../constants/theme";

const users = [
  { id: 1, name: "Ravi Kumar", role: "RM", status: "Active" },
  { id: 2, name: "Anita Rao", role: "Branch Manager", status: "Active" },
  { id: 3, name: "Kiran", role: "Admin Assistant", status: "On Leave" },
];

export function UsersSection() {
  return (
    <Panel title="Users & Access">
      {users.map((user) => (
        <View key={user.id} style={styles.rowLine}>
          <Text style={styles.strong}>{user.name}</Text>
          <Text style={styles.subtle}>{user.role} - {user.status}</Text>
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
