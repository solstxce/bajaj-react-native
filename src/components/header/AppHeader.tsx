import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Notice, RoleId } from "../../types/domain";
import { Notifications } from "./Notifications";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileDrawer } from "./ProfileDrawer";
import { SearchBar } from "./SearchBar";
import { SwitchRoles } from "./SwitchRoles";

type Props = {
  roleName: string;
  currentRole: RoleId;
  onSwitchRole: (role: RoleId) => void;
  onProfile: () => void;
  unreadCount: number;
  notifications: Notice[];
  onToggleNotification: (id: number) => void;
  onBookmarkNotification: (id: number) => void;
};

export function AppHeader({ roleName, currentRole, onSwitchRole, onProfile, unreadCount, notifications, onToggleNotification, onBookmarkNotification }: Props) {
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <>
      <View style={[styles.wrapper, { paddingTop: insets.top + 8 }]}>
        <LinearGradient colors={["#2563EB", "#06B6D4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <View style={styles.topRow}>
            <Pressable style={styles.thunderButton} onPress={() => setShowSwitcher(true)}>
              <Text style={styles.thunderIcon}>⚡</Text>
            </Pressable>

            <SearchBar />

            <View style={styles.rightGroup}>
              <Notifications unreadCount={unreadCount} notifications={notifications} onToggle={onToggleNotification} onBookmark={onBookmarkNotification} />
              <ProfileAvatar onPress={() => setShowDrawer(true)} />
            </View>
          </View>
        </LinearGradient>
      </View>

      <SwitchRoles visible={showSwitcher} currentRole={currentRole} onSelect={onSwitchRole} onClose={() => setShowSwitcher(false)} />
      <ProfileDrawer visible={showDrawer} roleName={roleName} currentRole={currentRole} onProfile={onProfile} onClose={() => setShowDrawer(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  header: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 6 },
  thunderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  thunderIcon: { fontSize: 20 },
  rightGroup: { flexDirection: "row", alignItems: "center", gap: 6 },
});
