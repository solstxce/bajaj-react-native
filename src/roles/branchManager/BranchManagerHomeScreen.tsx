import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Building, AlertCircle, Stamp, Route, Users, TrendingUp, Clock, CheckCircle, ChevronRight, TriangleAlert } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { AlertStrip } from "../../shared/components/AlertStrip";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { QuickButton } from "../../shared/components/QuickButton";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function BranchManagerHomeScreen() {
  const { scopedBranches, scopedApprovals, scopedNotifications, getBranch, setPage, showToast, approveRequest, rejectRequest, openBranchDetail, openAuditTrail } = useApp();
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

      <AlertStrip onReviewAlerts={() => setPage("notifications")} onOpenAudit={openAuditTrail} />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <TouchableOpacity onPress={() => setPage("branches")} style={{ flex: 1, minWidth: 160, backgroundColor: colors.white, borderRadius: borderRadius["2xl"], padding: spacing.xl, borderWidth: 1, borderColor: colors.border, alignItems: "center", gap: spacing.md, elevation: 2, shadowColor: "rgba(0,91,172,0.04)", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 24 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.sky50, alignItems: "center", justifyContent: "center" }}>
            <Building size={24} color={colors.sky600} />
          </View>
          <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900 }}>Branches</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>{scopedBranches.length} Managed</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPage("attendance")} style={{ flex: 1, minWidth: 160, backgroundColor: colors.white, borderRadius: borderRadius["2xl"], padding: spacing.xl, borderWidth: 1, borderColor: colors.border, alignItems: "center", gap: spacing.md, elevation: 2, shadowColor: "rgba(0,91,172,0.04)", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 24 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.emerald50, alignItems: "center", justifyContent: "center" }}>
            <Users size={24} color={colors.emerald600} />
          </View>
          <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900 }}>Staff</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>{totalStaff} Total</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPage("issues")} style={{ flex: 1, minWidth: 160, backgroundColor: colors.white, borderRadius: borderRadius["2xl"], padding: spacing.xl, borderWidth: 1, borderColor: colors.border, alignItems: "center", gap: spacing.md, elevation: 2, shadowColor: "rgba(0,91,172,0.04)", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 24 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.amber50, alignItems: "center", justifyContent: "center" }}>
            <AlertCircle size={24} color={colors.amber700} />
          </View>
          <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900 }}>Issues</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>{totalIssues} Open</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPage("approvals")} style={{ flex: 1, minWidth: 160, backgroundColor: colors.white, borderRadius: borderRadius["2xl"], padding: spacing.xl, borderWidth: 1, borderColor: colors.border, alignItems: "center", gap: spacing.md, elevation: 2, shadowColor: "rgba(0,91,172,0.04)", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 24 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.slate100, alignItems: "center", justifyContent: "center" }}>
            <Stamp size={24} color={colors.slate700} />
          </View>
          <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900 }}>Approvals</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>{pendingApprovals.length} Pending</Text>
        </TouchableOpacity>
      </View>

      <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
        {pendingApprovals.length > 0 ? (
          <Card variant="glass">
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
              <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.warning + "15", alignItems: "center", justifyContent: "center" }}>
                <Stamp size={16} color={colors.warning} strokeWidth={2} />
              </View>
              <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>Pending Approvals</Text>
            </View>
            <View style={{ gap: spacing.md }}>
              {pendingApprovals.slice(0, 3).map((a) => {
                const branch = getBranch(a.branchId);
                return (
                  <View key={a.id} style={{ backgroundColor: colors.bg, borderRadius: borderRadius.lg, padding: spacing.xl }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.text }}>{a.title}</Text>
                        <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{a.kind} | {branch?.name} | Rs {a.amount.toLocaleString("en-IN")}</Text>
                      </View>
                      <Badge label={a.priority} type={a.priority} />
                    </View>
                    <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg }}>
                      <TouchableOpacity onPress={() => approveRequest(a.id)} style={{ backgroundColor: colors.success, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <CheckCircle size={14} color={colors.white} strokeWidth={2} />
                        <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.white }}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => rejectRequest(a.id)} style={{ backgroundColor: colors.error, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <AlertCircle size={14} color={colors.white} strokeWidth={2} />
                        <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.white }}>Reject</Text>
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
            <Text style={{ fontSize: fontSize.xs, fontWeight: "400", color: colors.slate300, textTransform: "uppercase" }}>Quick Actions</Text>
          </View>
          <View style={{ gap: spacing.md }}>
            <TouchableOpacity onPress={() => setPage("branches")} style={{ backgroundColor: colors.brand, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <Building size={16} color={colors.white} strokeWidth={2} />
              <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.white }}>View Branches</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPage("approvals")} style={{ backgroundColor: colors.white, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <Stamp size={16} color={colors.text} strokeWidth={2} />
              <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.text }}>Review Approvals</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPage("visits")} style={{ backgroundColor: colors.white, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <Route size={16} color={colors.text} strokeWidth={2} />
              <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.text }}>Visit Reports</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.error + "15", alignItems: "center", justifyContent: "center" }}>
              <TriangleAlert size={16} color={colors.error} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>Recent Alerts</Text>
          </View>
          <View style={{ gap: spacing.md }}>
            {criticalAlerts.length > 0 ? criticalAlerts.slice(0, 3).map((n) => (
              <View key={n.id} style={{ backgroundColor: colors.rose50, borderRadius: borderRadius.lg, padding: spacing.xl, flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
                <TriangleAlert size={16} color={colors.rose700} strokeWidth={2} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.rose700 }}>{n.title}</Text>
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
