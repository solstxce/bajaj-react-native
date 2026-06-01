import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Search, Bell, ChevronDown, User, Plus, RefreshCw } from "lucide-react-native";
import { useApp } from "../../context/AppContext";
import { ROLES } from "../../data/mockData";
import { colors, fontSize, spacing, borderRadius, fontWeight } from "../../theme/theme";

interface Props {
  onSearchPress?: () => void;
  onRolePress?: () => void;
  onFormPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export function TopBar({ onSearchPress, onRolePress, onFormPress, onNotificationPress, onProfilePress }: Props) {
  const { state, currentUser, notifications } = useApp();
  const role = ROLES[state.role];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={{ backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border, paddingTop: Platform.OS === 'ios' ? 0 : spacing.sm }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.xl, height: 64, gap: spacing.lg }}>
        <TouchableOpacity
          onPress={onRolePress}
          style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, padding: spacing.sm, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border }}
        >
          <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 13, color: colors.white, fontWeight: "700" }}>{role.name[0]}</Text>
          </View>
          <ChevronDown size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSearchPress}
          style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, height: 42 }}
        >
          <Search size={18} color={colors.textSecondary} />
          <Text style={{ fontSize: fontSize.md, color: colors.textSecondary, marginLeft: spacing.sm }} numberOfLines={1}>Search...</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
          <TouchableOpacity
            onPress={onFormPress}
            style={{ width: 42, height: 42, borderRadius: borderRadius.lg, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center" }}
          >
            <Plus size={22} color={colors.white} strokeWidth={2.5} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNotificationPress}
            style={{ width: 42, height: 42, borderRadius: borderRadius.lg, backgroundColor: colors.slate50, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}
          >
            <Bell size={20} color={colors.textSecondary} />
            {unreadCount > 0 ? (
              <View style={{ position: "absolute", top: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.error, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.white }}>
                <Text style={{ fontSize: 9, fontWeight: "800", color: colors.white }}>{unreadCount > 9 ? "9" : unreadCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onProfilePress}
            style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.slate50, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}
          >
            <User size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
