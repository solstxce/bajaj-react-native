import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RoleId } from "../../types/domain";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;

type Props = {
  visible: boolean;
  roleName: string;
  currentRole: RoleId;
  onProfile: () => void;
  onClose: () => void;
};

export function ProfileDrawer({ visible, roleName, currentRole, onProfile, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(DRAWER_WIDTH);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: DRAWER_WIDTH, duration: 250, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={closeDrawer}>
      <Pressable style={styles.backdrop} onPress={closeDrawer}>
        <Animated.View style={[styles.backdropFill, { opacity: fadeAnim }]} />
      </Pressable>
      <Animated.View style={[styles.drawerWrap, { transform: [{ translateX: slideAnim }] }]}>
        <BlurView intensity={85} tint="light" style={styles.drawer}>
          <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
            <Pressable style={styles.closeBtn} onPress={closeDrawer}>
              <Text style={styles.closeIcon}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <Text style={styles.name}>{loggedIn ? "User Name" : "Guest"}</Text>
            <Text style={styles.role}>{loggedIn ? roleName : "Not signed in"}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.authSection}>
            {loggedIn ? (
              <Pressable style={styles.logoutBtn} onPress={() => setLoggedIn(false)}>
                <Text style={styles.logoutBtnText}>Logout</Text>
              </Pressable>
            ) : (
              <View style={styles.authRow}>
                <Pressable style={styles.loginBtn} onPress={() => setLoggedIn(true)}>
                  <Text style={styles.loginBtnText}>Login</Text>
                </Pressable>
                <Pressable style={styles.signupBtn} onPress={() => setLoggedIn(true)}>
                  <Text style={styles.signupBtnText}>Sign Up</Text>
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.navSection}>
            <Pressable onPress={() => { closeDrawer(); onProfile(); }} style={({ pressed }) => [styles.navCard, pressed && styles.navCardPressed]}>
              <View style={styles.navIconWrap}>
                <Text style={styles.navIcon}>👤</Text>
              </View>
              <View style={styles.navTextWrap}>
                <Text style={styles.navLabel}>View Profile</Text>
                <Text style={styles.navSub}>Personal information</Text>
              </View>
            </Pressable>
            <Pressable onPress={closeDrawer} style={({ pressed }) => [styles.navCard, pressed && styles.navCardPressed]}>
              <View style={styles.navIconWrap}>
                <Text style={styles.navIcon}>✏️</Text>
              </View>
              <View style={styles.navTextWrap}>
                <Text style={styles.navLabel}>Edit Profile</Text>
                <Text style={styles.navSub}>Update your details</Text>
              </View>
            </Pressable>
            <Pressable onPress={closeDrawer} style={({ pressed }) => [styles.navCard, pressed && styles.navCardPressed]}>
              <View style={styles.navIconWrap}>
                <Text style={styles.navIcon}>⚙️</Text>
              </View>
              <View style={styles.navTextWrap}>
                <Text style={styles.navLabel}>Settings</Text>
                <Text style={styles.navSub}>Preferences & controls</Text>
              </View>
            </Pressable>
            <Pressable onPress={closeDrawer} style={({ pressed }) => [styles.navCard, pressed && styles.navCardPressed]}>
              <View style={styles.navIconWrap}>
                <Text style={styles.navIcon}>❓</Text>
              </View>
              <View style={styles.navTextWrap}>
                <Text style={styles.navLabel}>Help & Support</Text>
                <Text style={styles.navSub}>FAQs and contact</Text>
              </View>
            </Pressable>
          </View>
        </BlurView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  backdropFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15,23,42,0.9)",
  },
  drawerWrap: {
    position: "absolute",
    top: 0,
    right: 0,
    width: DRAWER_WIDTH,
    height: "100%",
    shadowColor: "#0f172a",
    shadowOpacity: 0.12,
    shadowRadius: 32,
    shadowOffset: { width: -6, height: 0 },
    elevation: 24,
  },
  drawer: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.4)",
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    alignItems: "flex-end",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(15,23,42,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(241,245,249,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 32 },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 14,
  },
  role: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(15,23,42,0.06)",
    marginHorizontal: 20,
  },
  authSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  authRow: {
    gap: 10,
  },
  loginBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  loginBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  signupBtn: {
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  signupBtnText: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 15,
  },
  logoutBtn: {
    backgroundColor: "rgba(239,68,68,0.1)",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.15)",
  },
  logoutBtnText: {
    color: "#EF4444",
    fontWeight: "800",
    fontSize: 15,
  },
  navSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 10,
  },
  navCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  navCardPressed: {
    backgroundColor: "rgba(255,255,255,0.75)",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  navIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: { fontSize: 20 },
  navTextWrap: {
    flex: 1,
  },
  navLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  navSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
});
