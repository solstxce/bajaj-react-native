import React from "react";
import { View, Text } from "react-native";
import { CheckCircle2, Clock, XCircle, CalendarDays, Users } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function AmAttendanceScreen() {
  const { scopedUsers, scopedAttendance, state, getBranch, currentUser } = useApp();
  const branch = getBranch(currentUser.branchId)!;
  const todayAttendance = scopedAttendance.filter((a) => a.date === state.today);
  const present = todayAttendance.filter((a) => a.status === "Present").length;
  const late = todayAttendance.filter((a) => a.status === "Late").length;
  const absent = todayAttendance.filter((a) => a.status === "Absent").length;
  const teamUsers = scopedUsers.filter((u) => u.id !== currentUser.id && (u.role === "worker" || u.role === "employee"));

  const getAttStatus = (userId: number): string => {
    const entry = todayAttendance.find((a) => a.userId === userId);
    return entry ? entry.status : "Not marked";
  };

  return (
    <ScreenWrapper>
      <SectionHeader title="Team attendance overview" />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Present" value={String(present)} meta="Verified geo attendance" accent={colors.success} icon={CheckCircle2} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Late" value={String(late)} meta="Marked after shift start" accent={colors.warning} icon={Clock} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Absent" value={String(absent)} meta="No punch today" accent={colors.error} icon={XCircle} /></View>
      </View>

      <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
              <Users size={16} color={colors.brand} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Staff attendance list</Text>
          </View>
          <View style={{ gap: spacing.md }}>
            {teamUsers.map((user) => {
              const status = getAttStatus(user.id);
              return (
                <View key={user.id} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}>
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.brand }}>{user.name.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{user.name}</Text>
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{user.position} | {user.shift}</Text>
                    </View>
                  </View>
                  <Badge label={status} type={status} />
                </View>
              );
            })}
            {teamUsers.length === 0 && (
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>No staff in your branch</Text>
            )}
          </View>
        </Card>

        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
              <CalendarDays size={16} color={colors.brand} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Trend</Text>
          </View>
          <Card variant="soft" style={{ backgroundColor: colors.text, marginBottom: spacing.xl }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.sm }}>
              <CalendarDays size={14} color={colors.slate300} strokeWidth={2} />
              <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.slate300, textTransform: "uppercase" }}>Monthly attendance</Text>
            </View>
            <Text style={{ fontSize: fontSize["4xl"], fontWeight: "800", color: colors.white }}>{branch.todayAttendance + "%"}</Text>
            <Text style={{ fontSize: fontSize.sm, color: colors.slate300, marginTop: spacing.sm }}>Average over last 30 days</Text>
          </Card>
          <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius.xl, padding: spacing.xl }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md }}>
              <CalendarDays size={14} color={colors.text} strokeWidth={2} />
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Recent days</Text>
            </View>
            <View style={{ gap: spacing.sm }}>
              {["2026-04-26", "2026-04-25", "2026-04-24", "2026-04-23", "2026-04-22"].map((date) => {
                const dayAtt = scopedAttendance.filter((a) => a.date === date);
                const dayPresent = dayAtt.filter((a) => a.status === "Present").length;
                const dayTotal = dayAtt.length || 1;
                return (
                  <View key={date} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{date}</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{String(Math.round((dayPresent / dayTotal) * 100)) + "% attendance"}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Card>
      </View>
    </ScreenWrapper>
  );
}
