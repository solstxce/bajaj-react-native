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
  const iconColor = accent || colors.brand;
  return (
    <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, elevation: 3, shadowColor: "rgba(0,0,0,0.05)", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.lg }}>
        <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: iconColor + "12", alignItems: "center", justifyContent: "center" }}>
          {Icon ? <Icon size={24} color={iconColor} strokeWidth={2.2} /> : <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: iconColor }} />}
        </View>
        <Text style={{ fontSize: fontSize["5xl"], fontWeight: "700", color: colors.slate900, letterSpacing: -1 }}>{value}</Text>
      </View>
      <View>
        <Text numberOfLines={1} style={{ fontSize: fontSize.xs, fontWeight: "700", letterSpacing: 0.8, color: colors.slate900, textTransform: "uppercase" }}>{label}</Text>
        <Text numberOfLines={2} style={{ fontSize: 11, color: colors.slate500, marginTop: 2, lineHeight: 14 }}>{meta}</Text>
      </View>
    </View>
  );
}
