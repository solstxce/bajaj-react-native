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
    <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl, ...shadows.card }}>
      <View style={{ gap: spacing.xl }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" }}>
            <Badge label={task.status} type={task.status} />
            <Badge label={task.priority} type={task.priority} />
            <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.textSecondary, textTransform: "uppercase" }}>{task.schedule}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: spacing.md, marginTop: spacing.lg }}>
            <View style={{ width: 28, height: 28, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
              <Camera size={14} color={colors.brand} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, flex: 1 }}>{task.title}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xs, marginLeft: spacing.md + spacing.lg }}>
            <MapPin size={12} color={colors.textSecondary} strokeWidth={2} />
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{branch?.name} | {task.zone} | Assigned: {assignee}</Text>
          </View>

          {compact ? null : (
            <>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
                <View style={{ minWidth: 80, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <Clock size={14} color={colors.textSecondary} strokeWidth={2} />
                  <View>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Deadline</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{countdown(task.deadline, "2026-04-26T11:20:00")}</Text>
                  </View>
                </View>
                <View style={{ minWidth: 80, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <CheckSquare size={14} color={colors.textSecondary} strokeWidth={2} />
                  <View>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Checklist</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{task.checklistDone}/{task.checklistTotal} items</Text>
                  </View>
                </View>
                <View style={{ minWidth: 80, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <Camera size={14} color={colors.textSecondary} strokeWidth={2} />
                  <View>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Proof rule</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{task.proofLabel}</Text>
                  </View>
                </View>
                <View style={{ minWidth: 80, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                  <ShieldAlert size={14} color={colors.textSecondary} strokeWidth={2} />
                  <View>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>Escalation</Text>
                    <Text numberOfLines={2} style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{task.escalation}</Text>
                  </View>
                </View>
              </View>
              <View style={{ marginTop: spacing.lg }}>
                <ProgressBar value={pct} color={progressColor(task.status)} />
              </View>
            </>
          )}

          {task.redoReason ? (
            <View style={{ marginTop: spacing.lg, backgroundColor: colors.red50, borderRadius: borderRadius.lg, padding: spacing.lg, flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
              <RotateCcw size={14} color={colors.red700} strokeWidth={2} style={{ marginTop: 2 }} />
              <Text style={{ fontSize: fontSize.sm, color: colors.red700, flex: 1 }}><Text style={{ fontWeight: "700" }}>Redo note:</Text> {task.redoReason}</Text>
            </View>
          ) : null}
        </View>

        {actions && actions.length > 0 ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
            <TouchableOpacity
              onPress={() => openTaskDetail(task.id)}
              style={{
                borderRadius: borderRadius.lg,
                paddingHorizontal: spacing.xl,
                paddingVertical: spacing.md,
                backgroundColor: colors.brand,
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <Eye size={14} color={colors.white} strokeWidth={2} />
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>Detail</Text>
            </TouchableOpacity>
            {actions.map((a, i) => (
              <TouchableOpacity
                key={i}
                onPress={a.onPress}
                style={{
                  borderRadius: borderRadius.lg,
                  paddingHorizontal: spacing.xl,
                  paddingVertical: spacing.md,
                  backgroundColor: a.primary ? colors.success : colors.card,
                  borderWidth: a.primary ? 0 : 1,
                  borderColor: colors.border,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                {a.primary && <Camera size={14} color={colors.white} strokeWidth={2} />}
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: a.primary ? colors.white : colors.text }}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}
