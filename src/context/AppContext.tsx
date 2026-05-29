import React, { createContext, useContext, useReducer, useMemo, useCallback, ReactNode } from "react";
import {
  RoleId, TabState, Branch, User, Task, Complaint, Appliance, Approval,
  Visit, NotificationItem, AttendanceLog,
} from "../types/domain";
import {
  branches as branchData, users as userData, tasks as taskData, complaints as complaintData,
  appliances as applianceData, approvals as approvalData, visits as visitData,
  notifications as notificationData, attendanceLog as attendanceData,
  ROLES, initialTabState, currentUserByRole,
} from "../data/mockData";

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

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

const initialState: AppState = {
  role: "worker",
  page: ROLES.worker.pages[0].id,
  tabs: initialTabState,
  modalType: null,
  modalData: null,
  toast: "",
  search: "",
  now: "2026-04-26T11:20:00",
  today: "2026-04-26",
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
  openTaskDetail: (id: number) => void;
  openComplaintDetail: (id: number) => void;
  openBranchDetail: (id: number) => void;
  openUserDetail: (id: number) => void;
  openApplianceDetail: (id: number) => void;
  openApprovalDetail: (id: number) => void;
  openVisitDetail: (id: number) => void;
  markAttendance: () => void;
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
  createTask: (data: Partial<Task>) => void;
  createComplaint: (data: Partial<Complaint>) => void;
  createUser: (name: string, role: RoleId, branchId: number) => void;
  createStaff: (name: string, role: "worker" | "employee", position: string, phone: string, shift: string) => void;
  createAppliance: (data: Partial<Appliance>) => void;
  createExpense: (title: string, amount: number, vendor: string, desc: string) => void;
  createVisit: (branchId: number, date: string, purpose: string, agenda: string) => void;
  submitVisitReport: (id: number) => void;
  saveSettings: (settings: any) => void;
  showToast: (message: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [branches] = React.useState(branchData);
  const [users, setUsers] = React.useState(userData);
  const [tasks, setTasks] = React.useState(taskData);
  const [complaints, setComplaints] = React.useState(complaintData);
  const [appliances, setAppliances] = React.useState(applianceData);
  const [approvals, setApprovals] = React.useState(approvalData);
  const [visits, setVisits] = React.useState(visitData);
  const [notifications, setNotifications] = React.useState(notificationData);
  const [attendanceLog, setAttendanceLog] = React.useState(attendanceData);
  const [settings, setSettings] = React.useState({
    geoRadius: 180,
    workerEscalationMins: 45,
    employeeEscalationMins: 120,
    criticalAlertRule: "2 misses in 3 days",
    deadlineRule: "Auto escalate until RM if proof is missing",
  });

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

  const updateBranchPeopleCount = useCallback((branchId: number, role: string) => {
    const branch = branches.find((b) => b.id === branchId);
    if (!branch) return;
    branch.staffCount += 1;
    if (role === "worker") branch.workerCount += 1;
    if (role === "employee") branch.employeeCount += 1;
  }, [branches]);

  const setPage = useCallback((page: string) => dispatch({ type: "SET_PAGE", page }), []);
  const switchRole = useCallback((role: RoleId) => dispatch({ type: "SWITCH_ROLE", role }), []);
  const setTab = useCallback((key: keyof TabState, value: string) => dispatch({ type: "SET_TAB", key, value }), []);
  const openModal = useCallback((type: string, data?: any) => dispatch({ type: "OPEN_MODAL", modalType: type, modalData: data }), []);
  const closeModal = useCallback(() => dispatch({ type: "CLOSE_MODAL" }), []);
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

  const markAttendance = useCallback(() => {
    const user = currentUserByRole[state.role];
    let entry = attendanceLog.find((row) => row.userId === user && row.date === state.today);
    if (!entry) {
      const newEntry: AttendanceLog = {
        id: attendanceLog.length + 701, userId: user, date: state.today,
        status: "Present", checkIn: "11:22", location: "Inside geo fence - 40m",
        proof: "Geo + selfie verified", deviation: "No",
      };
      setAttendanceLog((prev) => [...prev, newEntry]);
    } else {
      setAttendanceLog((prev) => prev.map((e) =>
        e.id === entry!.id ? { ...e, status: "Present", proof: "Geo + selfie refreshed", location: "Inside geo fence - 38m" } : e
      ));
    }
    showToast("Attendance proof captured");
  }, [state.role, state.today, attendanceLog, showToast]);

  const submitTaskProof = useCallback((taskId: number) => {
    setTasks((prev) => prev.map((t) =>
      t.id === taskId ? { ...t, status: "Completed" as const, checklistDone: t.checklistTotal, completedBy: currentUser.id, completedAt: state.now } : t
    ));
    showToast("Photo proof submitted");
  }, [currentUser.id, state.now, showToast]);

  const markTaskDone = useCallback((taskId: number) => {
    setTasks((prev) => prev.map((t) =>
      t.id === taskId ? { ...t, status: "Completed" as const, checklistDone: t.checklistTotal, completedBy: currentUser.id, completedAt: state.now } : t
    ));
    showToast("Task marked complete");
  }, [currentUser.id, state.now, showToast]);

  const revokeTask = useCallback((taskId: number) => {
    setTasks((prev) => prev.map((t) =>
      t.id === taskId ? { ...t, status: "Revoked" as const, redoReason: "AM requested correction on checklist notes and supporting entry." } : t
    ));
    showToast("Task revoked with comment");
  }, [showToast]);

  const resolveComplaint = useCallback((id: number) => {
    setComplaints((prev) => prev.map((c) =>
      c.id === id ? { ...c, status: "Resolved" as const, escalationStage: "Closed", timeline: [...c.timeline, "11:20 - Marked resolved in system"] } : c
    ));
    showToast("Complaint resolved");
  }, [showToast]);

  const escalateComplaint = useCallback((id: number) => {
    setComplaints((prev) => prev.map((c) => {
      const nextStage = c.escalationStage === "AA" ? "Branch Manager" : "RM";
      return c.id === id ? { ...c, status: "Escalated" as const, escalationStage: nextStage, timeline: [...c.timeline, `11:20 - Escalated to ${nextStage}`] } : c;
    }));
    showToast("Complaint escalated");
  }, [showToast]);

  const assignVendor = useCallback((id: number) => {
    setComplaints((prev) => prev.map((c) =>
      c.id === id ? { ...c, assignedVendor: "Rapid Response Vendor", timeline: [...c.timeline, "11:20 - Vendor assignment updated"] } : c
    ));
    showToast("Vendor assigned");
  }, [showToast]);

  const approveHighCost = useCallback((id: number) => {
    setComplaints((prev) => prev.map((c) =>
      c.id === id ? { ...c, timeline: [...c.timeline, "11:20 - RM approved high-cost decision"] } : c
    ));
    showToast("High-cost approval recorded");
  }, [showToast]);

  const approveRequest = useCallback((id: number) => {
    setApprovals((prev) => prev.map((a) => a.id === id ? { ...a, status: "Approved" as const, stage: "Closed" } : a));
    showToast("Approval recorded");
  }, [showToast]);

  const rejectRequest = useCallback((id: number) => {
    setApprovals((prev) => prev.map((a) => a.id === id ? { ...a, status: "Rejected" as const, stage: "Closed" } : a));
    showToast("Request rejected");
  }, [showToast]);

  const toggleNotificationRead = useCallback((id: number) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: !n.read } : n));
    showToast("Toggled read status");
  }, [showToast]);

  const toggleBookmark = useCallback((id: number) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, bookmarked: !n.bookmarked } : n));
    showToast("Toggled bookmark");
  }, [showToast]);

  const createTask = useCallback((data: Partial<Task>) => {
    const newTask: Task = {
      id: tasks.length + 101, title: data.title || "New task", branchId: currentUser.branchId,
      audience: "worker", schedule: "Daily", priority: "High", zone: "Branch area",
      deadline: data.deadline || state.today + "T18:00:00", assignedTo: null, assignedBy: currentUser.id,
      status: "Pending", checklistDone: 0, checklistTotal: 5, proofRequired: false,
      completedBy: null, completedAt: null, notes: "Created from app", escalation: "AA review",
      proofLabel: "Completion note", redoReason: null, ...data,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast("Task created");
  }, [tasks.length, currentUser, state.today, showToast]);

  const createComplaint = useCallback((data: Partial<Complaint>) => {
    const newComplaint: Complaint = {
      id: complaints.length + 201, title: data.title || "New issue", branchId: currentUser.branchId,
      type: data.type || "Appliance", priority: "High", status: "Pending", reportedBy: currentUser.id,
      assignedVendor: "Not assigned", assetId: null, estimatedCost: 5000, impact: "Freshly raised",
      createdAt: "2026-04-26 11:20", description: data.description || "", escalationStage: "AA",
      timeline: ["11:20 - Complaint submitted"], ...data,
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    showToast("Complaint submitted");
  }, [complaints.length, currentUser, showToast]);

  const createUser = useCallback((name: string, role: RoleId, branchId: number) => {
    const newUser: User = {
      id: users.length + 1, name, role, branchId, position: ROLES[role].name,
      phone: "Pending", email: name.toLowerCase().replace(/\s+/g, ".") + "@bajaj.com",
      shift: role === "worker" ? "07:00 - 15:00" : "09:00 - 18:00",
      joinDate: "2026-04-26", status: "Present", rating: 4.0, attendancePct: 100,
      tasksClosed: 0, proofRate: 100, escalations: 0, managerId: currentUser.id,
      salary: 0, lastCheckIn: "Not marked", skills: ["New account"],
      emergencyContact: "Pending", documents: ["Pending onboarding"],
      deviceId: "USR-" + (users.length + 1),
    };
    setUsers((prev) => [...prev, newUser]);
    if (["worker", "employee", "am"].includes(role)) updateBranchPeopleCount(branchId, role);
    showToast("User created");
  }, [users.length, currentUser, showToast, updateBranchPeopleCount]);

  const createStaff = useCallback((name: string, role: "worker" | "employee", position: string, phone: string, shift: string) => {
    const newUser: User = {
      id: users.length + 1, name, role, branchId: currentUser.branchId, position,
      phone: phone || "Not added", email: name.toLowerCase().replace(/\s+/g, ".") + "@bajaj.com",
      shift: shift || (role === "worker" ? "07:00 - 15:00" : "09:00 - 18:00"),
      joinDate: "2026-04-26", status: "Present", rating: 4.0, attendancePct: 100,
      tasksClosed: 0, proofRate: 100, escalations: 0, managerId: currentUser.id,
      salary: role === "worker" ? 19000 : 31000, lastCheckIn: "Not marked",
      skills: ["New joiner"], emergencyContact: "To be added",
      documents: ["Pending onboarding docs"], deviceId: "NEW-" + role.toUpperCase() + "-" + (users.length + 1),
    };
    setUsers((prev) => [...prev, newUser]);
    updateBranchPeopleCount(currentUser.branchId, role);
    showToast(role + " added to branch");
  }, [users.length, currentUser, showToast, updateBranchPeopleCount]);

  const createAppliance = useCallback((data: Partial<Appliance>) => {
    const newApp: Appliance = {
      id: appliances.length + 301, branchId: currentUser.branchId,
      name: data.name || "New asset", category: data.category || "General",
      zone: data.zone || "Branch area", brand: data.brand || "Pending",
      model: data.model || "Pending", serial: "NEW-" + (appliances.length + 301),
      healthScore: 100, status: "Operational", purchaseDate: "2026-04-26",
      lastService: "New asset", nextService: "2026-07-26", warranty: "Pending",
      amcVendor: "To be assigned", purchaseCost: 0,
      approvalStatus: "Pending manager approval", pendingParts: "None",
      ...data,
    };
    setAppliances((prev) => [newApp, ...prev]);
    showToast("Appliance added");
  }, [appliances.length, currentUser.branchId, showToast]);

  const createExpense = useCallback((title: string, amount: number, vendor: string, desc: string) => {
    const newApproval: Approval = {
      id: approvals.length + 401, title, kind: "Expense", branchId: currentUser.branchId,
      amount, requestedBy: currentUser.id, status: "Pending",
      stage: state.role === "rm" ? "RM" : "Branch Manager",
      priority: amount > 25000 ? "Critical" : "High", age: "Just now",
      note: vendor ? vendor + " | " + desc : desc || "Work order created",
    };
    setApprovals((prev) => [newApproval, ...prev]);
    showToast("Work order created");
  }, [approvals.length, currentUser, state.role, showToast]);

  const createVisit = useCallback((branchId: number, date: string, purpose: string, agenda: string) => {
    const newVisit: Visit = {
      id: visits.length + 501, branchId, managerId: currentUser.id,
      scheduledAt: date.replace("T", " "), purpose,
      agenda: agenda || "Branch review", status: "Scheduled", report: "Pending",
    };
    setVisits((prev) => [newVisit, ...prev]);
    showToast("Visit scheduled");
  }, [visits.length, currentUser.id, showToast]);

  const submitVisitReport = useCallback((id: number) => {
    setVisits((prev) => prev.map((v) =>
      v.id === id ? { ...v, status: "Completed" as const, report: "Visit report submitted. Proof logs reviewed, manpower gaps discussed, and follow-up assigned." } : v
    ));
    showToast("Visit report submitted");
  }, [showToast]);

  const saveSettings = useCallback((newSettings: typeof settings) => {
    setSettings(newSettings);
    showToast("Settings updated");
  }, [showToast]);

  const value: AppContextValue = {
    state, dispatch, branches, users, tasks, complaints, appliances, approvals, visits, notifications, attendanceLog,
    currentUser, scopedBranchIds, scopedBranches, scopedTasks, scopedComplaints, scopedUsers,
    scopedApprovals, scopedAppliances, scopedNotifications, scopedAttendance,
    getBranch, getUser, getTask, getComplaint, getAppliance,
    setPage, switchRole, setTab, openModal, closeModal,
    openTaskDetail, openComplaintDetail, openBranchDetail, openUserDetail,
    openApplianceDetail, openApprovalDetail, openVisitDetail,
    markAttendance, submitTaskProof, markTaskDone, revokeTask,
    resolveComplaint, escalateComplaint, assignVendor, approveHighCost,
    approveRequest, rejectRequest, toggleNotificationRead, toggleBookmark,
    createTask, createComplaint, createUser, createStaff, createAppliance, createExpense, createVisit,
    submitVisitReport, saveSettings, showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
