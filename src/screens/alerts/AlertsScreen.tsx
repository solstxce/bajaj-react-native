import React, { useRef, useState, useMemo } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Notice, NoticePriority } from "../../types/domain";

type TabId = "all" | "unread" | "bookmarked" | "critical";

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "bookmarked", label: "Bookmarked" },
  { id: "critical", label: "Critical" },
];

const PRIORITY_LABEL: Record<NoticePriority, string> = { high: "High", medium: "Medium", low: "Low" };
const PRIORITY_COLOR: Record<NoticePriority, string> = { high: "#EF4444", medium: "#F59E0B", low: "#3B82F6" };
const PRIORITY_BG: Record<NoticePriority, string> = { high: "rgba(239,68,68,0.1)", medium: "rgba(245,158,11,0.1)", low: "rgba(59,130,246,0.1)" };

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

function typeIcon(type: Notice["type"]): string {
  switch (type) {
    case "critical": return "🔴";
    case "warning": return "⚠️";
    case "task": return "📋";
    case "escalation": return "🚨";
    default: return "🔔";
  }
}

type Props = {
  notifications: Notice[];
  onToggle: (id: number) => void;
  onBookmark: (id: number) => void;
};

export function AlertsScreen({ notifications, onToggle, onBookmark }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const tabSlide = useRef(new Animated.Value(0)).current;

  const filtered = useMemo(() => {
    const sorted = [...notifications].sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    switch (activeTab) {
      case "unread": return sorted.filter((n) => !n.read);
      case "bookmarked": return sorted.filter((n) => n.bookmarked);
      case "critical": return sorted.filter((n) => n.priority === "high");
      default: return sorted;
    }
  }, [notifications, activeTab]);

  const unreadList = useMemo(() => filtered.filter((n) => !n.read), [filtered]);
  const readList = useMemo(() => filtered.filter((n) => n.read), [filtered]);

  const switchTab = (tab: TabId) => {
    const idx = TABS.findIndex((t) => t.id === tab);
    Animated.timing(tabSlide, { toValue: idx * 88, duration: 250, useNativeDriver: true }).start();
    setActiveTab(tab);
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerSection}>
        <Text style={styles.screenTitle}>Notification Center</Text>
      </View>

      <View style={styles.tabsRow}>
        <View style={styles.tabsBg}>
          <Animated.View style={[styles.tabIndicator, { transform: [{ translateX: tabSlide }] }]} />
          {TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <Pressable key={tab.id} onPress={() => switchTab(tab.id)} style={styles.tabItem}>
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {unreadList.length > 0 && (
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Unread Messages</Text>
          <View style={styles.sectionDivider} />
          {unreadList.map((n) => (
            <NotificationCard key={n.id} notice={n} onToggle={onToggle} onBookmark={onBookmark} />
          ))}
        </View>
      )}

      {readList.length > 0 && (
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Read Messages</Text>
          <View style={styles.sectionDivider} />
          {readList.map((n) => (
            <NotificationCard key={n.id} notice={n} onToggle={onToggle} onBookmark={onBookmark} />
          ))}
        </View>
      )}

      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyText}>No notifications in this view</Text>
        </View>
      )}
    </ScrollView>
  );
}

function NotificationCard({ notice, onToggle, onBookmark }: { notice: Notice; onToggle: (id: number) => void; onBookmark: (id: number) => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, { toValue: 0.98, duration: 120, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.cardWrap, { transform: [{ scale: scaleAnim }] }, !notice.read && styles.cardUnread]}>
      <View style={styles.cardGlassEdge} />
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardTypeIcon}>{typeIcon(notice.type)}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_BG[notice.priority] }]}>
            <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLOR[notice.priority] }]} />
            <Text style={[styles.priorityText, { color: PRIORITY_COLOR[notice.priority] }]}>{PRIORITY_LABEL[notice.priority]}</Text>
          </View>
          {!notice.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.timestamp}>{formatTime(notice.timestamp)}</Text>
      </View>

      <Text style={styles.cardTitle}>{notice.title}</Text>
      <Text style={styles.cardDesc}>{notice.description}</Text>

      <View style={styles.cardActions}>
        <Pressable onPress={() => onToggle(notice.id)} style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}>
          <Text style={styles.actionText}>{notice.read ? "Unread" : "Mark Read"}</Text>
        </Pressable>
        <Pressable onPress={() => onBookmark(notice.id)} style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}>
          <Text style={styles.actionText}>{notice.bookmarked ? "★ Bookmarked" : "☆ Bookmark"}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 14, paddingBottom: 100, paddingTop: 4 },

  headerSection: {
    paddingHorizontal: 2,
    paddingTop: 6,
    paddingBottom: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  screenSub: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 18,
  },

  tabsRow: {
    paddingBottom: 16,
  },
  tabsBg: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 16,
    padding: 3,
    position: "relative",
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabIndicator: {
    position: "absolute",
    top: 3,
    left: 3,
    width: 82,
    height: 32,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#2563EB",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  tabLabelActive: {
    color: "#2563EB",
    fontWeight: "700",
  },

  sectionBlock: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    paddingHorizontal: 2,
    marginBottom: 8,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "rgba(37,99,235,0.1)",
    marginBottom: 10,
  },

  cardWrap: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardUnread: {
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(37,99,235,0.15)",
    shadowColor: "#2563EB",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardGlassEdge: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTypeIcon: { fontSize: 14 },

  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "700",
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#2563EB",
  },

  timestamp: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 17,
    marginBottom: 12,
  },

  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    shadowColor: "#0f172a",
    shadowOpacity: 0.03,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  actionBtnPressed: {
    backgroundColor: "rgba(37,99,235,0.08)",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },

  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyIcon: { fontSize: 40 },
  emptyText: {
    fontSize: 15,
    color: "#94A3B8",
    fontWeight: "600",
  },
});
