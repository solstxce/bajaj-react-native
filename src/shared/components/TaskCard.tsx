import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Clock, MapPin, CheckSquare, ShieldAlert, Camera, RotateCcw, Eye } from "lucide-react-native";
import { Task } from "../../types/domain";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius, shadows } from "../../theme/theme";
import { progressColor } from "../../theme/styleMaps";
import { formatMoney, countdown } from "../../utils/helpers";
import { Badge } from "./Badge";
import { ProgressBar } from "./ProgressBar";

interface Props {
  task: Task;
  compact?: boolean;
  actions?: { label: string; onPress: () => void; primary?: boolean }[];
}

export function TaskCard({ task, compact = false, actions }: Props) {
  const { getBranch, getUser, openTaskDetail } = useApp();
  const branch = getBranch(task.branchId);
  const assignee = task.assignedTo ? getUser(task.assignedTo)?.name : "Shared";
  const pct = (task.checklistDone / task.checklistTotal) * 100;

  return (
    <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl, ...shadows.card }}>
      <View style={{ gap: spacing.lg }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center", marginBottom: spacing.md }}>
            <Badge label={task.status} type={task.status} />
            <Badge label={task.priority} type={task.priority} />
            <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.slate400, textTransform: "uppercase", letterSpacing: 0.3 }}>{task.schedule}</Text>
          </View>
          <View style={{ gap: spacing.xs }}>
            <Text style={{ fontSize: fontSize.xl, fontWeight: "700", color: colors.slate900 }}>{task.title}</Text>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "500", color: colors.slate500 }}>{branch?.name} | {task.zone} | Assigned: {assignee}</Text>
          </View>

          {compact ? null : (
            <>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
                <View style={{ flex: 1, minWidth: 100 }}>
                  <Text style={{ fontSize: fontSize.xs, color: colors.slate400, marginBottom: 2 }}>Deadline</Text>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.slate900 }}>{countdown(task.deadline, "2026-04-26T11:20:00")}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 100 }}>
                  <Text style={{ fontSize: fontSize.xs, color: colors.slate400, marginBottom: 2 }}>Checklist</Text>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.slate900 }}>{task.checklistDone}/{task.checklistTotal} items</Text>
                </View>
                <View style={{ flex: 1, minWidth: 100 }}>
                  <Text style={{ fontSize: fontSize.xs, color: colors.slate400, marginBottom: 2 }}>Proof rule</Text>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.slate900 }}>{task.proofLabel}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 100 }}>
                  <Text style={{ fontSize: fontSize.xs, color: colors.slate400, marginBottom: 2 }}>Escalation</Text>
                  <Text numberOfLines={2} style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.slate900 }}>{task.escalation}</Text>
                </View>
              </View>
              <View style={{ marginTop: spacing.lg }}>
                <ProgressBar value={pct} color={progressColor(task.status)} />
              </View>
            </>
          )}

          {task.redoReason ? (
            <View style={{ marginTop: spacing.lg, backgroundColor: colors.red50, borderRadius: borderRadius.lg, padding: spacing.lg }}>
              <Text style={{ fontSize: fontSize.sm, color: colors.red700 }}><Text style={{ fontWeight: "600" }}>Redo note:</Text> {task.redoReason}</Text>
            </View>
          ) : null}
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: compact ? spacing.md : 0 }}>
          <TouchableOpacity
            onPress={() => openTaskDetail(task.id)}
            style={{ borderRadius: borderRadius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: spacing.sm }}
          >
            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.slate700 }}>Open detail</Text>
          </TouchableOpacity>
          {actions?.map((a, i) => (
            <TouchableOpacity
              key={i}
              onPress={a.onPress}
              style={{ borderRadius: borderRadius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: a.primary ? colors.success : colors.slate900, flexDirection: "row", alignItems: "center", gap: spacing.sm }}
            >
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
