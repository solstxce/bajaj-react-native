import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Building, AlertCircle, Stamp, Route, Users, TrendingUp, Clock, CheckCircle, ChevronRight, TriangleAlert } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { QuickButton } from "../../shared/components/QuickButton";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function BranchManagerHomeScreen() {
  const { scopedBranches, scopedApprovals, scopedNotifications, getBranch, setPage, showToast, approveRequest, rejectRequest } = useApp();
  const totalStaff = scopedBranches.reduce((s, b) => s + b.staffCount, 0);
  const totalIssues = scopedBranches.reduce((s, b) => s + b.openIssues, 0);
  const avgSla = scopedBranches.length ? Math.round(scopedBranches.reduce((s, b) => s + b.sla, 0) / scopedBranches.length) : 0;
  const pendingApprovals = scopedApprovals.filter((a) => a.status === "Pending");
  const criticalAlerts = scopedNotifications.filter((n) => n.priority === "Critical" && !n.read);

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Branch Manager Overview"
        action={
          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            <QuickButton label="View Branches" icon={Building} onPress={() => setPage("branches")} />
            <QuickButton label="Approvals" icon={Stamp} onPress={() => setPage("approvals")} />
          </View>
        }
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 140 }}><StatCard label="Branches managed" value={String(scopedBranches.length)} meta="Under your oversight" accent={colors.brand} icon={Building} /></View>
        <View style={{ flex: 1, minWidth: 140 }}><StatCard label="Total staff" value={String(totalStaff)} meta="Across all branches" accent={colors.slate600} icon={Users} /></View>
        <View style={{ flex: 1, minWidth: 140 }}><StatCard label="Open issues" value={String(totalIssues)} meta="Across managed branches" accent={colors.error} icon={AlertCircle} /></View>
        <View style={{ flex: 1, minWidth: 140 }}><StatCard label="SLA score" value={avgSla + "%"} meta="Average across branches" accent={colors.success} icon={TrendingUp} /></View>
      </View>

      <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
              <Building size={16} color={colors.brand} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Branch Health Overview</Text>
          </View>
          <View style={{ gap: spacing.md }}>
            {scopedBranches.map((branch) => (
              <View key={branch.id} style={{ backgroundColor: colors.bg, borderRadius: borderRadius.xl, padding: spacing.xl }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>{branch.name}</Text>
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{branch.code} | {branch.city}</Text>
                  </View>
                  <View style={{ backgroundColor: branch.health >= 90 ? colors.emerald50 : branch.health >= 80 ? colors.amber50 : colors.rose50, borderRadius: borderRadius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: branch.health >= 90 ? colors.emerald700 : branch.health >= 80 ? colors.amber700 : colors.rose700 }}>{branch.health}%</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.lg }}>
                  <View style={{ flex: 1, minWidth: 60 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                      <TrendingUp size={12} color={colors.textSecondary} />
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Performance</Text>
                    </View>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{branch.performance}%</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 60 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                      <Clock size={12} color={colors.textSecondary} />
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Attendance</Text>
                    </View>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{branch.todayAttendance}%</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 60 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                      <Users size={12} color={colors.textSecondary} />
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Staff</Text>
                    </View>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{branch.staffCount}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 60 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                      <AlertCircle size={12} color={colors.error} />
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Alerts</Text>
                    </View>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.error }}>{branch.criticalAlerts}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {pendingApprovals.length > 0 ? (
          <Card variant="glass">
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
              <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.warning + "15", alignItems: "center", justifyContent: "center" }}>
                <Stamp size={16} color={colors.warning} strokeWidth={2} />
              </View>
              <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Pending Approvals</Text>
            </View>
            <View style={{ gap: spacing.md }}>
              {pendingApprovals.slice(0, 3).map((a) => {
                const branch = getBranch(a.branchId);
                return (
                  <View key={a.id} style={{ backgroundColor: colors.bg, borderRadius: borderRadius.lg, padding: spacing.xl }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>{a.title}</Text>
                        <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{a.kind} | {branch?.name} | Rs {a.amount.toLocaleString("en-IN")}</Text>
                      </View>
                      <Badge label={a.priority} type={a.priority} />
                    </View>
                    <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg }}>
                      <TouchableOpacity onPress={() => approveRequest(a.id)} style={{ backgroundColor: colors.success, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <CheckCircle size={14} color={colors.white} strokeWidth={2} />
                        <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => rejectRequest(a.id)} style={{ backgroundColor: colors.error, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <AlertCircle size={14} color={colors.white} strokeWidth={2} />
                        <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>
        ) : null}

        <Card variant="soft" style={{ backgroundColor: colors.text }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.md }}>
            <ChevronRight size={16} color={colors.slate300} strokeWidth={2} />
            <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.slate300, textTransform: "uppercase" }}>Quick Actions</Text>
          </View>
          <View style={{ gap: spacing.md }}>
            <TouchableOpacity onPress={() => setPage("branches")} style={{ backgroundColor: colors.brand, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <Building size={16} color={colors.white} strokeWidth={2} />
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>View Branches</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPage("approvals")} style={{ backgroundColor: colors.white, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <Stamp size={16} color={colors.text} strokeWidth={2} />
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Review Approvals</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPage("visits")} style={{ backgroundColor: colors.white, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <Route size={16} color={colors.text} strokeWidth={2} />
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Visit Reports</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.error + "15", alignItems: "center", justifyContent: "center" }}>
              <TriangleAlert size={16} color={colors.error} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Recent Alerts</Text>
          </View>
          <View style={{ gap: spacing.md }}>
            {criticalAlerts.length > 0 ? criticalAlerts.slice(0, 3).map((n) => (
              <View key={n.id} style={{ backgroundColor: colors.rose50, borderRadius: borderRadius.lg, padding: spacing.xl, flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
                <TriangleAlert size={16} color={colors.rose700} strokeWidth={2} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.rose700 }}>{n.title}</Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.rose700, marginTop: spacing.xs }}>{n.detail}</Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.rose700, marginTop: spacing.xs }}>{n.time}</Text>
                </View>
              </View>
            )) : (
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>No critical alerts</Text>
            )}
          </View>
        </Card>
      </View>
    </ScreenWrapper>
  );
}
