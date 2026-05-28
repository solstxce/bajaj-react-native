import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { colors } from "../../theme/colors";
import { Notice } from "../../types/domain";

const { height: screenHeight } = Dimensions.get("window");
const MODAL_MAX_HEIGHT = Math.min(screenHeight * 0.8, 480);

function formatTime(ts: string): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

type Props = {
  unreadCount: number;
  notifications: Notice[];
  onToggle: (id: number) => void;
  onBookmark: (id: number) => void;
};

export function Notifications({ unreadCount, notifications, onToggle, onBookmark }: Props) {
  const [visible, setVisible] = React.useState(false);
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.9);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const display = notifications
    .filter((n) => !n.read)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <>
      <Pressable style={styles.bellButton} onPress={() => setVisible(true)}>
        <Text style={styles.bellIcon}>🔔</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </Pressable>

      <Modal visible={visible} transparent animationType="none" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <Animated.View style={[styles.modalWrap, { opacity: fadeAnim, transform: [{ scale: scaleAnim }], maxHeight: MODAL_MAX_HEIGHT }]}>
            <BlurView intensity={85} tint="light" style={styles.modal}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.title}>Notifications</Text>
                  <Text style={styles.subtitle}>{unreadCount} unread</Text>
                </View>
                <Pressable style={styles.closeBtn} onPress={() => setVisible(false)}>
                  <Text style={styles.closeIcon}>✕</Text>
                </Pressable>
              </View>

              <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                {display.length === 0 && (
                  <View style={styles.emptyRow}>
                    <Text style={styles.emptyIcon}>🔔</Text>
                    <Text style={styles.emptyText}>No new notifications</Text>
                  </View>
                )}
                {display.map((n) => (
                  <View key={n.id} style={styles.notifCard}>
                    <View style={styles.notifHeader}>
                      <View style={[styles.priorityDotSm, { backgroundColor: n.priority === "high" ? "#EF4444" : n.priority === "medium" ? "#F59E0B" : "#3B82F6" }]} />
                      <Text style={styles.notifTitle}>{n.title}</Text>
                      <Text style={styles.notifTime}>{formatTime(n.timestamp)}</Text>
                    </View>
                    <Text style={styles.notifDesc}>{n.description}</Text>
                    <View style={styles.notifActions}>
                      <Pressable onPress={() => onToggle(n.id)} style={({ pressed }) => [styles.actionChip, pressed && styles.actionChipPressed]}>
                        <Text style={styles.actionChipText}>Mark Read</Text>
                      </Pressable>
                      <Pressable onPress={() => onBookmark(n.id)} style={({ pressed }) => [styles.actionChip, pressed && styles.actionChipPressed]}>
                        <Text style={styles.actionChipText}>{n.bookmarked ? "★ Bookmarked" : "☆ Bookmark"}</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </BlurView>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bellIcon: { fontSize: 18 },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.critical,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "900" },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modalWrap: {
    width: "100%",
    maxWidth: 420,
    shadowColor: "#0f172a",
    shadowOpacity: 0.15,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 8 },
    elevation: 28,
    borderRadius: 24,
    overflow: "hidden",
  },
  modal: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    maxHeight: MODAL_MAX_HEIGHT,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(15,23,42,0.06)",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(15,23,42,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.secondary,
    marginTop: 2,
  },
  list: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 16,
  },
  notifCard: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  notifHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  priorityDotSm: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  notifTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  notifTime: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
  notifDesc: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 17,
    marginBottom: 10,
  },
  notifActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(241,245,249,0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  actionChipPressed: {
    backgroundColor: "rgba(37,99,235,0.08)",
  },
  actionChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  emptyRow: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 10,
  },
  emptyIcon: { fontSize: 32 },
  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
