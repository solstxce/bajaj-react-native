import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../constants/theme";

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: "48%", backgroundColor: "#fff", borderWidth: 1, borderColor: theme.line, borderRadius: 14, padding: 10 },
  value: { fontSize: 20, fontWeight: "900", color: theme.ink },
  label: { marginTop: 2, fontSize: 12, color: theme.muted },
});
