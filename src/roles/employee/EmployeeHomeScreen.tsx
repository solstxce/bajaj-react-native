import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Camera, MapPin, TriangleAlert, Award, ListChecks, CheckCircle, Clock } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { TaskCard } from "../../shared/components/TaskCard";
import { QuickButton } from "../../shared/components/QuickButton";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";
import { formatPct, countdown } from "../../utils/helpers";

export function EmployeeHomeScreen() {
  const { currentUser, getBranch, tasks, showToast, markAttendance, submitTaskProof, setPage } = useApp();
  const branch = getBranch(currentUser.branchId)!;
  const ownTasks = tasks
    .filter((t) => t.branchId === currentUser.branchId && t.audience === "employee" && (!t.assignedTo || t.assignedTo === currentUser.id))
    .slice(0, 3);

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Employee command desk"
        subtitle={"Fast actions, task deadlines, and branch alerts for " + branch.name}
        action={
          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            <QuickButton label="Mark Attendance" onPress={() => { markAttendance(); }} />
            <QuickButton label="Raise Issue" onPress={() => showToast("Issue form coming in Phase 7")} />
          </View>
        }
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ width: "47%" }}><StatCard label="Today's tasks" value={String(ownTasks.length)} meta="Employee tasks for today" accent={colors.brand} /></View>
        <View style={{ width: "47%" }}><StatCard label="Attendance status" value="Inside fence" meta={branch.geoRadius + "m policy, selfie matched"} accent={colors.success} /></View>
        <View style={{ width: "47%" }}><StatCard label="Open alerts" value="2" meta="Lounge AC and rear exit light" accent={colors.error} /></View>
        <View style={{ width: "47%" }}><StatCard label="This month" value={formatPct(currentUser.attendancePct)} meta={"Task proof closure " + formatPct(currentUser.proofRate)} accent={colors.text} /></View>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xl, marginTop: spacing.xl }}>
        <View style={{ flex: 2, minWidth: 280 }}>
          <Card variant="glass">
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View>
                <Text style={{ fontSize: fontSize.xs, fontWeight: "600", letterSpacing: 0.3, color: colors.textSecondary, textTransform: "uppercase" }}>Live queue</Text>
                <Text numberOfLines={1} style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginTop: spacing.sm }}>Today's employee tasks</Text>
              </View>
              <TouchableOpacity onPress={() => setPage("tasks")} style={{ backgroundColor: colors.brand, borderRadius: borderRadius.xl, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm }}>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>Open all tasks</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: spacing.xl }}>
              {ownTasks.map((task) => (
                <TaskCard key={task.id} task={task} compact actions={task.status !== "Completed" ? [{ label: "Submit Photo", onPress: () => submitTaskProof(task.id), primary: true }] : undefined} />
              ))}
            </View>
          </Card>

          <Card variant="glass" style={{ marginTop: spacing.xl }}>
            <Text numberOfLines={1} style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Task escalation ladder</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
              {[
                { title: "Employee", desc: "Submit proof or task stays pending.", bg: colors.orange50, text: colors.orange700 },
                { title: "AM", desc: "Gets notified once deadline risk starts.", bg: colors.emerald50, text: colors.emerald700 },
                { title: "Branch Manager", desc: "Reviews repeated misses and calls branch.", bg: colors.sky50, text: colors.sky700 },
                { title: "RM", desc: "Only for safety, audit or repeated failures.", bg: colors.rose50, text: colors.rose700 },
              ].map((step) => (
                <View key={step.title} style={{ backgroundColor: step.bg, borderRadius: borderRadius["2xl"], padding: spacing.xl, width: "45%", minWidth: 140 }}>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: step.text }}>{step.title}</Text>
                  <Text style={{ fontSize: fontSize.sm, color: step.text, marginTop: spacing.xs }}>{step.desc}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View style={{ flex: 1, minWidth: 220, gap: spacing.xl }}>
          <Card variant="soft" style={{ backgroundColor: colors.text }}>
            <Text style={{ fontSize: fontSize.xs, fontWeight: "600", letterSpacing: 0.3, color: colors.slate300, textTransform: "uppercase" }}>Countdown focus</Text>
            <Text style={{ fontSize: fontSize["4xl"], fontWeight: "800", color: colors.white, marginTop: spacing.sm }}>
              {ownTasks[0] ? countdown(ownTasks[0].deadline, "2026-04-26T11:20:00") : "No tasks"}
            </Text>
            <Text style={{ fontSize: fontSize.sm, color: colors.slate300, marginTop: spacing.sm }}>
              Open lobby patrol will escalate if photo proof is not uploaded on time.
            </Text>
            <TouchableOpacity
              onPress={() => ownTasks[0] && submitTaskProof(ownTasks[0].id)}
              style={{ backgroundColor: colors.white, borderRadius: borderRadius.xl, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, marginTop: spacing.xl, alignSelf: "flex-start" }}
            >
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Submit proof now</Text>
            </TouchableOpacity>
          </Card>

          <Card variant="glass">
            <Text numberOfLines={1} style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Alerts from branch head</Text>
            <View style={{ gap: spacing.lg, marginTop: spacing.xl }}>
              <View style={{ backgroundColor: colors.red50, borderRadius: borderRadius["2xl"], padding: spacing.xl }}>
                <Text style={{ fontSize: fontSize.sm, color: colors.red700 }}>Rear exit light failed. Employee must recheck every 90 minutes until fixed.</Text>
              </View>
              <View style={{ backgroundColor: colors.amber50, borderRadius: borderRadius["2xl"], padding: spacing.xl }}>
                <Text style={{ fontSize: fontSize.sm, color: colors.amber700 }}>Customer lounge AC complaint waiting for quick inspection image.</Text>
              </View>
              <View style={{ backgroundColor: colors.sky50, borderRadius: borderRadius["2xl"], padding: spacing.xl }}>
                <Text style={{ fontSize: fontSize.sm, color: colors.sky700 }}>Tomorrow at 08:30 there is a safety briefing with Farah.</Text>
              </View>
            </View>
          </Card>
        </View>
      </View>
    </ScreenWrapper>
  );
}
