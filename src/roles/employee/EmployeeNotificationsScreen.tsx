import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function EmployeeNotificationsScreen() {
  const { state, setTab, scopedNotifications, toggleNotificationRead, toggleBookmark } = useApp();
  const filter = state.tabs.notifications;
  const list = scopedNotifications.filter((item) => {
    if (filter === "all") return true;
    if (filter === "unread") return !item.read;
    if (filter === "bookmarked") return item.bookmarked;
    return item.priority === "Critical";
  });

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Notification center"
        subtitle="All, unread, bookmarked and critical notification buckets with quick actions"
        action={
          <SegmentedControl
            tabs={[{ label: "All", value: "all" }, { label: "Unread", value: "unread" }, { label: "Bookmarked", value: "bookmarked" }, { label: "Critical", value: "critical" }]}
            activeKey={filter}
            onChange={(v) => setTab("notifications", v)}
          />
        }
      />

      <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
        {list.map((item) => (
          <Card variant="glass" key={item.id}>
            <View style={{ gap: spacing.xl }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" }}>
                  <Badge label={item.priority} type={item.priority} />
                  <Badge label={item.read ? "Read" : "Unread"} type={item.read ? "Completed" : "Pending"} />
                </View>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginTop: spacing.lg }}>{item.title}</Text>
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{item.detail}</Text>
                <Text style={{ fontSize: fontSize.xs, fontWeight: "600", letterSpacing: 0.3, color: colors.textSecondary, marginTop: spacing.lg, textTransform: "uppercase" }}>{item.time}</Text>
              </View>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <TouchableOpacity onPress={() => toggleNotificationRead(item.id)} style={{ backgroundColor: colors.brand, borderRadius: borderRadius.xl, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}>
                  <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.white }}>{item.read ? "Mark unread" : "Mark read"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleBookmark(item.id)} style={{ backgroundColor: colors.card, borderRadius: borderRadius.xl, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.text }}>{item.bookmarked ? "Remove bookmark" : "Bookmark"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </ScreenWrapper>
  );
}
