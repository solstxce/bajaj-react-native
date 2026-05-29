import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Users, UserCheck, UserX, Building, Star, Clock, Phone, Mail, Briefcase, Filter } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function RmUsersScreen() {
  const { state, setTab, scopedUsers, scopedBranches, getBranch } = useApp();
  const filter = state.tabs.rmUsers || "active";
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const list = scopedUsers.filter((user) => {
    if (filter === "active" && user.status !== "Present") return false;
    if (filter === "inactive" && user.status === "Present") return false;
    if (selectedBranch && user.branchId !== selectedBranch) return false;
    if (selectedRole && user.role !== selectedRole) return false;
    return true;
  });

  const roleColor = (role: string) => {
    const map: Record<string, string> = { worker: colors.brandSecondary, employee: colors.brand, am: colors.success, branchManager: colors.brandDeep, rm: colors.brand };
    return map[role] || colors.text;
  };

  const roles = ["worker", "employee", "am", "branchManager"];

  return (
    <ScreenWrapper>
      <SectionHeader
        title="User Management"
        action={
          <View style={{ gap: spacing.sm }}>
            <SegmentedControl tabs={[{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }, { label: "All", value: "all" }]} activeKey={filter} onChange={(v) => setTab("rmUsers", v)} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              <TouchableOpacity onPress={() => setSelectedRole(null)} style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: !selectedRole ? colors.brand : colors.slate100 }}>
                <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: !selectedRole ? colors.white : colors.textSecondary }}>All roles</Text>
              </TouchableOpacity>
              {roles.map((r) => (
                <TouchableOpacity key={r} onPress={() => setSelectedRole(r)} style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: selectedRole === r ? colors.brand : colors.slate100 }}>
                  <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: selectedRole === r ? colors.white : colors.textSecondary }}>{r.charAt(0).toUpperCase() + r.slice(1, 4)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              <TouchableOpacity onPress={() => setSelectedBranch(null)} style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: !selectedBranch ? colors.brand : colors.slate100 }}>
                <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: !selectedBranch ? colors.white : colors.textSecondary }}>All branches</Text>
              </TouchableOpacity>
              {scopedBranches.map((b) => (
                <TouchableOpacity key={b.id} onPress={() => setSelectedBranch(b.id)} style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: selectedBranch === b.id ? colors.brand : colors.slate100 }}>
                  <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: selectedBranch === b.id ? colors.white : colors.textSecondary }}>{b.name.split(" ")[0]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
      />

      <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
        {list.map((user) => {
          const branch = getBranch(user.branchId);
          return (
            <Card variant="glass" key={user.id}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xl }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: roleColor(user.role), alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: colors.white }}>{user.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>{user.name}</Text>
                    <Badge label={user.role === "rm" ? "RM" : user.role === "branchManager" ? "BM" : user.role === "am" ? "AM" : user.role === "employee" ? "Emp" : "W"} type={user.role === "rm" ? "Critical" : user.role === "branchManager" ? "High" : user.role === "am" ? "Medium" : "Low"} />
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xs }}>
                    <Building size={12} color={colors.textSecondary} />
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{user.position} | {branch?.name}</Text>
                  </View>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.md }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                      <Star size={12} color={colors.warning} />
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{user.rating}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                      <Clock size={12} color={colors.textSecondary} />
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{user.attendancePct}%</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                      <Phone size={12} color={colors.textSecondary} />
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{user.phone}</Text>
                    </View>
                    <Badge label={user.status} type={user.status === "Present" ? "Success" : "Warning"} />
                  </View>
                </View>
              </View>
            </Card>
          );
        })}
      </View>
    </ScreenWrapper>
  );
}
