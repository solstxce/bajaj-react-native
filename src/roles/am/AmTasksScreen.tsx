import React from "react";
import { View, Text } from "react-native";
import { Clock, CheckCircle2, PlayCircle } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { TaskCard } from "../../shared/components/TaskCard";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing } from "../../theme/theme";

export function AmTasksScreen() {
  const { state, setTab, currentUser, scopedTasks, markTaskDone, revokeTask } = useApp();
  const filter = state.tabs.amTasks;
  const list = scopedTasks.filter((t) => {
    if (filter === "all") return true;
    return t.audience === filter;
  });
  const pending = list.filter((t) => t.status === "Pending").length;
  const completed = list.filter((t) => t.status === "Completed").length;
  const inProgress = list.filter((t) => t.status === "In Progress").length;

  return (
    <ScreenWrapper>
      <SectionHeader
        title="AM task board"
        action={
          <SegmentedControl
            tabs={[{ label: "Worker Tasks", value: "worker" }, { label: "Employee Tasks", value: "employee" }, { label: "All", value: "all" }]}
            activeKey={filter}
            onChange={(v) => setTab("amTasks", v)}
          />
        }
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Pending" value={String(pending)} meta="Awaiting completion or review" accent={colors.brand} icon={Clock} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="In Progress" value={String(inProgress)} meta="Currently being worked on" accent={colors.brandSecondary} icon={PlayCircle} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Completed" value={String(completed)} meta="Proof accepted and closed" accent={colors.success} icon={CheckCircle2} /></View>
      </View>

      <View style={{ marginTop: spacing.xl, gap: spacing.xl }}>
        {list.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            actions={task.status === "Pending" ? [
              { label: "Approve", onPress: () => markTaskDone(task.id), primary: true },
              { label: "Revise", onPress: () => revokeTask(task.id) },
            ] : task.status === "Completed" ? undefined : [
              { label: "Approve", onPress: () => markTaskDone(task.id), primary: true },
            ]}
          />
        ))}
        {list.length === 0 && (
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", paddingVertical: spacing["4xl"] }}>No tasks found for this filter</Text>
        )}
      </View>
    </ScreenWrapper>
  );
}
