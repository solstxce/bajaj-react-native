import React, { ReactNode } from "react";
import { View, Text } from "react-native";
import { colors, fontSize, spacing, fontWeight } from "../../theme/theme";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, action }: Props) {
  return (
    <View style={{ marginBottom: spacing.xl, gap: spacing.md }}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontSize: fontSize["4xl"], fontWeight: "700", color: colors.slate900, letterSpacing: -0.5 }}>{title}</Text>
        {subtitle ? <Text style={{ fontSize: fontSize.sm, color: colors.slate500, marginTop: spacing.xs, lineHeight: 18 }}>{subtitle}</Text> : null}
      </View>
      {action && (
        <View style={{ width: "100%", marginTop: spacing.xs }}>
          {action}
        </View>
      )}
    </View>
  );
}
