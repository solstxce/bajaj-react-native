import React from "react";
import { View, Text } from "react-native";
import { AlertCircle, TrendingUp, CheckCircle2 } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { ComplaintCard } from "../../shared/components/ComplaintCard";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing } from "../../theme/theme";

export function AmComplaintsScreen() {
  const { state, setTab, scopedComplaints, resolveComplaint, escalateComplaint, assignVendor } = useApp();
  const filter = state.tabs.complaints;
  const list = scopedComplaints.filter((item) => {
    if (filter === "all") return true;
    if (filter === "active") return item.status !== "Resolved";
    return item.status === "Escalated";
  });
  const openCount = scopedComplaints.filter((i) => i.status === "Pending").length;
  const escalatedCount = scopedComplaints.filter((i) => i.status === "Escalated").length;
  const resolvedCount = scopedComplaints.filter((i) => i.status === "Resolved").length;

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Issue desk"
        action={
          <SegmentedControl
            tabs={[{ label: "Active", value: "active" }, { label: "Escalated", value: "escalated" }, { label: "All", value: "all" }]}
            activeKey={filter}
            onChange={(v) => setTab("complaints", v)}
          />
        }
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Open" value={String(openCount)} meta="Waiting for action" accent={colors.brand} icon={AlertCircle} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Escalated" value={String(escalatedCount)} meta="Needs higher approval" accent={colors.error} icon={TrendingUp} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Resolved" value={String(resolvedCount)} meta="Closed after resolution" accent={colors.success} icon={CheckCircle2} /></View>
      </View>

      <View style={{ marginTop: spacing.xl, gap: spacing.xl }}>
        {list.map((item) => (
          <ComplaintCard
            key={item.id}
            item={item}
            actions={
              item.status === "Pending" ? [
                { label: "Assign Vendor", onPress: () => assignVendor(item.id), primary: true },
                { label: "Escalate", onPress: () => escalateComplaint(item.id), danger: true },
              ] : item.status === "Escalated" ? [
                { label: "Resolve", onPress: () => resolveComplaint(item.id), primary: true },
              ] : undefined
            }
          />
        ))}
        {list.length === 0 && (
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", paddingVertical: spacing["4xl"] }}>No complaints found for this filter</Text>
        )}
      </View>
    </ScreenWrapper>
  );
}
