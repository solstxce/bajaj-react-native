import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../constants/theme";

export function AppHeader({ roleName, hierarchy }: { roleName: string; hierarchy: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.brand}>Ravi Kumar Operations Platform</Text>
      <Text style={styles.title}>{roleName}</Text>
      <Text style={styles.meta}>{hierarchy}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { margin: 12, borderRadius: 18, padding: 14, backgroundColor: "rgba(255,255,255,0.9)", borderWidth: 1, borderColor: theme.line },
  brand: { color: theme.brand, fontWeight: "800", fontSize: 12 },
  title: { color: theme.ink, fontWeight: "900", fontSize: 20, marginTop: 3 },
  meta: { color: theme.muted, fontSize: 12, marginTop: 3 },
});
