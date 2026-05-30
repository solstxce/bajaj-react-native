import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Building, Users, HardHat, UserCheck, TrendingUp, TriangleAlert, Bell, ShieldCheck, Clock, CalendarDays, MapPin, Wrench, DollarSign } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { ProgressBar } from "../../shared/components/ProgressBar";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";
import { formatMoney } from "../../utils/helpers";

export function AmBranchScreen() {
  const { state, setTab, currentUser, getBranch, scopedUsers, scopedComplaints, scopedTasks, scopedAppliances, openUserDetail, openTaskDetail, openComplaintDetail, openApplianceDetail, openBranchDetail } = useApp();
  const branch = getBranch(currentUser.branchId)!;
  const activeTab = state.tabs.amBranch || "workers";
  const budgetPct = Math.round((branch.usedBudget / branch.monthlyBudget) * 100);
  const branchUsers = scopedUsers.filter((u) => u.branchId === branch.id);
  const branchTasks = scopedTasks.filter((t) => t.branchId === branch.id);
  const branchIssues = scopedComplaints.filter((c) => c.branchId === branch.id);
  const branchAssets = scopedAppliances.filter((a) => a.branchId === branch.id);

  return (
    <ScreenWrapper>
      <SectionHeader
        title={"Branch dashboard - " + branch.name}
        action={
            <SegmentedControl
            tabs={[
              { label: "Workers", value: "workers" },
              { label: "Appliances", value: "appliances" },
              { label: "Audit", value: "audit" },
            ]}
            activeKey={activeTab}
            onChange={(v) => setTab("amBranch", v)}
          />
        }
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Health" value={String(branch.health) + "%"} meta="Overall score" accent={colors.success} icon={ShieldCheck} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Performance" value={String(branch.performance) + "%"} meta="Ops rating" accent={colors.brand} icon={TrendingUp} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Attendance" value={String(branch.todayAttendance) + "%"} meta="Today's staff in" accent={colors.brandSecondary} icon={UserCheck} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="SLA" value={String(branch.sla) + "%"} meta="Service level" accent={colors.slate600} icon={Clock} /></View>
      </View>

      <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
        {activeTab === "workers" && (
          <>
            <Card variant="glass">
              <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Worker roster</Text>
              <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
                {branchUsers.filter((u) => u.role === "worker").map((user) => (
                  <TouchableOpacity key={user.id} onPress={() => openUserDetail(user.id)} style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.brandSecondary + "15", alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.brandSecondary }}>{user.name.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: spacing.md }}>
                      <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{user.name}</Text>
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{user.position} | Attendance {user.attendancePct}%</Text>
                    </View>
                    <Badge label={user.status} type={user.status} />
                  </TouchableOpacity>
                ))}
                {branchUsers.filter((u) => u.role === "worker").length === 0 && (
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>No workers in this branch</Text>
                )}
              </View>
            </Card>
            <Card variant="glass">
              <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Worker tasks</Text>
              <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
                {branchTasks.filter((t) => t.audience === "worker").slice(0, 5).map((task) => (
                  <TouchableOpacity key={task.id} onPress={() => openTaskDetail(task.id)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{task.title}</Text>
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{task.status} | {task.priority}</Text>
                    </View>
                    <Badge label={task.status} type={task.status} />
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          </>
        )}

        {activeTab === "appliances" && (
          <>
            <Card variant="glass">
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.lg }}>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Appliance status</Text>
                <Badge label={String(branchAssets.filter((a) => a.status !== "Operational").length) + " at risk"} type="Warning" />
              </View>
              <View style={{ gap: spacing.md }}>
                {branchAssets.slice(0, 8).map((app) => (
                  <TouchableOpacity key={app.id} onPress={() => openApplianceDetail(app.id)} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                      <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: (app.status === "Operational" ? colors.success : colors.warning) + "15", alignItems: "center", justifyContent: "center" }}>
                        <Wrench size={16} color={app.status === "Operational" ? colors.success : colors.warning} strokeWidth={2} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{app.name}</Text>
                        <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{app.zone} | {app.category}</Text>
                      </View>
                    </View>
                    <Badge label={app.status} type={app.status} />
                  </TouchableOpacity>
                ))}
                {branchAssets.length === 0 && (
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>No appliances in this branch</Text>
                )}
              </View>
            </Card>
            <Card variant="glass">
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
                <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.error + "15", alignItems: "center", justifyContent: "center" }}>
                  <TriangleAlert size={16} color={colors.error} strokeWidth={2} />
                </View>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Recent alerts & issues</Text>
              </View>
              <View style={{ gap: spacing.md }}>
                <View style={{ backgroundColor: colors.red50, borderRadius: borderRadius.lg, padding: spacing.xl, flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
                  <TriangleAlert size={16} color={colors.red700} strokeWidth={2} style={{ marginTop: 2 }} />
                  <Text style={{ fontSize: fontSize.sm, color: colors.red700, flex: 1 }}>Fire exit light down at rear staircase. Compliance risk.</Text>
                </View>
                <View style={{ backgroundColor: colors.amber50, borderRadius: borderRadius.lg, padding: spacing.xl, flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
                  <TriangleAlert size={16} color={colors.amber700} strokeWidth={2} style={{ marginTop: 2 }} />
                  <Text style={{ fontSize: fontSize.sm, color: colors.amber700, flex: 1 }}>Lounge AC cooling issue. Vendor inspection pending.</Text>
                </View>
                <View style={{ backgroundColor: colors.sky50, borderRadius: borderRadius.lg, padding: spacing.xl, flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
                  <Bell size={16} color={colors.sky700} strokeWidth={2} style={{ marginTop: 2 }} />
                  <Text style={{ fontSize: fontSize.sm, color: colors.sky700, flex: 1 }}>Safety briefing tomorrow 08:30 with all staff.</Text>
                </View>
              </View>
            </Card>
          </>
        )}

        {activeTab === "audit" && (
          <>
            <Card variant="glass">
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
                <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.success + "15", alignItems: "center", justifyContent: "center" }}>
                  <ShieldCheck size={16} color={colors.success} strokeWidth={2} />
                </View>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Audit readiness</Text>
              </View>
              <View style={{ gap: spacing.md }}>
                <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.xl }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm }}>
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Audit score</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>{branch.auditScore}%</Text>
                  </View>
                  <ProgressBar value={branch.auditScore} color={branch.auditScore >= 80 ? colors.success : branch.auditScore >= 60 ? colors.warning : colors.error} />
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md }}>
                  <View style={{ flex: 1, minWidth: 120, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.xl }}>
                    <Clock size={16} color={colors.textSecondary} strokeWidth={2} />
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text, marginTop: spacing.sm }}>Shift window</Text>
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{branch.shiftWindow}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 120, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.xl }}>
                    <MapPin size={16} color={colors.textSecondary} strokeWidth={2} />
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text, marginTop: spacing.sm }}>Geo radius</Text>
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{branch.geoRadius}m</Text>
                  </View>
                </View>
              </View>
            </Card>
            <Card variant="glass">
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
                <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                  <TrendingUp size={16} color={colors.brand} strokeWidth={2} />
                </View>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Budget usage</Text>
              </View>
              <View style={{ gap: spacing.sm }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Monthly budget</Text>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{formatMoney(branch.monthlyBudget)}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Used</Text>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{formatMoney(branch.usedBudget)}</Text>
                </View>
                <ProgressBar value={budgetPct} color={budgetPct > 80 ? colors.error : budgetPct > 60 ? colors.warning : colors.success} />
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{budgetPct}% utilised</Text>
              </View>
            </Card>
            <Card variant="glass">
              <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Open issues</Text>
              <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
                {branchIssues.slice(0, 5).map((c) => (
                  <TouchableOpacity key={c.id} onPress={() => openComplaintDetail(c.id)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{c.title}</Text>
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{c.status} | {c.priority}</Text>
                    </View>
                    <Badge label={c.status} type={c.status} />
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
            <Card variant="glass">
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
                <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                  <Building size={16} color={colors.brand} strokeWidth={2} />
                </View>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Branch info</Text>
              </View>
              <View style={{ gap: spacing.md }}>
                {[
                  { label: "Code", value: branch.code, icon: Building },
                  { label: "Address", value: branch.address, icon: MapPin },
                  { label: "Shift window", value: branch.shiftWindow, icon: Clock },
                  { label: "Last visit", value: branch.lastVisit, icon: CalendarDays },
                ].map((row) => (
                  <View key={row.label} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                      <row.icon size={14} color={colors.textSecondary} strokeWidth={2} />
                      <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{row.label}</Text>
                    </View>
                    <Text numberOfLines={1} style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text, maxWidth: 180 }}>{row.value}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </>
        )}
      </View>
    </ScreenWrapper>
  );
}
