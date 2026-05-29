import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { HardHat, UserCheck, UserCog, Briefcase, Crown, X, Check } from "lucide-react-native";
import { useApp } from "../../context/AppContext";
import { ROLES } from "../../data/mockData";
import { RoleId } from "../../types/domain";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const roleIconMap: Record<string, React.ComponentType<any>> = {
  worker: HardHat,
  employee: UserCheck,
  am: UserCog,
  branchManager: Briefcase,
  rm: Crown,
};

const roleAccentMap: Record<string, string> = {
  worker: colors.brandSecondary,
  employee: colors.brand,
  am: colors.success,
  branchManager: colors.brandDeep,
  rm: colors.brand,
};

export function RoleSwitcherModal({ visible, onClose }: Props) {
  const { state, switchRole } = useApp();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{ flex: 1, backgroundColor: "rgba(15,23,42,0.5)", justifyContent: "center", alignItems: "center", padding: spacing.xl }}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}} style={{ backgroundColor: colors.card, borderRadius: borderRadius["6xl"], padding: spacing.xl, width: "100%", maxWidth: 320 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.xl, paddingHorizontal: spacing.sm }}>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Switch Role</Text>
            <TouchableOpacity onPress={onClose} style={{ padding: spacing.sm }}>
              <X size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 400 }}>
            {(Object.values(ROLES) as any[]).map((r: any) => {
              const active = state.role === r.id;
              const Icon = roleIconMap[r.id];
              return (
                <TouchableOpacity
                  key={r.id}
                  onPress={() => { switchRole(r.id as RoleId); onClose(); }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.lg,
                    padding: spacing.lg,
                    borderRadius: borderRadius["2xl"],
                    marginBottom: spacing.sm,
                    backgroundColor: active ? colors.brandLight : "transparent",
                    borderWidth: active ? 1 : 0,
                    borderColor: active ? colors.brand : "transparent",
                  }}
                >
                  <View style={{ width: 44, height: 44, borderRadius: borderRadius["2xl"], backgroundColor: roleAccentMap[r.id], alignItems: "center", justifyContent: "center" }}>
                    <Icon size={20} color={colors.white} strokeWidth={1.8} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{r.name}</Text>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{r.short}</Text>
                  </View>
                  {active ? (
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center" }}>
                      <Check size={14} color={colors.white} strokeWidth={3} />
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
