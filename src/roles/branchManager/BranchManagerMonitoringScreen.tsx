import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ClipboardCheck, BarChart3, ListChecks, Clock, CheckCircle2, Building } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { TaskCard } from "../../shared/components/TaskCard";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function BranchManagerMonitoringScreen() {
  const { state, setTab, scopedBranches, scopedTasks, showToast, markTaskDone, revokeTask, openTaskDetail, openBranchDetail } = useApp();
  const activeTab = state.tabs.managerMonitoring;

  const filteredTasks = scopedTasks.filter((t) => {
    if (activeTab === "workers") return t.audience === "worker";
    return true;
  });

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Task Monitor"
        action={
          <SegmentedControl
            tabs={[
              { label: "Worker Tasks", value: "workers" },
              { label: "All", value: "all" },
            ]}
            activeKey={activeTab}
            onChange={(v) => setTab("managerMonitoring", v)}
          />
        }
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Total tasks" value={String(filteredTasks.length)} meta="In scope" accent={colors.brand} icon={ListChecks} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Pending" value={String(filteredTasks.filter((t) => t.status === "Pending").length)} meta="Awaiting work" accent={colors.warning} icon={Clock} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Completed" value={String(filteredTasks.filter((t) => t.status === "Completed").length)} meta="Done" accent={colors.success} icon={CheckCircle2} /></View>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        {scopedBranches.map((branch) => {
          const branchTasks = filteredTasks.filter((t) => t.branchId === branch.id);
          return (
            <TouchableOpacity key={branch.id} style={{ flex: 1, minWidth: 200 }} onPress={() => openBranchDetail(branch.id)} activeOpacity={0.7}>
              <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius.xl, padding: spacing.xl }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm }}>
                  <View style={{ width: 24, height: 24, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                    <Building size={12} color={colors.brand} strokeWidth={2} />
                  </View>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>{branch.name}</Text>
                </View>
                <View style={{ flexDirection: "row", gap: spacing.lg }}>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{branchTasks.length} tasks</Text>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{branchTasks.filter((t) => t.status === "Pending").length} pending</Text>
                  <Text style={{ fontSize: fontSize.sm, color: colors.success }}>{branchTasks.filter((t) => t.status === "Completed").length} done</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
              <ClipboardCheck size={16} color={colors.brand} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Task List</Text>
          </View>
          <View style={{ gap: spacing.xl }}>
            {filteredTasks.length > 0 ? filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                actions={
                  task.status === "Pending" || task.status === "In Progress"
                    ? [
                        { label: "Mark Complete", onPress: () => markTaskDone(task.id), primary: true },
                        { label: "Revoke", onPress: () => revokeTask(task.id) },
                      ]
                    : task.status === "Revoked"
                    ? [{ label: "Review", onPress: () => showToast("Reviewing revoked task " + task.id) }]
                    : undefined
                }
              />
            )) : (
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", padding: spacing["4xl"] }}>No tasks to show</Text>
            )}
          </View>
        </Card>
      </View>
    </ScreenWrapper>
  );
}
