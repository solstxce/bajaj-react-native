import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ListChecks, Building, TrendingUp, MapPin, TriangleAlert, ShieldCheck, AlertCircle, CalendarDays, Plus, UserPlus, Plug } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { AlertStrip } from "../../shared/components/AlertStrip";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { QuickButton } from "../../shared/components/QuickButton";
import { Badge } from "../../shared/components/Badge";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius, fontWeight } from "../../theme/theme";

export function LcHomeScreen() {
  const { currentUser, getBranch, scopedTasks, scopedComplaints, setPage, openBranchDetail, openApplianceDetail, scopedAppliances, scopedNotifications, openAuditTrail, openComplaintDetail } = useApp();
  const branch = getBranch(currentUser.branchId)!;
  const branchTasks = scopedTasks.filter((t) => t.branchId === branch.id);
  const pendingTasks = branchTasks.filter((t) => t.status !== "Completed").length;
  const openIssues = scopedComplaints.filter((c) => c.branchId === branch.id && c.status !== "Resolved");
  
  const budgetPct = Math.round((branch.usedBudget / branch.monthlyBudget) * 100);
  const atRiskAppliances = scopedAppliances.filter((a) => a.status !== "Operational");
  const todayComplaints = scopedComplaints.filter((c) => c.createdAt.includes("2026-04-26"));
  const criticalNotifs = scopedNotifications.filter((n) => n.priority === "Critical" && !n.read);

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Branch command center"
        subtitle={`${branch.name} branch head dashboard with quick ops control, issue triage and staffing health`}
        action={
          <>
            <QuickButton label="Create Task" icon={Plus} onPress={() => setPage("tasks")} tone="dark" />
            <QuickButton label="Add Staff" icon={UserPlus} onPress={() => setPage("attendance")} tone="light" />
            <QuickButton label="Add Appliance" icon={Plug} onPress={() => {}} tone="light" />
          </>
        }
      />

      <AlertStrip onReviewAlerts={() => setPage("notifications")} onOpenAudit={openAuditTrail} />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <TouchableOpacity onPress={() => setPage("tasks")} style={{ flex: 1, minWidth: 160, backgroundColor: colors.white, borderRadius: borderRadius["2xl"], padding: spacing.xl, borderWidth: 1, borderColor: colors.border, alignItems: "center", gap: spacing.md, elevation: 2, shadowColor: "rgba(0,91,172,0.04)", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 24 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.sky50, alignItems: "center", justifyContent: "center" }}>
            <ListChecks size={24} color={colors.sky600} />
          </View>
          <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900 }}>My Tasks</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>{pendingTasks} Pending</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPage("attendance")} style={{ flex: 1, minWidth: 160, backgroundColor: colors.white, borderRadius: borderRadius["2xl"], padding: spacing.xl, borderWidth: 1, borderColor: colors.border, alignItems: "center", gap: spacing.md, elevation: 2, shadowColor: "rgba(0,91,172,0.04)", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 24 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.emerald50, alignItems: "center", justifyContent: "center" }}>
            <MapPin size={24} color={colors.emerald600} />
          </View>
          <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900 }}>Attendance</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>Mark Daily Entry</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPage("complaints")} style={{ flex: 1, minWidth: 160, backgroundColor: colors.white, borderRadius: borderRadius["2xl"], padding: spacing.xl, borderWidth: 1, borderColor: colors.border, alignItems: "center", gap: spacing.md, elevation: 2, shadowColor: "rgba(0,91,172,0.04)", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 24 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.amber50, alignItems: "center", justifyContent: "center" }}>
            <TriangleAlert size={24} color={colors.amber700} />
          </View>
          <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900 }}>Issues</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>{openIssues.length} Open</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setPage("lcBranch")} style={{ flex: 1, minWidth: 160, backgroundColor: colors.white, borderRadius: borderRadius["2xl"], padding: spacing.xl, borderWidth: 1, borderColor: colors.border, alignItems: "center", gap: spacing.md, elevation: 2, shadowColor: "rgba(0,91,172,0.04)", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 24 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.slate100, alignItems: "center", justifyContent: "center" }}>
            <Building size={24} color={colors.slate700} />
          </View>
          <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900 }}>Branch</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>View Details</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "column", gap: spacing.xl, marginTop: spacing.xl }}>
        {atRiskAppliances.length > 0 && (
          <Card variant="glass" style={{ padding: spacing["3xl"] }}>
            <Text style={{ fontSize: fontSize.xl, fontWeight: "400", color: colors.slate900, marginBottom: spacing.lg }}>Pending appliance approvals</Text>
            <View style={{ gap: spacing.md }}>
              {atRiskAppliances.map((app) => (
                <TouchableOpacity key={app.id} onPress={() => openApplianceDetail(app.id)} style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius["2xl"], paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, gap: spacing.md, backgroundColor: colors.white }}>
                  <View style={{ flex: 1, minWidth: 200 }}>
                    <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.slate900 }}>{app.name}</Text>
                    <Text style={{ fontSize: fontSize.sm, color: colors.slate500, marginTop: spacing.xs }}>{app.zone} | {app.pendingParts}</Text>
                  </View>
                  <Badge label={app.status} type={app.status} />
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}
      </View>
    </ScreenWrapper>
  );
}
