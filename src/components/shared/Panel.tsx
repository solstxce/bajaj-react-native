import React, { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../constants/theme";

export function Panel({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { backgroundColor: theme.panel, borderWidth: 1, borderColor: theme.line, borderRadius: 16, padding: 12, gap: 8 },
  title: { color: theme.ink, fontSize: 16, fontWeight: "900" },
});
