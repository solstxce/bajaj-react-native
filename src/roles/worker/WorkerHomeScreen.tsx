import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Camera, MapPin, TriangleAlert, Clock, ShieldCheck, AlertCircle, CalendarDays, ChevronRight } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { AlertStrip } from "../../shared/components/AlertStrip";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { TaskCard } from "../../shared/components/TaskCard";
import { QuickButton } from "../../shared/components/QuickButton";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";
import { formatPct, countdown } from "../../utils/helpers";

export function WorkerHomeScreen() {
  const { currentUser, getBranch, tasks, showToast, markAttendance, submitTaskProof, setPage, openFormModal, openAuditTrail } = useApp();
  const branch = getBranch(currentUser.branchId)!;
  const ownTasks = tasks
    .filter((t) => t.branchId === currentUser.branchId && t.audience === "worker" && (!t.assignedTo || t.assignedTo === currentUser.id))
    .slice(0, 3);

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Worker command desk"
        action={
          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            <QuickButton label="Mark Attendance" icon={MapPin} onPress={() => { markAttendance(); }} />
            <QuickButton label="Raise Issue" icon={AlertCircle} onPress={() => openFormModal("complaint")} />
          </View>
        }
      />

      <AlertStrip onReviewAlerts={() => setPage("notifications")} onOpenAudit={openAuditTrail} />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ width: "47%" }}><StatCard label="Today's proof tasks" value={String(ownTasks.length)} meta="1 critical task missing proof" accent={colors.brand} icon={Camera} /></View>
        <View style={{ width: "47%" }}><StatCard label="Attendance status" value="Inside fence" meta={branch.geoRadius + "m policy, selfie matched"} accent={colors.success} icon={ShieldCheck} /></View>
        <View style={{ width: "47%" }}><StatCard label="Open alerts" value="2" meta="Fire exit light and lounge AC" accent={colors.error} icon={TriangleAlert} /></View>
        <View style={{ width: "47%" }}><StatCard label="This month" value={formatPct(currentUser.attendancePct)} meta={"Task proof closure " + formatPct(currentUser.proofRate)} accent={colors.slate600} icon={CalendarDays} /></View>
      </View>

      <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 }}>
              <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                <Clock size={16} color={colors.brand} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.textSecondary, textTransform: "uppercase" }}>Live queue</Text>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Today's worker tasks</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setPage("tasks")} style={{ backgroundColor: colors.brand, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm }}>
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>Open all</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: spacing.xl }}>
            {ownTasks.map((task) => (
              <TaskCard key={task.id} task={task} compact actions={task.status !== "Completed" ? [{ label: "Submit Photo", onPress: () => submitTaskProof(task.id), primary: true }] : undefined} />
            ))}
          </View>
        </Card>

        <Card variant="soft" style={{ backgroundColor: colors.text }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.sm }}>
            <Clock size={16} color={colors.slate300} strokeWidth={2} />
            <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.slate300, textTransform: "uppercase" }}>Countdown focus</Text>
          </View>
          <Text style={{ fontSize: fontSize["4xl"], fontWeight: "800", color: colors.white }}>
            {ownTasks[0] ? countdown(ownTasks[0].deadline, "2026-04-26T11:20:00") : "No tasks"}
          </Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.slate300, marginTop: spacing.sm }}>
            Open lobby patrol will escalate if photo proof is not uploaded on time.
          </Text>
          <TouchableOpacity
            onPress={() => ownTasks[0] && submitTaskProof(ownTasks[0].id)}
            style={{ backgroundColor: colors.white, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, marginTop: spacing.xl, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: spacing.sm }}
          >
            <Camera size={14} color={colors.text} strokeWidth={2} />
            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Submit proof now</Text>
          </TouchableOpacity>
        </Card>

        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.error + "15", alignItems: "center", justifyContent: "center" }}>
              <TriangleAlert size={16} color={colors.error} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Alerts from branch head</Text>
          </View>
          <View style={{ gap: spacing.md }}>
            <View style={{ backgroundColor: colors.red50, borderRadius: borderRadius.lg, padding: spacing.xl, flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
              <TriangleAlert size={16} color={colors.red700} strokeWidth={2} style={{ marginTop: 2 }} />
              <Text style={{ fontSize: fontSize.sm, color: colors.red700, flex: 1 }}>Rear exit light failed. Patrol must recheck every 90 minutes until fixed.</Text>
            </View>
            <View style={{ backgroundColor: colors.amber50, borderRadius: borderRadius.lg, padding: spacing.xl, flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
              <AlertCircle size={16} color={colors.amber700} strokeWidth={2} style={{ marginTop: 2 }} />
              <Text style={{ fontSize: fontSize.sm, color: colors.amber700, flex: 1 }}>Customer lounge AC complaint waiting for quick inspection image.</Text>
            </View>
            <View style={{ backgroundColor: colors.sky50, borderRadius: borderRadius.lg, padding: spacing.xl, flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
              <CalendarDays size={16} color={colors.sky700} strokeWidth={2} style={{ marginTop: 2 }} />
              <Text style={{ fontSize: fontSize.sm, color: colors.sky700, flex: 1 }}>Tomorrow at 08:30 there is a safety briefing with Meena.</Text>
            </View>
          </View>
        </Card>

        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={16} color={colors.brand} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Proof escalation ladder</Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md }}>
            {[
              { title: "Worker", desc: "Submit geo proof or task stays pending.", bg: colors.orange50, text: colors.orange700, icon: Camera },
              { title: "AA", desc: "Gets notified once deadline risk starts.", bg: colors.emerald50, text: colors.emerald700, icon: Clock },
              { title: "Branch Manager", desc: "Reviews repeated misses and calls branch.", bg: colors.sky50, text: colors.sky700, icon: ShieldCheck },
              { title: "RM", desc: "Only for safety, audit or repeated failures.", bg: colors.rose50, text: colors.rose700, icon: TriangleAlert },
            ].map((step) => (
              <View key={step.title} style={{ backgroundColor: step.bg, borderRadius: borderRadius.lg, padding: spacing.xl, width: "47%", minWidth: 140 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
                  <step.icon size={14} color={step.text} strokeWidth={2} />
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: step.text }}>{step.title}</Text>
                </View>
                <Text style={{ fontSize: fontSize.xs, color: step.text }}>{step.desc}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>
    </ScreenWrapper>
  );
}
