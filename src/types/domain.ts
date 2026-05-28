export type RoleId = "worker" | "employee" | "am" | "branchManager" | "rm";

export type Priority = "low" | "medium" | "high" | "critical";

export type RolePage = { id: string; label: string; emoji: string };

export type RoleDef = {
  id: RoleId;
  name: string;
  short: string;
  hierarchy: string;
  pages: RolePage[];
};

export type Branch = { id: number; code: string; name: string; city: string; health: number; attendance: number };
export type Task = { id: number; title: string; branchId: number; assigneeRole: RoleId; done: boolean; priority: Priority; due: string };
export type Complaint = { id: number; title: string; branchId: number; status: "active" | "resolved" | "escalated"; severity: Priority };
export type Approval = { id: number; label: string; branchId: number; status: "pending" | "approved" | "rejected"; amount: number };
export type NoticePriority = "high" | "medium" | "low";
export type Notice = {
  id: number;
  title: string;
  description: string;
  branchId: number;
  type: "info" | "warning" | "critical" | "task" | "escalation";
  priority: NoticePriority;
  read: boolean;
  bookmarked: boolean;
  timestamp: string;
};
