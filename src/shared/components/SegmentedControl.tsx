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
    <View style={{ flexDirection: "row", backgroundColor: colors.slate100, borderRadius: 16, padding: 6, width: "100%" }}>
      {tabs.map((tab) => {
        const active = activeKey === tab.value;
        return (
          <TouchableOpacity
            key={tab.value}
            onPress={() => onChange(tab.value)}
            style={{ 
              flex: 1,
              borderRadius: 12, 
              paddingVertical: 14, 
              backgroundColor: active ? colors.card : "transparent", 
              alignItems: "center",
              justifyContent: "center",
              ...(active ? { shadowColor: "rgba(0,0,0,0.08)", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 8, elevation: 3 } : {}) 
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: active ? "700" : "600", color: active ? colors.brand : colors.textSecondary, textTransform: "uppercase", letterSpacing: 0.8 }}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
