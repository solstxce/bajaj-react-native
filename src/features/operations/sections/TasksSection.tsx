import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../../../constants/theme";
import { Task } from "../../../types/domain";
import { Panel } from "../../../components/shared/Panel";

export function TasksSection({ tasks, onDone, onRevoke }: { tasks: Task[]; onDone: (id: number) => void; onRevoke: (id: number) => void }) {
  return (
    <Panel title="Task Queue">
      {tasks.map((task) => (
        <View key={task.id} style={styles.rowCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.strong}>{task.title}</Text>
            <Text style={styles.subtle}>Due: {task.due} - Branch #{task.branchId}</Text>
            <Text style={[styles.subtle, { color: priorityColor(task.priority) }]}>Priority: {task.priority}</Text>
          </View>
          <Pressable onPress={() => (task.done ? onRevoke(task.id) : onDone(task.id))} style={task.done ? styles.btnMuted : styles.btnPrimary}>
            <Text style={task.done ? styles.btnMutedText : styles.btnPrimaryText}>{task.done ? "Reopen" : "Done"}</Text>
          </Pressable>
        </View>
      ))}
    </Panel>
  );
}

function priorityColor(priority: Task["priority"]) {
  if (priority === "critical") return "#be123c";
  if (priority === "high") return "#d97706";
  if (priority === "medium") return "#2563eb";
  return "#0f766e";
}

const styles = StyleSheet.create({
  rowCard: { borderWidth: 1, borderColor: theme.line, borderRadius: 12, padding: 10, flexDirection: "row", gap: 10, alignItems: "center" },
  strong: { color: theme.ink, fontWeight: "700", fontSize: 13 },
  subtle: { color: theme.muted, fontSize: 12 },
  btnPrimary: { backgroundColor: theme.navy, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 11 },
  btnPrimaryText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  btnMuted: { backgroundColor: "#f3f4f6", borderRadius: 999, paddingVertical: 6, paddingHorizontal: 11 },
  btnMutedText: { color: theme.ink, fontWeight: "700", fontSize: 12 },
});
