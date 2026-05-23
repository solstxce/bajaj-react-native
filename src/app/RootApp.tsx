import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { AppHeader } from "../components/layout/AppHeader";
import { BottomNav } from "../components/layout/BottomNav";
import { ROLES } from "../constants/roles";
import { theme } from "../constants/theme";
import { OperationsScreen } from "../features/operations/OperationsScreen";
import { useOpsStore } from "../state/useOpsStore";

export function RootApp() {
  const store = useOpsStore();
  const roleDef = ROLES[store.role];

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgBlobA} />
      <View style={styles.bgBlobB} />

      <AppHeader roleName={roleDef.name} hierarchy={roleDef.hierarchy} />

      <OperationsScreen
        role={store.role}
        page={store.page}
        stats={store.stats}
        branches={store.branches}
        tasks={store.scopedTasks}
        complaints={store.scopedComplaints}
        approvals={store.scopedApprovals}
        notifications={store.notifications}
        switchRole={store.switchRole}
        markTaskDone={store.markTaskDone}
        revokeTask={store.revokeTask}
        resolveComplaint={store.resolveComplaint}
        escalateComplaint={store.escalateComplaint}
        decideApproval={store.decideApproval}
        toggleNotification={store.toggleNotification}
        createTask={store.createTask}
        createComplaint={store.createComplaint}
      />

      <BottomNav pages={roleDef.pages} activePage={store.page} onPage={store.setPage} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  bgBlobA: { position: "absolute", top: -90, left: -30, width: 220, height: 220, borderRadius: 999, backgroundColor: "rgba(239,124,33,0.18)" },
  bgBlobB: { position: "absolute", bottom: 120, right: -50, width: 180, height: 180, borderRadius: 999, backgroundColor: "rgba(21,128,61,0.12)" },
});
