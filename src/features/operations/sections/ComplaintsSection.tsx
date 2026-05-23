import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Panel } from "../../../components/shared/Panel";
import { theme } from "../../../constants/theme";
import { Complaint } from "../../../types/domain";

export function ComplaintsSection({ complaints, onResolve, onEscalate }: {
  complaints: Complaint[];
  onResolve: (id: number) => void;
  onEscalate: (id: number) => void;
}) {
  return (
    <Panel title="Complaint Tracker">
      {complaints.map((item) => (
        <View key={item.id} style={styles.rowCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.strong}>{item.title}</Text>
            <Text style={styles.subtle}>Status: {item.status} - Severity: {item.severity}</Text>
          </View>
          <View style={styles.col}>
            <Pressable onPress={() => onResolve(item.id)} style={styles.btnPrimary}><Text style={styles.btnPrimaryText}>Resolve</Text></Pressable>
            <Pressable onPress={() => onEscalate(item.id)} style={styles.btnMuted}><Text style={styles.btnMutedText}>Escalate</Text></Pressable>
          </View>
        </View>
      ))}
    </Panel>
  );
}

const styles = StyleSheet.create({
  rowCard: { borderWidth: 1, borderColor: theme.line, borderRadius: 12, padding: 10, flexDirection: "row", gap: 10, alignItems: "center" },
  strong: { color: theme.ink, fontWeight: "700", fontSize: 13 },
  subtle: { color: theme.muted, fontSize: 12 },
  col: { gap: 6 },
  btnPrimary: { backgroundColor: theme.navy, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 11 },
  btnPrimaryText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  btnMuted: { backgroundColor: "#f3f4f6", borderRadius: 999, paddingVertical: 6, paddingHorizontal: 11 },
  btnMutedText: { color: theme.ink, fontWeight: "700", fontSize: 12 },
});
