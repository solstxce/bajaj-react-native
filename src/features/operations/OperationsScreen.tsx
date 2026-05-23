import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ROLES } from "../../constants/roles";
import { theme } from "../../constants/theme";
import { Panel } from "../../components/shared/Panel";
import { StatCard } from "../../components/shared/StatCard";
import { Approval, Branch, Complaint, Notice, RoleId, Task } from "../../types/domain";
import { TasksSection } from "./sections/TasksSection";
import { ComplaintsSection } from "./sections/ComplaintsSection";
import { ApprovalsSection } from "./sections/ApprovalsSection";
import { NotificationsSection } from "./sections/NotificationsSection";
import { AttendanceSection } from "./sections/AttendanceSection";
import { BranchSection } from "./sections/BranchSection";
import { VisitsSection } from "./sections/VisitsSection";
import { UsersSection } from "./sections/UsersSection";
import { AnalyticsSection } from "./sections/AnalyticsSection";

type Props = {
  role: RoleId;
  page: string;
  stats: { avgHealth: number; openTasks: number; activeComplaints: number; unread: number };
  branches: Branch[];
  tasks: Task[];
  complaints: Complaint[];
  approvals: Approval[];
  notifications: Notice[];
  switchRole: (role: RoleId) => void;
  markTaskDone: (id: number) => void;
  revokeTask: (id: number) => void;
  resolveComplaint: (id: number) => void;
  escalateComplaint: (id: number) => void;
  decideApproval: (id: number, status: "approved" | "rejected") => void;
  toggleNotification: (id: number) => void;
  createTask: (title: string) => void;
  createComplaint: (title: string) => void;
};

export function OperationsScreen({ role, page, stats, branches, tasks, complaints, approvals, notifications, switchRole, markTaskDone, revokeTask, resolveComplaint, escalateComplaint, decideApproval, toggleNotification, createTask, createComplaint }: Props) {
  const [modal, setModal] = useState<"none" | "task" | "complaint">("none");
  const [title, setTitle] = useState("");

  const submit = () => {
    const value = title.trim();
    if (!value) return;
    if (modal === "task") createTask(value);
    if (modal === "complaint") createComplaint(value);
    setTitle("");
    setModal("none");
  };

  return (
    <>
    <ScrollView contentContainerStyle={styles.content}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roleRow}>
        {(Object.keys(ROLES) as RoleId[]).map((id) => {
          const active = id === role;
          return (
            <Pressable key={id} onPress={() => switchRole(id)} style={[styles.roleChip, active && styles.roleChipActive]}>
              <Text style={[styles.roleChipText, active && styles.roleChipTextActive]}>{ROLES[id].name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.statsRow}>
        <StatCard label="Avg Health" value={`${stats.avgHealth}%`} />
        <StatCard label="Open Tasks" value={`${stats.openTasks}`} />
        <StatCard label="Complaints" value={`${stats.activeComplaints}`} />
        <StatCard label="Unread" value={`${stats.unread}`} />
      </View>

      <Panel title={`Current Module: ${page}`}>
        <Text style={styles.text}>Role-aware sections are now split by feature and ready for API integration.</Text>
        <View style={styles.quickRow}>
          <Pressable style={styles.primaryBtn} onPress={() => setModal("task")}><Text style={styles.primaryBtnText}>+ Task</Text></Pressable>
          <Pressable style={styles.softBtn} onPress={() => setModal("complaint")}><Text style={styles.softBtnText}>+ Complaint</Text></Pressable>
        </View>
      </Panel>

      {(page === "tasks" || page === "monitoring") && <TasksSection tasks={tasks} onDone={markTaskDone} onRevoke={revokeTask} />}
      {(page === "complaints" || page === "issues" || page === "alerts") && (
        <ComplaintsSection complaints={complaints} onResolve={resolveComplaint} onEscalate={escalateComplaint} />
      )}
      {(page === "approvals" || page === "finance") && <ApprovalsSection approvals={approvals} onDecision={decideApproval} />}
      {page === "notifications" && <NotificationsSection notices={notifications} onToggle={toggleNotification} />}
      {page === "attendance" && <AttendanceSection branches={branches} />}
      {(page === "branch" || page === "branches" || page === "intelligence" || page === "analytics" || page === "home" || page === "dashboard") && (
        <BranchSection branches={branches} />
      )}
      {(page === "analytics" || page === "dashboard") && <AnalyticsSection />}
      {page === "users" && <UsersSection />}
      {page === "visits" && <VisitsSection />}
      {(page === "profile" || page === "settings" || page === "users" || page === "visits") && (
        <Panel title="Profile & Control">
          <Text style={styles.text}>User profile, permissions, settings, visit logs, and user management belong to this module group.</Text>
        </Panel>
      )}
    </ScrollView>
    <Modal visible={modal !== "none"} transparent animationType="slide" onRequestClose={() => setModal("none")}>
      <View style={styles.modalBg}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{modal === "task" ? "Create Task" : "Create Complaint"}</Text>
          <TextInput value={title} onChangeText={setTitle} placeholder="Enter title" style={styles.input} />
          <View style={styles.quickRow}>
            <Pressable style={styles.softBtn} onPress={() => setModal("none")}><Text style={styles.softBtnText}>Cancel</Text></Pressable>
            <Pressable style={styles.primaryBtn} onPress={submit}><Text style={styles.primaryBtnText}>Save</Text></Pressable>
          </View>
        </View>
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 12, paddingBottom: 100, gap: 10 },
  roleRow: { gap: 8, paddingVertical: 4 },
  roleChip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999, backgroundColor: "#fff", borderWidth: 1, borderColor: theme.line },
  roleChipActive: { backgroundColor: theme.navy, borderColor: theme.navy },
  roleChipText: { color: theme.ink, fontWeight: "700", fontSize: 12 },
  roleChipTextActive: { color: "#fff" },
  statsRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  text: { color: theme.muted, fontSize: 13 },
  quickRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  primaryBtn: { backgroundColor: theme.brand, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999 },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  softBtn: { backgroundColor: "#fff", borderWidth: 1, borderColor: theme.line, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999 },
  softBtnText: { color: theme.ink, fontWeight: "700", fontSize: 12 },
  modalBg: { flex: 1, backgroundColor: "rgba(2,6,23,0.35)", justifyContent: "center", padding: 16 },
  modalCard: { backgroundColor: "#fff", borderRadius: 16, padding: 14, gap: 10 },
  modalTitle: { color: theme.ink, fontWeight: "900", fontSize: 16 },
  input: { borderWidth: 1, borderColor: theme.line, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 9 },
});
