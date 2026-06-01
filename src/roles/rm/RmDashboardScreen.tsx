import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import {
  HeartPulse, MapPin, TriangleAlert, Stamp, ChevronRight,
  FileText, Route, ShieldCheck, Search,
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
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);
  const [showAllWatchlist, setShowAllWatchlist] = useState(false);
  const [showAllDecisions, setShowAllDecisions] = useState(false);
  const [branchSearch, setBranchSearch] = useState("");
  const [locationMode, setLocationMode] = useState<"state" | "district">("state");
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

  const getDistrict = (branch: typeof scopedBranches[number]) => branch.name || branch.city || "Unknown district";
  const getState = (branch: typeof scopedBranches[number]) => {
    const parts = branch.address?.split(",").map((part) => part.trim()).filter(Boolean) || [];
    return parts[parts.length - 1] || branch.city || "Unknown state";
  };

  const query = branchSearch.trim().toLowerCase();
  const searchedBranches = scopedBranches.filter((branch) => {
    if (!query) return true;
    return [branch.name, branch.city, branch.address, branch.code, getState(branch), getDistrict(branch)]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  const locationGroups = searchedBranches.reduce<Record<string, number>>((acc, branch) => {
    const key = locationMode === "state" ? getState(branch) : getDistrict(branch);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const locationGroupEntries = Object.entries(locationGroups).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const criticalBranches = searchedBranches.filter((b) => b.criticalAlerts > 0 || b.health < 80);
  const monitorBranches = searchedBranches.filter((b) => b.criticalAlerts === 0 && b.health >= 80 && (b.sla < 90 || b.usedBudget / Math.max(b.monthlyBudget, 1) > 0.75));
  const stableBranches = searchedBranches.filter((b) => b.criticalAlerts === 0 && b.health >= 80 && b.sla >= 90 && b.usedBudget / Math.max(b.monthlyBudget, 1) <= 0.75);

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

    return items;
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

    return items;
  }, [scopedBranches, scopedComplaints, scopedApprovals]);

  const visibleWatchlist = showAllWatchlist ? watchlistItems : watchlistItems.slice(0, 3);
  const visibleDecisionFeed = showAllDecisions ? decisionFeedItems : decisionFeedItems.slice(0, 3);

  const branchClusters = [
    { key: "critical", title: "Critical", subtitle: "Alerts or weak health", branches: criticalBranches, bg: colors.rose50, text: colors.rose700 },
    { key: "monitor", title: "Monitor", subtitle: "SLA or budget pressure", branches: monitorBranches, bg: colors.amber50, text: colors.amber700 },
    { key: "stable", title: "Stable", subtitle: "Healthy branches", branches: stableBranches, bg: colors.emerald50, text: colors.emerald700 },
  ];

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

          <View style={{ marginTop: spacing.xl }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, borderRadius: 999, paddingHorizontal: spacing.xl, height: 44 }}>
              <Search size={16} color={colors.slate400} />
              <TextInput
                value={branchSearch}
                onChangeText={setBranchSearch}
                placeholder="Search location, district, state or branch code"
                placeholderTextColor={colors.slate400}
                style={{ flex: 1, fontSize: fontSize.sm, color: colors.slate900, paddingVertical: 0 }}
              />
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md }}>
              {(["state", "district"] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  onPress={() => setLocationMode(mode)}
                  style={{ borderRadius: 999, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, backgroundColor: locationMode === mode ? colors.slate900 : colors.white, borderWidth: 1, borderColor: colors.slate200 }}
                >
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: locationMode === mode ? colors.white : colors.slate600, textTransform: "capitalize" }}>{mode} wise</Text>
                </TouchableOpacity>
              ))}
            </View>
            {locationGroupEntries.length > 0 ? (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md }}>
                {locationGroupEntries.map(([name, count]) => (
                  <View key={name} style={{ borderRadius: 999, backgroundColor: colors.slate50, borderWidth: 1, borderColor: colors.slate200, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}>
                    <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.slate600 }}>{name} · {count}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{ marginTop: spacing.md, fontSize: fontSize.sm, color: colors.slate500 }}>No matching locations found.</Text>
            )}
          </View>

          {/* Clustered branch groups */}
          <View style={{ marginTop: spacing.xl, gap: spacing.lg }}>
            {branchClusters.map((cluster) => {
              const expanded = expandedCluster === cluster.key;
              const visibleBranches = expanded ? cluster.branches : cluster.branches.slice(0, 2);
              return (
                <View key={cluster.key} style={{ backgroundColor: cluster.bg, borderRadius: 24, padding: spacing.xl }}>
                  <TouchableOpacity
                    onPress={() => setExpandedCluster(expanded ? null : cluster.key)}
                    activeOpacity={0.75}
                    style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md }}
                  >
                    <View>
                      <Text style={{ fontSize: fontSize.lg, fontWeight: "800", color: cluster.text }}>{cluster.title}</Text>
                      <Text style={{ fontSize: fontSize.sm, color: cluster.text, opacity: 0.75, marginTop: spacing.xs }}>{cluster.subtitle}</Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={{ fontSize: fontSize["4xl"], fontWeight: "800", color: cluster.text }}>{cluster.branches.length}</Text>
                      <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: cluster.text }}>{expanded ? "Hide" : "Open"}</Text>
                    </View>
                  </TouchableOpacity>

                  {visibleBranches.length > 0 ? (
                    <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
                      {visibleBranches.map((branch) => {
                        const budgetPct = Math.round((branch.usedBudget / Math.max(branch.monthlyBudget, 1)) * 100);
                        return (
                          <TouchableOpacity key={branch.id} onPress={() => openBranchDetail(branch.id)} style={{ backgroundColor: colors.white, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: spacing.md }}>
                              <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: fontSize.xs, fontWeight: "700", color: colors.slate400, textTransform: "uppercase", letterSpacing: 1.4 }}>{branch.code}</Text>
                                <Text style={{ marginTop: spacing.xs, fontSize: fontSize.md, fontWeight: "800", color: colors.slate900 }}>{branch.name}</Text>
                                <Text style={{ marginTop: spacing.xs, fontSize: fontSize.xs, color: colors.slate500 }}>{branch.city} · Health {branch.health}% · SLA {branch.sla}% · Budget {budgetPct}%</Text>
                              </View>
                              <ChevronRight size={16} color={colors.slate400} />
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : (
                    <Text style={{ marginTop: spacing.lg, fontSize: fontSize.sm, color: cluster.text, opacity: 0.75 }}>No branches in this cluster.</Text>
                  )}
                </View>
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
                visibleWatchlist.map((item, idx) => (
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
            {watchlistItems.length > 3 ? (
              <TouchableOpacity onPress={() => setShowAllWatchlist((value) => !value)} style={{ alignSelf: "center", marginTop: spacing.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.lg, backgroundColor: "rgba(255,255,255,0.12)" }}>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.white }}>
                  {showAllWatchlist ? "Hide watchlist" : `Show ${watchlistItems.length - 3} more`}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Decision Feed — glass card */}
          <Card variant="glass">
            <Text style={{ fontSize: fontSize.xl, fontWeight: "800", color: colors.slate900, letterSpacing: -0.3 }}>
              Decision Feed
            </Text>
            <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
              {decisionFeedItems.length > 0 ? (
                visibleDecisionFeed.map((item, idx) => (
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
            {decisionFeedItems.length > 3 ? (
              <TouchableOpacity onPress={() => setShowAllDecisions((value) => !value)} style={{ alignSelf: "center", marginTop: spacing.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.lg, backgroundColor: colors.slate100 }}>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.slate700 }}>
                  {showAllDecisions ? "Hide decisions" : `Show ${decisionFeedItems.length - 3} more`}
                </Text>
              </TouchableOpacity>
            ) : null}
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
