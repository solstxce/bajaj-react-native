import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BarChart3, Building, Users, Clock, TriangleAlert, TrendingUp, FileText, Bell, ShieldCheck, AlertCircle, ChevronRight, DollarSign } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { AlertStrip } from "../../shared/components/AlertStrip";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { ProgressBar } from "../../shared/components/ProgressBar";
import { QuickButton } from "../../shared/components/QuickButton";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function RmDashboardScreen() {
  const { scopedBranches, scopedUsers, scopedTasks, scopedComplaints, currentUser, showToast, setPage, openBranchDetail, openAuditTrail } = useApp();
  const totalBranches = scopedBranches.length;
  const totalStaff = scopedUsers.length;
  const avgSla = Math.round(scopedBranches.reduce((s, b) => s + b.sla, 0) / totalBranches);
  const criticalAlerts = scopedBranches.reduce((s, b) => s + b.criticalAlerts, 0);
  const totalBudget = scopedBranches.reduce((s, b) => s + b.monthlyBudget, 0);
  const totalUsed = scopedBranches.reduce((s, b) => s + b.usedBudget, 0);

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Regional Dashboard"
        action={
          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            <QuickButton label="Branches" icon={Building} onPress={() => setPage("intelligence")} />
            <QuickButton label="Alerts" icon={Bell} onPress={() => setPage("alerts")} />
          </View>
        }
      />

      <AlertStrip onReviewAlerts={() => setPage("alerts")} onOpenAudit={openAuditTrail} />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 140 }}><StatCard label="Total branches" value={String(totalBranches)} meta="Across region" accent={colors.brand} icon={Building} /></View>
        <View style={{ flex: 1, minWidth: 140 }}><StatCard label="Total staff" value={String(totalStaff)} meta="All roles combined" accent={colors.brandSecondary} icon={Users} /></View>
        <View style={{ flex: 1, minWidth: 140 }}><StatCard label="Avg SLA" value={`${avgSla}%`} meta="Regional average" accent={colors.success} icon={Clock} /></View>
        <View style={{ flex: 1, minWidth: 140 }}><StatCard label="Critical alerts" value={String(criticalAlerts)} meta="Require attention" accent={colors.error} icon={TriangleAlert} /></View>
      </View>

      <Card variant="glass" style={{ marginTop: spacing.xl }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
          <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
            <BarChart3 size={16} color={colors.brand} strokeWidth={2} />
          </View>
          <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, flex: 1 }}>Branch Health Comparison</Text>
        </View>
        <View style={{ gap: spacing.md }}>
          {scopedBranches.map((branch) => (
            <TouchableOpacity key={branch.id} onPress={() => openBranchDetail(branch.id)} style={{ backgroundColor: colors.bg, borderRadius: borderRadius.xl, padding: spacing.xl }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    <View style={{ width: 28, height: 28, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                      <Building size={14} color={colors.brand} strokeWidth={2} />
                    </View>
                    <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>{branch.name}</Text>
                  </View>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs, marginLeft: 40 }}>{branch.city} | {branch.staffCount} staff</Text>
                </View>
                <View style={{ backgroundColor: branch.health >= 80 ? colors.emerald50 : branch.health >= 60 ? colors.amber50 : colors.rose50, borderRadius: borderRadius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: branch.health >= 80 ? colors.emerald700 : branch.health >= 60 ? colors.amber700 : colors.rose700 }}>{branch.health}%</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.lg }}>
                <View style={{ flex: 1, minWidth: 70, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                  <TrendingUp size={12} color={colors.textSecondary} />
                  <View>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Performance</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{branch.performance}%</Text>
                  </View>
                </View>
                <View style={{ flex: 1, minWidth: 70, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                  <ShieldCheck size={12} color={colors.textSecondary} />
                  <View>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Audit</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{branch.auditScore}</Text>
                  </View>
                </View>
                <View style={{ flex: 1, minWidth: 70, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                  <AlertCircle size={12} color={colors.error} />
                  <View>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Issues</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.error }}>{branch.openIssues}</Text>
                  </View>
                </View>
                <ChevronRight size={16} color={colors.textSecondary} style={{ alignSelf: "center" }} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <Card variant="soft" style={{ flex: 1, minWidth: 140 }}>
          <View style={{ width: 36, height: 36, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center", marginBottom: spacing.md }}>
            <Building size={18} color={colors.brand} strokeWidth={2} />
          </View>
          <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Branches</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>Manage details</Text>
          <TouchableOpacity onPress={() => setPage("intelligence")} style={{ backgroundColor: colors.brand, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, marginTop: spacing.lg, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm }}>
            <Building size={14} color={colors.white} strokeWidth={2} />
            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>View</Text>
          </TouchableOpacity>
        </Card>
        <Card variant="soft" style={{ flex: 1, minWidth: 140 }}>
          <View style={{ width: 36, height: 36, borderRadius: borderRadius.md, backgroundColor: colors.brandSecondary + "15", alignItems: "center", justifyContent: "center", marginBottom: spacing.md }}>
            <TrendingUp size={18} color={colors.brandSecondary} strokeWidth={2} />
          </View>
          <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Analytics</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>Regional insights</Text>
          <TouchableOpacity onPress={() => setPage("analytics")} style={{ backgroundColor: colors.brand, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, marginTop: spacing.lg, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm }}>
            <TrendingUp size={14} color={colors.white} strokeWidth={2} />
            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>Open</Text>
          </TouchableOpacity>
        </Card>
        <Card variant="soft" style={{ flex: 1, minWidth: 140 }}>
          <View style={{ width: 36, height: 36, borderRadius: borderRadius.md, backgroundColor: colors.error + "15", alignItems: "center", justifyContent: "center", marginBottom: spacing.md }}>
            <TriangleAlert size={18} color={colors.error} strokeWidth={2} />
          </View>
          <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Alerts</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{criticalAlerts} critical</Text>
          <TouchableOpacity onPress={() => setPage("alerts")} style={{ backgroundColor: colors.brand, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, marginTop: spacing.lg, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm }}>
            <Bell size={14} color={colors.white} strokeWidth={2} />
            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>Review</Text>
          </TouchableOpacity>
        </Card>
        <Card variant="soft" style={{ flex: 1, minWidth: 140 }}>
          <View style={{ width: 36, height: 36, borderRadius: borderRadius.md, backgroundColor: colors.warning + "15", alignItems: "center", justifyContent: "center", marginBottom: spacing.md }}>
            <DollarSign size={18} color={colors.warning} strokeWidth={2} />
          </View>
          <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Finance</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>Budget & costs</Text>
          <TouchableOpacity onPress={() => setPage("finance")} style={{ backgroundColor: colors.brand, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, marginTop: spacing.lg, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm }}>
            <DollarSign size={14} color={colors.white} strokeWidth={2} />
            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>View</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </ScreenWrapper>
  );
}
