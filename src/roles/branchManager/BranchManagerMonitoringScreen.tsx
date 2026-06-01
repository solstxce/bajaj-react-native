import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, Image } from "react-native";
import { ClipboardCheck, BarChart3, ListChecks, Clock, CheckCircle2, Building, Calendar, X, Camera } from "lucide-react-native";
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
  const activeTab = state.tabs.managerMonitoring || "lc";

  const [fromDate, setFromDate] = useState("2026-04-20");
  const [toDate, setToDate] = useState("2026-04-26");
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

  const filteredTasks = scopedTasks.filter((t) => {
    if (activeTab === "lc") return t.audience === "lc";
    return true;
  });

  const selectedBranch = scopedBranches.find(b => b.id === selectedBranchId);
  const lcCompletedTasks = scopedTasks.filter(t => t.branchId === selectedBranchId && t.status === "Completed" && t.audience === "lc");

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Task Monitor"
        action={
          <SegmentedControl
            tabs={[
              { label: "LC Tasks", value: "lc" },
              { label: "All", value: "all" },
            ]}
            activeKey={activeTab}
            onChange={(v) => setTab("managerMonitoring", v)}
          />
        }
      />

      <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.xl }}>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text style={{ fontSize: fontSize.xs, color: colors.slate500, textTransform: "uppercase", letterSpacing: 1 }}>From Date</Text>
          <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, backgroundColor: colors.white }}>
            <Calendar size={16} color={colors.slate400} />
            <TextInput value={fromDate} onChangeText={setFromDate} style={{ flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.sm, color: colors.slate900, fontSize: fontSize.sm }} />
          </View>
        </View>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text style={{ fontSize: fontSize.xs, color: colors.slate500, textTransform: "uppercase", letterSpacing: 1 }}>To Date</Text>
          <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, backgroundColor: colors.white }}>
            <Calendar size={16} color={colors.slate400} />
            <TextInput value={toDate} onChangeText={setToDate} style={{ flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.sm, color: colors.slate900, fontSize: fontSize.sm }} />
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        {scopedBranches.map((branch) => {
          const branchTasks = filteredTasks.filter((t) => t.branchId === branch.id);
          return (
            <TouchableOpacity key={branch.id} style={{ flex: 1, minWidth: 280 }} onPress={() => setSelectedBranchId(branch.id)} activeOpacity={0.7}>
              <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: spacing.xl, borderWidth: 1, borderColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm }}>
                  <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                    <Building size={14} color={colors.brand} strokeWidth={2} />
                  </View>
                  <View>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900 }}>{branch.name}</Text>
                    <Text style={{ fontSize: fontSize.xs, color: colors.brand }}>Tap to view LC proofs</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: spacing.lg, marginTop: spacing.md }}>
                  <View>
                    <Text style={{ fontSize: fontSize.xs, color: colors.slate500 }}>Tasks</Text>
                    <Text style={{ fontSize: fontSize.md, color: colors.slate900 }}>{branchTasks.length}</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: fontSize.xs, color: colors.slate500 }}>Pending</Text>
                    <Text style={{ fontSize: fontSize.md, color: colors.slate900 }}>{branchTasks.filter((t) => t.status === "Pending").length}</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: fontSize.xs, color: colors.slate500 }}>Done</Text>
                    <Text style={{ fontSize: fontSize.md, color: colors.success }}>{branchTasks.filter((t) => t.status === "Completed").length}</Text>
                  </View>
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
            <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>Task List</Text>
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
                    ? [{ label: "Review", onPress: () => openTaskDetail(task.id) }]
                    : undefined
                }
              />
            )) : (
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", padding: spacing["4xl"] }}>No tasks to show</Text>
            )}
          </View>
        </Card>
      </View>

      <Modal visible={!!selectedBranchId} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: spacing.xl }}>
          <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: spacing.xl, maxHeight: '80%' }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.lg }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.xl, fontWeight: "400", color: colors.slate900 }}>LC Task Proofs</Text>
                <Text style={{ fontSize: fontSize.sm, color: colors.slate500, marginTop: 4 }}>{selectedBranch?.name} ({fromDate} to {toDate})</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedBranchId(null)} style={{ padding: spacing.sm, backgroundColor: colors.slate100, borderRadius: 20 }}>
                <X size={20} color={colors.slate700} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ gap: spacing.xl }}>
                {lcCompletedTasks.length > 0 ? lcCompletedTasks.map((task, index) => (
                  <View key={task.id} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: spacing.lg }}>
                    <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900, marginBottom: spacing.xs }}>{task.title}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md }}>
                      <CheckCircle2 size={14} color={colors.success} />
                      <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>Completed on {task.completedAt || "2026-04-26"}</Text>
                    </View>
                    <View style={{ height: 200, backgroundColor: colors.slate100, borderRadius: borderRadius.lg, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      <Image 
                        source={{ uri: `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600&h=400&random=${index}` }} 
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                      <View style={{ position: "absolute", bottom: spacing.md, right: spacing.md, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                        <Camera size={12} color={colors.white} />
                        <Text style={{ color: colors.white, fontSize: fontSize.xs }}>Verified Image</Text>
                      </View>
                    </View>
                  </View>
                )) : (
                  <View style={{ alignItems: "center", paddingVertical: spacing["4xl"] }}>
                    <ClipboardCheck size={32} color={colors.slate300} style={{ marginBottom: spacing.md }} />
                    <Text style={{ fontSize: fontSize.sm, color: colors.slate500, textAlign: "center" }}>No completed LC tasks found in this date range.</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
