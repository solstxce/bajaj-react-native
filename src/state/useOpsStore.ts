import { useMemo, useState } from "react";
import { ROLES } from "../constants/roles";
import { branches, initialApprovals, initialComplaints, initialNotifications, initialTasks } from "../data/mockData";
import { RoleId } from "../types/domain";

export function useOpsStore() {
  const [role, setRole] = useState<RoleId>("worker");
  const [page, setPage] = useState(ROLES.worker.pages[0].id);
  const [tasks, setTasks] = useState(initialTasks);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [approvals, setApprovals] = useState(initialApprovals);
  const [notifications, setNotifications] = useState(initialNotifications);

  const stats = useMemo(() => {
    const avgHealth = Math.round(branches.reduce((sum, b) => sum + b.health, 0) / branches.length);
    return {
      avgHealth,
      openTasks: tasks.filter((t) => !t.done).length,
      activeComplaints: complaints.filter((c) => c.status !== "resolved").length,
      unread: notifications.filter((n) => !n.read).length,
    };
  }, [tasks, complaints, notifications]);

  const scopedTasks = tasks.filter((t) => role === "rm" || role === "branchManager" || t.assigneeRole === role);
  const scopedComplaints = complaints.filter((c) => role === "rm" || role === "branchManager" || c.status !== "resolved");
  const scopedApprovals = approvals.filter((a) => a.status === "pending");

  return {
    role,
    page,
    stats,
    branches,
    scopedTasks,
    scopedComplaints,
    scopedApprovals,
    notifications,
    setPage,
    switchRole: (nextRole: RoleId) => {
      setRole(nextRole);
      setPage(ROLES[nextRole].pages[0].id);
    },
    markTaskDone: (id: number) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: true } : t))),
    createTask: (title: string) =>
      setTasks((prev) => [
        {
          id: Date.now(),
          title,
          branchId: 1,
          assigneeRole: role,
          done: false,
          priority: "medium",
          due: "Today 18:00",
        },
        ...prev,
      ]),
    revokeTask: (id: number) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: false } : t))),
    resolveComplaint: (id: number) => setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status: "resolved" } : c))),
    escalateComplaint: (id: number) => setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status: "escalated" } : c))),
    createComplaint: (title: string) =>
      setComplaints((prev) => [
        { id: Date.now(), title, branchId: 1, status: "active", severity: "high" },
        ...prev,
      ]),
    decideApproval: (id: number, status: "approved" | "rejected") =>
      setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a))),
    toggleNotification: (id: number) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))),
  };
}
