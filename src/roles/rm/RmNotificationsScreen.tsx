import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Bell, Eye, EyeOff, Bookmark, BookmarkCheck, Building, TriangleAlert } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function RmNotificationsScreen() {
  const { state, setTab, scopedNotifications, toggleNotificationRead, toggleBookmark } = useApp();
  const filter = state.tabs.notifications || "all";

  const list = scopedNotifications.filter((item) => {
    if (filter === "all") return true;
    if (filter === "unread") return !item.read;
    if (filter === "bookmarked") return item.bookmarked;
    return item.priority === "Critical";
  });

  return (
    <ScreenWrapper>
      <SectionHeader
        title="Notification Center"
        action={
          <SegmentedControl tabs={[{ label: "All", value: "all" }, { label: "Unread", value: "unread" }, { label: "Bookmarked", value: "bookmarked" }, { label: "Critical", value: "critical" }]} activeKey={filter} onChange={(v) => setTab("notifications", v)} />
        }
      />

      <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
        {list.map((item) => (
          <Card variant="glass" key={item.id}>
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: spacing.lg }}>
              <View style={{ width: 40, height: 40, borderRadius: borderRadius.lg, backgroundColor: item.priority === "Critical" ? colors.rose50 : item.priority === "High" ? colors.amber50 : colors.sky50, alignItems: "center", justifyContent: "center" }}>
                {item.priority === "Critical" ? <TriangleAlert size={18} color={colors.error} strokeWidth={2} /> : item.priority === "High" ? <Bell size={18} color={colors.warning} strokeWidth={2} /> : <Bell size={18} color={colors.info} strokeWidth={2} />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" }}>
                  <Badge label={item.priority} type={item.priority} />
                  {item.bookmarked && <BookmarkCheck size={14} color={colors.warning} strokeWidth={2} />}
                </View>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginTop: spacing.md }}>{item.title}</Text>
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{item.detail}</Text>
                <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.lg }}>{item.time}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg }}>
              <TouchableOpacity onPress={() => toggleNotificationRead(item.id)} style={{ backgroundColor: colors.brand, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                {item.read ? <EyeOff size={14} color={colors.white} strokeWidth={2} /> : <Eye size={14} color={colors.white} strokeWidth={2} />}
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>{item.read ? "Mark unread" : "Mark read"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleBookmark(item.id)} style={{ backgroundColor: item.bookmarked ? colors.amber50 : colors.slate100, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                {item.bookmarked ? <BookmarkCheck size={14} color={colors.warning} strokeWidth={2} /> : <Bookmark size={14} color={colors.textSecondary} strokeWidth={2} />}
                <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: item.bookmarked ? colors.amber700 : colors.textSecondary }}>{item.bookmarked ? "Bookmarked" : "Bookmark"}</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </View>
    </ScreenWrapper>
  );
}
