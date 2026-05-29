import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Search, Bell, ChevronDown, User } from "lucide-react-native";
import { useApp } from "../../context/AppContext";
import { ROLES } from "../../data/mockData";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

interface Props {
  onSearchPress?: () => void;
  onRolePress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export function TopBar({ onSearchPress, onRolePress, onNotificationPress, onProfilePress }: Props) {
  const { state, currentUser } = useApp();
  const role = ROLES[state.role];

  return (
    <View style={{ backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border, paddingTop: spacing.sm }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.xl, height: 48, gap: spacing.sm }}>
        <TouchableOpacity
          onPress={onRolePress}
          style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.slate50, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border }}
        >
          <View style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 10, color: colors.white, fontWeight: "700" }}>{role.name[0]}</Text>
          </View>
          <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.textSecondary }}>{role.name}</Text>
          <ChevronDown size={12} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSearchPress}
          style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: colors.slate50, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, height: 32 }}
        >
          <Search size={14} color={colors.textSecondary} />
          <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginLeft: spacing.sm }}>Search tasks, alerts...</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNotificationPress}
          style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.slate50, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}
        >
          <Bell size={14} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onProfilePress}
          style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingLeft: spacing.sm, paddingRight: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.slate50, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border }}
        >
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center" }}>
            <User size={12} color={colors.white} strokeWidth={2} />
          </View>
          <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.textSecondary }}>{currentUser.name.split(" ")[0]}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
