import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Users, UserCheck, UserX, Building, Star, Clock, Phone, Mail, Briefcase, Filter, UserPlus, Search } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { Badge } from "../../shared/components/Badge";
import { Card } from "../../shared/components/Card";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function RmUsersScreen() {
  const { state, setTab, scopedUsers, scopedBranches, getBranch, openUserDetail, createUser, showToast } = useApp();
  const filter = state.tabs.rmUsers || "active";
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("worker");
  const [newBranchId, setNewBranchId] = useState<number>(scopedBranches[0]?.id || 1);

  const statusFiltered = scopedUsers.filter((user) => {
    if (filter === "active" && user.status !== "Present") return false;
    if (filter === "inactive" && user.status === "Present") return false;
    if (selectedBranch && user.branchId !== selectedBranch) return false;
    if (selectedRole && user.role !== selectedRole) return false;
    return true;
  });

  const list = statusFiltered.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.phone?.includes(searchQuery) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleColor = (role: string) => {
    const map: Record<string, string> = { worker: colors.brandSecondary, employee: colors.brand, am: colors.success, branchManager: colors.brandDeep, rm: colors.brand };
    return map[role] || colors.text;
  };

  const roles = ["worker", "employee", "am", "branchManager"];

  const handleCreateUser = () => {
    if (!newName.trim()) return showToast("Enter user name");
    createUser(newName.trim(), newRole as any, newBranchId);
    setNewName("");
  };

  return (
    <ScreenWrapper>
      <SectionHeader
        title="User Management"
        action={
          <View style={{ gap: spacing.sm }}>
            <SegmentedControl tabs={[{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }, { label: "All", value: "all" }]} activeKey={filter} onChange={(v) => setTab("rmUsers", v)} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              <TouchableOpacity onPress={() => setSelectedRole(null)} style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: !selectedRole ? colors.slate900 : colors.white, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: fontSize.xs, fontWeight: "400", color: !selectedRole ? colors.white : colors.slate600 }}>All roles</Text>
              </TouchableOpacity>
              {roles.map((r) => (
                <TouchableOpacity key={r} onPress={() => setSelectedRole(r)} style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: selectedRole === r ? colors.slate900 : colors.white, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ fontSize: fontSize.xs, fontWeight: "400", color: selectedRole === r ? colors.white : colors.slate600 }}>{r.charAt(0).toUpperCase() + r.slice(1, 4)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              <TouchableOpacity onPress={() => setSelectedBranch(null)} style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: !selectedBranch ? colors.slate900 : colors.white, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: fontSize.xs, fontWeight: "400", color: !selectedBranch ? colors.white : colors.slate600 }}>All branches</Text>
              </TouchableOpacity>
              {scopedBranches.map((b) => (
                <TouchableOpacity key={b.id} onPress={() => setSelectedBranch(b.id)} style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: selectedBranch === b.id ? colors.slate900 : colors.white, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ fontSize: fontSize.xs, fontWeight: "400", color: selectedBranch === b.id ? colors.white : colors.slate600 }}>{b.name.split(" ")[0]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.xl }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border }}>
          <Search size={16} color={colors.slate400} />
          <TextInput 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name, role, or phone..." 
            placeholderTextColor={colors.slate400}
            style={{ flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.sm, color: colors.slate900, fontSize: fontSize.sm }} 
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xl, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 240 }}>
          <Card variant="glass">
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
              <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                <UserPlus size={16} color={colors.brand} strokeWidth={2} />
              </View>
              <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>Create user</Text>
            </View>
            <View style={{ gap: spacing.lg }}>
              <View>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.textSecondary, marginBottom: spacing.xs }}>Full name</Text>
                <TextInput
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Enter full name"
                  placeholderTextColor={colors.textSecondary}
                  style={{ borderRadius: borderRadius["2xl"], borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, fontSize: fontSize.sm, color: colors.text }}
                />
              </View>
              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.textSecondary, marginBottom: spacing.xs }}>Role</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
                    {["worker", "employee", "am", "branchManager"].map((r) => (
                      <TouchableOpacity key={r} onPress={() => setNewRole(r)} style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: newRole === r ? colors.brand : colors.slate100 }}>
                        <Text style={{ fontSize: fontSize.xs, fontWeight: "400", color: newRole === r ? colors.white : colors.textSecondary }}>{r.charAt(0).toUpperCase() + r.slice(1)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              <View>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.textSecondary, marginBottom: spacing.xs }}>Branch</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
                  {scopedBranches.map((b) => (
                    <TouchableOpacity key={b.id} onPress={() => setNewBranchId(b.id)} style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: newBranchId === b.id ? colors.brand : colors.slate100 }}>
                      <Text style={{ fontSize: fontSize.xs, fontWeight: "400", color: newBranchId === b.id ? colors.white : colors.textSecondary }}>{b.name.split(" ")[0]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <TouchableOpacity onPress={handleCreateUser} style={{ backgroundColor: colors.brand, borderRadius: borderRadius.xl, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, alignItems: "center" }}>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.white }}>Add user</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        <View style={{ flex: 2, minWidth: 280, gap: spacing.xl }}>
          {list.map((user) => {
            const branch = getBranch(user.branchId);
            const userRoleString = user.role as string;
            return (
              <TouchableOpacity key={user.id} onPress={() => openUserDetail(user.id)} activeOpacity={0.7}>
                <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.xl, borderWidth: 1, borderColor: colors.border }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xl }}>
                    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: roleColor(user.role), alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.white }}>{user.name.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                        <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>{user.name}</Text>
                        <Badge label={userRoleString === "rm" ? "RM" : userRoleString === "branchManager" ? "BM" : userRoleString === "am" ? "AM" : userRoleString === "employee" ? "Emp" : "W"} type={userRoleString === "rm" ? "Critical" : userRoleString === "branchManager" ? "High" : userRoleString === "am" ? "Medium" : "Low"} />
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
                </View>
              </TouchableOpacity>
            );
          })}
          {list.length === 0 && (
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", paddingVertical: spacing["4xl"] }}>No users found</Text>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}
