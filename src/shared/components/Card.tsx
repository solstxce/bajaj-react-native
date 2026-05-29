import React, { ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import { colors, shadows, borderRadius } from "../../theme/theme";

interface Props {
  children: ReactNode;
  variant?: "glass" | "soft";
  style?: ViewStyle;
}

export function Card({ children, variant = "soft", style }: Props) {
  const isGlass = variant === "glass";
  return (
    <View
      style={[
        {
          backgroundColor: isGlass ? colors.cardGlass : colors.card,
          borderRadius: borderRadius.xl,
          borderWidth: 1,
          borderColor: isGlass ? "rgba(255,255,255,0.6)" : colors.border,
          padding: 16,
          ...(isGlass ? shadows.card : shadows.shell),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
