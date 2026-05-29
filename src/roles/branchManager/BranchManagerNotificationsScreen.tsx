import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Bell, Eye, EyeOff, Bookmark, BookmarkCheck } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function BranchManagerNotificationsScreen() {
  const { state, setTab, scopedNotifications, toggleNotificationRead, toggleBookmark } = useApp();
  const activeTab = state.tabs.notifications;

  const filtered = scopedNotifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "bookmarked") return n.bookmarked;
    if (activeTab === "critical") return n.priority === "Critical";
    return true;
  });

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Notification Center"
        action={
          <SegmentedControl
            tabs={[
              { label: "All", value: "all" },
              { label: "Unread", value: "unread" },
              { label: "Bookmarked", value: "bookmarked" },
              { label: "Critical", value: "critical" },
            ]}
            activeKey={activeTab}
            onChange={(v) => setTab("notifications", v)}
          />
        }
      />

      <View style={{ marginTop: spacing.xl }}>
        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
              <Bell size={16} color={colors.brand} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>
              {activeTab === "all" ? "All Notifications" : activeTab === "unread" ? "Unread" : activeTab === "bookmarked" ? "Bookmarked" : "Critical Alerts"}
            </Text>
          </View>
          <View style={{ gap: spacing.md }}>
            {filtered.length > 0 ? filtered.map((n) => (
              <View
                key={n.id}
                style={{
                  backgroundColor: n.read ? colors.card : colors.brandLight,
                  borderRadius: borderRadius.xl,
                  padding: spacing.xl,
                  borderWidth: 1,
                  borderColor: n.read ? colors.border : colors.brandSecondary + "30",
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" }}>
                      <Badge label={n.priority} type={n.priority} />
                      {n.bookmarked ? <Bookmark size={14} color={colors.warning} strokeWidth={2} /> : null}
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: spacing.md, marginTop: spacing.lg }}>
                      <View style={{ width: 28, height: 28, borderRadius: borderRadius.md, backgroundColor: n.priority === "Critical" ? colors.error + "15" : colors.brand + "15", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                        <Bell size={14} color={n.priority === "Critical" ? colors.error : colors.brand} strokeWidth={2} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>{n.title}</Text>
                        <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{n.detail}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.sm }}>{n.time}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg }}>
                  <TouchableOpacity onPress={() => toggleNotificationRead(n.id)} style={{ backgroundColor: colors.slate100, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    {n.read ? <EyeOff size={14} color={colors.textSecondary} strokeWidth={2} /> : <Eye size={14} color={colors.textSecondary} strokeWidth={2} />}
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.textSecondary }}>{n.read ? "Mark unread" : "Mark read"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleBookmark(n.id)} style={{ backgroundColor: n.bookmarked ? colors.amber50 : colors.slate100, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    {n.bookmarked ? <BookmarkCheck size={14} color={colors.warning} strokeWidth={2} /> : <Bookmark size={14} color={colors.textSecondary} strokeWidth={2} />}
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: n.bookmarked ? colors.amber700 : colors.textSecondary }}>{n.bookmarked ? "Bookmarked" : "Bookmark"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )) : (
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", padding: spacing["4xl"] }}>No notifications to show</Text>
            )}
          </View>
        </Card>
      </View>
    </ScreenWrapper>
  );
}
