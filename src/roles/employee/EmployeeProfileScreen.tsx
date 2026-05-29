import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowUpRight } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { QuickButton } from "../../shared/components/QuickButton";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";
import { formatPct } from "../../utils/helpers";

export function EmployeeProfileScreen() {
  const { currentUser, getBranch, showToast } = useApp();
  const branch = getBranch(currentUser.branchId)!;

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Profile and operational identity"
        subtitle="Staff profile, branch assignment, performance and documents"
        action={<QuickButton label="Open detail view" onPress={() => showToast("Detail modal coming in Phase 7")} />}
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xl, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 200 }}>
          <Card variant="glass">
            <View style={{ backgroundColor: colors.text, borderRadius: borderRadius["4xl"], padding: spacing["2xl"] }}>
              <View style={{ width: 60, height: 60, borderRadius: 24, backgroundColor: colors.brandLight, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: fontSize["3xl"], fontWeight: "800", color: colors.brand }}>
                  {currentUser.name.split(" ").map((n) => n[0]).join("")}
                </Text>
              </View>
              <Text style={{ fontSize: fontSize["4xl"], fontWeight: "800", color: colors.white, marginTop: spacing.xl }}>{currentUser.name}</Text>
              <Text style={{ fontSize: fontSize.sm, color: colors.slate300, marginTop: spacing.xs }}>{currentUser.position}</Text>
              <Text style={{ fontSize: fontSize.sm, color: colors.slate300 }}>{branch.name}</Text>
            </View>
            <View style={{ gap: spacing.lg, marginTop: spacing.xl }}>
              {[
                { label: "Phone", value: currentUser.phone },
                { label: "Email", value: currentUser.email },
                { label: "Shift", value: currentUser.shift },
                { label: "Device", value: currentUser.deviceId },
              ].map((row) => (
                <View key={row.label} style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], paddingHorizontal: spacing.xl, paddingVertical: spacing.lg }}>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{row.label}</Text>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{row.value}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View style={{ flex: 2, minWidth: 280, gap: spacing.xl }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg }}>
            <View style={{ width: "30%" }}><StatCard label="Attendance" value={formatPct(currentUser.attendancePct)} meta="Monthly" accent={colors.success} /></View>
            <View style={{ width: "30%" }}><StatCard label="Task closures" value={String(currentUser.tasksClosed)} meta="Completed assignments" accent={colors.brandSecondary} /></View>
            <View style={{ width: "30%" }}><StatCard label="Rating" value={currentUser.rating.toFixed(1)} meta="Supervisor score" accent={colors.brand} /></View>
          </View>

          <Card variant="glass">
            <Text numberOfLines={1} style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Skills and compliance</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xl }}>
              {currentUser.skills.map((skill) => (
                <View key={skill} style={{ backgroundColor: colors.slate100, borderRadius: borderRadius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.textSecondary }}>{skill}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
              <View style={{ flex: 1, backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], padding: spacing.xl }}>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>Emergency contact</Text>
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{currentUser.emergencyContact}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], padding: spacing.xl }}>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>Join date</Text>
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{currentUser.joinDate}</Text>
              </View>
            </View>
            <View style={{ marginTop: spacing.xl, backgroundColor: colors.slate50, borderRadius: borderRadius["4xl"], padding: spacing.xl }}>
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Uploaded documents</Text>
              <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
                {currentUser.documents.map((doc) => (
                  <View key={doc} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{doc}</Text>
                    <Text style={{ fontSize: fontSize.sm, color: colors.success }}>Verified</Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>
        </View>
      </View>
    </ScreenWrapper>
  );
}
