import React from "react";
import { View, Text } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

interface Props {
  label: string;
  value: string;
  meta: string;
  accent?: string;
  icon?: LucideIcon;
}

export function StatCard({ label, value, meta, accent, icon: Icon }: Props) {
  const iconBg = accent || colors.brand;
  return (
    <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={2} style={{ fontSize: fontSize.xs, fontWeight: "600", letterSpacing: 0.5, color: colors.textSecondary, textTransform: "uppercase" }}>{label}</Text>
          <Text style={{ fontSize: fontSize["3xl"], fontWeight: "800", color: colors.text, marginTop: spacing.xs }}>{value}</Text>
          <Text numberOfLines={2} style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs, lineHeight: 14 }}>{meta}</Text>
        </View>
        <View style={{ width: 36, height: 36, borderRadius: borderRadius.md, backgroundColor: iconBg + "15", alignItems: "center", justifyContent: "center" }}>
          {Icon ? <Icon size={18} color={iconBg} strokeWidth={2} /> : <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: iconBg }} />}
        </View>
      </View>
    </View>
  );
}
