import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Stamp, CheckCircle, XCircle, Clock, DollarSign, Building, AlertCircle } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";
import { formatMoney } from "../../utils/helpers";

export function RmApprovalsScreen() {
  const { state, setTab, scopedApprovals, approveRequest, rejectRequest, scopedBranches, showToast } = useApp();
  const filter = state.tabs.approvals || "pending";
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

  const list = scopedApprovals.filter((item) => {
    if (filter === "pending" && item.status !== "Pending") return false;
    if (filter === "approved" && item.status !== "Approved") return false;
    if (filter === "rejected" && item.status !== "Rejected") return false;
    if (selectedBranch && item.branchId !== selectedBranch) return false;
    return true;
  });

  const pendingCount = scopedApprovals.filter((a) => a.status === "Pending").length;

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Approval Queue"
        action={
          <View style={{ gap: spacing.sm }}>
            <SegmentedControl tabs={[{ label: "Pending", value: "pending" }, { label: "Approved", value: "approved" }, { label: "Rejected", value: "rejected" }]} activeKey={filter} onChange={(v) => setTab("approvals", v)} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              <TouchableOpacity onPress={() => setSelectedBranch(null)} style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: !selectedBranch ? colors.brand : colors.slate100 }}>
                <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: !selectedBranch ? colors.white : colors.textSecondary }}>All</Text>
              </TouchableOpacity>
              {scopedBranches.map((b) => (
                <TouchableOpacity key={b.id} onPress={() => setSelectedBranch(b.id)} style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: selectedBranch === b.id ? colors.brand : colors.slate100 }}>
                  <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: selectedBranch === b.id ? colors.white : colors.textSecondary }}>{b.name.split(" ")[0]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
      />

      <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
        {list.map((approval) => (
          <Card variant="glass" key={approval.id}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" }}>
                  <Badge label={approval.kind} type={approval.priority} />
                  <Badge label={approval.priority} type={approval.priority} />
                  <Badge label={approval.stage} type={approval.status} />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.md }}>
                  <View style={{ width: 24, height: 24, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                    <DollarSign size={12} color={colors.brand} strokeWidth={2} />
                  </View>
                  <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>{approval.title}</Text>
                </View>
                <View style={{ flexDirection: "row", gap: spacing.lg, marginTop: spacing.md }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                    <DollarSign size={12} color={colors.brand} />
                    <Text style={{ fontSize: fontSize["2xl"], fontWeight: "700", color: colors.brand }}>{formatMoney(approval.amount)}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                    <Clock size={12} color={colors.textSecondary} />
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{approval.age}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.md }}>{approval.note}</Text>
              </View>
            </View>

            {filter === "pending" && (
              <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.xl }}>
                <TouchableOpacity onPress={() => approveRequest(approval.id)} style={{ backgroundColor: colors.success, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm, flex: 1 }}>
                  <CheckCircle size={16} color={colors.white} strokeWidth={2} />
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => rejectRequest(approval.id)} style={{ backgroundColor: colors.error, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm, flex: 1 }}>
                  <XCircle size={16} color={colors.white} strokeWidth={2} />
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>
        ))}
      </View>
    </ScreenWrapper>
  );
}
