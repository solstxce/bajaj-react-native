import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Panel } from "../../../components/shared/Panel";
import { theme } from "../../../constants/theme";
import { Approval } from "../../../types/domain";

export function ApprovalsSection({ approvals, onDecision }: { approvals: Approval[]; onDecision: (id: number, status: "approved" | "rejected") => void }) {
  return (
    <Panel title="Approvals">
      {approvals.map((approval) => (
        <View key={approval.id} style={styles.rowCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.strong}>{approval.label}</Text>
            <Text style={styles.subtle}>Amount: Rs {approval.amount} - Branch #{approval.branchId}</Text>
          </View>
          <View style={styles.col}>
            <Pressable onPress={() => onDecision(approval.id, "approved")} style={styles.btnPrimary}><Text style={styles.btnPrimaryText}>Approve</Text></Pressable>
            <Pressable onPress={() => onDecision(approval.id, "rejected")} style={styles.btnMuted}><Text style={styles.btnMutedText}>Reject</Text></Pressable>
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
