import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

interface Item {
  label: string;
  value: string;
}

interface Props {
  tabs: Item[];
  activeKey: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ tabs, activeKey, onChange }: Props) {
  return (
    <View style={{ flexDirection: "row", backgroundColor: colors.slate100, borderRadius: borderRadius.full, padding: 3, alignSelf: "flex-start" }}>
      {tabs.map((tab) => {
        const active = activeKey === tab.value;
        return (
          <TouchableOpacity
            key={tab.value}
            onPress={() => onChange(tab.value)}
            style={{ borderRadius: borderRadius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, backgroundColor: active ? colors.card : "transparent", ...(active ? { shadowColor: "rgba(0,0,0,0.06)", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 1, shadowRadius: 4, elevation: 2 } : {}) }}
          >
            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: active ? colors.text : colors.textSecondary }}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
