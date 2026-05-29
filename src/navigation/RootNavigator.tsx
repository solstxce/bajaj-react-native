import React, { useState } from "react";
import { View, SafeAreaView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, ListChecks, Wrench, MapPin, Bell, IdCard, BarChart3, AlertCircle, Building, LineChart, Stamp, Route, Satellite, TriangleAlert, Wallet, ChartColumn, Users, Sliders, Circle } from "lucide-react-native";
import { useApp } from "../context/AppContext";
import { ROLES } from "../data/mockData";
import { colors, fontSize, spacing, borderRadius } from "../theme/theme";
import { pageIcon } from "../theme/styleMaps";
import { TopBar } from "../shared/layout/TopBar";
import { Toast } from "../shared/components/Toast";
import { RoleSwitcherModal } from "../modals/forms/RoleSwitcherModal";
import { DetailModal } from "../modals/detail/DetailModal";
import { SearchModal } from "../modals/forms/SearchModal";
import { PlaceholderScreen } from "./PlaceholderScreen";

import { WorkerHomeScreen } from "../roles/worker/WorkerHomeScreen";
import { WorkerTasksScreen } from "../roles/worker/WorkerTasksScreen";
import { WorkerComplaintsScreen } from "../roles/worker/WorkerComplaintsScreen";
import { WorkerAttendanceScreen } from "../roles/worker/WorkerAttendanceScreen";
import { WorkerNotificationsScreen } from "../roles/worker/WorkerNotificationsScreen";
import { WorkerProfileScreen } from "../roles/worker/WorkerProfileScreen";

import { EmployeeHomeScreen } from "../roles/employee/EmployeeHomeScreen";
import { EmployeeTasksScreen } from "../roles/employee/EmployeeTasksScreen";
import { EmployeeComplaintsScreen } from "../roles/employee/EmployeeComplaintsScreen";
import { EmployeeAttendanceScreen } from "../roles/employee/EmployeeAttendanceScreen";
import { EmployeeNotificationsScreen } from "../roles/employee/EmployeeNotificationsScreen";
import { EmployeeProfileScreen } from "../roles/employee/EmployeeProfileScreen";

import { AmHomeScreen } from "../roles/am/AmHomeScreen";
import { AmTasksScreen } from "../roles/am/AmTasksScreen";
import { AmComplaintsScreen } from "../roles/am/AmComplaintsScreen";
import { AmBranchScreen } from "../roles/am/AmBranchScreen";
import { AmAttendanceScreen } from "../roles/am/AmAttendanceScreen";
import { AmNotificationsScreen } from "../roles/am/AmNotificationsScreen";
import { AmProfileScreen } from "../roles/am/AmProfileScreen";

import { BranchManagerHomeScreen } from "../roles/branchManager/BranchManagerHomeScreen";
import { BranchManagerBranchesScreen } from "../roles/branchManager/BranchManagerBranchesScreen";
import { BranchManagerMonitoringScreen } from "../roles/branchManager/BranchManagerMonitoringScreen";
import { BranchManagerIssuesScreen } from "../roles/branchManager/BranchManagerIssuesScreen";
import { BranchManagerApprovalsScreen } from "../roles/branchManager/BranchManagerApprovalsScreen";
import { BranchManagerVisitsScreen } from "../roles/branchManager/BranchManagerVisitsScreen";
import { BranchManagerNotificationsScreen } from "../roles/branchManager/BranchManagerNotificationsScreen";
import { BranchManagerProfileScreen } from "../roles/branchManager/BranchManagerProfileScreen";

import { RmDashboardScreen } from "../roles/rm/RmDashboardScreen";
import { RmIntelligenceScreen } from "../roles/rm/RmIntelligenceScreen";
import { RmAlertsScreen } from "../roles/rm/RmAlertsScreen";
import { RmFinanceScreen } from "../roles/rm/RmFinanceScreen";
import { RmAnalyticsScreen } from "../roles/rm/RmAnalyticsScreen";
import { RmApprovalsScreen } from "../roles/rm/RmApprovalsScreen";
import { RmUsersScreen } from "../roles/rm/RmUsersScreen";
import { RmSettingsScreen } from "../roles/rm/RmSettingsScreen";
import { RmNotificationsScreen } from "../roles/rm/RmNotificationsScreen";
import { RmProfileScreen } from "../roles/rm/RmProfileScreen";

const Tab = createBottomTabNavigator();

const screenRegistry: Record<string, React.ComponentType> = {};

export function registerScreen(roleId: string, pageId: string, component: React.ComponentType) {
  screenRegistry[roleId + "_" + pageId] = component;
}

registerScreen("worker", "home", WorkerHomeScreen);
registerScreen("worker", "tasks", WorkerTasksScreen);
registerScreen("worker", "complaints", WorkerComplaintsScreen);
registerScreen("worker", "attendance", WorkerAttendanceScreen);
registerScreen("worker", "notifications", WorkerNotificationsScreen);
registerScreen("worker", "profile", WorkerProfileScreen);

registerScreen("employee", "home", EmployeeHomeScreen);
registerScreen("employee", "tasks", EmployeeTasksScreen);
registerScreen("employee", "complaints", EmployeeComplaintsScreen);
registerScreen("employee", "attendance", EmployeeAttendanceScreen);
registerScreen("employee", "notifications", EmployeeNotificationsScreen);
registerScreen("employee", "profile", EmployeeProfileScreen);

registerScreen("am", "home", AmHomeScreen);
registerScreen("am", "tasks", AmTasksScreen);
registerScreen("am", "complaints", AmComplaintsScreen);
registerScreen("am", "branch", AmBranchScreen);
registerScreen("am", "attendance", AmAttendanceScreen);
registerScreen("am", "notifications", AmNotificationsScreen);
registerScreen("am", "profile", AmProfileScreen);

registerScreen("branchManager", "home", BranchManagerHomeScreen);
registerScreen("branchManager", "branches", BranchManagerBranchesScreen);
registerScreen("branchManager", "monitoring", BranchManagerMonitoringScreen);
registerScreen("branchManager", "issues", BranchManagerIssuesScreen);
registerScreen("branchManager", "approvals", BranchManagerApprovalsScreen);
registerScreen("branchManager", "visits", BranchManagerVisitsScreen);
registerScreen("branchManager", "notifications", BranchManagerNotificationsScreen);
registerScreen("branchManager", "profile", BranchManagerProfileScreen);

registerScreen("rm", "dashboard", RmDashboardScreen);
registerScreen("rm", "intelligence", RmIntelligenceScreen);
registerScreen("rm", "alerts", RmAlertsScreen);
registerScreen("rm", "finance", RmFinanceScreen);
registerScreen("rm", "analytics", RmAnalyticsScreen);
registerScreen("rm", "approvals", RmApprovalsScreen);
registerScreen("rm", "users", RmUsersScreen);
registerScreen("rm", "settings", RmSettingsScreen);
registerScreen("rm", "notifications", RmNotificationsScreen);
registerScreen("rm", "profile", RmProfileScreen);

function getScreen(roleId: string, pageId: string): React.ComponentType {
  return screenRegistry[roleId + "_" + pageId] || PlaceholderScreen;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Home, ListChecks, Wrench, MapPin, Bell, IdCard,
  BarChart3, AlertCircle, Building, LineChart, Stamp,
  Route, Satellite, TriangleAlert, Wallet, ChartColumn,
  Users, Sliders, Circle,
};

function TabIcon({ pageId, focused, color }: { pageId: string; focused: boolean; color: string }) {
  const iconName = pageIcon(pageId);
  const Icon = iconMap[iconName] || Circle;
  return (
    <View style={{
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      backgroundColor: focused ? colors.brandLight : "transparent",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Icon size={20} color={focused ? colors.brand : color} strokeWidth={focused ? 2 : 1.8} />
    </View>
  );
}

function MainTabs() {
  const { state, setPage } = useApp();
  const roleDef = ROLES[state.role];
  const pages = roleDef.pages;

  return (
    <Tab.Navigator
      key={state.role}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
        },
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600", marginTop: 2 },
        tabBarItemStyle: { paddingVertical: spacing.xs },
      }}
    >
      {pages.slice(0, 5).map((page) => (
        <Tab.Screen
          key={page.id}
          name={page.id}
          component={getScreen(state.role, page.id)}
          listeners={{ tabPress: () => setPage(page.id) }}
          options={{
            tabBarLabel: page.label,
            tabBarIcon: ({ focused, color }) => <TabIcon pageId={page.id} focused={focused} color={color} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [detailModal, setDetailModal] = useState<{ entityType: string; entityId: number } | null>(null);
  const { setPage, dispatch } = useApp();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1 }}>
        <TopBar
          onRolePress={() => setRoleModalVisible(true)}
          onSearchPress={() => setSearchModalVisible(true)}
          onNotificationPress={() => setPage("notifications")}
          onProfilePress={() => setPage("profile")}
        />
        <MainTabs />
        <Toast />
        <RoleSwitcherModal visible={roleModalVisible} onClose={() => setRoleModalVisible(false)} />
        <SearchModal
          visible={searchModalVisible}
          onClose={() => setSearchModalVisible(false)}
          onSelectResult={(entityType, entityId) => setDetailModal({ entityType, entityId })}
        />
        {detailModal ? (
          <DetailModal
            visible={!!detailModal}
            onClose={() => setDetailModal(null)}
            entityType={detailModal.entityType}
            entityId={detailModal.entityId}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}
