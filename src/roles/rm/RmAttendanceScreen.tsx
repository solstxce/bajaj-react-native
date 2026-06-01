import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { CheckCircle2, Clock, XCircle, Building, Users, Search, CalendarDays, ChevronLeft, ChevronRight, ListChecks, MapPin } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function RmAttendanceScreen() {
  const { scopedAttendance, scopedBranches, scopedTasks, state, getBranch, scopedUsers } = useApp();
  const todayAttendance = scopedAttendance.filter((a) => a.date === state.today);
  const [activeTab, setActiveTab] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("April 2026");
  const [locationMode, setLocationMode] = useState<"state" | "district">("state");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const getDistrict = (branch: typeof scopedBranches[number]) => branch.name || branch.city || "Unknown district";
  const getState = (branch: typeof scopedBranches[number]) => {
    const parts = branch.address?.split(",").map((part) => part.trim()).filter(Boolean) || [];
    return parts[parts.length - 1] || branch.city || "Unknown state";
  };
  const getLocation = (branch: typeof scopedBranches[number]) => locationMode === "state" ? getState(branch) : getDistrict(branch);
  const locationGroups = scopedBranches.reduce<Record<string, number>>((acc, branch) => {
    const key = getLocation(branch);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const locationEntries = Object.entries(locationGroups).sort((a, b) => b[1] - a[1]);
  const locationFilteredBranches = selectedLocation ? scopedBranches.filter(b => getLocation(b) === selectedLocation) : scopedBranches;
  const locationBranchIds = locationFilteredBranches.map(b => b.id);

  const staffUsers = scopedUsers.filter(u =>
    locationBranchIds.includes(u.branchId) && (u.role === "lc" || u.role === "branchManager" || (u.role as string) === "worker" || (u.role as string) === "employee")
  );

  const filteredStaff = staffUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const locationFilteredAttendance = todayAttendance.filter(a => staffUsers.find(u => u.id === a.userId));

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Regional Attendance"
        action={
          <SegmentedControl
            tabs={[
              { label: "Today", value: "today" },
              { label: "Calendar", value: "calendar" },
            ]}
            activeKey={activeTab}
            onChange={(v) => setActiveTab(v)}
          />
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing.xl, paddingBottom: 40, paddingTop: spacing.lg }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
          {(["state", "district"] as const).map((mode) => (
            <TouchableOpacity key={mode} onPress={() => { setLocationMode(mode); setSelectedLocation(null); }} style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: locationMode === mode ? colors.slate900 : colors.slate100, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
              <MapPin size={14} color={locationMode === mode ? colors.white : colors.textSecondary} />
              <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: locationMode === mode ? colors.white : colors.textSecondary, textTransform: "capitalize" }}>{mode} wise</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
          <TouchableOpacity onPress={() => setSelectedLocation(null)} style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: !selectedLocation ? colors.brand : colors.slate100, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
            <MapPin size={14} color={!selectedLocation ? colors.white : colors.textSecondary} />
            <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: !selectedLocation ? colors.white : colors.textSecondary }}>All {locationMode}s</Text>
          </TouchableOpacity>
          {locationEntries.map(([location, count]) => (
            <TouchableOpacity key={location} onPress={() => setSelectedLocation(location)} style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: selectedLocation === location ? colors.brand : colors.slate100, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
              <MapPin size={14} color={selectedLocation === location ? colors.white : colors.textSecondary} />
              <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: selectedLocation === location ? colors.white : colors.textSecondary }}>{location} · {count}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "today" && (
          <Card variant="glass">
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
              <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                <Users size={16} color={colors.brand} strokeWidth={2} />
              </View>
              <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>Today's Roster & Tasks</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg }}>
              <Search size={16} color={colors.textSecondary} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search staff..."
                placeholderTextColor={colors.textSecondary}
                style={{ flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.sm, color: colors.text, fontSize: fontSize.sm }}
              />
            </View>

            <View style={{ gap: spacing.md }}>
              {filteredStaff.map((staff) => {
                const branch = getBranch(staff.branchId);
                const attRecord = locationFilteredAttendance.find(a => a.userId === staff.id);
                const isPresent = attRecord?.status === "Present" || attRecord?.status === "Late";
                const staffTasks = scopedTasks.filter(t => t.assignedTo === staff.id && (t.status === "Pending" || t.status === "In Progress" || t.status === "Completed"));

                return (
                  <View key={staff.id} style={{ backgroundColor: colors.white, borderRadius: 24, padding: spacing.xl, borderWidth: 1, borderColor: colors.border }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <View style={{ flex: 1, flexDirection: "row", gap: spacing.lg }}>
                        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: isPresent ? colors.emerald50 : colors.rose50, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: isPresent ? colors.emerald200 : colors.rose200 }}>
                          <Text style={{ fontSize: fontSize.lg, color: isPresent ? colors.emerald700 : colors.rose700 }}>{staff.name.charAt(0)}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900 }}>{staff.name}</Text>
                          <Text style={{ fontSize: fontSize.xs, color: colors.slate500 }}>{staff.role === "branchManager" ? "BM" : staff.role === "lc" ? "LC" : staff.role.toUpperCase()} | {branch?.name}</Text>
                          {isPresent ? (
                            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.xs }}>
                              <Clock size={12} color={colors.success} />
                              <Text style={{ fontSize: fontSize.xs, color: colors.success }}>Punched in at {attRecord?.checkIn}</Text>
                            </View>
                          ) : (
                            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.xs }}>
                              <XCircle size={12} color={colors.error} />
                              <Text style={{ fontSize: fontSize.xs, color: colors.error }}>Absent or not punched in</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <Badge label={attRecord?.status || "Absent"} type={attRecord?.status || "Pending"} />
                    </View>

                    {staffTasks.length > 0 ? (
                      <View style={{ marginTop: spacing.lg, borderTopWidth: 1, borderColor: colors.slate100, paddingTop: spacing.md, gap: spacing.xs }}>
                        <Text style={{ fontSize: fontSize.xs, color: colors.slate400, textTransform: "uppercase", letterSpacing: 1, marginBottom: spacing.xs }}>Today's Queue</Text>
                        {staffTasks.map(t => (
                          <View key={t.id} style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                            <ListChecks size={14} color={t.status === "Completed" ? colors.success : colors.brandSecondary} />
                            <Text style={{ fontSize: fontSize.sm, color: t.status === "Completed" ? colors.slate400 : colors.slate700, textDecorationLine: t.status === "Completed" ? "line-through" : "none" }}>{t.title}</Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={{ marginTop: spacing.lg, borderTopWidth: 1, borderColor: colors.slate100, paddingTop: spacing.md }}>
                        <Text style={{ fontSize: fontSize.sm, color: colors.slate400, fontStyle: "italic" }}>No tasks assigned for today</Text>
                      </View>
                    )}
                  </View>
                );
              })}
              {filteredStaff.length === 0 && (
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", paddingVertical: spacing.xl }}>No staff found</Text>
              )}
            </View>
          </Card>
        )}

        {activeTab === "calendar" && (
          <View style={{ gap: spacing.xl }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.white, borderRadius: 24, padding: spacing.xl, borderWidth: 1, borderColor: colors.border }}>
              <TouchableOpacity style={{ padding: spacing.sm, backgroundColor: colors.slate50, borderRadius: 12 }}>
                <ChevronLeft size={20} color={colors.slate700} />
              </TouchableOpacity>
              <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.slate900 }}>{selectedMonth}</Text>
              <TouchableOpacity style={{ padding: spacing.sm, backgroundColor: colors.slate50, borderRadius: 12 }}>
                <ChevronRight size={20} color={colors.slate700} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: spacing.md }}>
              {["2026-04-26", "2026-04-25", "2026-04-24", "2026-04-23"].map((date) => {
                const dayAtt = scopedAttendance.filter((a) => a.date === date && locationBranchIds.includes(getBranch(scopedUsers.find(u => u.id === a.userId)?.branchId ?? 0)?.id ?? 0));
                const presentCount = dayAtt.filter((a) => a.status === "Present" || a.status === "Late").length;
                const absentStaff = staffUsers.filter(u => !dayAtt.find(a => a.userId === u.id && (a.status === "Present" || a.status === "Late")));

                return (
                  <View key={date} style={{ backgroundColor: colors.white, borderRadius: 24, padding: spacing.xl, borderWidth: 1, borderColor: colors.border }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                        <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                          <Text style={{ fontSize: fontSize.xl, color: colors.brand }}>{date.slice(-2)}</Text>
                        </View>
                        <View>
                          <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900 }}>{new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}</Text>
                          <Text style={{ fontSize: fontSize.xs, color: colors.slate500 }}>{presentCount} / {staffUsers.length} staff present</Text>
                        </View>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Badge label={`${Math.round((presentCount / (staffUsers.length || 1)) * 100)}%`} type={presentCount / (staffUsers.length || 1) >= 0.8 ? "Completed" : "High"} />
                      </View>
                    </View>

                    {absentStaff.length > 0 && (
                      <View style={{ backgroundColor: colors.rose50, borderRadius: borderRadius.xl, padding: spacing.md }}>
                        <Text style={{ fontSize: fontSize.xs, color: colors.rose700, textTransform: "uppercase", letterSpacing: 1, marginBottom: spacing.xs }}>Absent Staff ({absentStaff.length})</Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
                          {absentStaff.slice(0, 8).map(u => (
                            <Text key={u.id} style={{ fontSize: fontSize.sm, color: colors.rose700 }}>• {u.name.split(" ")[0]}</Text>
                          ))}
                          {absentStaff.length > 8 && <Text style={{ fontSize: fontSize.sm, color: colors.rose700 }}>+ {absentStaff.length - 8} more</Text>}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
