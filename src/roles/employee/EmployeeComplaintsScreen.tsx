import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { QuickButton } from "../../shared/components/QuickButton";
import { ComplaintCard } from "../../shared/components/ComplaintCard";
import { Card } from "../../shared/components/Card";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function EmployeeComplaintsScreen() {
  const { state, setTab, scopedComplaints, createComplaint, showToast } = useApp();
  const filter = state.tabs.complaints;
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Appliance");
  const [priority, setPriority] = useState("High");
  const [desc, setDesc] = useState("");

  const list = scopedComplaints.filter((item) => {
    if (filter === "all") return true;
    if (filter === "active") return item.status !== "Resolved";
    return item.status === "Escalated";
  });

  const handleSubmit = () => {
    if (!title.trim() || !desc.trim()) return showToast("Add title and description");
    createComplaint({ title: title.trim(), type, priority: priority as any, description: desc.trim() });
    setTitle(""); setDesc("");
  };

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Issue desk"
        subtitle="Raise, inspect, resolve or escalate branch issues with clear owner and cost detail"
        action={
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" }}>
            <SegmentedControl
              tabs={[{ label: "Active", value: "active" }, { label: "Escalated", value: "escalated" }, { label: "All", value: "all" }]}
              activeKey={filter}
              onChange={(v) => setTab("complaints", v)}
            />
            <QuickButton label="Raise complaint" onPress={handleSubmit} />
          </View>
        }
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ width: "30%" }}><StatCard label="Open" value={String(list.filter((i) => i.status === "Pending").length)} meta="Waiting for action" accent={colors.brand} /></View>
        <View style={{ width: "30%" }}><StatCard label="Escalated" value={String(list.filter((i) => i.status === "Escalated").length)} meta="Needs higher approval" accent={colors.error} /></View>
        <View style={{ width: "30%" }}><StatCard label="Resolved" value={String(scopedComplaints.filter((i) => i.status === "Resolved").length)} meta="Closed after proof" accent={colors.success} /></View>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xl, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 240 }}>
          <Card variant="glass">
            <Text numberOfLines={1} style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Raise new complaint</Text>
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>Capture issue type, priority, asset/zone and description</Text>
            <View style={{ gap: spacing.lg, marginTop: spacing.xl }}>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Issue title"
                placeholderTextColor={colors.textSecondary}
                style={{ borderRadius: borderRadius["2xl"], borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, fontSize: fontSize.sm, color: colors.text }}
              />
              <View style={{ flexDirection: "row", gap: spacing.lg }}>
                <View style={{ flex: 1, borderRadius: borderRadius["2xl"], borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg }}>
                  <TextInput value={type} onChangeText={setType} placeholder="Type" placeholderTextColor={colors.textSecondary} style={{ fontSize: fontSize.sm, color: colors.text }} />
                </View>
                <View style={{ flex: 1, borderRadius: borderRadius["2xl"], borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg }}>
                  <TextInput value={priority} onChangeText={setPriority} placeholder="Priority" placeholderTextColor={colors.textSecondary} style={{ fontSize: fontSize.sm, color: colors.text }} />
                </View>
              </View>
              <TextInput
                value={desc}
                onChangeText={setDesc}
                placeholder="Describe exact location, visible risk, and any temporary workaround"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                style={{ borderRadius: borderRadius["2xl"], borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, fontSize: fontSize.sm, minHeight: 90, color: colors.text, textAlignVertical: "top" }}
              />
              <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: colors.brand, borderRadius: borderRadius.xl, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, alignItems: "center" }}>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>Submit complaint</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        <View style={{ flex: 2, minWidth: 280 }}>
          {list.map((item) => (
            <ComplaintCard key={item.id} item={item} />
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
}
