import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../components/header/AppHeader";
import { BottomNavbar } from "../components/navigation/BottomNavbar";
import { ROLES } from "../constants/roles";
import { HomeScreen } from "../screens/home/HomeScreen";
import { TasksScreen } from "../screens/tasks/TasksScreen";
import { ComplaintScreen } from "../screens/complaint/ComplaintScreen";
import { AttendanceScreen } from "../screens/attendance/AttendanceScreen";
import { AlertsScreen } from "../screens/alerts/AlertsScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { useOpsStore } from "../state/useOpsStore";

function CurrentScreen({ store }: { store: ReturnType<typeof useOpsStore> }) {
  const page = store.page;

  switch (page) {
    case "profile":
      return <ProfileScreen />;
    case "home":
    case "dashboard":
    case "branch":
    case "branches":
    case "intelligence":
    case "analytics":
      return <HomeScreen stats={store.stats} branches={store.branches} page={page} role={store.role} />;
    case "tasks":
    case "monitoring":
      return <TasksScreen tasks={store.scopedTasks} onDone={store.markTaskDone} onRevoke={store.revokeTask} />;
    case "complaints":
    case "issues":
    case "alerts":
      return <ComplaintScreen complaints={store.scopedComplaints} onResolve={store.resolveComplaint} onEscalate={store.escalateComplaint} />;
    case "attendance":
      return <AttendanceScreen branches={store.branches} />;
    case "notifications":
      return <AlertsScreen notifications={store.notifications} onToggle={store.toggleNotification} onBookmark={store.bookmarkNotification} />;
    default:
      return <HomeScreen stats={store.stats} branches={store.branches} page={page} role={store.role} />;
  }
}

export function RootApp() {
  const store = useOpsStore();
  const roleDef = ROLES[store.role];

  return (
    <SafeAreaProvider>
      <LinearGradient colors={["#E8EEF5", "#F2F6FC", "#EDF2F8"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        <SafeAreaView style={styles.root} edges={["left", "right", "bottom"]}>
          <StatusBar barStyle="dark-content" />

          <View style={styles.glassBlurA} />
          <View style={styles.glassBlurB} />
          <View style={styles.glassBlurC} />

          <AppHeader roleName={roleDef.name} currentRole={store.role} onSwitchRole={store.switchRole} onProfile={() => store.setPage("profile")} unreadCount={store.stats.unread} notifications={store.notifications} onToggleNotification={store.toggleNotification} onBookmarkNotification={store.bookmarkNotification} />

          <CurrentScreen store={store} />

          <BottomNavbar activePage={store.page} onPage={store.setPage} />
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: "transparent",
  },
  glassBlurA: {
    position: "absolute",
    top: -80,
    right: -30,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: "rgba(37,99,235,0.07)",
  },
  glassBlurB: {
    position: "absolute",
    bottom: 120,
    left: -70,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: "rgba(6,182,212,0.06)",
  },
  glassBlurC: {
    position: "absolute",
    top: "35%",
    left: "40%",
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(139,92,246,0.04)",
  },
});
