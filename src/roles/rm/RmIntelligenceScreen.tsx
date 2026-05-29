import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TrendingUp, Shield, ClipboardCheck, TriangleAlert, ArrowUp, ArrowDown, Building, Filter } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { ProgressBar } from "../../shared/components/ProgressBar";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function RmIntelligenceScreen() {
  const { state, setTab, scopedBranches } = useApp();
  const activeTab = state.tabs.rmIntelligence || "performance";
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

  const filtered = selectedBranch ? scopedBranches.filter((b) => b.id === selectedBranch) : scopedBranches;

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Branch Intelligence"
        action={
          <SegmentedControl tabs={[{ label: "Performance", value: "performance" }, { label: "Risk", value: "risk" }, { label: "Audit", value: "audit" }]} activeKey={activeTab} onChange={(v) => setTab("rmIntelligence", v)} />
        }
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xl }}>
        <TouchableOpacity onPress={() => setSelectedBranch(null)} style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: !selectedBranch ? colors.brand : colors.slate100 }}>
          <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: !selectedBranch ? colors.white : colors.textSecondary }}>All branches</Text>
        </TouchableOpacity>
        {scopedBranches.map((b) => (
          <TouchableOpacity key={b.id} onPress={() => setSelectedBranch(b.id)} style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: selectedBranch === b.id ? colors.brand : colors.slate100 }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: selectedBranch === b.id ? colors.white : colors.textSecondary }}>{b.name.split(" ")[0]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "performance" && (
        <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
          {filtered.map((branch) => (
            <Card variant="glass" key={branch.id}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <View style={{ width: 28, height: 28, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                    <Building size={14} color={colors.brand} strokeWidth={2} />
                  </View>
                  <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>{branch.name}</Text>
                </View>
                <Badge label={`${branch.performance}%`} type={branch.performance >= 80 ? "Completed" : branch.performance >= 60 ? "Warning" : "Error"} />
              </View>
              <View style={{ marginTop: spacing.lg }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm }}>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>SLA compliance</Text>
                  <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.text }}>{branch.sla}%</Text>
                </View>
                <ProgressBar value={branch.sla} color={branch.sla >= 80 ? colors.success : branch.sla >= 60 ? colors.warning : colors.error} />
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.lg }}>
                <View style={{ flex: 1, minWidth: 80, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <TrendingUp size={14} color={colors.brand} />
                  <View>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Revenue</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>{branch.revenueIndex}</Text>
                  </View>
                </View>
                <View style={{ flex: 1, minWidth: 80, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <ClipboardCheck size={14} color={colors.brandSecondary} />
                  <View>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Footfall</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>{branch.customerFootfall}</Text>
                  </View>
                </View>
                <View style={{ flex: 1, minWidth: 80, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <Shield size={14} color={colors.success} />
                  <View>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Attendance</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>{branch.todayAttendance}%</Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}

      {activeTab === "risk" && (
        <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
          {filtered.map((branch) => {
            const riskLevel = branch.applianceRisk >= 3 ? "High" : branch.applianceRisk >= 2 ? "Medium" : "Low";
            return (
              <Card variant="glass" key={branch.id}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    <View style={{ width: 28, height: 28, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                      <Building size={14} color={colors.brand} strokeWidth={2} />
                    </View>
                    <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>{branch.name}</Text>
                  </View>
                  <Badge label={riskLevel} type={riskLevel} />
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.lg }}>
                  <View style={{ flex: 1, minWidth: 90, backgroundColor: colors.rose50, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: "center" }}>
                    <TriangleAlert size={16} color={colors.error} strokeWidth={2} />
                    <Text style={{ fontSize: fontSize.xs, color: colors.error, marginTop: spacing.xs }}>Appliance risk</Text>
                    <Text style={{ fontSize: fontSize["2xl"], fontWeight: "700", color: colors.error, marginTop: spacing.xs }}>{branch.applianceRisk}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 90, backgroundColor: colors.amber50, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: "center" }}>
                    <Shield size={16} color={colors.warning} strokeWidth={2} />
                    <Text style={{ fontSize: fontSize.xs, color: colors.warning, marginTop: spacing.xs }}>Critical alerts</Text>
                    <Text style={{ fontSize: fontSize["2xl"], fontWeight: "700", color: colors.warning, marginTop: spacing.xs }}>{branch.criticalAlerts}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 90, backgroundColor: colors.sky50, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: "center" }}>
                    <ClipboardCheck size={16} color={colors.brandSecondary} strokeWidth={2} />
                    <Text style={{ fontSize: fontSize.xs, color: colors.brandSecondary, marginTop: spacing.xs }}>Open issues</Text>
                    <Text style={{ fontSize: fontSize["2xl"], fontWeight: "700", color: colors.brandSecondary, marginTop: spacing.xs }}>{branch.openIssues}</Text>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>
      )}

      {activeTab === "audit" && (
        <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
          {filtered.map((branch) => (
            <Card variant="glass" key={branch.id}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <View style={{ width: 28, height: 28, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                    <Building size={14} color={colors.brand} strokeWidth={2} />
                  </View>
                  <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>{branch.name}</Text>
                </View>
                <Text style={{ fontSize: fontSize["4xl"], fontWeight: "700", color: branch.auditScore >= 80 ? colors.success : branch.auditScore >= 60 ? colors.warning : colors.error }}>{branch.auditScore}</Text>
              </View>
              <ProgressBar value={branch.auditScore} color={branch.auditScore >= 80 ? colors.success : branch.auditScore >= 60 ? colors.warning : colors.error} height={8} />
              <View style={{ flexDirection: "row", gap: spacing.lg, marginTop: spacing.lg }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <ArrowUp size={14} color={colors.success} />
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Health: {branch.health}%</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <ArrowDown size={14} color={colors.textSecondary} />
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Issues: {branch.openIssues}</Text>
                </View>
              </View>
              <View style={{ marginTop: spacing.lg, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Last visit: {branch.lastVisit}</Text>
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Next: {branch.nextVisit}</Text>
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScreenWrapper>
  );
}
