import React, { useState, useEffect, useRef } from "react";
import { View, SafeAreaView, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Home, ListChecks, Wrench, MapPin, Bell, IdCard, BarChart3, AlertCircle, Building, LineChart, Stamp, Route, Satellite, TriangleAlert, Wallet, ChartColumn, Users, Sliders, Circle } from "lucide-react-native";
import { useApp } from "../context/AppContext";
import { ROLES } from "../data/mockData";
import { colors, fontSize, spacing, borderRadius, shadows } from "../theme/theme";
import { pageIcon } from "../theme/styleMaps";
import { TopBar } from "../shared/layout/TopBar";
import { Toast } from "../shared/components/Toast";
import { RoleSwitcherModal } from "../modals/forms/RoleSwitcherModal";
import { FormModal } from "../modals/forms/FormModal";
import { AuditTrailModal } from "../modals/forms/AuditTrailModal";
import { DetailModal } from "../modals/detail/DetailModal";
import { SearchModal } from "../modals/forms/SearchModal";
import { PlaceholderScreen } from "./PlaceholderScreen";

import { LcHomeScreen } from "../roles/lc/LcHomeScreen";
import { LcTasksScreen } from "../roles/lc/LcTasksScreen";
import { LcComplaintsScreen } from "../roles/lc/LcComplaintsScreen";
import { LcBranchScreen } from "../roles/lc/LcBranchScreen";
import { LcAttendanceScreen } from "../roles/lc/LcAttendanceScreen";
import { LcNotificationsScreen } from "../roles/lc/LcNotificationsScreen";
import { LcProfileScreen } from "../roles/lc/LcProfileScreen";

import { BranchManagerHomeScreen } from "../roles/branchManager/BranchManagerHomeScreen";
import { BranchManagerBranchesScreen } from "../roles/branchManager/BranchManagerBranchesScreen";
import { BranchManagerMonitoringScreen } from "../roles/branchManager/BranchManagerMonitoringScreen";
import { BranchManagerIssuesScreen } from "../roles/branchManager/BranchManagerIssuesScreen";
import { BranchManagerApprovalsScreen } from "../roles/branchManager/BranchManagerApprovalsScreen";
import { BranchManagerVisitsScreen } from "../roles/branchManager/BranchManagerVisitsScreen";
import { BranchManagerNotificationsScreen } from "../roles/branchManager/BranchManagerNotificationsScreen";
import { BranchManagerProfileScreen } from "../roles/branchManager/BranchManagerProfileScreen";
import { BranchManagerAttendanceScreen } from "../roles/branchManager/BranchManagerAttendanceScreen";

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
import { RmAttendanceScreen } from "../roles/rm/RmAttendanceScreen";

const Tab = createBottomTabNavigator();

const screenRegistry: Record<string, React.ComponentType> = {};

export function registerScreen(roleId: string, pageId: string, component: React.ComponentType) {
  screenRegistry[roleId + "_" + pageId] = component;
}

registerScreen("lc", "home", LcHomeScreen);
registerScreen("lc", "tasks", LcTasksScreen);
registerScreen("lc", "complaints", LcComplaintsScreen);
registerScreen("lc", "branch", LcBranchScreen);
registerScreen("lc", "attendance", LcAttendanceScreen);
registerScreen("lc", "notifications", LcNotificationsScreen);
registerScreen("lc", "profile", LcProfileScreen);

registerScreen("branchManager", "home", BranchManagerHomeScreen);
registerScreen("branchManager", "branches", BranchManagerBranchesScreen);
registerScreen("branchManager", "monitoring", BranchManagerMonitoringScreen);
registerScreen("branchManager", "issues", BranchManagerIssuesScreen);
registerScreen("branchManager", "approvals", BranchManagerApprovalsScreen);
registerScreen("branchManager", "visits", BranchManagerVisitsScreen);
registerScreen("branchManager", "attendance", BranchManagerAttendanceScreen);
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
registerScreen("rm", "attendance", RmAttendanceScreen);
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
      width: 44,
      height: 32,
      borderRadius: 12,
      backgroundColor: focused ? colors.brandLight : "transparent",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Icon size={22} color={focused ? colors.brand : color} strokeWidth={focused ? 2.4 : 1.8} />
    </View>
  );
}

function NavigationSync() {
  const { state } = useApp();
  const navigation = useNavigation();
  const prevPageRef = useRef(state.page);

  useEffect(() => {
    const prevPage = prevPageRef.current;
    prevPageRef.current = state.page;
    if (prevPage !== state.page) {
      (navigation as any).navigate(state.page);
    }
  }, [state.page, navigation]);

  return null;
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
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.white,
          borderTopColor: colors.slate200,
          borderTopWidth: 1,
          height: 84,
          paddingTop: 12,
          paddingBottom: 24,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
        },
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { 
          fontSize: 9, 
          fontWeight: "700", 
          marginTop: 4,
          textTransform: "uppercase",
          letterSpacing: 0.6,
        },
        tabBarItemStyle: { 
          height: 60,
          marginHorizontal: 16,
          paddingHorizontal: 0,
        },
      }}
    >
      <Tab.Screen
        name="__tabSync"
        component={NavigationSync}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
      {pages.map((page, index) => (
        <Tab.Screen
          key={page.id}
          name={page.id}
          component={getScreen(state.role, page.id)}
          listeners={{ tabPress: () => setPage(page.id) }}
          options={{
            tabBarLabel: page.label,
            tabBarIcon: ({ focused, color }) => <TabIcon pageId={page.id} focused={focused} color={color} />,
            ...(index >= 5 ? { tabBarButton: () => null } : {}),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [detailModal, setDetailModal] = useState<{ entityType: string; entityId: number } | null>(null);
  const { state, setPage, dispatch } = useApp();

  useEffect(() => {
    const type = state.modalType;
    if (!type) return;
    if (type === "form") {
      setFormModalVisible(true);
      dispatch({ type: "CLOSE_MODAL" });
    } else if (type === "audit") {
      setAuditModalVisible(true);
      dispatch({ type: "CLOSE_MODAL" });
    } else if (["task", "complaint", "branch", "user", "appliance", "approval", "visit"].includes(type)) {
      setDetailModal({ entityType: type, entityId: state.modalData?.id });
    }
  }, [state.modalType, state.modalData]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1 }}>
        <TopBar
          onRolePress={() => setRoleModalVisible(true)}
          onSearchPress={() => setSearchModalVisible(true)}
          onFormPress={() => setFormModalVisible(true)}
          onNotificationPress={() => setPage("notifications")}
          onProfilePress={() => setPage("profile")}
        />
        <MainTabs />
        <Toast />
        <RoleSwitcherModal visible={roleModalVisible} onClose={() => setRoleModalVisible(false)} />
        <FormModal visible={formModalVisible} onClose={() => setFormModalVisible(false)} />
        <AuditTrailModal visible={auditModalVisible} onClose={() => setAuditModalVisible(false)} />
        <SearchModal
          visible={searchModalVisible}
          onClose={() => setSearchModalVisible(false)}
          onSelectResult={(entityType, entityId) => setDetailModal({ entityType, entityId })}
        />
        {detailModal ? (
          <DetailModal
            visible={!!detailModal}
            onClose={() => { setDetailModal(null); dispatch({ type: "CLOSE_MODAL" }); }}
            entityType={detailModal.entityType}
            entityId={detailModal.entityId}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}
