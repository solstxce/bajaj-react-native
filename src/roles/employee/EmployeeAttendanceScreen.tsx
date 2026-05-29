import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MapPin } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { QuickButton } from "../../shared/components/QuickButton";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function EmployeeAttendanceScreen() {
  const { currentUser, attendanceLog, markAttendance, state } = useApp();
  const entry = attendanceLog.find((r) => r.userId === currentUser.id && r.date === state.today);

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Attendance proof"
        subtitle="Geo-validation, day-wise records and attendance trend for the current month"
        action={<QuickButton label="Mark now" onPress={markAttendance} />}
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xl, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 220 }}>
          <Card variant="glass">
            <View style={{ backgroundColor: colors.text, borderRadius: borderRadius["4xl"], padding: spacing["2xl"] }}>
              <Text style={{ fontSize: fontSize.xs, fontWeight: "600", letterSpacing: 0.3, color: colors.slate300, textTransform: "uppercase" }}>Today's proof</Text>
              <Text style={{ fontSize: fontSize["4xl"], fontWeight: "800", color: colors.white, marginTop: spacing.sm }}>{entry ? entry.status : "Not marked"}</Text>
              <Text style={{ fontSize: fontSize.sm, color: colors.slate300, marginTop: spacing.sm }}>{entry ? entry.location : "Geo proof not captured yet"}</Text>
              <TouchableOpacity onPress={markAttendance} style={{ backgroundColor: colors.white, borderRadius: borderRadius.xl, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, marginTop: spacing.xl, alignSelf: "flex-start" }}>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Capture attendance</Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: spacing.lg, marginTop: spacing.xl }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], paddingHorizontal: spacing.xl, paddingVertical: spacing.lg }}>
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Check-in</Text>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{entry ? entry.checkIn : "-"}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], paddingHorizontal: spacing.xl, paddingVertical: spacing.lg }}>
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Proof</Text>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{entry ? entry.proof : "Not available"}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], paddingHorizontal: spacing.xl, paddingVertical: spacing.lg }}>
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Deviation</Text>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{entry ? entry.deviation : "Pending"}</Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={{ flex: 1, minWidth: 220 }}>
          <Card variant="glass">
            <Text numberOfLines={1} style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Attendance detail</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
              <View style={{ width: "30%" }}><StatCard label="Present" value="24" meta="Working days this month" accent={colors.success} /></View>
              <View style={{ width: "30%" }}><StatCard label="Late" value="1" meta="One late punch this month" accent={colors.brand} /></View>
              <View style={{ width: "30%" }}><StatCard label="Absent" value="0" meta="No unapproved absence" accent={colors.text} /></View>
            </View>
            <View style={{ marginTop: spacing.xl, backgroundColor: colors.slate50, borderRadius: borderRadius["4xl"], padding: spacing.xl }}>
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Recent day-wise records</Text>
              <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
                {["2026-04-26", "2026-04-25", "2026-04-24", "2026-04-23"].map((date) => (
                  <View key={date} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{date}</Text>
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{date === "2026-04-26" ? (entry?.status || "Pending") : "Present - 08:5" + Math.floor(Math.random() * 9 + 8)}</Text>
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
