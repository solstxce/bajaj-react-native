import React from "react";
import { View, Text } from "react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { QuickButton } from "../../shared/components/QuickButton";
import { TaskCard } from "../../shared/components/TaskCard";
import { useApp } from "../../context/AppContext";
import { colors, spacing } from "../../theme/theme";

export function EmployeeTasksScreen() {
  const { state, setTab, currentUser, scopedTasks, showToast, submitTaskProof } = useApp();
  const filter = state.tabs.employeeTasks;
  const list = scopedTasks
    .filter((t) => t.audience === "employee" && (!t.assignedTo || t.assignedTo === currentUser.id))
    .filter((t) => filter === "all" ? true : t.schedule.toLowerCase() === filter);

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Employee task board"
        subtitle="Daily and weekly tasks with mandatory image proof and escalation clocks"
        action={
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" }}>
            <SegmentedControl
              tabs={[{ label: "Daily", value: "daily" }, { label: "Weekly", value: "weekly" }, { label: "All", value: "all" }]}
              activeKey={filter}
              onChange={(v) => setTab("employeeTasks", v)}
            />
            <QuickButton label="Raise issue" onPress={() => showToast("Issue form coming in Phase 7")} />
          </View>
        }
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ width: "30%" }}><StatCard label="Pending" value={String(list.filter((t) => t.status === "Pending").length)} meta="Still waiting for proof" accent={colors.brand} /></View>
        <View style={{ width: "30%" }}><StatCard label="Completed" value={String(list.filter((t) => t.status === "Completed").length)} meta="Proof accepted" accent={colors.success} /></View>
        <View style={{ width: "30%" }}><StatCard label="Shared tasks" value={String(list.filter((t) => !t.assignedTo).length)} meta="Any employee can close these" accent={colors.text} /></View>
      </View>

      <View style={{ marginTop: spacing.xl, gap: spacing.xl }}>
        {list.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            actions={task.status !== "Completed" ? [{ label: "Submit Photo", onPress: () => submitTaskProof(task.id), primary: true }] : undefined}
          />
        ))}
      </View>
    </ScreenWrapper>
  );
}
