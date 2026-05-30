import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { UserCog, Mail, Phone, Clock, Smartphone, Award, FileText, CalendarDays, Phone as PhoneIcon, ChevronRight } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function AmProfileScreen() {
  const { currentUser, getBranch, openAuditTrail } = useApp();
  const branch = getBranch(currentUser.branchId)!;

  const detailRows = [
    { label: "Phone", value: currentUser.phone, icon: Phone },
    { label: "Email", value: currentUser.email, icon: Mail },
    { label: "Shift", value: currentUser.shift, icon: Clock },
    { label: "Device", value: currentUser.deviceId, icon: Smartphone },
  ];

  return (
    <ScreenWrapper>
      <SectionHeader title="Profile & identity" />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xl, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 200 }}>
          <Card variant="glass">
            <View style={{ backgroundColor: colors.text, borderRadius: borderRadius.xl, padding: spacing.xl }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.brandLight, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: fontSize["3xl"], fontWeight: "800", color: colors.brand }}>
                  {currentUser.name.split(" ").map((n) => n[0]).join("")}
                </Text>
              </View>
              <Text style={{ fontSize: fontSize["4xl"], fontWeight: "800", color: colors.white, marginTop: spacing.xl }}>{currentUser.name}</Text>
              <Text style={{ fontSize: fontSize.sm, color: colors.slate300, marginTop: spacing.xs }}>{currentUser.position}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xs }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.brand + "30", alignItems: "center", justifyContent: "center" }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand }} />
                </View>
                <Text style={{ fontSize: fontSize.sm, color: colors.slate300 }}>{branch.name}</Text>
              </View>
            </View>
            <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
              {detailRows.map((row) => (
                <View key={row.label} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                    <row.icon size={14} color={colors.textSecondary} strokeWidth={2} />
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{row.label}</Text>
                  </View>
                  <Text numberOfLines={1} style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text, maxWidth: 160 }}>{row.value}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View style={{ flex: 2, minWidth: 280, gap: spacing.xl }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg }}>
            <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Attendance" value={String(currentUser.attendancePct) + "%"} meta="Monthly" accent={colors.success} icon={Award} /></View>
            <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Task closures" value={String(currentUser.tasksClosed)} meta="Completed" accent={colors.brandSecondary} icon={FileText} /></View>
            <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Rating" value={currentUser.rating.toFixed(1)} meta="Supervisor score" accent={colors.brand} icon={Award} /></View>
          </View>

          <Card variant="glass">
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
              <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                <Award size={16} color={colors.brand} strokeWidth={2} />
              </View>
              <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Skills and compliance</Text>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              {currentUser.skills.map((skill) => (
                <View key={skill} style={{ backgroundColor: colors.slate100, borderRadius: borderRadius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.textSecondary }}>{skill}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
              <View style={{ flex: 1, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.xl }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                  <PhoneIcon size={12} color={colors.text} strokeWidth={2} />
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>Emergency contact</Text>
                </View>
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{currentUser.emergencyContact}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.xl }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                  <CalendarDays size={12} color={colors.text} strokeWidth={2} />
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>Join date</Text>
                </View>
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{currentUser.joinDate}</Text>
              </View>
            </View>
            <View style={{ marginTop: spacing.xl, backgroundColor: colors.slate50, borderRadius: borderRadius.xl, padding: spacing.xl }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md }}>
                <FileText size={14} color={colors.text} strokeWidth={2} />
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Uploaded documents</Text>
              </View>
              <View style={{ gap: spacing.sm }}>
                {currentUser.documents.map((doc) => (
                  <View key={doc} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, flex: 1 }}>
                      <FileText size={12} color={colors.textSecondary} strokeWidth={2} />
                      <Text numberOfLines={1} style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{doc}</Text>
                    </View>
                    <Text style={{ fontSize: fontSize.sm, color: colors.success, fontWeight: "600" }}>Verified</Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>

          <TouchableOpacity onPress={openAuditTrail} style={{ backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: spacing.xl }}>
            <View style={{ width: 36, height: 36, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
              <FileText size={16} color={colors.brand} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: colors.text }}>Open audit trail</Text>
              <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>Review all actions taken on your account</Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}
