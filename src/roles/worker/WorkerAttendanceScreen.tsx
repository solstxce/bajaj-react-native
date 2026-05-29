import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MapPin, CheckCircle2, Clock, XCircle, CalendarDays } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { QuickButton } from "../../shared/components/QuickButton";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function WorkerAttendanceScreen() {
  const { currentUser, attendanceLog, markAttendance, state } = useApp();
  const entry = attendanceLog.find((r) => r.userId === currentUser.id && r.date === state.today);

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Attendance proof"
        action={<QuickButton label="Mark now" icon={MapPin} onPress={markAttendance} />}
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xl, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 220 }}>
          <Card variant="glass">
            <View style={{ backgroundColor: colors.text, borderRadius: borderRadius.xl, padding: spacing.xl }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.sm }}>
                <MapPin size={16} color={colors.slate300} strokeWidth={2} />
                <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.slate300, textTransform: "uppercase" }}>Today's proof</Text>
              </View>
              <Text style={{ fontSize: fontSize["4xl"], fontWeight: "800", color: colors.white }}>{entry ? entry.status : "Not marked"}</Text>
              <Text style={{ fontSize: fontSize.sm, color: colors.slate300, marginTop: spacing.sm }}>{entry ? entry.location : "Geo proof not captured yet"}</Text>
              <TouchableOpacity onPress={markAttendance} style={{ backgroundColor: colors.white, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, marginTop: spacing.xl, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <MapPin size={14} color={colors.text} strokeWidth={2} />
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Capture attendance</Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <Clock size={14} color={colors.textSecondary} strokeWidth={2} />
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Check-in</Text>
                </View>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{entry ? entry.checkIn : "-"}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <CheckCircle2 size={14} color={colors.textSecondary} strokeWidth={2} />
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Proof</Text>
                </View>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{entry ? entry.proof : "Not available"}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <XCircle size={14} color={colors.textSecondary} strokeWidth={2} />
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Deviation</Text>
                </View>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{entry ? entry.deviation : "Pending"}</Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={{ flex: 1, minWidth: 220 }}>
          <Card variant="glass">
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
              <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                <CalendarDays size={16} color={colors.brand} strokeWidth={2} />
              </View>
              <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Attendance detail</Text>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg }}>
              <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Present" value="24" meta="Working days this month" accent={colors.success} icon={CheckCircle2} /></View>
              <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Late" value="1" meta="One late punch this month" accent={colors.brand} icon={Clock} /></View>
              <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Absent" value="0" meta="No unapproved absence" accent={colors.slate600} icon={XCircle} /></View>
            </View>
            <View style={{ marginTop: spacing.xl, backgroundColor: colors.slate50, borderRadius: borderRadius.xl, padding: spacing.xl }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md }}>
                <CalendarDays size={14} color={colors.text} strokeWidth={2} />
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Recent day-wise records</Text>
              </View>
              <View style={{ gap: spacing.sm }}>
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
