import React from "react";
import { View, Text, ScrollView } from "react-native";
import { X, MapPin, Calendar, User, Building, Clock, CheckCircle, XCircle, AlertTriangle, DollarSign, Wrench, HardHat, Phone, Mail, Award, Activity, Shield, TrendingUp, FileText } from "lucide-react-native";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius, shadows } from "../../theme/theme";
import { Badge } from "../../shared/components/Badge";
import { ProgressBar } from "../../shared/components/ProgressBar";
import { QuickButton } from "../../shared/components/QuickButton";
import { ModalSheet } from "../../shared/components/ModalSheet";
import { formatMoney, countdown } from "../../utils/helpers";
import { Task, Complaint, Branch, User as UserType, Appliance, Approval, Visit } from "../../types/domain";

interface Props {
  visible: boolean;
  onClose: () => void;
  entityType: string;
  entityId: number;
}

export function DetailModal({ visible, onClose, entityType, entityId }: Props) {
  const { getTask, getComplaint, getBranch, getUser, getAppliance, tasks, complaints, approvals, visits, state, currentUser, submitTaskProof, markTaskDone, revokeTask, resolveComplaint, escalateComplaint, assignVendor, approveRequest, rejectRequest, showToast } = useApp();

  const type = entityType || state.modalType;
  const id = entityId || state.modalData?.id;

  const task = type === "task" ? getTask(id) || tasks.find(t => t.id === id) : undefined;
  const complaint = type === "complaint" ? getComplaint(id) : undefined;
  const branch = type === "branch" ? getBranch(id) : undefined;
  const user = type === "user" ? getUser(id) : undefined;
  const appliance = type === "appliance" ? getAppliance(id) : undefined;
  const approval = type === "approval" ? approvals.find(a => a.id === id) : undefined;
  const visit = type === "visit" ? visits.find(v => v.id === id) : undefined;

  function renderTaskContent() {
    if (!task) return null;
    const taskBranch = getBranch(task.branchId);
    const assignee = task.assignedTo ? getUser(task.assignedTo) : undefined;
    const pct = (task.checklistDone / task.checklistTotal) * 100;
    return (
      <>
        <View style={{ gap: spacing.md }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" }}>
            <Badge label={task.status} type={task.status as any} />
            <Badge label={task.priority} type={task.priority as any} />
            <Badge label={task.schedule} />
          </View>
          <Text style={{ fontSize: fontSize["2xl"], fontWeight: "400", color: colors.slate900 }}>{task.title}</Text>
        </View>
        <View style={{ gap: spacing.md }}>
          <DetailRow icon={Building} label="Branch" value={taskBranch?.name || "—"} />
          <DetailRow icon={MapPin} label="Zone" value={task.zone} />
          <DetailRow icon={User} label="Assigned to" value={assignee?.name || "Shared"} />
          <DetailRow icon={Clock} label="Deadline" value={countdown(task.deadline, "2026-04-26T11:20:00")} />
          <DetailRow icon={FileText} label="Proof rule" value={task.proofLabel} />
          <DetailRow icon={Activity} label="Escalation" value={task.escalation} />
        </View>
        <View>
          <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900, marginBottom: spacing.sm }}>Checklist: {task.checklistDone}/{task.checklistTotal}</Text>
          <ProgressBar value={pct} color={task.status === "Completed" ? colors.success : colors.brand} />
        </View>
        {task.notes ? (
          <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900 }}>Notes</Text>
            <Text style={{ fontSize: fontSize.sm, color: colors.slate500, marginTop: spacing.xs }}>{task.notes}</Text>
          </View>
        ) : null}
        {task.redoReason ? (
          <View style={{ backgroundColor: colors.red50, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.red700 }}>Redo reason</Text>
            <Text style={{ fontSize: fontSize.sm, color: colors.red700, marginTop: spacing.xs }}>{task.redoReason}</Text>
          </View>
        ) : null}
        {task.completedBy && task.completedAt ? (
          <View style={{ backgroundColor: colors.emerald50, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.emerald700 }}>Completed</Text>
            <Text style={{ fontSize: fontSize.sm, color: colors.emerald700, marginTop: spacing.xs }}>By user #{task.completedBy} at {task.completedAt}</Text>
          </View>
        ) : null}
        {task.status !== "Completed" ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
            <QuickButton label="Submit photo proof" onPress={() => submitTaskProof(task.id)} />
            <QuickButton label="Mark complete" onPress={() => markTaskDone(task.id)} />
            {task.status !== "Revoked" ? <QuickButton label="Revoke with comment" onPress={() => revokeTask(task.id)} /> : null}
          </View>
        ) : null}
      </>
    );
  }

  function renderComplaintContent() {
    if (!complaint) return null;
    const complaintBranch = getBranch(complaint.branchId);
    const reporter = getUser(complaint.reportedBy);
    return (
      <>
        <View style={{ gap: spacing.md }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" }}>
            <Badge label={complaint.status} type={complaint.status as any} />
            <Badge label={complaint.priority} type={complaint.priority as any} />
            <Badge label={complaint.type} />
          </View>
          <Text style={{ fontSize: fontSize["2xl"], fontWeight: "400", color: colors.slate900 }}>{complaint.title}</Text>
        </View>
        <View style={{ gap: spacing.md }}>
          <DetailRow icon={Building} label="Branch" value={complaintBranch?.name || "—"} />
          <DetailRow icon={User} label="Reported by" value={reporter?.name || "—"} />
          <DetailRow icon={Wrench} label="Vendor" value={complaint.assignedVendor} />
          <DetailRow icon={DollarSign} label="Est. Cost" value={formatMoney(complaint.estimatedCost)} />
          <DetailRow icon={Shield} label="Escalation" value={complaint.escalationStage} />
          <DetailRow icon={Calendar} label="Raised" value={complaint.createdAt} />
        </View>
        {complaint.description ? (
          <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900 }}>Description</Text>
            <Text style={{ fontSize: fontSize.sm, color: colors.slate500, marginTop: spacing.xs }}>{complaint.description}</Text>
          </View>
        ) : null}
        {complaint.timeline.length > 0 ? (
          <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900, marginBottom: spacing.sm }}>Timeline</Text>
            {complaint.timeline.map((entry: string, i: number) => (
              <View key={i} style={{ flexDirection: "row", gap: spacing.sm, marginBottom: spacing.xs }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.brand, marginTop: 5 }} />
                <Text style={{ fontSize: fontSize.sm, color: colors.slate500, flex: 1 }}>{entry}</Text>
              </View>
            ))}
          </View>
        ) : null}
        {complaint.status === "Pending" ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
            <QuickButton label="Resolve" onPress={() => resolveComplaint(complaint.id)} />
            <QuickButton label="Escalate" onPress={() => escalateComplaint(complaint.id)} />
            <QuickButton label="Assign vendor" onPress={() => assignVendor(complaint.id)} />
          </View>
        ) : complaint.status === "Escalated" ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
            <QuickButton label="Resolve" onPress={() => resolveComplaint(complaint.id)} />
            <QuickButton label="Assign vendor" onPress={() => assignVendor(complaint.id)} />
          </View>
        ) : null}
      </>
    );
  }

  function renderBranchContent() {
    if (!branch) return null;
    const manager = getUser(branch.managerId);
    const aa = getUser(branch.assistantManagerId);
    const budgetPct = Math.round((branch.usedBudget / branch.monthlyBudget) * 100);
    return (
      <>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xl }}>
          <View style={{ flex: 1, minWidth: 240, gap: spacing.xl }}>
            <View style={{ backgroundColor: colors.slate900, borderRadius: borderRadius["4xl"], padding: spacing["2xl"] }}>
              <Text style={{ fontSize: fontSize.xs, fontWeight: "400", color: colors.slate300, textTransform: "uppercase", letterSpacing: 2 }}>{branch.code}</Text>
              <Text style={{ fontSize: fontSize["3xl"], fontWeight: "400", color: colors.white, marginTop: spacing.sm }}>{branch.name}</Text>
              <Text style={{ fontSize: fontSize.sm, color: colors.slate300, marginTop: spacing.xs }}>{branch.address}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xl }}>
                {[
                  { label: "Health", value: branch.health + "%", color: colors.success },
                  { label: "Attendance", value: branch.todayAttendance + "%", color: colors.brandLight },
                  { label: "SLA", value: branch.sla + "%", color: colors.sky200 },
                  { label: "Alerts", value: String(branch.criticalAlerts), color: colors.error },
                ].map((s) => (
                  <View key={s.label} style={{ flex: 1, minWidth: 60, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: borderRadius["2xl"], padding: spacing.md, alignItems: "center" }}>
                    <Text style={{ fontSize: fontSize.xs, color: colors.slate300 }}>{s.label}</Text>
                    <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: s.color, marginTop: spacing.xs }}>{s.value}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius["4xl"], padding: spacing["2xl"] }}>
              <View style={{ gap: spacing.md }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Branch Manager</Text>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900 }}>{manager?.name || "—"}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>LC</Text>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900 }}>{aa?.name || "—"}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Geo radius</Text>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900 }}>{branch.geoRadius}m</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Shift window</Text>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900 }}>{branch.shiftWindow}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Next visit</Text>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900 }}>{branch.nextVisit}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ flex: 2, minWidth: 280, gap: spacing.xl }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              {[
                { label: "Staff", value: String(branch.staffCount), meta: "Total staff", accent: colors.sky600 },
                { label: "Issues", value: String(branch.openIssues), meta: "Open and escalated", accent: colors.warning },
                { label: "Tasks", value: String(branch.staffCount * 3), meta: "Still pending", accent: colors.error },
                { label: "Budget left", value: formatMoney(branch.monthlyBudget - branch.usedBudget), meta: "After current spend", accent: colors.success },
              ].map((s) => (
                <View key={s.label} style={{ flex: 1, minWidth: 100, backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</Text>
                  <Text style={{ fontSize: fontSize["2xl"], fontWeight: "400", color: colors.slate900, marginTop: spacing.xs }}>{s.value}</Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>{s.meta}</Text>
                </View>
              ))}
            </View>

            <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius["4xl"], padding: spacing["2xl"] }}>
              <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.slate900 }}>Operational drill-down</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.xl }}>
                <View style={{ flex: 1, minWidth: 140, backgroundColor: colors.white, borderRadius: borderRadius["2xl"], padding: spacing.xl }}>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900 }}>People mix</Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>{branch.staffCount} staff, 1 LC.</Text>
                </View>
                <View style={{ flex: 1, minWidth: 140, backgroundColor: colors.white, borderRadius: borderRadius["2xl"], padding: spacing.xl }}>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900 }}>Appliance status</Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>{branch.applianceRisk} asset(s) need action.</Text>
                </View>
                <View style={{ flex: 1, minWidth: 140, backgroundColor: colors.white, borderRadius: borderRadius["2xl"], padding: spacing.xl }}>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900 }}>Audit readiness</Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>Last audit {branch.auditScore}% with safety logs mostly complete.</Text>
                </View>
                <View style={{ flex: 1, minWidth: 140, backgroundColor: colors.white, borderRadius: borderRadius["2xl"], padding: spacing.xl }}>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900 }}>Finance posture</Text>
                  <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>Used {budgetPct}% of monthly budget.</Text>
                </View>
              </View>
              <View style={{ marginTop: spacing.lg }}>
                <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900, marginBottom: spacing.xs }}>Budget: {formatMoney(branch.usedBudget)} / {formatMoney(branch.monthlyBudget)}</Text>
                <ProgressBar value={budgetPct} color={budgetPct > 80 ? colors.error : budgetPct > 60 ? colors.warning : colors.success} />
              </View>
            </View>
          </View>
        </View>
      </>
    );
  }

  function renderUserContent() {
    if (!user) return null;
    const userBranch = getBranch(user.branchId);
    return (
      <>
        <View style={{ alignItems: "center", gap: spacing.md, paddingVertical: spacing.md }}>
          <View style={{ width: 64, height: 64, borderRadius: 24, backgroundColor: colors.brandLight, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: fontSize["3xl"], fontWeight: "400", color: colors.brand }}>
              {user.name.split(" ").map((n: string) => n[0]).join("")}
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: fontSize["2xl"], fontWeight: "400", color: colors.slate900 }}>{user.name}</Text>
            <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>{user.position}</Text>
            <Badge label={user.role as any} type={user.role as any} />
          </View>
        </View>
        <View style={{ gap: spacing.md }}>
          <DetailRow icon={Building} label="Branch" value={userBranch?.name || "—"} />
          <DetailRow icon={Phone} label="Phone" value={user.phone} />
          <DetailRow icon={Mail} label="Email" value={user.email} />
          <DetailRow icon={Clock} label="Shift" value={user.shift} />
          <DetailRow icon={Calendar} label="Joined" value={user.joinDate} />
          <DetailRow icon={Award} label="Rating" value={user.rating.toFixed(1)} />
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
          <MiniStat label="Attendance" value={user.attendancePct + "%"} color={colors.success} />
          <MiniStat label="Tasks" value={String(user.tasksClosed)} color={colors.brand} />
          <MiniStat label="Proof rate" value={user.proofRate + "%"} color={colors.sky600} />
        </View>
        <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius["4xl"], padding: spacing.xl }}>
          <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900, marginBottom: spacing.sm }}>Skills</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }}>
            {user.skills.map((s: string) => (
              <View key={s} style={{ backgroundColor: colors.white, borderRadius: borderRadius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{s}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius["4xl"], padding: spacing.xl }}>
          <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900, marginBottom: spacing.sm }}>Documents</Text>
          {user.documents.map((d: string) => (
            <View key={d} style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
              <CheckCircle size={12} color={colors.success} />
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{d}</Text>
            </View>
          ))}
        </View>
      </>
    );
  }

  function renderApplianceContent() {
    if (!appliance) return null;
    const applianceBranch = getBranch(appliance.branchId);
    return (
      <>
        <View style={{ gap: spacing.md }}>
          <Badge label={appliance.status} type={appliance.status as any} />
          <Text style={{ fontSize: fontSize["2xl"], fontWeight: "400", color: colors.slate900 }}>{appliance.name}</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>{appliance.category} | {appliance.zone}</Text>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
          <MiniStat label="Health" value={appliance.healthScore + "%"} color={appliance.healthScore > 70 ? colors.success : colors.warning} />
        </View>
        <View style={{ gap: spacing.md }}>
          <DetailRow icon={Building} label="Branch" value={applianceBranch?.name || "—"} />
          <DetailRow icon={Wrench} label="Brand" value={appliance.brand} />
          <DetailRow icon={FileText} label="Model" value={appliance.model} />
          <DetailRow icon={Calendar} label="Purchased" value={appliance.purchaseDate} />
          <DetailRow icon={Clock} label="Last service" value={appliance.lastService} />
          <DetailRow icon={Activity} label="Next service" value={appliance.nextService} />
          <DetailRow icon={Shield} label="Warranty" value={appliance.warranty} />
          <DetailRow icon={User} label="AMC vendor" value={appliance.amcVendor} />
          <DetailRow icon={DollarSign} label="Cost" value={formatMoney(appliance.purchaseCost)} />
        </View>
        {appliance.pendingParts !== "None" ? (
          <View style={{ backgroundColor: colors.amber50, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.amber700 }}>Pending parts</Text>
            <Text style={{ fontSize: fontSize.sm, color: colors.amber700, marginTop: spacing.xs }}>{appliance.pendingParts}</Text>
          </View>
        ) : null}
      </>
    );
  }

  function renderApprovalContent() {
    if (!approval) return null;
    const approvalBranch = getBranch(approval.branchId);
    const requester = getUser(approval.requestedBy);
    return (
      <>
        <View style={{ gap: spacing.md }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" }}>
            <Badge label={approval.status} type={approval.status as any} />
            <Badge label={approval.priority} type={approval.priority as any} />
            <Badge label={approval.kind} />
          </View>
          <Text style={{ fontSize: fontSize["2xl"], fontWeight: "400", color: colors.slate900 }}>{approval.title}</Text>
        </View>
        <View style={{ gap: spacing.md }}>
          <DetailRow icon={Building} label="Branch" value={approvalBranch?.name || "—"} />
          <DetailRow icon={User} label="Requester" value={requester?.name || "—"} />
          <DetailRow icon={DollarSign} label="Amount" value={formatMoney(approval.amount)} />
          <DetailRow icon={Shield} label="Stage" value={approval.stage} />
          <DetailRow icon={Clock} label="Age" value={approval.age} />
        </View>
        {approval.note ? (
          <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900 }}>Note</Text>
            <Text style={{ fontSize: fontSize.sm, color: colors.slate500, marginTop: spacing.xs }}>{approval.note}</Text>
          </View>
        ) : null}
        {approval.status === "Pending" ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
            <QuickButton label="Approve" onPress={() => approveRequest(approval.id)} />
            <QuickButton label="Reject" onPress={() => rejectRequest(approval.id)} />
          </View>
        ) : null}
      </>
    );
  }

  function renderVisitContent() {
    if (!visit) return null;
    const visitBranch = getBranch(visit.branchId);
    const manager = getUser(visit.managerId);
    return (
      <>
        <View style={{ gap: spacing.md }}>
          <Badge label={visit.status} type={visit.status as any} />
          <Text style={{ fontSize: fontSize["2xl"], fontWeight: "400", color: colors.slate900 }}>{visit.purpose}</Text>
        </View>
        <View style={{ gap: spacing.md }}>
          <DetailRow icon={Building} label="Branch" value={visitBranch?.name || "—"} />
          <DetailRow icon={User} label="Manager" value={manager?.name || "—"} />
          <DetailRow icon={Calendar} label="Scheduled" value={visit.scheduledAt} />
          <DetailRow icon={FileText} label="Agenda" value={visit.agenda} />
        </View>
        {visit.report !== "Pending" ? (
          <View style={{ backgroundColor: colors.emerald50, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.emerald700 }}>Report</Text>
            <Text style={{ fontSize: fontSize.sm, color: colors.emerald700, marginTop: spacing.xs }}>{visit.report}</Text>
          </View>
        ) : null}
      </>
    );
  }

  return (
    <ModalSheet visible={visible} onClose={onClose} title="Details">
      <ScrollView style={{ maxHeight: 600 }} contentContainerStyle={{ gap: spacing.xl, paddingBottom: spacing.xl }}>
        {type === "task" && renderTaskContent()}
        {type === "complaint" && renderComplaintContent()}
        {type === "branch" && renderBranchContent()}
        {type === "user" && renderUserContent()}
        {type === "appliance" && renderApplianceContent()}
        {type === "approval" && renderApprovalContent()}
        {type === "visit" && renderVisitContent()}
        {!task && !complaint && !branch && !user && !appliance && !approval && !visit ? (
          <View style={{ alignItems: "center", padding: spacing["3xl"] }}>
            <AlertTriangle size={24} color={colors.slate400} />
            <Text style={{ fontSize: fontSize.sm, color: colors.slate500, marginTop: spacing.md }}>Entity not found</Text>
          </View>
        ) : null}
      </ScrollView>
    </ModalSheet>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ComponentType<any>; label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
      <View style={{ width: 28, height: 28, borderRadius: borderRadius.md, backgroundColor: colors.slate50, alignItems: "center", justifyContent: "center" }}>
        <Icon size={12} color={colors.slate500} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: fontSize.sm, color: colors.slate500 }}>{label}</Text>
        <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.slate900 }}>{value}</Text>
      </View>
    </View>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={{ flex: 1, minWidth: 70, backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], padding: spacing.lg, alignItems: "center" }}>
      <Text style={{ fontSize: fontSize.xs, color: colors.slate500 }}>{label}</Text>
      <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color, marginTop: spacing.xs }}>{value}</Text>
    </View>
  );
}
