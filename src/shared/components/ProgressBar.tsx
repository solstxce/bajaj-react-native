import React from "react";
import { View } from "react-native";
import { colors } from "../../theme/theme";

interface Props {
  value: number;
  color: string;
  height?: number;
}

export function ProgressBar({ value, color, height = 8 }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View style={{ height, backgroundColor: colors.slate100, borderRadius: 999, overflow: "hidden" }}>
      <View style={{ height: "100%", width: `${clamped}%`, backgroundColor: color, borderRadius: 999 }} />
    </View>
  );
}
