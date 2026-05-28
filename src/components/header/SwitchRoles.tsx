import React, { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import { shadows } from "../../theme/shadows";
import { RoleId } from "../../types/domain";
import { ROLES } from "../../constants/roles";

const ROLE_ORDER: RoleId[] = ["worker", "employee", "am", "branchManager", "rm"];

type Props = {
  visible: boolean;
  currentRole: RoleId;
  onSelect: (role: RoleId) => void;
  onClose: () => void;
};

export function SwitchRoles({ visible, currentRole, onSelect, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;

  useEffect(() => {
    if (visible) {
      opacity.setValue(0);
      translateY.setValue(-8);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={[styles.backdrop, { paddingTop: insets.top + 80 }]} onPress={onClose}>
        <Animated.View style={[styles.menuWrap, { opacity, transform: [{ translateY }] }]}>
          <BlurView intensity={85} tint="light" style={styles.menu}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Switch Role</Text>
              <Text style={styles.menuSub}>Select a role to change your view</Text>
            </View>
            <View style={styles.roleList}>
              {ROLE_ORDER.map((id) => {
                const role = ROLES[id];
                const active = id === currentRole;
                return (
                  <Pressable
                    key={id}
                    onPress={() => {
                      onSelect(id);
                      onClose();
                    }}
                    style={({ pressed }) => [
                      styles.roleItem,
                      active && styles.roleItemActive,
                      pressed && !active && styles.roleItemPressed,
                    ]}
                  >
                    <View style={[styles.avatar, active && styles.avatarActive]}>
                      <Text style={[styles.avatarText, active && { color: colors.white }]}>{role.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.roleInfo}>
                      <Text style={[styles.roleName, active && styles.roleNameActive]}>{role.name}</Text>
                      <Text style={styles.roleDesc}>{role.short}</Text>
                    </View>
                    {active && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </BlurView>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.9)",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  menuWrap: {
    borderRadius: 20,
    overflow: "hidden",
    ...shadows.lg,
    shadowColor: "#0f172a",
    shadowOpacity: 0.1,
    shadowRadius: 28,
    elevation: 16,
  },
  menu: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  menuHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(15,23,42,0.06)",
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  menuSub: {
    fontSize: 13,
    color: colors.secondary,
    marginTop: 2,
  },
  roleList: {
    paddingVertical: 6,
  },
  roleItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 6,
    borderRadius: 14,
    gap: 14,
  },
  roleItemActive: {
    backgroundColor: "rgba(37,99,235,0.12)",
  },
  roleItemPressed: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarActive: {
    backgroundColor: colors.primary,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.secondary,
  },
  roleInfo: {
    flex: 1,
  },
  roleName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  roleNameActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  roleDesc: {
    fontSize: 12,
    color: colors.secondary,
    marginTop: 1,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
});
