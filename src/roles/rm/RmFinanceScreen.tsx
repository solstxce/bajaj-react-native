import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Wallet, TrendingDown, DollarSign, Building, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { ProgressBar } from "../../shared/components/ProgressBar";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";
import { formatMoney } from "../../utils/helpers";

export function RmFinanceScreen() {
  const { scopedBranches, scopedApprovals, openBranchDetail } = useApp();
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const filtered = selectedBranch ? scopedBranches.filter((b) => b.id === selectedBranch) : scopedBranches;

  const totalBudget = filtered.reduce((s, b) => s + b.monthlyBudget, 0);
  const totalUsed = filtered.reduce((s, b) => s + b.usedBudget, 0);
  const budgetPct = Math.round((totalUsed / totalBudget) * 100);
  const pendingApprovals = scopedApprovals.filter((a) => a.status === "Pending" && (!selectedBranch || a.branchId === selectedBranch));

  return (
    <ScreenWrapper>
      <SectionHeader title="Issues & Costs" />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xl }}>
        <TouchableOpacity onPress={() => setSelectedBranch(null)} style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: !selectedBranch ? colors.brand : colors.slate100 }}>
          <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: !selectedBranch ? colors.white : colors.textSecondary }}>All</Text>
        </TouchableOpacity>
        {scopedBranches.map((b) => (
          <TouchableOpacity key={b.id} onPress={() => setSelectedBranch(b.id)} style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: selectedBranch === b.id ? colors.brand : colors.slate100 }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: selectedBranch === b.id ? colors.white : colors.textSecondary }}>{b.name.split(" ")[0]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 140 }}><StatCard label="Total budget" value={formatMoney(totalBudget)} meta="Monthly regional" accent={colors.brand} icon={Wallet} /></View>
        <View style={{ flex: 1, minWidth: 140 }}><StatCard label="Total used" value={formatMoney(totalUsed)} meta={`${budgetPct}% utilized`} accent={colors.warning} icon={DollarSign} /></View>
        <View style={{ flex: 1, minWidth: 140 }}><StatCard label="Pending" value={String(pendingApprovals.length)} meta="Finance requests" accent={colors.error} icon={AlertCircle} /></View>
        <View style={{ flex: 1, minWidth: 140 }}><StatCard label="Avg use" value={`${budgetPct}%`} meta="Regional average" accent={colors.brandSecondary} icon={TrendingDown} /></View>
      </View>

      <Card variant="glass" style={{ marginTop: spacing.xl }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
          <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
            <DollarSign size={16} color={colors.brand} strokeWidth={2} />
          </View>
          <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Budget Usage Per Branch</Text>
        </View>
        <View style={{ gap: spacing.md }}>
          {filtered.map((branch) => {
            const pct = Math.round((branch.usedBudget / branch.monthlyBudget) * 100);
            return (
              <TouchableOpacity key={branch.id} onPress={() => openBranchDetail(branch.id)} activeOpacity={0.7} style={{ backgroundColor: colors.bg, borderRadius: borderRadius.xl, padding: spacing.xl }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    <View style={{ width: 24, height: 24, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                      <Building size={12} color={colors.brand} strokeWidth={2} />
                    </View>
                    <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>{branch.name}</Text>
                  </View>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: pct >= 80 ? colors.error : pct >= 60 ? colors.warning : colors.success }}>{pct}%</Text>
                </View>
                <ProgressBar value={pct} color={pct >= 80 ? colors.error : pct >= 60 ? colors.warning : colors.success} height={8} />
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: spacing.md }}>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Used: {formatMoney(branch.usedBudget)}</Text>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Budget: {formatMoney(branch.monthlyBudget)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      <Card variant="glass" style={{ marginTop: spacing.xl }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
          <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.warning + "15", alignItems: "center", justifyContent: "center" }}>
            <Wallet size={16} color={colors.warning} strokeWidth={2} />
          </View>
          <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Pending Financial Approvals</Text>
        </View>
        <View style={{ gap: spacing.md }}>
          {pendingApprovals.slice(0, 5).map((approval) => (
            <View key={approval.id} style={{ backgroundColor: colors.bg, borderRadius: borderRadius.xl, padding: spacing.xl }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", gap: spacing.sm, alignItems: "center" }}>
                    <Badge label={approval.kind} type={approval.priority} />
                    <Badge label={approval.priority} type={approval.priority} />
                  </View>
                  <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginTop: spacing.md }}>{approval.title}</Text>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{approval.note}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.md }}>
                    <Text style={{ fontSize: fontSize["2xl"], fontWeight: "700", color: colors.brand }}>{formatMoney(approval.amount)}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                      <Clock size={12} color={colors.textSecondary} />
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{approval.age}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
          {pendingApprovals.length === 0 && (
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", padding: spacing.xl }}>No pending approvals</Text>
          )}
        </View>
      </Card>
    </ScreenWrapper>
  );
}
