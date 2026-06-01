import React, { useRef } from "react";
import { Text, TouchableOpacity, View, Animated } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

interface Props {
  label: string;
  icon?: LucideIcon;
  onPress: () => void;
  tone?: string;
}

export function QuickButton({ label, icon: Icon, onPress, tone }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const isDark = tone?.includes("emerald") || tone?.includes("brand") || !tone;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, friction: 8, tension: 200, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.85}
        style={{
          borderRadius: 14,
          paddingHorizontal: spacing.xl,
          height: 44,
          backgroundColor: isDark ? colors.slate900 : colors.white,
          borderWidth: isDark ? 0 : 1,
          borderColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.sm,
          minWidth: 100,
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        }}
      >
        {Icon && <Icon size={18} color={isDark ? colors.white : colors.slate700} strokeWidth={2.2} />}
        <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: isDark ? colors.white : colors.slate700 }}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
