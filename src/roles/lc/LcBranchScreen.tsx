import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Users, UserCheck, Plug, ClipboardCheck, Phone, ChevronRight,
  ShieldCheck, LucideIcon,
} from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { ProgressBar } from "../../shared/components/ProgressBar";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { QuickButton } from "../../shared/components/QuickButton";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius, fontWeight } from "../../theme/theme";
import { formatPct } from "../../utils/helpers";
import { User } from "../../types/domain";

// ── Module-scope constants ──

const BRANCH_TABS = [
  { label: "Workers", value: "workers" },
  { label: "Employees", value: "employees" },
  { label: "Appliances", value: "appliances" },
  { label: "Audit", value: "audit" },
] as const;

const WORKER_SKILLS = ["Patrol", "Equipment check", "Fire safety", "Housekeeping", "Cleaning"];

const FAB_CONFIG: Record<string, { label: string; formType: string }> = {
  workers: { label: "Add Worker", formType: "staff" },
  employees: { label: "Add Employee", formType: "staff" },
  appliances: { label: "Add Appliance", formType: "appliance" },
  audit: { label: "Audit Trail", formType: "audit" },
};

// ── Helpers ──

function isWorkerLike(user: User): boolean {
  if (user.skills.some((s) => WORKER_SKILLS.includes(s))) return true;
  return user.salary < 30000;
}

function partitionStaff(staff: User[]): { workers: User[]; employees: User[] } {
  const workers: User[] = [];
  const employees: User[] = [];
  for (const u of staff) {
    (isWorkerLike(u) ? workers : employees).push(u);
  }
  return { workers, employees };
}

// ── Shared UI primitives ──

function MetricTile({ label, value, center }: { label: string; value: string; center?: boolean }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: center ? "center" : undefined }}>
      <Text style={{ fontSize: 10, fontWeight: fontWeight.semibold, color: colors.slate400, textTransform: "uppercase", letterSpacing: 1 }}>
        {label}
      </Text>
      <Text style={{ fontSize: fontSize.md, fontWeight: fontWeight.extrabold, color: colors.slate900, marginTop: spacing.xs }} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function ComplianceRow({ label, value, valueColor }: { label: string; value: string; valueColor: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border }}>
      <Text style={{ fontSize: fontSize.sm, fontWeight: fontWeight.extrabold, color: colors.slate600 }}>{label}</Text>
      <Text style={{ fontSize: fontSize.lg, fontWeight: fontWeight.extrabold, color: valueColor }}>{value}</Text>
    </View>
  );
}

type StaffVariant = "worker" | "employee";

interface StaffMetricConfig {
  label: string;
  getValue: (u: User) => string;
}

const WORKER_METRICS: StaffMetricConfig[] = [
  { label: "Attend", getValue: (u) => formatPct(u.attendancePct) },
  { label: "Proof", getValue: (u) => formatPct(u.proofRate) },
  { label: "Tasks", getValue: (u) => String(u.tasksClosed) },
];

const EMPLOYEE_METRICS: StaffMetricConfig[] = [
  { label: "Department", getValue: (u) => u.position },
  { label: "Rating", getValue: (u) => u.rating.toFixed(1) },
  { label: "Closures", getValue: (u) => String(u.tasksClosed) },
];

function StaffCard({
  user,
  variant,
  onUserPress,
}: {
  user: User;
  variant: StaffVariant;
  onUserPress: (id: number) => void;
}) {
  const Icon: LucideIcon = variant === "worker" ? Users : UserCheck;
  const iconBg = variant === "worker" ? colors.slate100 : colors.emerald50;
  const iconColor = variant === "worker" ? colors.slate400 : colors.emerald600;
  const metrics = variant === "worker" ? WORKER_METRICS : EMPLOYEE_METRICS;
  const footerText = variant === "worker" ? `Shift: ${user.shift}` : `Last check-in: ${user.lastCheckIn}`;

  return (
    <Card variant="soft">
      <TouchableOpacity onPress={() => onUserPress(user.id)} activeOpacity={0.7}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.lg, flex: 1 }}>
            <View style={{ width: 44, height: 44, borderRadius: 16, backgroundColor: iconBg, alignItems: "center", justifyContent: "center" }}>
              <Icon size={20} color={iconColor} strokeWidth={2} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ fontSize: fontSize.lg, fontWeight: fontWeight.extrabold, color: colors.slate900 }} numberOfLines={1}>
                {user.name}
              </Text>
              <Text style={{ fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: colors.slate400, textTransform: "uppercase", letterSpacing: 1.2, marginTop: 2 }}>
                {user.position}
              </Text>
            </View>
          </View>
          <Badge label={user.status} type={user.status} />
        </View>

        <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.xl }}>
          {metrics.map((m) => (
            <MetricTile key={m.label} label={m.label} value={m.getValue(user)} />
          ))}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.lg, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border }}>
          <Text style={{ fontSize: fontSize.xs, color: colors.slate500 }}>{footerText}</Text>
          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            <TouchableOpacity
              onPress={() => onUserPress(user.id)}
              style={{ flex: 1, paddingVertical: spacing.md, borderRadius: borderRadius.lg, backgroundColor: colors.slate900, alignItems: "center" }}
            >
              <Text style={{ fontSize: fontSize.xs, fontWeight: fontWeight.extrabold, color: colors.white }}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: borderRadius.lg, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200, alignItems: "center" }}
            >
              <Phone size={14} color={colors.slate700} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

// ── Main Screen ──

export function LcBranchScreen() {
  const {
    state,
    setTab,
    currentUser,
    getBranch,
    scopedComplaints,
    scopedAppliances,
    scopedUsers,
    scopedAttendance,
    auditLog,
    openUserDetail,
    openApplianceDetail,
    openFormModal,
    openAuditTrail,
  } = useApp();

  const branch = getBranch(currentUser.branchId)!;
  const activeTab = state.tabs.lcBranch || "workers";

  const branchStaff = useMemo(
    () => scopedUsers.filter((u) => u.branchId === branch.id && u.id !== currentUser.id),
    [scopedUsers, branch.id, currentUser.id],
  );

  const { workers, employees } = useMemo(() => partitionStaff(branchStaff), [branchStaff]);

  const branchAssets = useMemo(
    () => scopedAppliances.filter((a) => a.branchId === branch.id),
    [scopedAppliances, branch.id],
  );

  const branchAudit = useMemo(
    () => auditLog.filter((a) => a.branchId === branch.id).slice(0, 10),
    [auditLog, branch.id],
  );

  const branchUserIdSet = useMemo(
    () => new Set(branchStaff.map((u) => u.id)),
    [branchStaff],
  );

  const branchAttendance = useMemo(
    () => scopedAttendance.filter((e) => branchUserIdSet.has(e.userId)),
    [scopedAttendance, branchUserIdSet],
  );

  const branchComplaints = useMemo(
    () => scopedComplaints.filter((c) => c.branchId === branch.id),
    [scopedComplaints, branch.id],
  );

  const employeeCount = branch.staffCount - branch.workerCount;

  // Compute proof task rate from actual staff data
  const proofTaskRate = useMemo(() => {
    if (branchStaff.length === 0) return "—";
    const avg = Math.round(branchStaff.reduce((sum, u) => sum + u.proofRate, 0) / branchStaff.length);
    return formatPct(avg);
  }, [branchStaff]);

  const currentFab = FAB_CONFIG[activeTab] || FAB_CONFIG.workers;

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Branch Hub"
        subtitle={`Operational control for ${branch.name}`}
        action={
          <View style={{ gap: spacing.md }}>
            <SegmentedControl
              tabs={[...BRANCH_TABS]}
              activeKey={activeTab}
              onChange={(v) => setTab("lcBranch", v)}
            />
            <View style={{ flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" }}>
              <QuickButton
                label={currentFab.label}
                icon={activeTab === "audit" ? ClipboardCheck : Users}
                onPress={() => (activeTab === "audit" ? openAuditTrail() : openFormModal(currentFab.formType))}
                variant="primary"
              />
              <QuickButton
                label="Notify team"
                icon={Phone}
                onPress={() => {}}
                variant="secondary"
              />
            </View>
          </View>
        }
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg }}>
        <View style={{ flex: 1, minWidth: 140 }}>
          <StatCard label="Workers" value={String(workers.length)} meta={`${workers.length} field staff`} icon={Users} accent={colors.brandSecondary} />
        </View>
        <View style={{ flex: 1, minWidth: 140 }}>
          <StatCard label="Employees" value={String(employees.length)} meta={`${employeeCount} office staff`} icon={UserCheck} accent={colors.success} />
        </View>
        <View style={{ flex: 1, minWidth: 140 }}>
          <StatCard label="Appliance Risk" value={String(branch.applianceRisk)} meta="Need service" icon={Plug} accent={colors.brand} />
        </View>
        <View style={{ flex: 1, minWidth: 140 }}>
          <StatCard label="Audit" value={formatPct(branch.auditScore)} meta={`Last visit ${branch.lastVisit}`} icon={ClipboardCheck} accent={branch.auditScore >= 90 ? colors.success : colors.warning} />
        </View>
      </View>

      <View style={{ marginTop: spacing["3xl"] }}>
        {activeTab === "workers" && (
          <StaffListTab staff={workers} variant="worker" emptyMessage="No workers in this branch" onUserPress={openUserDetail} />
        )}
        {activeTab === "employees" && (
          <StaffListTab staff={employees} variant="employee" emptyMessage="No employees in this branch" onUserPress={openUserDetail} />
        )}
        {activeTab === "appliances" && (
          <AppliancesTab appliances={branchAssets} onAppliancePress={openApplianceDetail} />
        )}
        {activeTab === "audit" && (
          <AuditTab branch={branch} auditLog={branchAudit} attendance={branchAttendance} branchComplaints={branchComplaints} proofTaskRate={proofTaskRate} />
        )}
      </View>
    </ScreenWrapper>
  );
}

// ── Staff List Tab (replaces WorkersTab + EmployeesTab) ──

function StaffListTab({
  staff,
  variant,
  emptyMessage,
  onUserPress,
}: {
  staff: User[];
  variant: StaffVariant;
  emptyMessage: string;
  onUserPress: (id: number) => void;
}) {
  if (staff.length === 0) {
    return (
      <Card variant="glass">
        <Text style={{ fontSize: fontSize.sm, color: colors.slate400, textAlign: "center", paddingVertical: spacing["3xl"] }}>
          {emptyMessage}
        </Text>
      </Card>
    );
  }

  return (
    <View style={{ gap: spacing.lg }}>
      {staff.map((user) => (
        <StaffCard key={user.id} user={user} variant={variant} onUserPress={onUserPress} />
      ))}
    </View>
  );
}

// ── Appliances Tab ──

function AppliancesTab({
  appliances,
  onAppliancePress,
}: {
  appliances: ReturnType<typeof useApp>["scopedAppliances"];
  onAppliancePress: (id: number) => void;
}) {
  if (appliances.length === 0) {
    return (
      <Card variant="glass">
        <Text style={{ fontSize: fontSize.sm, color: colors.slate400, textAlign: "center", paddingVertical: spacing["3xl"] }}>
          No appliances in this branch
        </Text>
      </Card>
    );
  }

  return (
    <View style={{ gap: spacing.lg }}>
      {appliances.map((app) => {
        const statusColor =
          app.status === "Operational" ? colors.success
            : app.status === "At Risk" ? colors.warning
              : colors.error;

        return (
          <Card key={app.id} variant="soft">
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" }}>
                <Badge label={app.status} type={app.status} />
                <Badge
                  label={app.approvalStatus.includes("Pending") ? "Pending" : "Approved"}
                  type={app.approvalStatus.includes("Pending") ? "Pending" : "Approved"}
                />
              </View>
              <TouchableOpacity onPress={() => onAppliancePress(app.id)} style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                <Text style={{ fontSize: fontSize.sm, fontWeight: fontWeight.extrabold, color: colors.brand }}>Details</Text>
                <ChevronRight size={14} color={colors.brand} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: fontSize.xl, fontWeight: fontWeight.extrabold, color: colors.slate900, marginTop: spacing.lg }}>
              {app.name}
            </Text>
            <Text style={{ fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: colors.slate400, textTransform: "uppercase", letterSpacing: 1.2, marginTop: spacing.xs }}>
              {app.category} · {app.brand}
            </Text>

            <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.xl }}>
              <MetricTile label="Health" value={`${app.healthScore}%`} center />
              <MetricTile label="AMC" value={app.amcVendor.split(" ")[0]} center />
              <MetricTile label="Service" value={app.nextService.slice(5)} center />
              <MetricTile label="Parts" value={app.pendingParts} center />
            </View>

            <View style={{ marginTop: spacing.lg }}>
              <ProgressBar value={app.healthScore} color={statusColor} height={6} />
            </View>
          </Card>
        );
      })}
    </View>
  );
}

// ── Audit Tab ──

function AuditTab({
  branch,
  auditLog,
  attendance,
  branchComplaints,
  proofTaskRate,
}: {
  branch: ReturnType<typeof useApp>["scopedBranches"][0];
  auditLog: ReturnType<typeof useApp>["auditLog"];
  attendance: ReturnType<typeof useApp>["scopedAttendance"];
  branchComplaints: ReturnType<typeof useApp>["scopedComplaints"];
  proofTaskRate: string;
}) {
  const presentCount = attendance.filter((e) => e.status === "Present").length;
  const lateCount = attendance.filter((e) => e.status === "Late").length;
  const openIssueCount = branchComplaints.filter((c) => c.status !== "Resolved").length;

  return (
    <View style={{ gap: spacing.xl }}>
      <Card variant="soft">
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.xl }}>
          <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
            <ClipboardCheck size={16} color={colors.brand} strokeWidth={2} />
          </View>
          <Text style={{ fontSize: fontSize.xl, fontWeight: fontWeight.extrabold, color: colors.slate900 }}>
            Branch Audit Trail
          </Text>
        </View>
        {auditLog.length > 0 ? (
          <View style={{ gap: spacing.md }}>
            {auditLog.map((entry) => (
              <View key={entry.id} style={{ backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: 10, fontWeight: fontWeight.extrabold, color: colors.slate400, textTransform: "uppercase", letterSpacing: 1.2 }}>
                    {entry.time}
                  </Text>
                  <Text style={{ fontSize: 10, fontWeight: fontWeight.extrabold, color: colors.brand }}>
                    {entry.role.toUpperCase()}
                  </Text>
                </View>
                <Text style={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.slate700, marginTop: spacing.sm }}>
                  {entry.text}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ fontSize: fontSize.sm, color: colors.slate400, textAlign: "center", paddingVertical: spacing.xl }}>
            No audit entries yet. Actions will appear here as they happen.
          </Text>
        )}
      </Card>

      <Card variant="soft">
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.xl }}>
          <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.success + "15", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={16} color={colors.success} strokeWidth={2} />
          </View>
          <Text style={{ fontSize: fontSize.xl, fontWeight: fontWeight.extrabold, color: colors.slate900 }}>
            Branch Compliance
          </Text>
        </View>

        <View style={{ gap: spacing.md }}>
          <ComplianceRow label="Geo Attendance" value={formatPct(branch.todayAttendance)} valueColor={colors.emerald600} />
          <ComplianceRow label="Proof Task Rate" value={proofTaskRate} valueColor={colors.brand} />
          <ComplianceRow label="Safety Issues" value={`${branch.criticalAlerts} Critical`} valueColor={colors.rose500} />

          <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.xl, marginTop: spacing.sm }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm }}>
              <Text style={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.slate500 }}>Audit score</Text>
              <Text style={{ fontSize: fontSize.sm, fontWeight: fontWeight.extrabold, color: colors.slate900 }}>{formatPct(branch.auditScore)}</Text>
            </View>
            <ProgressBar
              value={branch.auditScore}
              color={branch.auditScore >= 80 ? colors.success : branch.auditScore >= 60 ? colors.warning : colors.error}
              height={10}
            />
          </View>

          <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.sm }}>
            <MetricTile label="Present" value={String(presentCount)} center />
            <MetricTile label="Late" value={String(lateCount)} center />
            <MetricTile label="Open Issues" value={String(openIssueCount)} center />
          </View>
        </View>
      </Card>
    </View>
  );
}
