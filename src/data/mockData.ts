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
  { id: 31, title: "Daily attendance lock at 11:00", description: "All branches must lock attendance by 11:00 AM. Pending corrections to be submitted by branch manager.", type: "info", priority: "medium", read: false, bookmarked: false, timestamp: "2026-05-28T09:15:00Z", branchId: 1 },
  { id: 32, title: "Critical complaint aging > 24h", description: "Complaint #1024 at Gachibowli Office has been unresolved for over 24 hours. Immediate attention required.", type: "critical", priority: "high", read: false, bookmarked: true, timestamp: "2026-05-28T08:45:00Z", branchId: 3 },
  { id: 33, title: "Task overdue: QC verification", description: "QC verification for Unit 4B at Banjara Hills is past due. Escalated to shift supervisor.", type: "task", priority: "high", read: false, bookmarked: false, timestamp: "2026-05-28T07:30:00Z", branchId: 1 },
  { id: 34, title: "Leave request pending approval", description: "Priya S. from Kukatpally has submitted a leave request awaiting your approval.", type: "info", priority: "low", read: false, bookmarked: false, timestamp: "2026-05-28T06:00:00Z", branchId: 3 },
  { id: 35, title: "Escalation: Network infrastructure", description: "Network downtime issue at Gachibowli escalated to regional IT support. Tracking ticket #IT-8921.", type: "escalation", priority: "high", read: false, bookmarked: true, timestamp: "2026-05-27T22:15:00Z", branchId: 2 },
  { id: 36, title: "Attendance anomaly detected", description: "3 staff members clocked in late at Kukatpally branch. Manual review recommended.", type: "warning", priority: "medium", read: true, bookmarked: false, timestamp: "2026-05-27T18:30:00Z", branchId: 3 },
  { id: 37, title: "Monthly safety report due", description: "May safety compliance report for all branches must be filed by June 2nd.", type: "task", priority: "low", read: true, bookmarked: false, timestamp: "2026-05-27T16:00:00Z", branchId: 1 },
  { id: 38, title: "Branch audit completed", description: "Banjara Hills passed monthly audit with 96% compliance score. 2 minor flags to review.", type: "info", priority: "low", read: true, bookmarked: false, timestamp: "2026-05-27T14:20:00Z", branchId: 1 },
  { id: 39, title: "Vendor payment approved", description: "Vendor payment of ₹29,000 for office supplies has been approved and processed.", type: "info", priority: "medium", read: true, bookmarked: true, timestamp: "2026-05-27T11:00:00Z", branchId: 2 },
  { id: 40, title: "System maintenance scheduled", description: "Core banking system will be down from 02:00-04:00 AM on June 1st for scheduled maintenance.", type: "warning", priority: "medium", read: true, bookmarked: false, timestamp: "2026-05-27T09:00:00Z", branchId: 1 },
  { id: 41, title: "Fire drill compliance check", description: "All branches must complete quarterly fire drill by June 10th. Submit compliance report.", type: "task", priority: "low", read: true, bookmarked: false, timestamp: "2026-05-26T16:45:00Z", branchId: 2 },
  { id: 42, title: "Employee of the month nominations", description: "Nominations for June Employee of the Month are open until May 30th. Submit your team picks.", type: "info", priority: "low", read: true, bookmarked: false, timestamp: "2026-05-26T10:30:00Z", branchId: 1 },
];
