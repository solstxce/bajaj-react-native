import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Panel } from "../../../components/shared/Panel";
import { theme } from "../../../constants/theme";
import { Notice } from "../../../types/domain";

export function NotificationsSection({ notices, onToggle }: { notices: Notice[]; onToggle: (id: number) => void }) {
  return (
    <Panel title="Notifications">
      {notices.map((notice) => (
        <Pressable key={notice.id} onPress={() => onToggle(notice.id)} style={[styles.rowLine, !notice.read && styles.unread]}>
          <Text style={styles.strong}>{notice.type === "warning" ? "🚨" : "🔔"} {notice.title}</Text>
          <Text style={styles.subtle}>{notice.read ? "Read" : "Unread"}</Text>
        </Pressable>
      ))}
    </Panel>
  );
}

const styles = StyleSheet.create({
  rowLine: { borderWidth: 1, borderColor: theme.line, borderRadius: 10, padding: 10, flexDirection: "row", justifyContent: "space-between", gap: 8 },
  unread: { backgroundColor: "#fff7ed" },
  strong: { color: theme.ink, fontWeight: "700", fontSize: 13, flex: 1 },
  subtle: { color: theme.muted, fontSize: 12 },
});
