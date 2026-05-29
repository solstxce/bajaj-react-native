import React from "react";
import { View, Text } from "react-native";
import { Building, Users, HardHat, UserCheck, TrendingUp, TriangleAlert, Bell, ShieldCheck, Clock, CalendarDays, MapPin } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { ProgressBar } from "../../shared/components/ProgressBar";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function AmBranchScreen() {
  const { currentUser, getBranch, scopedAppliances } = useApp();
  const branch = getBranch(currentUser.branchId)!;
  const budgetPct = Math.round((branch.usedBudget / branch.monthlyBudget) * 100);
  const atRiskAppliances = scopedAppliances.filter((a) => a.status === "At Risk" || a.status === "Critical" || a.status === "Down");

  return (
    <ScreenWrapper>
      <SectionHeader title={"Branch dashboard - " + branch.name} />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Health" value={String(branch.health) + "%"} meta="Overall score" accent={colors.success} icon={ShieldCheck} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Performance" value={String(branch.performance) + "%"} meta="Ops rating" accent={colors.brand} icon={TrendingUp} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Attendance" value={String(branch.todayAttendance) + "%"} meta="Today's staff in" accent={colors.brandSecondary} icon={UserCheck} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="SLA" value={String(branch.sla) + "%"} meta="Service level" accent={colors.slate600} icon={Clock} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Audit" value={String(branch.auditScore) + "%"} meta="Compliance score" accent={colors.success} icon={ShieldCheck} /></View>
      </View>

      <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
              <Users size={16} color={colors.brand} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Staff overview</Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md }}>
            <View style={{ flex: 1, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.xl, minWidth: 140 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <HardHat size={18} color={colors.brandSecondary} />
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.textSecondary }}>Workers</Text>
              </View>
              <Text style={{ fontSize: fontSize["4xl"], fontWeight: "800", color: colors.text, marginTop: spacing.sm }}>{branch.workerCount}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.xl, minWidth: 140 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <UserCheck size={18} color={colors.brand} />
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.textSecondary }}>Employees</Text>
              </View>
              <Text style={{ fontSize: fontSize["4xl"], fontWeight: "800", color: colors.text, marginTop: spacing.sm }}>{branch.employeeCount}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.xl, marginTop: spacing.md }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <Users size={18} color={colors.text} />
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.textSecondary }}>Total staff</Text>
            </View>
            <Text style={{ fontSize: fontSize["3xl"], fontWeight: "800", color: colors.text }}>{branch.staffCount}</Text>
          </View>
        </Card>

        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={16} color={colors.brand} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Budget usage</Text>
          </View>
          <View style={{ gap: spacing.sm }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Monthly budget</Text>
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{"Rs " + String(branch.monthlyBudget).slice(0, 3) + "k"}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Used</Text>
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{"Rs " + String(branch.usedBudget).slice(0, 3) + "k"}</Text>
            </View>
            <ProgressBar value={budgetPct} color={budgetPct > 80 ? colors.error : budgetPct > 60 ? colors.warning : colors.success} />
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{budgetPct}% utilised</Text>
          </View>
        </Card>

        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.error + "15", alignItems: "center", justifyContent: "center" }}>
              <TriangleAlert size={16} color={colors.error} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Recent alerts & issues</Text>
          </View>
          <View style={{ gap: spacing.md }}>
            <View style={{ backgroundColor: colors.red50, borderRadius: borderRadius.lg, padding: spacing.xl, flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
              <TriangleAlert size={16} color={colors.red700} strokeWidth={2} style={{ marginTop: 2 }} />
              <Text style={{ fontSize: fontSize.sm, color: colors.red700, flex: 1 }}>Fire exit light down at rear staircase. Compliance risk.</Text>
            </View>
            <View style={{ backgroundColor: colors.amber50, borderRadius: borderRadius.lg, padding: spacing.xl, flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
              <TriangleAlert size={16} color={colors.amber700} strokeWidth={2} style={{ marginTop: 2 }} />
              <Text style={{ fontSize: fontSize.sm, color: colors.amber700, flex: 1 }}>Lounge AC cooling issue. Vendor inspection pending.</Text>
            </View>
            <View style={{ backgroundColor: colors.sky50, borderRadius: borderRadius.lg, padding: spacing.xl, flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
              <Bell size={16} color={colors.sky700} strokeWidth={2} style={{ marginTop: 2 }} />
              <Text style={{ fontSize: fontSize.sm, color: colors.sky700, flex: 1 }}>Safety briefing tomorrow 08:30 with all staff.</Text>
            </View>
          </View>
        </Card>

        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.lg }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.warning + "15", alignItems: "center", justifyContent: "center" }}>
                <TriangleAlert size={16} color={colors.warning} strokeWidth={2} />
              </View>
              <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Appliance status</Text>
            </View>
            <Badge label={String(atRiskAppliances.length) + " at risk"} type="Warning" />
          </View>
          <View style={{ gap: spacing.md }}>
            {atRiskAppliances.slice(0, 4).map((app) => (
              <View key={app.id} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                  <View style={{ width: 28, height: 28, borderRadius: borderRadius.md, backgroundColor: colors.warning + "15", alignItems: "center", justifyContent: "center" }}>
                    <TriangleAlert size={14} color={colors.warning} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{app.name}</Text>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{app.zone}</Text>
                  </View>
                </View>
                <Badge label={app.status} type={app.status} />
              </View>
            ))}
            {atRiskAppliances.length === 0 && (
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>All appliances operational</Text>
            )}
          </View>
        </Card>

        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
              <Building size={16} color={colors.brand} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Branch info</Text>
          </View>
          <View style={{ gap: spacing.md }}>
            {[
              { label: "Code", value: branch.code, icon: Building },
              { label: "Address", value: branch.address, icon: MapPin },
              { label: "Shift window", value: branch.shiftWindow, icon: Clock },
              { label: "Last visit", value: branch.lastVisit, icon: CalendarDays },
            ].map((row) => (
              <View key={row.label} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                  <row.icon size={14} color={colors.textSecondary} strokeWidth={2} />
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{row.label}</Text>
                </View>
                <Text numberOfLines={1} style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text, maxWidth: 180 }}>{row.value}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>
    </ScreenWrapper>
  );
}
