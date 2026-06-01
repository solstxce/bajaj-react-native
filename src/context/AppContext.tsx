import React, { createContext, useContext, useReducer, useMemo, useCallback, useState, useEffect, useRef, ReactNode } from "react";
import {
  RoleId, TabState, Branch, User, Task, Complaint, Appliance, Approval,
  Visit, NotificationItem, AttendanceLog, WeeklyTaskItem,
} from "../types/domain";
import {
  branches as branchData, users as userData, tasks as taskData, complaints as complaintData,
  appliances as applianceData, approvals as approvalData, visits as visitData,
  notifications as notificationData, attendanceLog as attendanceData,
  ROLES, initialTabState, currentUserByRole,
} from "../data/mockData";

export type AuditEntry = {
  id: number;
  time: string;
  text: string;
  icon: string;
  color: string;
  role: RoleId;
  userId: number;
  branchId: number;
};

export type AlertState = {
  notificationId: number;
  acknowledged: boolean;
  escalated: boolean;
  acknowledgedAt: string | null;
  escalatedAt: string | null;
};

export type AppSettings = {
  geoRadius: number;
  criticalAlertRule: string;
  deadlineRule: string;
  escalationTimeout: string;
  locationProofRequired: boolean;
  selfieVerification: boolean;
  workerShiftWindow: string;
  weekendSchedule: string;
  budgetApprovalLimitBM: number;
  budgetApprovalLimitRM: number;
  proofPolicy: string;
  auditFrequency: string;
  autoSyncInterval: string;
  offlineMode: boolean;
  dataRetentionDays: number;
};

interface AppState {
  role: RoleId;
  page: string;
  tabs: TabState;
  modalType: string | null;
  modalData: any;
  toast: string;
  search: string;
  now: string;
  today: string;
}

type AppAction =
  | { type: "SWITCH_ROLE"; role: RoleId }
  | { type: "SET_PAGE"; page: string }
  | { type: "SET_TAB"; key: keyof TabState; value: string }
  | { type: "OPEN_MODAL"; modalType: string; modalData?: any }
  | { type: "CLOSE_MODAL" }
  | { type: "SHOW_TOAST"; message: string }
  | { type: "HIDE_TOAST" }
  | { type: "SET_SEARCH"; query: string };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SWITCH_ROLE":
      return { ...state, role: action.role, page: ROLES[action.role].pages[0].id, modalType: null };
    case "SET_PAGE":
      return { ...state, page: action.page };
    case "SET_TAB":
      return { ...state, tabs: { ...state.tabs, [action.key]: action.value } };
    case "OPEN_MODAL":
      return { ...state, modalType: action.modalType, modalData: action.modalData ?? null };
    case "CLOSE_MODAL":
      return { ...state, modalType: null, modalData: null };
    case "SHOW_TOAST":
      return { ...state, toast: action.message };
    case "HIDE_TOAST":
      return { ...state, toast: "" };
    case "SET_SEARCH":
      return { ...state, search: action.query };
    default:
      return state;
  }
}

const getNow = () => new Date().toISOString().slice(0, 19).replace("T", " ");
const getToday = () => new Date().toISOString().slice(0, 10);
const getTimeStr = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const initialState: AppState = {
  role: "lc",
  page: ROLES.lc.pages[0].id,
  tabs: initialTabState,
  modalType: null,
  modalData: null,
  toast: "",
  search: "",
  now: getNow(),
  today: getToday(),
};

const defaultSettings: AppSettings = {
  geoRadius: 180,
  criticalAlertRule: "2 misses in 3 days",
  deadlineRule: "Auto escalate until RM if proof is missing",
  escalationTimeout: "45 min worker",
  locationProofRequired: true,
  selfieVerification: true,
  workerShiftWindow: "07:00 - 15:00",
  weekendSchedule: "Alternate Saturdays off",
  budgetApprovalLimitBM: 25000,
  budgetApprovalLimitRM: 50000,
  proofPolicy: "Geo + photo for all checklists",
  auditFrequency: "Quarterly internal audit",
  autoSyncInterval: "Every 5 minutes",
  offlineMode: true,
  dataRetentionDays: 90,
};

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  branches: Branch[];
  users: User[];
  tasks: Task[];
  complaints: Complaint[];
  appliances: Appliance[];
  approvals: Approval[];
  visits: Visit[];
  notifications: NotificationItem[];
  attendanceLog: AttendanceLog[];

  currentUser: User;
  scopedBranchIds: number[];
  scopedBranches: Branch[];
  scopedTasks: Task[];
  scopedComplaints: Complaint[];
  scopedUsers: User[];
  scopedApprovals: Approval[];
  scopedAppliances: Appliance[];
  scopedNotifications: NotificationItem[];
  scopedAttendance: AttendanceLog[];

  auditLog: AuditEntry[];
  alertStates: Record<number, AlertState>;
  settings: AppSettings;

  getBranch: (id: number) => Branch | undefined;
  getUser: (id: number) => User | undefined;
  getTask: (id: number) => Task | undefined;
  getComplaint: (id: number) => Complaint | undefined;
  getAppliance: (id: number) => Appliance | undefined;

  setPage: (page: string) => void;
  switchRole: (role: RoleId) => void;
  setTab: (key: keyof TabState, value: string) => void;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  openFormModal: (formType?: string) => void;
  openTaskDetail: (id: number) => void;
  openComplaintDetail: (id: number) => void;
  openBranchDetail: (id: number) => void;
  openUserDetail: (id: number) => void;
  openApplianceDetail: (id: number) => void;
  openApprovalDetail: (id: number) => void;
  openVisitDetail: (id: number) => void;
  markAttendance: (weeklyTasks?: WeeklyTaskItem[]) => void;
  submitTaskProof: (taskId: number) => void;
  markTaskDone: (taskId: number) => void;
  revokeTask: (taskId: number) => void;
  resolveComplaint: (id: number) => void;
  escalateComplaint: (id: number) => void;
  assignVendor: (id: number) => void;
  approveHighCost: (id: number) => void;
  approveRequest: (id: number) => void;
  rejectRequest: (id: number) => void;
  toggleNotificationRead: (id: number) => void;
  toggleBookmark: (id: number) => void;
  acknowledgeAlert: (notificationId: number) => void;
  escalateAlert: (notificationId: number) => void;
  createTask: (data: Partial<Task>) => void;
  createComplaint: (data: Partial<Complaint>) => void;
  createUser: (name: string, role: RoleId, branchId: number) => void;
  createAppliance: (data: Partial<Appliance>) => void;
  createExpense: (title: string, amount: number, vendor: string, desc: string) => void;
  createVisit: (branchId: number, date: string, purpose: string, agenda: string) => void;
  submitVisitReport: (id: number) => void;
  editUser: (id: number, data: Partial<User>) => void;
  saveSettings: (settings: AppSettings) => void;
  showToast: (message: string) => void;
  openAuditTrail: () => void;
  addAuditEntry: (text: string, icon: string, color: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [branches] = useState(branchData);
  const [users, setUsers] = useState(userData);
  const [tasks, setTasks] = useState(taskData);
  const [complaints, setComplaints] = useState(complaintData);
  const [appliances, setAppliances] = useState(applianceData);
  const [approvals, setApprovals] = useState(approvalData);
  const [visits, setVisits] = useState(visitData);
  const [notifications, setNotifications] = useState(notificationData);
  const [attendanceLog, setAttendanceLog] = useState(attendanceData);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [alertStates, setAlertStates] = useState<Record<number, AlertState>>({});
  const auditIdRef = useRef(1);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "SHOW_TOAST", message: "" });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const currentUser = useMemo(() => users.find((u) => u.id === currentUserByRole[state.role])!, [state.role, users]);

  const scopedBranchIds = useMemo(() => {
    if (state.role === "rm") return branches.map((b) => b.id);
    if (state.role === "branchManager") return currentUser.branchScope || [];
    return [currentUser.branchId];
  }, [state.role, currentUser, branches]);

  const scopedBranches = useMemo(() => branches.filter((b) => scopedBranchIds.includes(b.id)), [branches, scopedBranchIds]);
  const scopedUsers = useMemo(() => users.filter((u) => scopedBranchIds.includes(u.branchId) || u.id === currentUser.id), [users, scopedBranchIds, currentUser]);
  const scopedTasks = useMemo(() => tasks.filter((t) => scopedBranchIds.includes(t.branchId)), [tasks, scopedBranchIds]);
  const scopedComplaints = useMemo(() => complaints.filter((c) => scopedBranchIds.includes(c.branchId)), [complaints, scopedBranchIds]);
  const scopedApprovals = useMemo(() => approvals.filter((a) => scopedBranchIds.includes(a.branchId)), [approvals, scopedBranchIds]);
  const scopedAppliances = useMemo(() => appliances.filter((a) => scopedBranchIds.includes(a.branchId)), [appliances, scopedBranchIds]);
  const scopedNotifications = useMemo(() => notifications.filter((n) => n.scope.includes(state.role)), [notifications, state.role]);
  const scopedAttendance = useMemo(() => attendanceLog.filter((entry) => {
    const person = users.find((u) => u.id === entry.userId);
    return person && scopedBranchIds.includes(person.branchId);
  }), [attendanceLog, users, scopedBranchIds]);

  const getBranch = useCallback((id: number) => branches.find((b) => b.id === id), [branches]);
  const getUser = useCallback((id: number) => users.find((u) => u.id === id), [users]);
  const getTask = useCallback((id: number) => tasks.find((t) => t.id === id), [tasks]);
  const getComplaint = useCallback((id: number) => complaints.find((c) => c.id === id), [complaints]);
  const getAppliance = useCallback((id: number) => appliances.find((a) => a.id === id), [appliances]);

  const addAuditEntry = useCallback((text: string, icon: string, color: string) => {
    const entry: AuditEntry = {
      id: auditIdRef.current++,
      time: getTimeStr(),
      text,
      icon,
      color,
      role: state.role,
      userId: currentUser.id,
      branchId: currentUser.branchId,
    };
    setAuditLog((prev) => [entry, ...prev].slice(0, 100));
  }, [state.role, currentUser]);

  const setPage = useCallback((page: string) => dispatch({ type: "SET_PAGE", page }), []);
  const switchRole = useCallback((role: RoleId) => dispatch({ type: "SWITCH_ROLE", role }), []);
  const setTab = useCallback((key: keyof TabState, value: string) => dispatch({ type: "SET_TAB", key, value }), []);
  const openModal = useCallback((type: string, data?: any) => dispatch({ type: "OPEN_MODAL", modalType: type, modalData: data }), []);
  const closeModal = useCallback(() => dispatch({ type: "CLOSE_MODAL" }), []);
  const openFormModal = useCallback((formType?: string) => dispatch({ type: "OPEN_MODAL", modalType: "form", modalData: formType ? { formType } : {} }), []);
  const openAuditTrail = useCallback(() => dispatch({ type: "OPEN_MODAL", modalType: "audit" }), []);
  const openTaskDetail = useCallback((id: number) => dispatch({ type: "OPEN_MODAL", modalType: "task", modalData: { id } }), []);
  const openComplaintDetail = useCallback((id: number) => dispatch({ type: "OPEN_MODAL", modalType: "complaint", modalData: { id } }), []);
  const openBranchDetail = useCallback((id: number) => dispatch({ type: "OPEN_MODAL", modalType: "branch", modalData: { id } }), []);
  const openUserDetail = useCallback((id: number) => dispatch({ type: "OPEN_MODAL", modalType: "user", modalData: { id } }), []);
  const openApplianceDetail = useCallback((id: number) => dispatch({ type: "OPEN_MODAL", modalType: "appliance", modalData: { id } }), []);
  const openApprovalDetail = useCallback((id: number) => dispatch({ type: "OPEN_MODAL", modalType: "approval", modalData: { id } }), []);
  const openVisitDetail = useCallback((id: number) => dispatch({ type: "OPEN_MODAL", modalType: "visit", modalData: { id } }), []);
  const showToast = useCallback((message: string) => {
    dispatch({ type: "SHOW_TOAST", message });
    setTimeout(() => dispatch({ type: "HIDE_TOAST" }), 2200);
  }, []);

  const markAttendance = useCallback((weeklyTasks?: WeeklyTaskItem[]) => {
    const userId = currentUserByRole[state.role];
    const nowTime = getTimeStr();
    let entry = attendanceLog.find((row) => row.userId === userId && row.date === state.today);
    if (!entry) {
      const newEntry: AttendanceLog = {
        id: attendanceLog.length + 701, userId, date: state.today,
        status: "Present", checkIn: nowTime, location: "Inside geo fence - 40m",
        proof: "Geo + selfie verified", deviation: "No",
        weeklyTasks: weeklyTasks || [],
      };
      setAttendanceLog((prev) => [...prev, newEntry]);
    } else {
      setAttendanceLog((prev) => prev.map((e) =>
        e.id === entry!.id ? { ...e, status: "Present" as const, proof: "Geo + selfie refreshed", location: "Inside geo fence - 38m", weeklyTasks: weeklyTasks || e.weeklyTasks } : e
      ));
    }
    addAuditEntry(`${currentUser.name} marked attendance at ${nowTime}`, "CheckCircle", "#10B981");
    showToast("Attendance proof captured");
  }, [state.role, state.today, attendanceLog, currentUser, addAuditEntry, showToast]);

  const submitTaskProof = useCallback((taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.map((t) =>
      t.id === taskId ? { ...t, status: "Completed" as const, checklistDone: t.checklistTotal, completedBy: currentUser.id, completedAt: getNow() } : t
    ));
    addAuditEntry(`Task ${taskId}${task ? ` "${task.title}"` : ""} completed with photo proof by ${currentUser.name}`, "CheckCircle", "#10B981");
    showToast("Photo proof submitted");
  }, [tasks, currentUser, addAuditEntry, showToast]);

  const markTaskDone = useCallback((taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.map((t) =>
      t.id === taskId ? { ...t, status: "Completed" as const, checklistDone: t.checklistTotal, completedBy: currentUser.id, completedAt: getNow() } : t
    ));
    addAuditEntry(`Task ${taskId}${task ? ` "${task.title}"` : ""} marked complete by ${currentUser.name}`, "CheckCircle", "#10B981");
    showToast("Task marked complete");
  }, [tasks, currentUser, addAuditEntry, showToast]);

  const revokeTask = useCallback((taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.map((t) =>
      t.id === taskId ? { ...t, status: "Revoked" as const, redoReason: "Revision requested on checklist notes and supporting entry." } : t
    ));
    addAuditEntry(`Task ${taskId}${task ? ` "${task.title}"` : ""} revoked by ${currentUser.name} for revision`, "RefreshCw", "#EF4444");
    showToast("Task revoked with comment");
  }, [tasks, currentUser, addAuditEntry, showToast]);

  const resolveComplaint = useCallback((id: number) => {
    const complaint = complaints.find((c) => c.id === id);
    setComplaints((prev) => prev.map((c) =>
      c.id === id ? { ...c, status: "Resolved" as const, escalationStage: "Closed", timeline: [...c.timeline, `${getTimeStr()} - Marked resolved by ${currentUser.name}`] } : c
    ));
    addAuditEntry(`Complaint ${id}${complaint ? ` "${complaint.title}"` : ""} resolved by ${currentUser.name}`, "CheckCircle", "#10B981");
    showToast("Complaint resolved");
  }, [complaints, currentUser, addAuditEntry, showToast]);

  const escalateComplaint = useCallback((id: number) => {
    const complaint = complaints.find((c) => c.id === id);
    setComplaints((prev) => prev.map((c) => {
      const nextStage = c.escalationStage === "LC" ? "Branch Manager" : "RM";
      return c.id === id ? { ...c, status: "Escalated" as const, escalationStage: nextStage, timeline: [...c.timeline, `${getTimeStr()} - Escalated to ${nextStage} by ${currentUser.name}`] } : c;
    }));
    addAuditEntry(`Complaint ${id}${complaint ? ` "${complaint.title}"` : ""} escalated by ${currentUser.name}`, "AlertTriangle", "#F59E0B");
    showToast("Complaint escalated");
  }, [complaints, currentUser, addAuditEntry, showToast]);

  const assignVendor = useCallback((id: number) => {
    setComplaints((prev) => prev.map((c) =>
      c.id === id ? { ...c, assignedVendor: "Rapid Response Vendor", timeline: [...c.timeline, `${getTimeStr()} - Vendor assigned by ${currentUser.name}`] } : c
    ));
    addAuditEntry(`Vendor assigned to complaint ${id} by ${currentUser.name}`, "Wrench", "#6366F1");
    showToast("Vendor assigned");
  }, [currentUser, addAuditEntry, showToast]);

  const approveHighCost = useCallback((id: number) => {
    setComplaints((prev) => prev.map((c) =>
      c.id === id ? { ...c, timeline: [...c.timeline, `${getTimeStr()} - RM approved high-cost decision`] } : c
    ));
    addAuditEntry(`High-cost approval recorded for complaint ${id} by ${currentUser.name}`, "CheckCircle", "#10B981");
    showToast("High-cost approval recorded");
  }, [currentUser, addAuditEntry, showToast]);

  const approveRequest = useCallback((id: number) => {
    const approval = approvals.find((a) => a.id === id);
    setApprovals((prev) => prev.map((a) => a.id === id ? { ...a, status: "Approved" as const, stage: "Closed" } : a));
    addAuditEntry(`Approval ${id}${approval ? ` "${approval.title}"` : ""} approved by ${currentUser.name}`, "CheckCircle", "#10B981");
    showToast("Approval recorded");
  }, [approvals, currentUser, addAuditEntry, showToast]);

  const rejectRequest = useCallback((id: number) => {
    const approval = approvals.find((a) => a.id === id);
    setApprovals((prev) => prev.map((a) => a.id === id ? { ...a, status: "Rejected" as const, stage: "Closed" } : a));
    addAuditEntry(`Approval ${id}${approval ? ` "${approval.title}"` : ""} rejected by ${currentUser.name}`, "XCircle", "#EF4444");
    showToast("Request rejected");
  }, [approvals, currentUser, addAuditEntry, showToast]);

  const toggleNotificationRead = useCallback((id: number) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: !n.read } : n));
  }, []);

  const toggleBookmark = useCallback((id: number) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, bookmarked: !n.bookmarked } : n));
  }, []);

  const acknowledgeAlert = useCallback((notificationId: number) => {
    const notif = notifications.find((n) => n.id === notificationId);
    setAlertStates((prev) => ({
      ...prev,
      [notificationId]: {
        notificationId,
        acknowledged: true,
        escalated: prev[notificationId]?.escalated || false,
        acknowledgedAt: getNow(),
        escalatedAt: prev[notificationId]?.escalatedAt || null,
      },
    }));
    if (notif) {
      addAuditEntry(`Alert "${notif.title}" acknowledged by ${currentUser.name}`, "CheckCircle", "#10B981");
    }
    showToast("Alert acknowledged");
  }, [notifications, currentUser, addAuditEntry, showToast]);

  const escalateAlert = useCallback((notificationId: number) => {
    const notif = notifications.find((n) => n.id === notificationId);
    setAlertStates((prev) => ({
      ...prev,
      [notificationId]: {
        notificationId,
        acknowledged: prev[notificationId]?.acknowledged || false,
        escalated: true,
        acknowledgedAt: prev[notificationId]?.acknowledgedAt || null,
        escalatedAt: getNow(),
      },
    }));
    if (notif) {
      addAuditEntry(`Alert "${notif.title}" escalated by ${currentUser.name}`, "AlertTriangle", "#F59E0B");
    }
    showToast("Alert escalated to RM");
  }, [notifications, currentUser, addAuditEntry, showToast]);

  const createTask = useCallback((data: Partial<Task>) => {
    const newTask: Task = {
      id: tasks.length + 101, title: data.title || "New task", branchId: data.branchId || currentUser.branchId,
      audience: data.audience || "lc", schedule: data.schedule || "Daily", priority: data.priority || "High",
      zone: data.zone || "Branch area", deadline: data.deadline || state.today + "T18:00:00",
      assignedTo: data.assignedTo || null, assignedBy: currentUser.id, status: "Pending",
      checklistDone: 0, checklistTotal: 5, proofRequired: data.proofRequired || false,
      completedBy: null, completedAt: null, notes: data.notes || "Created from app",
      escalation: "LC review", proofLabel: "Completion note", redoReason: null, ...data,
    };
    setTasks((prev) => [newTask, ...prev]);
    addAuditEntry(`Task "${newTask.title}" created by ${currentUser.name} for ${newTask.audience}`, "Plus", "#6366F1");
    showToast("Task created");
  }, [tasks.length, currentUser, state.today, addAuditEntry, showToast]);

  const createComplaint = useCallback((data: Partial<Complaint>) => {
    const timeStr = getTimeStr();
    const newComplaint: Complaint = {
      id: complaints.length + 201, title: data.title || "New issue", branchId: data.branchId || currentUser.branchId,
      type: data.type || "Appliance", priority: data.priority || "High", status: "Pending", reportedBy: currentUser.id,
      assignedVendor: "Not assigned", assetId: null, estimatedCost: data.estimatedCost || 5000, impact: data.impact || "Freshly raised",
      createdAt: getNow(), description: data.description || "", escalationStage: "LC",
      timeline: [`${timeStr} - Complaint submitted by ${currentUser.name}`], ...data,
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    addAuditEntry(`Complaint "${newComplaint.title}" raised by ${currentUser.name}`, "Zap", "#EF4444");
    showToast("Complaint submitted");
  }, [complaints.length, currentUser, addAuditEntry, showToast]);

  const createUser = useCallback((name: string, role: RoleId, branchId: number) => {
    const newUser: User = {
      id: users.length + 1, name, role, branchId, position: ROLES[role].name,
      phone: "Pending", email: name.toLowerCase().replace(/\s+/g, ".") + "@bajaj.com",
      shift: "09:00 - 18:00", joinDate: getToday(), status: "Present", rating: 4.0, attendancePct: 100,
      tasksClosed: 0, proofRate: 100, escalations: 0, managerId: currentUser.id,
      salary: 0, lastCheckIn: "Not marked", skills: ["New account"],
      emergencyContact: "Pending", documents: ["Pending onboarding"],
      deviceId: "USR-" + (users.length + 1),
    };
    setUsers((prev) => [...prev, newUser]);
    addAuditEntry(`User "${name}" created as ${role} by ${currentUser.name}`, "UserPlus", "#6366F1");
    showToast("User created");
  }, [users.length, currentUser, addAuditEntry, showToast]);

  const editUser = useCallback((id: number, data: Partial<User>) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, ...data } : u));
    const user = users.find((u) => u.id === id);
    addAuditEntry(`User ${id}${user ? ` "${user.name}"` : ""} profile updated by ${currentUser.name}`, "Edit", "#6366F1");
    showToast("Profile updated");
  }, [users, currentUser, addAuditEntry, showToast]);

  const createAppliance = useCallback((data: Partial<Appliance>) => {
    const newApp: Appliance = {
      id: appliances.length + 301, branchId: currentUser.branchId,
      name: data.name || "New asset", category: data.category || "General",
      zone: data.zone || "Branch area", brand: data.brand || "Pending",
      model: data.model || "Pending", serial: "NEW-" + (appliances.length + 301),
      healthScore: 100, status: "Operational", purchaseDate: getToday(),
      lastService: "New asset", nextService: "2026-07-26", warranty: "Pending",
      amcVendor: "To be assigned", purchaseCost: 0,
      approvalStatus: "Pending manager approval", pendingParts: "None", ...data,
    };
    setAppliances((prev) => [newApp, ...prev]);
    addAuditEntry(`Appliance "${newApp.name}" added by ${currentUser.name}`, "Wrench", "#10B981");
    showToast("Appliance added");
  }, [appliances.length, currentUser.branchId, currentUser, addAuditEntry, showToast]);

  const createExpense = useCallback((title: string, amount: number, vendor: string, desc: string) => {
    const newApproval: Approval = {
      id: approvals.length + 401, title, kind: "Expense", branchId: currentUser.branchId,
      amount, requestedBy: currentUser.id, status: "Pending",
      stage: state.role === "rm" ? "RM" : "Branch Manager",
      priority: amount > 25000 ? "Critical" : "High", age: "Just now",
      note: vendor ? vendor + " | " + desc : desc || "Work order created",
    };
    setApprovals((prev) => [newApproval, ...prev]);
    addAuditEntry(`Work order "${title}" created for ${amount} by ${currentUser.name}`, "DollarSign", "#F59E0B");
    showToast("Work order created");
  }, [approvals.length, currentUser, state.role, addAuditEntry, showToast]);

  const createVisit = useCallback((branchId: number, date: string, purpose: string, agenda: string) => {
    const newVisit: Visit = {
      id: visits.length + 501, branchId, managerId: currentUser.id,
      scheduledAt: date.replace("T", " "), purpose,
      agenda: agenda || "Branch review", status: "Scheduled", report: "Pending",
    };
    setVisits((prev) => [newVisit, ...prev]);
    const branch = branches.find((b) => b.id === branchId);
    addAuditEntry(`Visit scheduled at ${branch?.name || "Branch " + branchId} by ${currentUser.name}`, "Calendar", "#6366F1");
    showToast("Visit scheduled");
  }, [visits.length, currentUser.id, branches, addAuditEntry, showToast]);

  const submitVisitReport = useCallback((id: number) => {
    setVisits((prev) => prev.map((v) =>
      v.id === id ? { ...v, status: "Completed" as const, report: "Visit report submitted. Proof logs reviewed, manpower gaps discussed, and follow-up assigned." } : v
    ));
    addAuditEntry(`Visit ${id} report submitted by ${currentUser.name}`, "FileText", "#10B981");
    showToast("Visit report submitted");
  }, [currentUser, addAuditEntry, showToast]);

  const saveSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    addAuditEntry(`System settings updated by ${currentUser.name}`, "Settings", "#6366F1");
    showToast("Settings updated");
  }, [currentUser, addAuditEntry, showToast]);

  const value: AppContextValue = {
    state, dispatch, branches, users, tasks, complaints, appliances, approvals, visits, notifications, attendanceLog,
    currentUser, scopedBranchIds, scopedBranches, scopedTasks, scopedComplaints, scopedUsers,
    scopedApprovals, scopedAppliances, scopedNotifications, scopedAttendance,
    auditLog, alertStates, settings,
    getBranch, getUser, getTask, getComplaint, getAppliance,
    setPage, switchRole, setTab, openModal, closeModal, openFormModal,
    openTaskDetail, openComplaintDetail, openBranchDetail, openUserDetail,
    openApplianceDetail, openApprovalDetail, openVisitDetail,
    markAttendance, submitTaskProof, markTaskDone, revokeTask,
    resolveComplaint, escalateComplaint, assignVendor, approveHighCost,
    approveRequest, rejectRequest, toggleNotificationRead, toggleBookmark,
    acknowledgeAlert, escalateAlert,
    createTask, createComplaint, createUser, createAppliance, createExpense, createVisit,
    submitVisitReport, editUser, saveSettings, showToast, openAuditTrail, addAuditEntry,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
