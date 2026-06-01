import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  HeartPulse, MapPin, TriangleAlert, Stamp, ChevronRight,
  FileText, Route, ShieldCheck,
} from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { AlertStrip } from "../../shared/components/AlertStrip";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { QuickButton } from "../../shared/components/QuickButton";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function RmDashboardScreen() {
  const {
    scopedBranches, scopedUsers, scopedTasks, scopedComplaints,
    scopedApprovals, scopedNotifications, scopedAppliances,
    currentUser, showToast, setPage, openBranchDetail, openAuditTrail,
  } = useApp();

  // --- Computed stats ---
  const totalBranches = scopedBranches.length;
  const avgHealth = Math.round(
    scopedBranches.reduce((s, b) => s + b.health, 0) / (totalBranches || 1),
  );
  const avgAttendance = Math.round(
    scopedBranches.reduce((s, b) => s + b.todayAttendance, 0) / (totalBranches || 1),
  );
  const criticalAlerts = scopedBranches.reduce((s, b) => s + b.criticalAlerts, 0);
  const pendingApprovals = scopedApprovals.filter((a) => a.status === "Pending").length;

  // --- Watchlist items (dynamic from real data) ---
  const watchlistItems = useMemo(() => {
    const items: string[] = [];

    // Critical appliance approvals
    scopedApprovals
      .filter((a) => a.status === "Pending" && a.priority === "Critical")
      .forEach((a) => {
        const branch = scopedBranches.find((b) => b.id === a.branchId);
        items.push(`${branch?.name || "Branch"}: ${a.title} needs approval now.`);
      });

    // Branches with high budget usage (>75%)
    scopedBranches
      .filter((b) => b.usedBudget / b.monthlyBudget > 0.75)
      .forEach((b) => {
        const pct = Math.round((b.usedBudget / b.monthlyBudget) * 100);
        items.push(`${b.name} crossed ${pct}% monthly budget already.`);
      });

    // Escalated complaints
    scopedComplaints
      .filter((c) => c.status === "Escalated")
      .forEach((c) => {
        const branch = scopedBranches.find((b) => b.id === c.branchId);
        items.push(`${branch?.name || "Branch"}: ${c.title} is escalated.`);
      });

    // Low health branches
    scopedBranches
      .filter((b) => b.health < 80)
      .forEach((b) => {
        items.push(`${b.name} health score at ${b.health}% — review needed.`);
      });

    return items.slice(0, 5);
  }, [scopedBranches, scopedComplaints, scopedApprovals]);

  // --- Decision feed items (dynamic from real data) ---
  const decisionFeedItems = useMemo(() => {
    const items: { text: string; priority: string }[] = [];

    // High-cost complaints needing RM decision
    scopedComplaints
      .filter((c) => c.estimatedCost > 20000 && c.status !== "Resolved")
      .forEach((c) => {
        const branch = scopedBranches.find((b) => b.id === c.branchId);
        items.push({
          text: `Approve ${c.estimatedCost > 40000 ? "capex" : "repair"} for ${branch?.name || "branch"} — ${c.title}.`,
          priority: c.priority,
        });
      });

    // Pending approvals at RM stage
    scopedApprovals
      .filter((a) => a.status === "Pending" && a.stage === "RM")
      .forEach((a) => {
        const branch = scopedBranches.find((b) => b.id === a.branchId);
        items.push({
          text: `${a.title} at ${branch?.name || "branch"} is awaiting RM approval.`,
          priority: a.priority,
        });
      });

    // Branches below SLA threshold
    scopedBranches
      .filter((b) => b.sla < 90)
      .forEach((b) => {
        items.push({
          text: `${b.name} SLA at ${b.sla}% — push visit report within 24 hrs.`,
          priority: "High",
        });
      });

    return items.slice(0, 4);
  }, [scopedBranches, scopedComplaints, scopedApprovals]);

  return (
    <ScreenWrapper>
      {/* Section header with action buttons */}
      <SectionHeader
        title="Regional Dashboard"
        subtitle="Global branch health, priority alerts, financial exposure and decision-ready intelligence"
        action={
          <View style={{ flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" }}>
            <QuickButton
              label="Open Approvals"
              icon={Stamp}
              onPress={() => setPage("approvals")}
              variant="primary"
            />
            <QuickButton
              label="User Control"
              icon={ShieldCheck}
              onPress={() => setPage("users")}
              variant="secondary"
            />
          </View>
        }
      />

      {/* Alert strip */}
      <AlertStrip onReviewAlerts={() => setPage("alerts")} onOpenAudit={openAuditTrail} />

      {/* 4 Stat Cards — 2×2 grid */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 160 }}>
          <StatCard
            label="Branch Health"
            value={`${avgHealth}%`}
            meta="Regional weighted score"
            icon={HeartPulse}
            accent={colors.emerald600}
          />
        </View>
        <View style={{ flex: 1, minWidth: 160 }}>
          <StatCard
            label="Attendance Avg"
            value={`${avgAttendance}%`}
            meta="Across all active offices"
            icon={MapPin}
            accent={colors.brandSecondary}
          />
        </View>
        <View style={{ flex: 1, minWidth: 160 }}>
          <StatCard
            label="Critical Alerts"
            value={String(criticalAlerts)}
            meta="Immediate RM queue items"
            icon={TriangleAlert}
            accent={colors.error}
          />
        </View>
        <View style={{ flex: 1, minWidth: 160 }}>
          <StatCard
            label="Open Approvals"
            value={String(pendingApprovals)}
            meta="High-cost and risk-sensitive requests"
            icon={Stamp}
            accent={colors.slate900}
          />
        </View>
      </View>

      {/* Two-column layout: Branch Health Board + Right sidebar */}
      <View style={{ marginTop: spacing.xl, gap: spacing.xl }}>
        {/* Branch Health Board — full-width on mobile */}
        <Card variant="glass">
          {/* Header row */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: spacing.md }}>
            <View style={{ flex: 1, minWidth: 200 }}>
              <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.slate900, letterSpacing: -0.3 }}>
                Branch Health Board
              </Text>
              <Text style={{ fontSize: fontSize.sm, color: colors.slate500, marginTop: spacing.xs }}>
                High-level view with performance, alert pressure and budget health.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setPage("intelligence")}
              style={{ backgroundColor: colors.slate900, borderRadius: borderRadius["2xl"], paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}
            >
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>Open Intelligence</Text>
            </TouchableOpacity>
          </View>

          {/* Branch items */}
          <View style={{ marginTop: spacing.xl, gap: spacing.lg }}>
            {scopedBranches.map((branch) => {
              const budgetPct = Math.round((branch.usedBudget / branch.monthlyBudget) * 100);
              return (
                <TouchableOpacity
                  key={branch.id}
                  onPress={() => openBranchDetail(branch.id)}
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 24,
                    padding: spacing.xl,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  {/* Top row: branch info + badges */}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: spacing.md }}>
                    <View style={{ flex: 1, minWidth: 180 }}>
                      <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.slate400, textTransform: "uppercase", letterSpacing: 2 }}>
                        {branch.code}
                      </Text>
                      <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.slate900, marginTop: spacing.sm }}>
                        {branch.name}
                      </Text>
                      <Text style={{ fontSize: fontSize.sm, color: colors.slate500, marginTop: spacing.xs }}>
                        {branch.city} | Revenue index {branch.revenueIndex}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
                      <Badge
                        label={`${branch.criticalAlerts} critical`}
                        type={branch.criticalAlerts > 0 ? "Critical" : "Completed"}
                      />
                      <Badge
                        label={`Audit ${branch.auditScore}`}
                        type={branch.auditScore < 90 ? "High" : "Completed"}
                      />
                    </View>
                  </View>

                  {/* Metrics row */}
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing["3xl"], marginTop: spacing.xl }}>
                    <View style={{ minWidth: 60 }}>
                      <Text style={{ fontSize: fontSize.xs, color: colors.slate400, textTransform: "uppercase", letterSpacing: 1 }}>Health</Text>
                      <Text style={{ fontSize: fontSize.md, fontWeight: "600", color: colors.slate900, marginTop: spacing.xs }}>{branch.health}%</Text>
                    </View>
                    <View style={{ minWidth: 60 }}>
                      <Text style={{ fontSize: fontSize.xs, color: colors.slate400, textTransform: "uppercase", letterSpacing: 1 }}>Attendance</Text>
                      <Text style={{ fontSize: fontSize.md, fontWeight: "600", color: colors.slate900, marginTop: spacing.xs }}>{branch.todayAttendance}%</Text>
                    </View>
                    <View style={{ minWidth: 60 }}>
                      <Text style={{ fontSize: fontSize.xs, color: colors.slate400, textTransform: "uppercase", letterSpacing: 1 }}>SLA</Text>
                      <Text style={{ fontSize: fontSize.md, fontWeight: "600", color: colors.slate900, marginTop: spacing.xs }}>{branch.sla}%</Text>
                    </View>
                    <View style={{ minWidth: 60 }}>
                      <Text style={{ fontSize: fontSize.xs, color: colors.slate400, textTransform: "uppercase", letterSpacing: 1 }}>Budget Used</Text>
                      <Text style={{ fontSize: fontSize.md, fontWeight: "600", color: budgetPct > 75 ? colors.warning : colors.slate900, marginTop: spacing.xs }}>{budgetPct}%</Text>
                    </View>
                    <ChevronRight size={16} color={colors.slate400} style={{ alignSelf: "center" }} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Right column: Watchlist + Decision Feed */}
        <View style={{ gap: spacing.xl }}>
          {/* RM Watchlist — dark card */}
          <View
            style={{
              backgroundColor: colors.slate900,
              borderRadius: borderRadius["5xl"],
              padding: spacing["2xl"],
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.white, letterSpacing: -0.3 }}>
              RM Watchlist
            </Text>
            <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
              {watchlistItems.length > 0 ? (
                watchlistItems.map((item, idx) => (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderRadius: borderRadius["2xl"],
                      padding: spacing.xl,
                    }}
                  >
                    <Text style={{ fontSize: fontSize.sm, color: "rgba(255,255,255,0.9)", lineHeight: 18 }}>
                      {item}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: borderRadius["2xl"], padding: spacing.xl }}>
                  <Text style={{ fontSize: fontSize.sm, color: "rgba(255,255,255,0.6)" }}>No watchlist items right now.</Text>
                </View>
              )}
            </View>
          </View>

          {/* Decision Feed — glass card */}
          <Card variant="glass">
            <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.slate900, letterSpacing: -0.3 }}>
              Decision Feed
            </Text>
            <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
              {decisionFeedItems.length > 0 ? (
                decisionFeedItems.map((item, idx) => (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: colors.slate50,
                      borderRadius: borderRadius["2xl"],
                      padding: spacing.xl,
                      borderLeftWidth: 3,
                      borderLeftColor:
                        item.priority === "Critical"
                          ? colors.error
                          : item.priority === "High"
                            ? colors.warning
                            : colors.brand,
                    }}
                  >
                    <Text style={{ fontSize: fontSize.sm, color: colors.slate600, lineHeight: 18 }}>
                      {item.text}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], padding: spacing.xl }}>
                  <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>No pending decisions.</Text>
                </View>
              )}
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <Card variant="glass">
          <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.slate900, letterSpacing: -0.3 }}>
            Quick Actions
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.xl }}>
            <QuickButton
              label="Review Reports"
              icon={FileText}
              onPress={() => setPage("approvals")}
              variant="primary"
            />
            <QuickButton
              label="Schedule Visit"
              icon={Route}
              onPress={() => {
                openBranchDetail(scopedBranches[0]?.id);
                showToast("Select a branch to schedule visit");
              }}
              variant="secondary"
            />
            <QuickButton
              label="Approve Requests"
              icon={Stamp}
              onPress={() => setPage("approvals")}
              variant="success"
            />
          </View>
        </Card>
      </View>
    </ScreenWrapper>
  );
}
