import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Building, TrendingUp, Users, Clock, AlertCircle, TriangleAlert,
  ShieldCheck, DollarSign, ChevronRight, BarChart3, Activity,
  MapPin, Wrench
} from "lucide-react-native";
import { ScreenWrapper } from "../layout/ScreenWrapper";
import { SectionHeader } from "./SectionHeader";
import { SegmentedControl } from "./SegmentedControl";
import { Badge } from "./Badge";
import { ProgressBar } from "./ProgressBar";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";
import { BranchDeepDiveScreen } from "./detail/BranchDeepDiveScreen";
import { Branch } from "../../types/domain";

export function BranchesScreen() {
  const { state, setTab, scopedBranches, openBranchDetail, openFormModal } = useApp();
  const isRm = state.role === "rm";
  const activeTab = isRm ? (state.tabs.rmIntelligence || "performance") : null;
  const [filterBranch, setFilterBranch] = useState<number | null>(null);
  const [deepDiveBranch, setDeepDiveBranch] = useState<Branch | null>(null);

  const filtered = filterBranch ? scopedBranches.filter((b) => b.id === filterBranch) : scopedBranches;

  if (deepDiveBranch) {
    return (
      <BranchDeepDiveScreen
        branch={deepDiveBranch}
        onBack={() => setDeepDiveBranch(null)}
      />
    );
  }

  return (
    <ScreenWrapper>
      <SectionHeader
        title={isRm ? "Branch Intelligence" : "Branch Directory"}
        subtitle={
          isRm
            ? "Performance score, risk mix, finance burn and drill-down detail across all branches"
            : "Every branch opens into a deep operational drawer with staffing, finance, appliance and issue detail"
        }
        action={
          isRm ? (
            <SegmentedControl
              tabs={[{ label: "Performance", value: "performance" }, { label: "Risk", value: "risk" }]}
              activeKey={activeTab!}
              onChange={(v) => setTab("rmIntelligence", v)}
            />
          ) : undefined
        }
      />

      {isRm && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xl }}>
          <TouchableOpacity onPress={() => setFilterBranch(null)} style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: !filterBranch ? colors.text : colors.slate100 }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: !filterBranch ? colors.white : colors.textSecondary }}>All branches</Text>
          </TouchableOpacity>
          {scopedBranches.map((b) => (
            <TouchableOpacity key={b.id} onPress={() => setFilterBranch(b.id)} style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: filterBranch === b.id ? colors.text : colors.slate100 }}>
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: filterBranch === b.id ? colors.white : colors.textSecondary }}>{b.name.split(" ")[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
        {filtered.length === 0 ? (
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", paddingVertical: spacing["4xl"] }}>No branches found</Text>
        ) : filtered.map((branch) => {
          const budgetPct = Math.round((branch.usedBudget / branch.monthlyBudget) * 100);
          const healthy = branch.health >= 90;

          return (
            <View key={branch.id} style={{ backgroundColor: colors.card, borderRadius: borderRadius["6xl"], borderWidth: 1, borderColor: colors.border, padding: spacing["2xl"] }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    <View style={{ width: 36, height: 36, borderRadius: borderRadius.md, backgroundColor: colors.brandLight, alignItems: "center", justifyContent: "center" }}>
                      <Building size={18} color={colors.brand} strokeWidth={2} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: 2 }}>{branch.code}</Text>
                      <Text style={{ fontSize: fontSize["2xl"], fontWeight: "800", color: colors.text, marginTop: spacing.xs }}>{branch.name}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.sm }}>
                    <MapPin size={10} color={colors.textSecondary} />
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, flex: 1 }}>{branch.city} · {branch.address}</Text>
                  </View>
                  {isRm && (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.xs }}>
                      <TrendingUp size={10} color={colors.brandSecondary} />
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Revenue Index {branch.revenueIndex}</Text>
                    </View>
                  )}
                </View>
                <Badge label={healthy ? "Healthy" : "Watch"} type={healthy ? "Completed" : "High"} />
              </View>

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
                <View style={{ flex: 1, minWidth: 70, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.sm, alignItems: "center" }}>
                  <Activity size={12} color={colors.success} strokeWidth={2} />
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>Health</Text>
                  <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>{formatPctShort(branch.health)}</Text>
                </View>
                {isRm ? (
                  <View style={{ flex: 1, minWidth: 70, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.sm, alignItems: "center" }}>
                    <BarChart3 size={12} color={colors.brandSecondary} strokeWidth={2} />
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>Performance</Text>
                    <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>{branch.performance}%</Text>
                  </View>
                ) : (
                  <View style={{ flex: 1, minWidth: 70, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.sm, alignItems: "center" }}>
                    <Users size={12} color={colors.brand} strokeWidth={2} />
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>Staff</Text>
                    <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>{branch.staffCount}</Text>
                  </View>
                )}
                <View style={{ flex: 1, minWidth: 70, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.sm, alignItems: "center" }}>
                  <Users size={12} color={colors.info} strokeWidth={2} />
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>Attendance</Text>
                  <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>{branch.todayAttendance}%</Text>
                </View>
                <View style={{ flex: 1, minWidth: 70, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.sm, alignItems: "center" }}>
                  <Clock size={12} color={colors.warning} strokeWidth={2} />
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>SLA</Text>
                  <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>{branch.sla}%</Text>
                </View>
                <View style={{ flex: 1, minWidth: 70, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.sm, alignItems: "center" }}>
                  <AlertCircle size={12} color={colors.error} strokeWidth={2} />
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>Issues</Text>
                  <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>{branch.openIssues}</Text>
                </View>
              </View>

              <View style={{ marginTop: spacing.lg }}>
                <ProgressBar value={isRm && activeTab === "risk" ? 100 - branch.criticalAlerts * 15 : branch.health} color={branch.health >= 90 ? colors.success : branch.health >= 80 ? colors.warning : colors.error} />
              </View>

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.xl }}>
                <TouchableOpacity onPress={() => openBranchDetail(branch.id)} style={{ backgroundColor: colors.card, borderRadius: borderRadius["2xl"], paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.textSecondary }}>Overview</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDeepDiveBranch(branch)} style={{ backgroundColor: colors.text, borderRadius: borderRadius["2xl"], paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.white }}>Deep Dive</Text>
                  <ChevronRight size={14} color={colors.white} strokeWidth={2} />
                </TouchableOpacity>
                {!isRm ? (
                  <TouchableOpacity onPress={() => openFormModal("visit")} style={{ backgroundColor: colors.card, borderRadius: borderRadius["2xl"], paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border }}>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.textSecondary }}>Schedule visit</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.lg }}>
                <View style={{ flex: 1, minWidth: 60, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                  <ShieldCheck size={12} color={colors.success} />
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Staff: {branch.workerCount}W · {branch.employeeCount}E</Text>
                </View>
                <View style={{ flex: 1, minWidth: 60, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                  <TriangleAlert size={12} color={colors.error} />
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Critical: {branch.criticalAlerts}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 60, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                  <Wrench size={12} color={colors.warning} />
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Appliance risk: {branch.applianceRisk}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 60, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                  <DollarSign size={12} color={colors.brand} />
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Budget: {budgetPct}%</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScreenWrapper>
  );
}

function formatPctShort(v: number): string {
  return v + "%";
}
