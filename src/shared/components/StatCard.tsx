import React from "react";
import { View, Text } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { colors, fontSize, spacing, borderRadius, shadows } from "../../theme/theme";

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
    <View style={{ backgroundColor: colors.card, borderRadius: 24, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, ...shadows.card }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: spacing.xl }}>
        {/* Left column: label, value, meta */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.slate400, textTransform: "uppercase", letterSpacing: 1.8 }}>
            {label}
          </Text>
          <Text style={{ fontSize: fontSize["5xl"], fontWeight: "800", color: colors.slate900, letterSpacing: -0.5, marginTop: spacing.sm }}>
            {value}
          </Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.slate500, marginTop: spacing.xs }} numberOfLines={2}>
            {meta}
          </Text>
        </View>
        {/* Right column: solid accent icon tile */}
        <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: iconBg, alignItems: "center", justifyContent: "center" }}>
          {Icon ? <Icon size={24} color={colors.white} strokeWidth={2.2} /> : null}
        </View>
      </View>
    </View>
  );
}
