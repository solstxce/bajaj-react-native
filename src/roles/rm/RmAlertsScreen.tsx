import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TriangleAlert, AlertCircle, Info, Bell, Building, CheckCircle } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function RmAlertsScreen() {
  const { state, setTab, scopedNotifications, scopedBranches, showToast } = useApp();
  const filter = state.tabs.rmAlerts || "critical";
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

  const filtered = scopedNotifications.filter((item) => {
    if (filter !== "all" && item.priority.toLowerCase() !== filter) return false;
    if (selectedBranch && item.branchId !== selectedBranch) return false;
    return true;
  });

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Alert Center"
        action={
          <SegmentedControl tabs={[{ label: "Critical", value: "critical" }, { label: "Warning", value: "warning" }, { label: "Info", value: "info" }, { label: "All", value: "all" }]} activeKey={filter} onChange={(v) => setTab("rmAlerts", v)} />
        }
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xl }}>
        <TouchableOpacity onPress={() => setSelectedBranch(null)} style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: !selectedBranch ? colors.brand : colors.slate100 }}>
          <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: !selectedBranch ? colors.white : colors.textSecondary }}>All</Text>
        </TouchableOpacity>
        {scopedBranches.map((b) => (
          <TouchableOpacity key={b.id} onPress={() => setSelectedBranch(b.id)} style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: selectedBranch === b.id ? colors.brand : colors.slate100 }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: selectedBranch === b.id ? colors.white : colors.textSecondary }}>{b.name.split(" ")[0]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
        {filtered.map((item) => (
          <Card variant="glass" key={item.id}>
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: spacing.lg }}>
              <View style={{ width: 40, height: 40, borderRadius: borderRadius.lg, backgroundColor: item.priority === "Critical" ? colors.rose50 : item.priority === "High" ? colors.amber50 : colors.sky50, alignItems: "center", justifyContent: "center" }}>
                {item.priority === "Critical" ? <TriangleAlert size={18} color={colors.error} strokeWidth={2} /> : item.priority === "High" ? <AlertCircle size={18} color={colors.warning} strokeWidth={2} /> : <Info size={18} color={colors.info} strokeWidth={2} />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" }}>
                  <Badge label={item.priority} type={item.priority} />
                  <Badge label={item.read ? "Read" : "Unread"} type={item.read ? "Completed" : "Pending"} />
                </View>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginTop: spacing.md }}>{item.title}</Text>
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{item.detail}</Text>
                <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.lg }}>{item.time}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg }}>
              <TouchableOpacity onPress={() => showToast("Alert acknowledged")} style={{ backgroundColor: colors.brand, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <CheckCircle size={14} color={colors.white} strokeWidth={2} />
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>Acknowledge</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => showToast("Escalating alert")} style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <TriangleAlert size={14} color={colors.textSecondary} strokeWidth={2} />
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Escalate</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </View>
    </ScreenWrapper>
  );
}
