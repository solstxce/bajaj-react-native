import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Animated } from "react-native";
import { X, Send, Plus, Wrench, Briefcase, DollarSign, Calendar, UserPlus, Zap, ChevronRight } from "lucide-react-native";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius, shadows } from "../../theme/theme";
import { RoleId } from "../../types/domain";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function FormModal({ visible, onClose }: Props) {
  const { createComplaint, createTask, createStaff, createAppliance, createExpense, createVisit, createUser, branches, currentUser, showToast } = useApp();
  const [formType, setFormType] = useState<string | null>(null);
  const translateY = useRef(new Animated.Value(18)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setFormType(null);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
      ]).start();
    } else {
      translateY.setValue(18);
      opacity.setValue(0);
    }
  }, [visible]);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Appliance");
  const [priority, setPriority] = useState("High");
  const [desc, setDesc] = useState("");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskAudience, setTaskAudience] = useState("worker");
  const [taskSchedule, setTaskSchedule] = useState("Daily");
  const [taskZone, setTaskZone] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskPriority, setTaskPriority] = useState("High");
  const [taskProofRule, setTaskProofRule] = useState("true");
  const [taskNotes, setTaskNotes] = useState("");

  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState<"worker">("worker");
  const [staffPosition, setStaffPosition] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [staffShift, setStaffShift] = useState("");

  const [applianceName, setApplianceName] = useState("");
  const [applianceCategory, setApplianceCategory] = useState("");
  const [applianceZone, setApplianceZone] = useState("");
  const [applianceBrand, setApplianceBrand] = useState("");
  const [applianceModel, setApplianceModel] = useState("");
  const [applianceNotes, setApplianceNotes] = useState("");

  const [leaveType, setLeaveType] = useState("Casual");
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [leaveReason, setLeaveReason] = useState("");

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseVendor, setExpenseVendor] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");

  const [visitBranch, setVisitBranch] = useState(branches[0]?.id || 1);
  const [visitDate, setVisitDate] = useState("");
  const [visitPurpose, setVisitPurpose] = useState("");
  const [visitAgenda, setVisitAgenda] = useState("");

  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState<RoleId>("worker");
  const [userBranch, setUserBranch] = useState(branches[0]?.id || 1);

  const resetForms = () => {
    setTitle(""); setType("Appliance"); setPriority("High"); setDesc("");
    setTaskTitle(""); setTaskAudience("worker"); setTaskSchedule("Daily"); setTaskZone(""); setTaskDeadline(""); setTaskPriority("High"); setTaskProofRule("true"); setTaskNotes("");
    setStaffName(""); setStaffRole("worker"); setStaffPosition(""); setStaffPhone(""); setStaffShift("");
    setApplianceName(""); setApplianceCategory(""); setApplianceZone(""); setApplianceBrand(""); setApplianceModel(""); setApplianceNotes("");
    setLeaveType("Casual"); setLeaveFrom(""); setLeaveTo(""); setLeaveReason("");
    setExpenseTitle(""); setExpenseAmount(""); setExpenseVendor(""); setExpenseDesc("");
    setVisitBranch(branches[0]?.id || 1); setVisitDate(""); setVisitPurpose(""); setVisitAgenda("");
    setUserName(""); setUserRole("worker"); setUserBranch(branches[0]?.id || 1);
  };

  const openForm = (type: string) => {
    resetForms();
    setFormType(type);
  };

  const handleClose = () => {
    setFormType(null);
    onClose();
  };

  const selectOptions = (label: string, options: string[], value: string, onValue: (v: string) => void) => (
    <View>
      <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.textSecondary, marginBottom: spacing.xs }}>{label}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => onValue(opt)}
            style={{
              paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
              borderRadius: borderRadius.full, backgroundColor: value === opt ? colors.brand : colors.slate50,
            }}
          >
            <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: value === opt ? colors.white : colors.textSecondary }}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const input = (placeholder: string, val: string, set: (v: string) => void, extra?: any) => (
    <TextInput
      value={val}
      onChangeText={set}
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      style={{ borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, fontSize: fontSize.sm, color: colors.text, ...extra }}
    />
  );

  const textarea = (placeholder: string, val: string, set: (v: string) => void) => (
    <TextInput
      value={val}
      onChangeText={set}
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      multiline
      numberOfLines={4}
      style={{ borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, fontSize: fontSize.sm, minHeight: 90, color: colors.text, textAlignVertical: "top" }}
    />
  );

  const submitBtn = (label: string, onPress: () => void) => (
    <TouchableOpacity onPress={() => { onPress(); handleClose(); }} style={{ backgroundColor: colors.brand, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: spacing.sm }}>
      <Send size={14} color={colors.white} strokeWidth={2} />
      <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>{label}</Text>
    </TouchableOpacity>
  );

  const forms: Record<string, { title: string; subtitle: string; render: () => React.ReactNode }> = {
    quick: {
      title: "Quick actions",
      subtitle: "Jump into the most common operational workflows",
      render: () => (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md }}>
          {[
            { label: "Create task", icon: Plus, color: colors.text, bg: colors.text, action: () => openForm("task") },
            { label: "Raise complaint", icon: Zap, color: colors.brand, bg: colors.card, border: true, action: () => openForm("complaint") },
            { label: "Add staff", icon: UserPlus, color: colors.brandSecondary, bg: colors.card, border: true, action: () => openForm("staff") },
            { label: "Add appliance", icon: Wrench, color: colors.success, bg: colors.card, border: true, action: () => openForm("appliance") },
          ].map((item, i) => (
            <TouchableOpacity key={i} onPress={item.action} style={{ width: "47%", backgroundColor: item.bg, borderRadius: borderRadius.xl, padding: spacing.xl, borderWidth: item.border ? 1 : 0, borderColor: colors.border }}>
              <item.icon size={20} color={item.color} strokeWidth={2} />
              <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: item.border ? colors.text : colors.white, marginTop: spacing.md }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ),
    },
    complaint: {
      title: "Raise complaint",
      subtitle: "Capture issue details, priority, and operational impact.",
      render: () => (
        <View style={{ gap: spacing.lg }}>
          {input("Issue title", title, setTitle)}
          {selectOptions("Type", ["Appliance", "Electrical", "Plumbing", "Safety", "Security"], type, setType)}
          {selectOptions("Priority", ["Low", "Medium", "High", "Critical"], priority, setPriority)}
          {textarea("Describe issue, exact area, visible damage, workaround and impact", desc, setDesc)}
          {submitBtn("Submit complaint", () => createComplaint({ title, type, priority: priority as any, description: desc }))}
        </View>
      ),
    },
    task: {
      title: "Task form",
      subtitle: "Add richer task details including proof rule, zone and escalation notes.",
      render: () => (
        <View style={{ gap: spacing.lg }}>
          {input("Task title", taskTitle, setTaskTitle)}
          {selectOptions("Audience", ["worker"], taskAudience, setTaskAudience as (v: string) => void)}
          {selectOptions("Schedule", ["Daily", "Weekly", "Monthly"], taskSchedule, setTaskSchedule)}
          <View style={{ flexDirection: "row", gap: spacing.lg }}>
            <View style={{ flex: 1 }}>{input("Zone / area", taskZone, setTaskZone)}</View>
            <View style={{ flex: 1 }}>{input("Deadline", taskDeadline, setTaskDeadline, {})}</View>
          </View>
          {selectOptions("Priority", ["Low", "Medium", "High", "Critical"], taskPriority, setTaskPriority)}
          {selectOptions("Proof rule", ["Photo proof mandatory", "Completion note only"], taskProofRule, setTaskProofRule)}
          {textarea("Checklist note, escalation rule, instructions, materials required", taskNotes, setTaskNotes)}
          {submitBtn("Create task", () => createTask({ title: taskTitle, audience: taskAudience as any, schedule: taskSchedule as any, zone: taskZone, deadline: taskDeadline, priority: taskPriority as any, proofRequired: taskProofRule === "true", notes: taskNotes }))}
        </View>
      ),
    },
    staff: {
      title: "Add staff",
      subtitle: "Add worker with branch micro details.",
      render: () => (
        <View style={{ gap: spacing.lg }}>
          {input("Full name", staffName, setStaffName)}
          {selectOptions("Role", ["worker"], staffRole, setStaffRole as (v: string) => void)}
          {input("Position", staffPosition, setStaffPosition)}
          <View style={{ flexDirection: "row", gap: spacing.lg }}>
            <View style={{ flex: 1 }}>{input("Phone", staffPhone, setStaffPhone)}</View>
            <View style={{ flex: 1 }}>{input("Shift", staffShift, setStaffShift)}</View>
          </View>
          {submitBtn("Add staff member", () => createStaff(staffName, staffRole, staffPosition, staffPhone, staffShift))}
        </View>
      ),
    },
    appliance: {
      title: "Add appliance",
      subtitle: "Capture category, zone, vendor and approval requirement.",
      render: () => (
        <View style={{ gap: spacing.lg }}>
          {input("Appliance name", applianceName, setApplianceName)}
          <View style={{ flexDirection: "row", gap: spacing.lg }}>
            <View style={{ flex: 1 }}>{input("Category", applianceCategory, setApplianceCategory)}</View>
            <View style={{ flex: 1 }}>{input("Zone", applianceZone, setApplianceZone)}</View>
          </View>
          <View style={{ flexDirection: "row", gap: spacing.lg }}>
            <View style={{ flex: 1 }}>{input("Brand", applianceBrand, setApplianceBrand)}</View>
            <View style={{ flex: 1 }}>{input("Model", applianceModel, setApplianceModel)}</View>
          </View>
          {textarea("Purchase reason, warranty, AMC vendor and approval need", applianceNotes, setApplianceNotes)}
          {submitBtn("Add appliance", () => createAppliance({ name: applianceName, category: applianceCategory, zone: applianceZone, brand: applianceBrand, model: applianceModel }))}
        </View>
      ),
    },
    leave: {
      title: "Apply leave",
      subtitle: "Add leave period, reason and handover note.",
      render: () => (
        <View style={{ gap: spacing.lg }}>
          {selectOptions("Leave type", ["Casual", "Sick", "Annual"], leaveType, setLeaveType)}
          <View style={{ flexDirection: "row", gap: spacing.lg }}>
            <View style={{ flex: 1 }}>{input("From date", leaveFrom, setLeaveFrom)}</View>
            <View style={{ flex: 1 }}>{input("To date", leaveTo, setLeaveTo)}</View>
          </View>
          {textarea("Reason and handover note", leaveReason, setLeaveReason)}
          {submitBtn("Apply leave", () => showToast("Leave application submitted"))}
        </View>
      ),
    },
    expense: {
      title: "Create work order",
      subtitle: "Create work order with vendor and urgency details.",
      render: () => (
        <View style={{ gap: spacing.lg }}>
          {input("Work order title", expenseTitle, setExpenseTitle)}
          <View style={{ flexDirection: "row", gap: spacing.lg }}>
            <View style={{ flex: 1 }}>{input("Amount", expenseAmount, setExpenseAmount)}</View>
            <View style={{ flex: 1 }}>{input("Vendor", expenseVendor, setExpenseVendor)}</View>
          </View>
          {textarea("Scope, urgency, risk if delayed", expenseDesc, setExpenseDesc)}
          {submitBtn("Create work order", () => createExpense(expenseTitle, Number(expenseAmount) || 0, expenseVendor, expenseDesc))}
        </View>
      ),
    },
    visit: {
      title: "Schedule visit",
      subtitle: "Create visit with branch, agenda and expected outcome.",
      render: () => (
        <View style={{ gap: spacing.lg }}>
          <View>
            <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.textSecondary, marginBottom: spacing.xs }}>Branch</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              {branches.map((b) => (
                <TouchableOpacity
                  key={b.id}
                  onPress={() => setVisitBranch(b.id)}
                  style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: visitBranch === b.id ? colors.brand : colors.slate50 }}
                >
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: visitBranch === b.id ? colors.white : colors.textSecondary }}>{b.name.split(" ")[0]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {input("Date & time", visitDate, setVisitDate)}
          {input("Purpose", visitPurpose, setVisitPurpose)}
          {textarea("Agenda and outcome expected", visitAgenda, setVisitAgenda)}
          {submitBtn("Schedule visit", () => createVisit(visitBranch, visitDate, visitPurpose, visitAgenda))}
        </View>
      ),
    },
    user: {
      title: "Create user",
      subtitle: "Add a new user to the regional directory.",
      render: () => (
        <View style={{ gap: spacing.lg }}>
          {input("Full name", userName, setUserName)}
          <View style={{ flexDirection: "row", gap: spacing.lg }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.textSecondary, marginBottom: spacing.xs }}>Role</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
                {(["worker", "am", "branchManager"] as RoleId[]).map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setUserRole(r)}
                    style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: userRole === r ? colors.brand : colors.slate50 }}
                  >
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: userRole === r ? colors.white : colors.textSecondary }}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          {submitBtn("Create user", () => createUser(userName, userRole, userBranch))}
        </View>
      ),
    },
  };

  const selectedForm = formType ? forms[formType] : null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableOpacity activeOpacity={1} onPress={handleClose} style={{ flex: 1, backgroundColor: "rgba(15,23,42,0.5)", justifyContent: "center", alignItems: "center", padding: spacing.xl }}>
        <Animated.View style={{ backgroundColor: colors.card, borderRadius: borderRadius["6xl"], width: "100%", maxWidth: 420, maxHeight: "85%", opacity, transform: [{ translateY }], ...shadows.modal }}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.xl, paddingTop: spacing.xl }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>
                  {selectedForm ? selectedForm.title : "Quick actions"}
                </Text>
                <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>
                  {selectedForm ? selectedForm.subtitle : "Jump into the most common operational workflows"}
                </Text>
              </View>
              <TouchableOpacity onPress={handleClose} style={{ padding: spacing.sm, borderRadius: borderRadius.md, backgroundColor: colors.slate50 }}>
                <X size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 500 }} contentContainerStyle={{ padding: spacing.xl, gap: spacing.xl }}>
              {selectedForm ? selectedForm.render() : forms.quick.render()}
            </ScrollView>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
