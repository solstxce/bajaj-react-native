import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export function ProfileAvatar({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.iconButton} onPress={onPress}>
      <Text style={styles.icon}>👤</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 18 },
});
