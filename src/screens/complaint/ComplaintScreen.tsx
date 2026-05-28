import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Panel } from "../../components/common/Panel";
import { Complaint } from "../../types/domain";

type Props = {
  complaints: Complaint[];
  onResolve: (id: number) => void;
  onEscalate: (id: number) => void;
};

export function ComplaintScreen({ complaints, onResolve, onEscalate }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Panel title="Complaint Tracker">
        {complaints.map((item) => (
          <View key={item.id} style={styles.rowCard}>
            <View style={styles.complaintInfo}>
              <Text style={styles.strong}>{item.title}</Text>
              <Text style={styles.subtle}>Status: {item.status} — Severity: {item.severity}</Text>
            </View>
            <View style={styles.col}>
              <Pressable onPress={() => onResolve(item.id)} style={styles.btnPrimary}>
                <Text style={styles.btnPrimaryText}>Resolve</Text>
              </Pressable>
              <Pressable onPress={() => onEscalate(item.id)} style={styles.btnMuted}>
                <Text style={styles.btnMutedText}>Escalate</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </Panel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 14, paddingBottom: 100, gap: 10, paddingTop: 4 },
  rowCard: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.76)",
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  complaintInfo: { flex: 1 },
  strong: { color: "#0F172A", fontWeight: "700", fontSize: 13 },
  subtle: { color: "#64748B", fontSize: 12, marginTop: 1 },
  col: { gap: 6 },
  btnPrimary: {
    backgroundColor: "#2563EB",
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 13,
    shadowColor: "#2563EB",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  btnPrimaryText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  btnMuted: {
    backgroundColor: "rgba(241,245,249,0.8)",
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 13,
  },
  btnMutedText: { color: "#0F172A", fontWeight: "700", fontSize: 12 },
});
