import React, { ReactNode } from "react";
import { View, Text } from "react-native";
import { colors, fontSize, spacing } from "../../theme/theme";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, action }: Props) {
  return (
    <View style={{ gap: spacing.md }}>
      <Text style={{ fontSize: fontSize["4xl"], fontWeight: "800", color: colors.text, letterSpacing: -0.3 }}>{title}</Text>
      {subtitle ? <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{subtitle}</Text> : null}
      {action && <View>{action}</View>}
    </View>
  );
}
