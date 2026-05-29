import React from "react";
import { View, Text } from "react-native";
import { Building, Users, TrendingUp, DollarSign, Activity, HardHat, UserCheck, AlertCircle, TriangleAlert, ShieldCheck } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { Card } from "../../shared/components/Card";
import { ProgressBar } from "../../shared/components/ProgressBar";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";
import { formatPct, formatMoney } from "../../utils/helpers";

export function BranchManagerBranchesScreen() {
  const { scopedBranches } = useApp();
  const totalStaff = scopedBranches.reduce((s, b) => s + b.staffCount, 0);
  const avgHealth = scopedBranches.length ? Math.round(scopedBranches.reduce((s, b) => s + b.health, 0) / scopedBranches.length) : 0;

  return (
    <ScreenWrapper>
      <SectionHeader title="Branch Portfolio" />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xl, marginTop: spacing.xl }}>
        {scopedBranches.map((branch) => {
          const budgetPct = Math.round((branch.usedBudget / branch.monthlyBudget) * 100);
          return (
            <View key={branch.id} style={{ width: "100%" }}>
              <Card variant="glass">
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                      <View style={{ width: 28, height: 28, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                        <Building size={14} color={colors.brand} strokeWidth={2} />
                      </View>
                      <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.textSecondary, textTransform: "uppercase" }}>{branch.code}</Text>
                    </View>
                    <Text style={{ fontSize: fontSize["lg"], fontWeight: "700", color: colors.text, marginTop: spacing.sm }}>{branch.name}</Text>
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{branch.address}</Text>
                  </View>
                  <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: branch.health >= 90 ? colors.emerald50 : branch.health >= 80 ? colors.amber50 : colors.rose50, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: branch.health >= 90 ? colors.emerald700 : branch.health >= 80 ? colors.amber700 : colors.rose700 }}>{branch.health}%</Text>
                  </View>
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.xl }}>
                  <View style={{ flex: 1, minWidth: 100 }}>
                    <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.lg }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <TrendingUp size={14} color={colors.success} />
                        <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Performance</Text>
                      </View>
                      <Text style={{ fontSize: fontSize.xl, fontWeight: "700", color: colors.text, marginTop: spacing.xs }}>{branch.performance}%</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, minWidth: 100 }}>
                    <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.lg }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <Activity size={14} color={colors.brandSecondary} />
                        <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Attendance</Text>
                      </View>
                      <Text style={{ fontSize: fontSize.xl, fontWeight: "700", color: colors.text, marginTop: spacing.xs }}>{branch.todayAttendance}%</Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.md }}>
                  <View style={{ flex: 1, minWidth: 100 }}>
                    <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.lg }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <Users size={14} color={colors.text} />
                        <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Staff</Text>
                      </View>
                      <Text style={{ fontSize: fontSize.xl, fontWeight: "700", color: colors.text, marginTop: spacing.xs }}>{branch.staffCount} <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>({branch.workerCount}W/{branch.employeeCount}E)</Text></Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, minWidth: 100 }}>
                    <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.lg }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <DollarSign size={14} color={colors.warning} />
                        <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Budget</Text>
                      </View>
                      <Text style={{ fontSize: fontSize.xl, fontWeight: "700", color: colors.text, marginTop: spacing.xs }}>{formatMoney(branch.usedBudget)}</Text>
                    </View>
                  </View>
                </View>

                <View style={{ marginTop: spacing.xl }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm }}>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Budget usage</Text>
                    <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.text }}>{formatPct(budgetPct)}</Text>
                  </View>
                  <ProgressBar value={budgetPct} color={budgetPct > 85 ? colors.error : budgetPct > 70 ? colors.warning : colors.success} />
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.xl }}>
                  <View style={{ flex: 1, minWidth: 70, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                    <AlertCircle size={12} color={colors.error} />
                    <View>
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Open issues</Text>
                      <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.error }}>{branch.openIssues}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, minWidth: 70, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                    <TriangleAlert size={12} color={colors.error} />
                    <View>
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Critical alerts</Text>
                      <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.error }}>{branch.criticalAlerts}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, minWidth: 70, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                    <TriangleAlert size={12} color={colors.warning} />
                    <View>
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Appliance risk</Text>
                      <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.warning }}>{branch.applianceRisk}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, minWidth: 70, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                    <ShieldCheck size={12} color={colors.text} />
                    <View>
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Audit score</Text>
                      <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{branch.auditScore}</Text>
                    </View>
                  </View>
                </View>
              </Card>
            </View>
          );
        })}
      </View>
    </ScreenWrapper>
  );
}
