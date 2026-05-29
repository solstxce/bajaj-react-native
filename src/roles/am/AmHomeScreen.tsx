import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ListChecks, Users, Building, TrendingUp, HardHat, UserCheck, MapPin, TriangleAlert, Clock, ShieldCheck, AlertCircle, CalendarDays, ChevronRight } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { TaskCard } from "../../shared/components/TaskCard";
import { QuickButton } from "../../shared/components/QuickButton";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function AmHomeScreen() {
  const { currentUser, getBranch, scopedTasks, scopedComplaints, scopedAttendance, setPage, showToast, markTaskDone, revokeTask, state } = useApp();
  const branch = getBranch(currentUser.branchId)!;
  const employeeTasks = scopedTasks.filter((t) => t.audience === "employee").slice(0, 4);
  const pendingTasks = scopedTasks.filter((t) => t.status === "Pending").length;
  const todayAttendance = scopedAttendance.filter((a) => a.date === state.today);
  const presentCount = todayAttendance.filter((a) => a.status === "Present").length;
  const totalCount = todayAttendance.length || 1;
  const openComplaints = scopedComplaints.filter((c) => c.status !== "Resolved").length;
  const budgetPct = Math.round((branch.usedBudget / branch.monthlyBudget) * 100);

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Admin Assistant desk"
        action={
          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            <QuickButton label="Review Tasks" icon={ListChecks} onPress={() => setPage("tasks")} />
            <QuickButton label="Team Attendance" icon={MapPin} onPress={() => setPage("attendance")} />
          </View>
        }
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 140 }}><StatCard label="Team tasks pending" value={String(pendingTasks)} meta="Across worker & employee" accent={colors.brand} icon={ListChecks} /></View>
        <View style={{ flex: 1, minWidth: 140 }}><StatCard label="Today's attendance" value={String(Math.round((presentCount / totalCount) * 100)) + "%"} meta={presentCount + " of " + totalCount + " staff in"} accent={colors.success} icon={UserCheck} /></View>
        <View style={{ flex: 1, minWidth: 140 }}><StatCard label="Open complaints" value={String(openComplaints)} meta={String(scopedComplaints.filter((c) => c.status === "Escalated").length) + " escalated"} accent={colors.error} icon={TriangleAlert} /></View>
        <View style={{ flex: 1, minWidth: 140 }}><StatCard label="Budget used" value={String(budgetPct) + "%"} meta={"Rs " + String(branch.usedBudget).slice(0, 3) + "k of " + String(branch.monthlyBudget).slice(0, 3) + "k"} accent={colors.slate600} icon={TrendingUp} /></View>
      </View>

      <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 }}>
              <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                <Clock size={16} color={colors.brand} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.textSecondary, textTransform: "uppercase" }}>Live queue</Text>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Employee-manageable tasks</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setPage("tasks")} style={{ backgroundColor: colors.brand, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm }}>
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>All tasks</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: spacing.xl }}>
            {employeeTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                compact
                actions={task.status !== "Completed" ? [
                  { label: "Approve", onPress: () => markTaskDone(task.id), primary: true },
                  { label: "Revise", onPress: () => revokeTask(task.id) },
                ] : undefined}
              />
            ))}
            {employeeTasks.length === 0 && (
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, paddingVertical: spacing.xl }}>No employee tasks pending review</Text>
            )}
          </View>
        </Card>

        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.success + "15", alignItems: "center", justifyContent: "center" }}>
              <Building size={16} color={colors.success} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Quick branch report</Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md }}>
            <View style={{ flex: 1, backgroundColor: colors.emerald50, borderRadius: borderRadius.lg, padding: spacing.xl, minWidth: 120 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                <ShieldCheck size={14} color={colors.emerald700} strokeWidth={2} />
                <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.emerald700 }}>Health score</Text>
              </View>
              <Text style={{ fontSize: fontSize["4xl"], fontWeight: "800", color: colors.emerald700 }}>{branch.health + "%"}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.sky50, borderRadius: borderRadius.lg, padding: spacing.xl, minWidth: 120 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                <Clock size={14} color={colors.sky700} strokeWidth={2} />
                <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.sky700 }}>SLA</Text>
              </View>
              <Text style={{ fontSize: fontSize["4xl"], fontWeight: "800", color: colors.sky700 }}>{branch.sla + "%"}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.amber50, borderRadius: borderRadius.lg, padding: spacing.xl, minWidth: 120 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                <TriangleAlert size={14} color={colors.amber700} strokeWidth={2} />
                <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.amber700 }}>Appliance risk</Text>
              </View>
              <Text style={{ fontSize: fontSize["4xl"], fontWeight: "800", color: colors.amber700 }}>{branch.applianceRisk}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.rose50, borderRadius: borderRadius.lg, padding: spacing.xl, minWidth: 120 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                <AlertCircle size={14} color={colors.rose700} strokeWidth={2} />
                <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.rose700 }}>Critical alerts</Text>
              </View>
              <Text style={{ fontSize: fontSize["4xl"], fontWeight: "800", color: colors.rose700 }}>{branch.criticalAlerts}</Text>
            </View>
          </View>
        </Card>

        <Card variant="soft" style={{ backgroundColor: colors.text }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.md }}>
            <Users size={16} color={colors.slate300} strokeWidth={2} />
            <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.slate300, textTransform: "uppercase" }}>Staff summary</Text>
          </View>
          <View style={{ gap: spacing.lg }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <HardHat size={16} color={colors.slate300} />
                <Text style={{ fontSize: fontSize.sm, color: colors.slate300 }}>Workers</Text>
              </View>
              <Text style={{ fontSize: fontSize["3xl"], fontWeight: "800", color: colors.white }}>{branch.workerCount}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <UserCheck size={16} color={colors.slate300} />
                <Text style={{ fontSize: fontSize.sm, color: colors.slate300 }}>Employees</Text>
              </View>
              <Text style={{ fontSize: fontSize["3xl"], fontWeight: "800", color: colors.white }}>{branch.employeeCount}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <Users size={16} color={colors.slate300} />
                <Text style={{ fontSize: fontSize.sm, color: colors.slate300 }}>Total staff</Text>
              </View>
              <Text style={{ fontSize: fontSize["3xl"], fontWeight: "800", color: colors.white }}>{branch.staffCount}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setPage("branch")} style={{ backgroundColor: colors.white, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, marginTop: spacing.xl, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
            <Building size={14} color={colors.text} strokeWidth={2} />
            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Branch dashboard</Text>
          </TouchableOpacity>
        </Card>

        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.error + "15", alignItems: "center", justifyContent: "center" }}>
              <TriangleAlert size={16} color={colors.error} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Today's alerts</Text>
          </View>
          <View style={{ gap: spacing.md }}>
            <View style={{ backgroundColor: colors.red50, borderRadius: borderRadius.lg, padding: spacing.xl, flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
              <TriangleAlert size={16} color={colors.red700} strokeWidth={2} style={{ marginTop: 2 }} />
              <Text style={{ fontSize: fontSize.sm, color: colors.red700, flex: 1 }}>Fire exit light failed at rear staircase. Safety risk flagged.</Text>
            </View>
            <View style={{ backgroundColor: colors.amber50, borderRadius: borderRadius.lg, padding: spacing.xl, flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
              <AlertCircle size={16} color={colors.amber700} strokeWidth={2} style={{ marginTop: 2 }} />
              <Text style={{ fontSize: fontSize.sm, color: colors.amber700, flex: 1 }}>Lounge AC cooling below threshold. Vendor inspection due.</Text>
            </View>
            <View style={{ backgroundColor: colors.sky50, borderRadius: borderRadius.lg, padding: spacing.xl, flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
              <CalendarDays size={16} color={colors.sky700} strokeWidth={2} style={{ marginTop: 2 }} />
              <Text style={{ fontSize: fontSize.sm, color: colors.sky700, flex: 1 }}>Tomorrow 08:30 safety briefing with Branch Manager.</Text>
            </View>
          </View>
        </Card>
      </View>
    </ScreenWrapper>
  );
}
