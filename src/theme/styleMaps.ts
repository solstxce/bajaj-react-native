import { RoleId } from "../types/domain";
import { colors } from "./theme";

export function toneClass(type: string) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    Critical: { bg: colors.rose50, text: colors.rose700, border: colors.rose200 },
    High: { bg: colors.orange50, text: colors.orange700, border: colors.orange200 },
    Medium: { bg: colors.amber50, text: colors.amber700, border: colors.amber200 },
    Low: { bg: colors.slate100, text: colors.slate600, border: colors.slate200 },
    Pending: { bg: colors.amber50, text: colors.amber700, border: colors.amber200 },
    "In Progress": { bg: colors.sky50, text: colors.sky700, border: colors.sky200 },
    Completed: { bg: colors.emerald50, text: colors.emerald700, border: colors.emerald200 },
    Resolved: { bg: colors.emerald50, text: colors.emerald700, border: colors.emerald200 },
    Escalated: { bg: colors.rose50, text: colors.rose700, border: colors.rose200 },
    Revoked: { bg: colors.red50, text: colors.red700, border: colors.red500 },
    Approved: { bg: colors.emerald50, text: colors.emerald700, border: colors.emerald200 },
    Rejected: { bg: colors.slate100, text: colors.slate600, border: colors.slate200 },
    "At Risk": { bg: colors.orange50, text: colors.orange700, border: colors.orange200 },
    Operational: { bg: colors.emerald50, text: colors.emerald700, border: colors.emerald200 },
    Down: { bg: colors.rose50, text: colors.rose700, border: colors.rose500 },
    Scheduled: { bg: colors.sky50, text: colors.sky700, border: colors.sky200 },
    Closed: { bg: colors.slate100, text: colors.slate600, border: colors.slate200 },
    Warning: { bg: colors.amber50, text: colors.amber700, border: colors.amber200 },
    Success: { bg: colors.emerald50, text: colors.emerald700, border: colors.emerald200 },
    Error: { bg: colors.rose50, text: colors.rose700, border: colors.rose200 },
    Info: { bg: colors.sky50, text: colors.sky700, border: colors.sky200 },
  };
  return map[type] || { bg: colors.slate100, text: colors.slate700, border: colors.slate200 };
}

export function roleAccent(role: RoleId): { bg: string; text: string } {
  const map: Record<RoleId, string> = {
    worker: colors.brandSecondary,
    am: colors.success,
    branchManager: colors.brandDeep,
    rm: colors.brand,
  };
  return { bg: map[role], text: colors.white };
}

export function roleIcon(role: RoleId): string {
  const map: Record<RoleId, string> = {
    worker: "HardHat",
    am: "UserCog",
    branchManager: "Briefcase",
    rm: "Crown",
  };
  return map[role];
}

export function pageIcon(pageId: string): string {
  const map: Record<string, string> = {
    home: "Home",
    dashboard: "BarChart3",
    tasks: "ListChecks",
    complaints: "Wrench",
    issues: "AlertCircle",
    attendance: "MapPin",
    notifications: "Bell",
    profile: "IdCard",
    branch: "Building",
    branches: "Building",
    monitoring: "LineChart",
    approvals: "Stamp",
    visits: "Route",
    intelligence: "Satellite",
    alerts: "TriangleAlert",
    finance: "Wallet",
    analytics: "ChartColumn",
    users: "Users",
    settings: "Sliders",
  };
  return map[pageId] || "Circle";
}

export function progressColor(status: string): string {
  if (status === "Completed" || status === "Resolved" || status === "Approved") return colors.success;
  if (status === "Critical" || status === "Escalated" || status === "Revoked" || status === "Down") return colors.error;
  if (status === "In Progress") return colors.brandSecondary;
  return colors.brand;
}
