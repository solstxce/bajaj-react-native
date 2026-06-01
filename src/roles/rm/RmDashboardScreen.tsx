import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BarChart3, Building, Users, Clock, TriangleAlert, TrendingUp, FileText, Bell, ShieldCheck, AlertCircle, ChevronRight, DollarSign, Activity } from "lucide-react-native";
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
  const avgSla = Math.round(scopedBranches.reduce((s, b) => s + b.sla, 0) / (totalBranches || 1));
  const criticalAlerts = scopedBranches.reduce((s, b) => s + b.criticalAlerts, 0);

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Regional Dashboard"
      />

      <AlertStrip onReviewAlerts={() => setPage("alerts")} onOpenAudit={openAuditTrail} />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <TouchableOpacity onPress={() => setPage("intelligence")} style={{ flex: 1, minWidth: 160, backgroundColor: colors.white, borderRadius: 24, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, alignItems: "center", gap: spacing.md, elevation: 2 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.sky50, alignItems: "center", justifyContent: "center" }}>
            <Building size={24} color={colors.sky600} />
          </View>
          <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900 }}>Branches</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>{totalBranches} Managed</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPage("analytics")} style={{ flex: 1, minWidth: 160, backgroundColor: colors.white, borderRadius: 24, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, alignItems: "center", gap: spacing.md, elevation: 2 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.emerald50, alignItems: "center", justifyContent: "center" }}>
            <Activity size={24} color={colors.emerald600} />
          </View>
          <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900 }}>Analytics</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>Avg SLA {avgSla}%</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPage("alerts")} style={{ flex: 1, minWidth: 160, backgroundColor: colors.white, borderRadius: 24, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, alignItems: "center", gap: spacing.md, elevation: 2 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.rose50, alignItems: "center", justifyContent: "center" }}>
            <Bell size={24} color={colors.rose600} />
          </View>
          <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900 }}>Alerts</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>{criticalAlerts} Critical</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPage("finance")} style={{ flex: 1, minWidth: 160, backgroundColor: colors.white, borderRadius: 24, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, alignItems: "center", gap: spacing.md, elevation: 2 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.amber50, alignItems: "center", justifyContent: "center" }}>
            <DollarSign size={24} color={colors.amber700} />
          </View>
          <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900 }}>Finance</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>Budget & Costs</Text>
        </TouchableOpacity>
      </View>

      <Card variant="glass" style={{ marginTop: spacing.xl }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
          <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
            <Building size={16} color={colors.brand} strokeWidth={2} />
          </View>
          <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text, flex: 1 }}>Top Performing Branches</Text>
        </View>
        <View style={{ gap: spacing.md }}>
          {scopedBranches.sort((a, b) => b.performance - a.performance).slice(0, 5).map((branch) => (
            <TouchableOpacity key={branch.id} onPress={() => openBranchDetail(branch.id)} style={{ backgroundColor: colors.white, borderRadius: 24, padding: spacing.xl, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>     
                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.slate50, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border }}>
                      <Building size={14} color={colors.slate700} />
                    </View>
                    <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.slate900 }}>{branch.name}</Text>
                  </View>
                  <Text style={{ fontSize: fontSize.sm, color: colors.slate500, marginTop: spacing.xs, marginLeft: 40 }}>{branch.city} | {branch.staffCount} staff</Text>
                </View>
                <Badge label={`${branch.performance}%`} type="Completed" />
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.lg, paddingLeft: 40 }}>
                <View style={{ flex: 1, minWidth: 70 }}>
                  <Text style={{ fontSize: fontSize.xs, color: colors.slate500, textTransform: "uppercase", letterSpacing: 1 }}>Audit</Text>
                  <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900 }}>{branch.auditScore}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 70 }}>
                  <Text style={{ fontSize: fontSize.xs, color: colors.slate500, textTransform: "uppercase", letterSpacing: 1 }}>Issues</Text>
                  <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: branch.openIssues > 0 ? colors.amber700 : colors.emerald700 }}>{branch.openIssues}</Text>
                </View>
                <ChevronRight size={16} color={colors.slate400} style={{ alignSelf: "center" }} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Card>
    </ScreenWrapper>
  );
}
