import { Approval, Branch, Complaint, Notice, Task } from "../types/domain";

export const branches: Branch[] = [
  { id: 1, code: "HYD-BH-01", name: "Banjara Hills Office", city: "Hyderabad", health: 93, attendance: 96 },
  { id: 2, code: "HYD-GC-02", name: "Gachibowli Office", city: "Hyderabad", health: 88, attendance: 91 },
  { id: 3, code: "HYD-KP-03", name: "Kukatpally Office", city: "Hyderabad", health: 78, attendance: 86 },
];

export const initialTasks: Task[] = [
  { id: 1, title: "Opening checklist + photo proof", branchId: 1, assigneeRole: "worker", done: false, priority: "high", due: "Today 10:30" },
  { id: 2, title: "Counter audit for cash and docs", branchId: 2, assigneeRole: "employee", done: false, priority: "medium", due: "Today 14:00" },
  { id: 3, title: "Escalate branch AC maintenance", branchId: 3, assigneeRole: "am", done: true, priority: "critical", due: "Done" },
];

export const initialComplaints: Complaint[] = [
  { id: 11, title: "Printer not responding", branchId: 1, status: "active", severity: "medium" },
  { id: 12, title: "Network downtime after 4 PM", branchId: 2, status: "escalated", severity: "high" },
];

export const initialApprovals: Approval[] = [
  { id: 21, label: "Vendor payment release", branchId: 2, status: "pending", amount: 29000 },
  { id: 22, label: "Emergency repair expense", branchId: 3, status: "pending", amount: 64000 },
];

export const initialNotifications: Notice[] = [
  { id: 31, title: "Daily attendance lock at 11:00", branchId: 1, type: "info", read: false },
  { id: 32, title: "Critical complaint aging > 24h", branchId: 3, type: "warning", read: false },
];
