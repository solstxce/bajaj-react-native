import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Wrench, MapPin, DollarSign, TrendingUp, Calendar, Eye } from "lucide-react-native";
import { Complaint } from "../../types/domain";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius, shadows } from "../../theme/theme";
import { formatMoney } from "../../utils/helpers";
import { Badge } from "./Badge";

interface Props {
  item: Complaint;
  actions?: { label: string; onPress: () => void; primary?: boolean; danger?: boolean }[];
}

export function ComplaintCard({ item, actions }: Props) {
  const { getBranch, openComplaintDetail } = useApp();
  const branch = getBranch(item.branchId);

  return (
    <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl, ...shadows.card }}>
      <View style={{ gap: spacing.xl }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" }}>
            <Badge label={item.status} type={item.status} />
            <Badge label={item.priority} type={item.priority} />
            <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.textSecondary, textTransform: "uppercase" }}>{item.type}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: spacing.md, marginTop: spacing.lg }}>
            <View style={{ width: 28, height: 28, borderRadius: borderRadius.md, backgroundColor: colors.error + "15", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
              <Wrench size={14} color={colors.error} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, flex: 1 }}>{item.title}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xs, marginLeft: spacing.md + spacing.lg }}>
            <MapPin size={12} color={colors.textSecondary} strokeWidth={2} />
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{branch?.name} | {item.impact}</Text>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
            <View style={{ minWidth: 80, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <Wrench size={14} color={colors.textSecondary} strokeWidth={2} />
              <View>
                <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Vendor</Text>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{item.assignedVendor}</Text>
              </View>
            </View>
            <View style={{ minWidth: 80, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <DollarSign size={14} color={colors.textSecondary} strokeWidth={2} />
              <View>
                <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Est. Cost</Text>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{formatMoney(item.estimatedCost)}</Text>
              </View>
            </View>
            <View style={{ minWidth: 80, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <TrendingUp size={14} color={colors.textSecondary} strokeWidth={2} />
              <View>
                <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Escalation</Text>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{item.escalationStage}</Text>
              </View>
            </View>
            <View style={{ minWidth: 80, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <Calendar size={14} color={colors.textSecondary} strokeWidth={2} />
              <View>
                <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Raised</Text>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{item.createdAt}</Text>
              </View>
            </View>
          </View>
        </View>

        {actions && actions.length > 0 ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.lg }}>
            <TouchableOpacity
              onPress={() => openComplaintDetail(item.id)}
              style={{
                borderRadius: borderRadius.lg,
                paddingHorizontal: spacing.xl,
                paddingVertical: spacing.md,
                backgroundColor: colors.brand,
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <Eye size={14} color={colors.white} strokeWidth={2} />
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>Detail</Text>
            </TouchableOpacity>
            {actions.map((a, i) => (
              <TouchableOpacity
                key={i}
                onPress={a.onPress}
                style={{
                  borderRadius: borderRadius.lg,
                  paddingHorizontal: spacing.xl,
                  paddingVertical: spacing.md,
                  backgroundColor: a.danger ? colors.error : a.primary ? colors.success : colors.brand,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}
