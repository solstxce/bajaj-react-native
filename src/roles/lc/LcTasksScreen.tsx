import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Clock, CheckCircle2, PlayCircle, Search, Calendar } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { TaskCard } from "../../shared/components/TaskCard";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function LcTasksScreen() {
  const { state, setTab, currentUser, scopedTasks, submitTaskProof, markTaskDone } = useApp();
  const filter = state.tabs.lcTasks || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("2026-04-20");
  const [toDate, setToDate] = useState("2026-04-26");

  const myTasks = scopedTasks.filter((t) => t.assignedTo === currentUser.id);
  const statusFiltered = filter === "all" ? myTasks : myTasks.filter((t) => t.status === filter);
  
  const list = statusFiltered.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.zone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pending = myTasks.filter((t) => t.status === "Pending").length;
  const completed = myTasks.filter((t) => t.status === "Completed").length;
  const inProgress = myTasks.filter((t) => t.status === "In Progress").length;

  return (
    <ScreenWrapper>
      <SectionHeader
        title="My task board"
        action={
          <SegmentedControl
            tabs={[{ label: "All", value: "all" }, { label: "Pending", value: "Pending" }, { label: "In Progress", value: "In Progress" }, { label: "Completed", value: "Completed" }]}
            activeKey={filter}
            onChange={(v) => setTab("lcTasks", v)}
          />
        }
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 280 }}><StatCard label="Pending" value={String(pending)} meta="Awaiting completion" accent={colors.brand} icon={Clock} /></View>
        <View style={{ flex: 1, minWidth: 280 }}><StatCard label="In Progress" value={String(inProgress)} meta="Currently working" accent={colors.brandSecondary} icon={PlayCircle} /></View>
        <View style={{ flex: 1, minWidth: 280 }}><StatCard label="Completed" value={String(completed)} meta="Proof accepted" accent={colors.success} icon={CheckCircle2} /></View>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.xl }}>
        <View style={{ flex: 2, minWidth: 200, flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border }}>
          <Search size={16} color={colors.slate400} />
          <TextInput 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search tasks..." 
            placeholderTextColor={colors.slate400}
            style={{ flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.sm, color: colors.slate900, fontSize: fontSize.sm }} 
          />
        </View>
        <View style={{ flex: 1, minWidth: 140, flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border }}>
          <Calendar size={16} color={colors.slate400} />
          <TextInput value={fromDate} onChangeText={setFromDate} placeholder="From" style={{ flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.sm, color: colors.slate900, fontSize: fontSize.sm }} />
        </View>
        <View style={{ flex: 1, minWidth: 140, flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border }}>
          <Calendar size={16} color={colors.slate400} />
          <TextInput value={toDate} onChangeText={setToDate} placeholder="To" style={{ flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.sm, color: colors.slate900, fontSize: fontSize.sm }} />
        </View>
      </View>

      <View style={{ marginTop: spacing.xl, gap: spacing.xl }}>
        {list.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            actions={task.status === "Pending" || task.status === "In Progress" ? [
              { label: "Submit Proof", onPress: () => submitTaskProof(task.id), primary: true },
              { label: "Mark Complete", onPress: () => markTaskDone(task.id) },
            ] : undefined}
          />
        ))}
        {list.length === 0 && (
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", paddingVertical: spacing["4xl"] }}>No tasks found for this filter</Text>
        )}
      </View>
    </ScreenWrapper>
  );
}
