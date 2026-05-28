import React from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { Panel } from "../../components/common/Panel";
import { Task } from "../../types/domain";

type Props = {
  tasks: Task[];
  onDone: (id: number) => void;
  onRevoke: (id: number) => void;
};

function priorityColor(priority: Task["priority"]) {
  if (priority === "critical") return "#be123c";
  if (priority === "high") return "#d97706";
  if (priority === "medium") return "#2563eb";
  return "#0f766e";
}

export function TasksScreen({ tasks, onDone, onRevoke }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Panel title="Task Queue">
        {tasks.map((task) => (
          <View key={task.id} style={styles.rowCard}>
            <View style={styles.taskInfo}>
              <Text style={styles.strong}>{task.title}</Text>
              <Text style={styles.subtle}>Due: {task.due} — Branch #{task.branchId}</Text>
              <Text style={[styles.subtle, { color: priorityColor(task.priority), fontWeight: "600" }]}>Priority: {task.priority}</Text>
            </View>
            <Pressable onPress={() => (task.done ? onRevoke(task.id) : onDone(task.id))} style={task.done ? styles.btnMuted : styles.btnPrimary}>
              <Text style={task.done ? styles.btnMutedText : styles.btnPrimaryText}>{task.done ? "Reopen" : "Done"}</Text>
            </Pressable>
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
  taskInfo: { flex: 1 },
  strong: { color: "#0F172A", fontWeight: "700", fontSize: 13 },
  subtle: { color: "#64748B", fontSize: 12, marginTop: 1 },
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
