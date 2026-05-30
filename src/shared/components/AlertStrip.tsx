import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TriangleAlert } from "lucide-react-native";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";
import { useApp } from "../../context/AppContext";

interface Props {
  onReviewAlerts?: () => void;
  onOpenAudit?: () => void;
}

export function AlertStrip({ onReviewAlerts, onOpenAudit }: Props) {
  const { scopedBranches, scopedComplaints } = useApp();
  const criticalCount = scopedBranches.reduce((sum, b) => sum + b.criticalAlerts, 0);
  const openCount = scopedComplaints.filter((c) => c.status !== "Resolved").length;

  if (criticalCount === 0 && openCount === 0) return null;

  return (
    <View style={{ backgroundColor: colors.card, borderRadius: borderRadius["4xl"], borderWidth: 1, borderColor: colors.border, padding: spacing.xl }}>
      <View style={{ flexDirection: "column", gap: spacing.lg }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.lg }}>
          <View style={{ width: 40, height: 40, borderRadius: borderRadius.lg, backgroundColor: colors.rose100, alignItems: "center", justifyContent: "center" }}>
            <TriangleAlert size={18} color={colors.rose600} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>
              {criticalCount} critical alert{criticalCount !== 1 ? "s" : ""} and {openCount} open issue{openCount !== 1 ? "s" : ""} in current scope
            </Text>
            <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>
              Escalation chain is active for missing proof, attendance deviations and appliance failures.
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          {onReviewAlerts ? (
            <TouchableOpacity onPress={onReviewAlerts} style={{ backgroundColor: colors.text, borderRadius: borderRadius["2xl"], paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}>
              <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.white }}>Review alerts</Text>
            </TouchableOpacity>
          ) : null}
          {onOpenAudit ? (
            <TouchableOpacity onPress={onOpenAudit} style={{ backgroundColor: colors.card, borderRadius: borderRadius["2xl"], paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.textSecondary }}>Open audit trail</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}
