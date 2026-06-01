import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ListChecks,
  Plus,
  ShieldCheck,
  UserPlus,
  Users,
  Wrench,
} from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { Card } from "../../shared/components/Card";
import { StatCard } from "../../shared/components/StatCard";
import { QuickButton } from "../../shared/components/QuickButton";
import { Badge } from "../../shared/components/Badge";
import { ProgressBar } from "../../shared/components/ProgressBar";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

const pct = (value?: number) => `${Math.round(value ?? 0)}%`;

function money(value?: number) {
  const amount = value ?? 0;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${Math.round(amount / 1000)}K`;
  return `₹${amount}`;
}

export function LcHomeScreen() {
  const {
    currentUser,
    getBranch,
    scopedTasks,
    scopedComplaints,
    scopedUsers,
    scopedAppliances,
    setPage,
    openFormModal,
    openTaskDetail,
    openComplaintDetail,
    openUserDetail,
    openApplianceDetail,
  } = useApp();

  const branch = getBranch(currentUser.branchId);
  const branchId = branch?.id ?? currentUser.branchId;

  const tasks = scopedTasks.filter((task) => task.branchId === branchId);
  const pendingTasks = tasks.filter((task) => task.status === "Pending");
  const activeTasks = tasks.filter((task) => task.status === "Pending" || task.status === "In Progress");
  const completedTasks = tasks.filter((task) => task.status === "Completed");
  const complaints = scopedComplaints.filter((complaint) => complaint.branchId === branchId);
  const openComplaints = complaints.filter((complaint) => complaint.status !== "Resolved");
  const staff = scopedUsers.filter((user) => user.branchId === branchId && user.id !== currentUser.id);
  const appliances = scopedAppliances.filter((appliance) => appliance.branchId === branchId);
  const riskyAppliances = appliances.filter(
    (appliance) => appliance.status !== "Operational" || appliance.approvalStatus.includes("Pending")
  );

  const closureRate = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const averageAttendance = staff.length
    ? Math.round(staff.reduce((sum, user) => sum + (user.attendancePct || 0), 0) / staff.length)
    : branch?.todayAttendance ?? 0;

  if (!branch) {
    return (
      <ScreenWrapper>
        <Card>
          <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.slate900 }}>
            LC home unavailable
          </Text>
          <Text style={{ marginTop: spacing.sm, fontSize: fontSize.sm, color: colors.slate500, lineHeight: 18 }}>
            The current LC profile does not have a valid branch assignment. Please switch role or check mock data.
          </Text>
          <View style={{ marginTop: spacing.xl, alignSelf: "flex-start" }}>
            <QuickButton label="Switch role" onPress={() => setPage("profile")} variant="secondary" />
          </View>
        </Card>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={{ marginBottom: spacing.xl }}>
        <Text style={{ fontSize: fontSize["4xl"], fontWeight: "800", color: colors.slate900, letterSpacing: -0.5 }}>
          Branch command center
        </Text>
        <Text style={{ marginTop: spacing.sm, fontSize: fontSize.sm, color: colors.slate500, lineHeight: 18 }}>
          {branch.name}, {branch.city} · {currentUser.name}
        </Text>
      </View>

      {/* Primary actions */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.xl }}>
        <QuickButton label="Create task" icon={Plus} onPress={() => openFormModal("task")} variant="primary" />
        <QuickButton label="Add staff" icon={UserPlus} onPress={() => openFormModal("staff")} variant="secondary" />
        <QuickButton label="Report issue" icon={Wrench} onPress={() => openFormModal("complaint")} variant="secondary" />
      </View>

      {/* Stats */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg }}>
        <View style={{ flex: 1, minWidth: 150 }}>
          <StatCard label="Health" value={pct(branch.health)} meta={`SLA ${pct(branch.sla)}`} icon={ShieldCheck} accent={colors.success} />
        </View>
        <View style={{ flex: 1, minWidth: 150 }}>
          <StatCard label="Open tasks" value={String(activeTasks.length)} meta={`${pendingTasks.length} pending`} icon={ListChecks} accent={colors.brand} />
        </View>
        <View style={{ flex: 1, minWidth: 150 }}>
          <StatCard label="Issues" value={String(openComplaints.length)} meta={`${branch.criticalAlerts} critical`} icon={AlertTriangle} accent={colors.warning} />
        </View>
        <View style={{ flex: 1, minWidth: 150 }}>
          <StatCard label="Attendance" value={pct(averageAttendance)} meta={`${staff.length} staff tracked`} icon={Users} accent={colors.brandSecondary} />
        </View>
      </View>

      {/* Alert summary */}
      {(branch.criticalAlerts > 0 || openComplaints.length > 0 || riskyAppliances.length > 0) ? (
        <Card style={{ marginTop: spacing.xl, backgroundColor: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.25)" }}>
          <View style={{ flexDirection: "row", gap: spacing.md, alignItems: "flex-start" }}>
            <AlertTriangle size={20} color={colors.amber700} strokeWidth={2.2} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.amber700 }}>
                Attention needed
              </Text>
              <Text style={{ marginTop: spacing.xs, fontSize: fontSize.sm, color: colors.amber700, lineHeight: 18 }}>
                {branch.criticalAlerts} critical alerts, {openComplaints.length} open issues, and {riskyAppliances.length} appliance items need review.
              </Text>
            </View>
            <TouchableOpacity onPress={() => setPage("notifications")} style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: borderRadius.lg, backgroundColor: colors.white }}>
              <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.amber700 }}>Review</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ) : null}

      {/* Work queue */}
      <View style={{ marginTop: spacing["3xl"] }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md }}>
          <View>
            <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.slate900 }}>Action queue</Text>
            <Text style={{ marginTop: spacing.xs, fontSize: fontSize.sm, color: colors.slate500 }}>
              Latest branch tasks requiring LC attention
            </Text>
          </View>
          <TouchableOpacity onPress={() => setPage("tasks")}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.brand }}>View all</Text>
          </TouchableOpacity>
        </View>

        <Card>
          {activeTasks.slice(0, 4).map((task, index) => (
            <TouchableOpacity key={task.id} onPress={() => openTaskDetail(task.id)} activeOpacity={0.75}>
              <View style={{ paddingVertical: spacing.lg }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.slate900 }} numberOfLines={1}>
                      {task.title}
                    </Text>
                    <Text style={{ marginTop: spacing.xs, fontSize: fontSize.sm, color: colors.slate500 }} numberOfLines={1}>
                      {task.zone} · {task.schedule}
                    </Text>
                  </View>
                  <Badge label={task.status} type={task.status} />
                </View>
              </View>
              {index < Math.min(activeTasks.length, 4) - 1 ? <View style={{ height: 1, backgroundColor: colors.slate100 }} /> : null}
            </TouchableOpacity>
          ))}
          {activeTasks.length === 0 ? (
            <Text style={{ paddingVertical: spacing.xl, textAlign: "center", fontSize: fontSize.sm, color: colors.slate500 }}>
              No open tasks for this branch.
            </Text>
          ) : null}
        </Card>
      </View>

      {/* Staff pulse */}
      <View style={{ marginTop: spacing["3xl"] }}>
        <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.slate900, marginBottom: spacing.md }}>
          Staff pulse
        </Text>
        <Card>
          {staff.slice(0, 5).map((member, index) => (
            <TouchableOpacity key={member.id} onPress={() => openUserDetail(member.id)} activeOpacity={0.75}>
              <View style={{ paddingVertical: spacing.lg }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.slate900 }} numberOfLines={1}>
                      {member.name}
                    </Text>
                    <Text style={{ marginTop: spacing.xs, fontSize: fontSize.sm, color: colors.slate500 }} numberOfLines={1}>
                      {member.position} · {member.status}
                    </Text>
                  </View>
                  <Text style={{ fontSize: fontSize.md, fontWeight: "800", color: colors.slate900 }}>{pct(member.attendancePct)}</Text>
                </View>
                <View style={{ marginTop: spacing.md }}>
                  <ProgressBar value={member.attendancePct || 0} color={(member.attendancePct || 0) >= 90 ? colors.success : colors.warning} height={6} />
                </View>
              </View>
              {index < Math.min(staff.length, 5) - 1 ? <View style={{ height: 1, backgroundColor: colors.slate100 }} /> : null}
            </TouchableOpacity>
          ))}
          {staff.length === 0 ? (
            <Text style={{ paddingVertical: spacing.xl, textAlign: "center", fontSize: fontSize.sm, color: colors.slate500 }}>
              No staff records available.
            </Text>
          ) : null}
        </Card>
      </View>

      {/* Branch snapshot */}
      <View style={{ marginTop: spacing["3xl"] }}>
        <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.slate900, marginBottom: spacing.md }}>
          Branch snapshot
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg }}>
          <View style={{ flex: 1, minWidth: 150 }}>
            <Card>
              <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.slate400, textTransform: "uppercase", letterSpacing: 1 }}>Budget used</Text>
              <Text style={{ marginTop: spacing.sm, fontSize: fontSize["3xl"], fontWeight: "800", color: colors.slate900 }}>{money(branch.usedBudget)}</Text>
              <Text style={{ marginTop: spacing.xs, fontSize: fontSize.sm, color: colors.slate500 }}>of {money(branch.monthlyBudget)}</Text>
            </Card>
          </View>
          <View style={{ flex: 1, minWidth: 150 }}>
            <Card>
              <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.slate400, textTransform: "uppercase", letterSpacing: 1 }}>Closure rate</Text>
              <Text style={{ marginTop: spacing.sm, fontSize: fontSize["3xl"], fontWeight: "800", color: colors.slate900 }}>{pct(closureRate)}</Text>
              <Text style={{ marginTop: spacing.xs, fontSize: fontSize.sm, color: colors.slate500 }}>{completedTasks.length} of {tasks.length} tasks</Text>
            </Card>
          </View>
        </View>
      </View>

      {/* Appliances */}
      {riskyAppliances.length > 0 ? (
        <View style={{ marginTop: spacing["3xl"] }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md }}>
            <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.slate900 }}>Appliance watch</Text>
            <TouchableOpacity onPress={() => setPage("branch")}>
              <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.brand }}>Open branch</Text>
            </TouchableOpacity>
          </View>
          <Card>
            {riskyAppliances.slice(0, 3).map((appliance, index) => (
              <TouchableOpacity key={appliance.id} onPress={() => openApplianceDetail(appliance.id)} activeOpacity={0.75}>
                <View style={{ paddingVertical: spacing.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.slate900 }} numberOfLines={1}>{appliance.name}</Text>
                    <Text style={{ marginTop: spacing.xs, fontSize: fontSize.sm, color: colors.slate500 }} numberOfLines={1}>{appliance.zone} · {appliance.category}</Text>
                  </View>
                  <Badge label={appliance.status} type={appliance.status} />
                </View>
                {index < Math.min(riskyAppliances.length, 3) - 1 ? <View style={{ height: 1, backgroundColor: colors.slate100 }} /> : null}
              </TouchableOpacity>
            ))}
          </Card>
        </View>
      ) : null}

      {/* Complaint shortcut */}
      {openComplaints.length > 0 ? (
        <View style={{ marginTop: spacing["3xl"] }}>
          <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.slate900, marginBottom: spacing.md }}>Open issues</Text>
          <Card>
            {openComplaints.slice(0, 3).map((complaint, index) => (
              <TouchableOpacity key={complaint.id} onPress={() => openComplaintDetail(complaint.id)} activeOpacity={0.75}>
                <View style={{ paddingVertical: spacing.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: fontSize.md, fontWeight: "700", color: colors.slate900 }} numberOfLines={1}>{complaint.title}</Text>
                    <Text style={{ marginTop: spacing.xs, fontSize: fontSize.sm, color: colors.slate500 }} numberOfLines={1}>{complaint.type} · {complaint.impact}</Text>
                  </View>
                  <Badge label={complaint.priority} type={complaint.priority} />
                </View>
                {index < Math.min(openComplaints.length, 3) - 1 ? <View style={{ height: 1, backgroundColor: colors.slate100 }} /> : null}
              </TouchableOpacity>
            ))}
          </Card>
        </View>
      ) : null}

      <View style={{ height: 12 }} />
    </ScreenWrapper>
  );
}
