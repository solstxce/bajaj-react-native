import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, Animated } from "react-native";
import { X, MapPin, Calendar, User, Building, Clock, CheckCircle, XCircle, AlertTriangle, DollarSign, Wrench, HardHat, Phone, Mail, Award, Activity, Shield, TrendingUp, FileText } from "lucide-react-native";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius, shadows } from "../../theme/theme";
import { Badge } from "../../shared/components/Badge";
import { ProgressBar } from "../../shared/components/ProgressBar";
import { formatMoney, countdown } from "../../utils/helpers";
import { Task, Complaint, Branch, User as UserType, Appliance, Approval, Visit } from "../../types/domain";

interface Props {
  visible: boolean;
  onClose: () => void;
  entityType: string;
  entityId: number;
}

export function DetailModal({ visible, onClose, entityType, entityId }: Props) {
  const { getTask, getComplaint, getBranch, getUser, getAppliance, tasks, approvals, visits, state } = useApp();
  const translateY = useRef(new Animated.Value(18)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const type = entityType || state.modalType;
  const id = entityId || state.modalData?.id;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
      ]).start();
    } else {
      translateY.setValue(18);
      opacity.setValue(0);
    }
  }, [visible]);

  const task = type === "task" ? getTask(id) || tasks.find(t => t.id === id) : undefined;
  const complaint = type === "complaint" ? getComplaint(id) : undefined;
  const branch = type === "branch" ? getBranch(id) : undefined;
  const user = type === "user" ? getUser(id) : undefined;
  const appliance = type === "appliance" ? getAppliance(id) : undefined;
  const approval = type === "approval" ? approvals.find(a => a.id === id) : undefined;
  const visit = type === "visit" ? visits.find(v => v.id === id) : undefined;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} onPress={onClose} style={{ flex: 1, backgroundColor: "rgba(15,23,42,0.5)", justifyContent: "center", alignItems: "center", padding: spacing.xl }}>
        <Animated.View style={{ backgroundColor: colors.card, borderRadius: borderRadius["6xl"], width: "100%", maxWidth: 420, maxHeight: "85%", opacity, transform: [{ translateY }], ...shadows.modal }}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.xl, paddingTop: spacing.xl }}>
              <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Details</Text>
              <TouchableOpacity onPress={onClose} style={{ padding: spacing.sm, borderRadius: borderRadius.md, backgroundColor: colors.slate50 }}>
                <X size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 500 }} contentContainerStyle={{ padding: spacing.xl, gap: spacing.xl }}>
              {task ? renderTask(task, getBranch, getUser) : null}
              {complaint ? renderComplaint(complaint, getBranch, getUser) : null}
              {branch ? renderBranch(branch, getUser) : null}
              {user ? renderUser(user, getBranch) : null}
              {appliance ? renderAppliance(appliance, getBranch) : null}
              {approval ? renderApproval(approval, getBranch, getUser) : null}
              {visit ? renderVisit(visit, getBranch, getUser) : null}
              {!task && !complaint && !branch && !user && !appliance && !approval && !visit ? (
                <View style={{ alignItems: "center", padding: spacing["3xl"] }}>
                  <AlertTriangle size={24} color={colors.textSecondary} />
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.md }}>Entity not found</Text>
                </View>
              ) : null}
            </ScrollView>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

function renderTask(task: Task, getBranch: (id: number) => Branch | undefined, getUser: (id: number) => UserType | undefined) {
  const branch = getBranch(task.branchId);
  const assignee = task.assignedTo ? getUser(task.assignedTo) : undefined;
  const pct = (task.checklistDone / task.checklistTotal) * 100;
  return (
    <>
      <View style={{ gap: spacing.md }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" }}>
          <Badge label={task.status} type={task.status} />
          <Badge label={task.priority} type={task.priority} />
          <Badge label={task.schedule} />
        </View>
        <Text style={{ fontSize: fontSize["2xl"], fontWeight: "800", color: colors.text }}>{task.title}</Text>
      </View>
      <View style={{ gap: spacing.md }}>
        <DetailRow icon={Building} label="Branch" value={branch?.name || "—"} />
        <DetailRow icon={MapPin} label="Zone" value={task.zone} />
        <DetailRow icon={User} label="Assigned to" value={assignee?.name || "Shared"} />
        <DetailRow icon={Clock} label="Deadline" value={countdown(task.deadline, "2026-04-26T11:20:00")} />
        <DetailRow icon={FileText} label="Proof rule" value={task.proofLabel} />
        <DetailRow icon={Activity} label="Escalation" value={task.escalation} />
      </View>
      <View>
        <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text, marginBottom: spacing.sm }}>Checklist: {task.checklistDone}/{task.checklistTotal}</Text>
        <ProgressBar value={pct} color={task.status === "Completed" ? colors.success : colors.brand} />
      </View>
      {task.notes ? (
        <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
          <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Notes</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{task.notes}</Text>
        </View>
      ) : null}
      {task.redoReason ? (
        <View style={{ backgroundColor: colors.red50, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
          <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.red700 }}>Redo reason</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.red700, marginTop: spacing.xs }}>{task.redoReason}</Text>
        </View>
      ) : null}
      {task.completedBy && task.completedAt ? (
        <View style={{ backgroundColor: colors.emerald50, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
          <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.emerald700 }}>Completed</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.emerald700, marginTop: spacing.xs }}>By user #{task.completedBy} at {task.completedAt}</Text>
        </View>
      ) : null}
    </>
  );
}

function renderComplaint(complaint: Complaint, getBranch: (id: number) => Branch | undefined, getUser: (id: number) => UserType | undefined) {
  const branch = getBranch(complaint.branchId);
  const reporter = getUser(complaint.reportedBy);
  return (
    <>
      <View style={{ gap: spacing.md }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" }}>
          <Badge label={complaint.status} type={complaint.status} />
          <Badge label={complaint.priority} type={complaint.priority} />
          <Badge label={complaint.type} />
        </View>
        <Text style={{ fontSize: fontSize["2xl"], fontWeight: "800", color: colors.text }}>{complaint.title}</Text>
      </View>
      <View style={{ gap: spacing.md }}>
        <DetailRow icon={Building} label="Branch" value={branch?.name || "—"} />
        <DetailRow icon={User} label="Reported by" value={reporter?.name || "—"} />
        <DetailRow icon={Wrench} label="Vendor" value={complaint.assignedVendor} />
        <DetailRow icon={DollarSign} label="Est. Cost" value={formatMoney(complaint.estimatedCost)} />
        <DetailRow icon={Shield} label="Escalation" value={complaint.escalationStage} />
        <DetailRow icon={Calendar} label="Raised" value={complaint.createdAt} />
      </View>
      {complaint.description ? (
        <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
          <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Description</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{complaint.description}</Text>
        </View>
      ) : null}
      {complaint.timeline.length > 0 ? (
        <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
          <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text, marginBottom: spacing.sm }}>Timeline</Text>
          {complaint.timeline.map((entry, i) => (
            <View key={i} style={{ flexDirection: "row", gap: spacing.sm, marginBottom: spacing.xs }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.brand, marginTop: 5 }} />
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, flex: 1 }}>{entry}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </>
  );
}

function renderBranch(branch: Branch, getUser: (id: number) => UserType | undefined) {
  const manager = getUser(branch.managerId);
  const aa = getUser(branch.assistantManagerId);
  return (
    <>
      <View style={{ gap: spacing.md }}>
        <View style={{ backgroundColor: colors.brandLight, borderRadius: borderRadius["2xl"], paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, alignSelf: "flex-start" }}>
          <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.brand }}>{branch.code}</Text>
        </View>
        <Text style={{ fontSize: fontSize["2xl"], fontWeight: "800", color: colors.text }}>{branch.name}</Text>
        <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{branch.address}</Text>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
        <MiniStat label="Health" value={branch.health + "%"} color={colors.success} />
        <MiniStat label="SLA" value={branch.sla + "%"} color={colors.brand} />
        <MiniStat label="Audit" value={branch.auditScore + "%"} color={colors.info} />
        <MiniStat label="Footfall" value={String(branch.customerFootfall)} color={colors.text} />
      </View>
      <View style={{ gap: spacing.md }}>
        <DetailRow icon={User} label="Manager" value={manager?.name || "—"} />
        <DetailRow icon={User} label="AA/LC" value={aa?.name || "—"} />
        <DetailRow icon={Phone} label="Phone" value={branch.phone} />
        <DetailRow icon={Mail} label="Email" value={branch.email} />
        <DetailRow icon={Activity} label="Shift" value={branch.shiftWindow} />
        <DetailRow icon={MapPin} label="Geo radius" value={branch.geoRadius + "m"} />
      </View>
      <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius["4xl"], padding: spacing.xl }}>
        <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text, marginBottom: spacing.sm }}>Staff & Resources</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xl }}>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Staff: {branch.staffCount}</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Workers: {branch.workerCount}</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Employees: {branch.employeeCount}</Text>
        </View>
        <View style={{ marginTop: spacing.md }}>
          <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text, marginBottom: spacing.xs }}>Budget: {formatMoney(branch.usedBudget)} / {formatMoney(branch.monthlyBudget)}</Text>
          <ProgressBar value={(branch.usedBudget / branch.monthlyBudget) * 100} color={branch.usedBudget > branch.monthlyBudget * 0.8 ? colors.warning : colors.success} />
        </View>
      </View>
    </>
  );
}

function renderUser(user: UserType, getBranch: (id: number) => Branch | undefined) {
  const branch = getBranch(user.branchId);
  return (
    <>
      <View style={{ alignItems: "center", gap: spacing.md, paddingVertical: spacing.md }}>
        <View style={{ width: 64, height: 64, borderRadius: 24, backgroundColor: colors.brandLight, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: fontSize["3xl"], fontWeight: "800", color: colors.brand }}>
            {user.name.split(" ").map(n => n[0]).join("")}
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: fontSize["2xl"], fontWeight: "800", color: colors.text }}>{user.name}</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{user.position}</Text>
          <Badge label={user.role} type={user.role} />
        </View>
      </View>
      <View style={{ gap: spacing.md }}>
        <DetailRow icon={Building} label="Branch" value={branch?.name || "—"} />
        <DetailRow icon={Phone} label="Phone" value={user.phone} />
        <DetailRow icon={Mail} label="Email" value={user.email} />
        <DetailRow icon={Clock} label="Shift" value={user.shift} />
        <DetailRow icon={Calendar} label="Joined" value={user.joinDate} />
        <DetailRow icon={Award} label="Rating" value={user.rating.toFixed(1)} />
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
        <MiniStat label="Attendance" value={user.attendancePct + "%"} color={colors.success} />
        <MiniStat label="Tasks" value={String(user.tasksClosed)} color={colors.brand} />
        <MiniStat label="Proof rate" value={user.proofRate + "%"} color={colors.info} />
      </View>
      <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius["4xl"], padding: spacing.xl }}>
        <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text, marginBottom: spacing.sm }}>Skills</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }}>
          {user.skills.map(s => (
            <View key={s} style={{ backgroundColor: colors.card, borderRadius: borderRadius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{s}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius["4xl"], padding: spacing.xl }}>
        <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text, marginBottom: spacing.sm }}>Documents</Text>
        {user.documents.map(d => (
          <View key={d} style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
            <CheckCircle size={12} color={colors.success} />
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{d}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

function renderAppliance(appliance: Appliance, getBranch: (id: number) => Branch | undefined) {
  const branch = getBranch(appliance.branchId);
  return (
    <>
      <View style={{ gap: spacing.md }}>
        <Badge label={appliance.status} type={appliance.status} />
        <Text style={{ fontSize: fontSize["2xl"], fontWeight: "800", color: colors.text }}>{appliance.name}</Text>
        <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{appliance.category} | {appliance.zone}</Text>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
        <MiniStat label="Health" value={appliance.healthScore + "%"} color={appliance.healthScore > 70 ? colors.success : colors.warning} />
      </View>
      <View style={{ gap: spacing.md }}>
        <DetailRow icon={Building} label="Branch" value={branch?.name || "—"} />
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
          <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.amber700 }}>Pending parts</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.amber700, marginTop: spacing.xs }}>{appliance.pendingParts}</Text>
        </View>
      ) : null}
    </>
  );
}

function renderApproval(approval: Approval, getBranch: (id: number) => Branch | undefined, getUser: (id: number) => UserType | undefined) {
  const branch = getBranch(approval.branchId);
  const requester = getUser(approval.requestedBy);
  return (
    <>
      <View style={{ gap: spacing.md }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" }}>
          <Badge label={approval.status} type={approval.status} />
          <Badge label={approval.priority} type={approval.priority} />
          <Badge label={approval.kind} />
        </View>
        <Text style={{ fontSize: fontSize["2xl"], fontWeight: "800", color: colors.text }}>{approval.title}</Text>
      </View>
      <View style={{ gap: spacing.md }}>
        <DetailRow icon={Building} label="Branch" value={branch?.name || "—"} />
        <DetailRow icon={User} label="Requester" value={requester?.name || "—"} />
        <DetailRow icon={DollarSign} label="Amount" value={formatMoney(approval.amount)} />
        <DetailRow icon={Shield} label="Stage" value={approval.stage} />
        <DetailRow icon={Clock} label="Age" value={approval.age} />
      </View>
      {approval.note ? (
        <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
          <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Note</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{approval.note}</Text>
        </View>
      ) : null}
    </>
  );
}

function renderVisit(visit: Visit, getBranch: (id: number) => Branch | undefined, getUser: (id: number) => UserType | undefined) {
  const branch = getBranch(visit.branchId);
  const manager = getUser(visit.managerId);
  return (
    <>
      <View style={{ gap: spacing.md }}>
        <Badge label={visit.status} type={visit.status} />
        <Text style={{ fontSize: fontSize["2xl"], fontWeight: "800", color: colors.text }}>{visit.purpose}</Text>
      </View>
      <View style={{ gap: spacing.md }}>
        <DetailRow icon={Building} label="Branch" value={branch?.name || "—"} />
        <DetailRow icon={User} label="Manager" value={manager?.name || "—"} />
        <DetailRow icon={Calendar} label="Scheduled" value={visit.scheduledAt} />
        <DetailRow icon={FileText} label="Agenda" value={visit.agenda} />
      </View>
      {visit.report !== "Pending" ? (
        <View style={{ backgroundColor: colors.emerald50, borderRadius: borderRadius["2xl"], padding: spacing.lg }}>
          <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.emerald700 }}>Report</Text>
          <Text style={{ fontSize: fontSize.sm, color: colors.emerald700, marginTop: spacing.xs }}>{visit.report}</Text>
        </View>
      ) : null}
    </>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ComponentType<any>; label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
      <View style={{ width: 28, height: 28, borderRadius: borderRadius.md, backgroundColor: colors.slate50, alignItems: "center", justifyContent: "center" }}>
        <Icon size={12} color={colors.textSecondary} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{label}</Text>
        <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{value}</Text>
      </View>
    </View>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={{ flex: 1, minWidth: 70, backgroundColor: colors.slate50, borderRadius: borderRadius["2xl"], padding: spacing.lg, alignItems: "center" }}>
      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{label}</Text>
      <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color, marginTop: spacing.xs }}>{value}</Text>
    </View>
  );
}
