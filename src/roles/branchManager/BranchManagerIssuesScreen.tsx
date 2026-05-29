import React from "react";
import { View, Text } from "react-native";
import { AlertCircle, TrendingUp, CheckCircle2 } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { ComplaintCard } from "../../shared/components/ComplaintCard";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing } from "../../theme/theme";

export function BranchManagerIssuesScreen() {
  const { state, setTab, scopedBranches, scopedComplaints, resolveComplaint, escalateComplaint } = useApp();
  const activeTab = state.tabs.managerIssues;

  const filteredComplaints = scopedComplaints.filter((c) => {
    if (activeTab === "open") return c.status === "Pending";
    if (activeTab === "escalated") return c.status === "Escalated";
    return true;
  });

  const openCount = scopedComplaints.filter((c) => c.status === "Pending").length;
  const escalatedCount = scopedComplaints.filter((c) => c.status === "Escalated").length;
  const resolvedCount = scopedComplaints.filter((c) => c.status === "Resolved").length;

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Issues & Complaints"
        action={
          <SegmentedControl
            tabs={[
              { label: "Open", value: "open" },
              { label: "Escalated", value: "escalated" },
              { label: "All", value: "all" },
            ]}
            activeKey={activeTab}
            onChange={(v) => setTab("managerIssues", v)}
          />
        }
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Open" value={String(openCount)} meta="Pending issues" accent={colors.warning} icon={AlertCircle} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Escalated" value={String(escalatedCount)} meta="Needs attention" accent={colors.error} icon={TrendingUp} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Resolved" value={String(resolvedCount)} meta="Closed this period" accent={colors.success} icon={CheckCircle2} /></View>
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
              <AlertCircle size={16} color={colors.brand} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>
              {activeTab === "open" ? "Open Issues" : activeTab === "escalated" ? "Escalated Issues" : "All Issues"}
            </Text>
          </View>
          <View style={{ gap: spacing.xl }}>
            {filteredComplaints.length > 0 ? filteredComplaints.map((item) => (
              <ComplaintCard
                key={item.id}
                item={item}
                actions={
                  item.status === "Pending"
                    ? [
                        { label: "Resolve", onPress: () => resolveComplaint(item.id), primary: true },
                        { label: "Escalate", onPress: () => escalateComplaint(item.id) },
                      ]
                    : item.status === "Escalated"
                    ? [{ label: "Resolve", onPress: () => resolveComplaint(item.id), primary: true }]
                    : undefined
                }
              />
            )) : (
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", padding: spacing["4xl"] }}>No issues to show</Text>
            )}
          </View>
        </Card>
      </View>
    </ScreenWrapper>
  );
}
