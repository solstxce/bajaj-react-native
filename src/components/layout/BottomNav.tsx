import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "../../constants/theme";
import { RolePage } from "../../types/domain";

export function BottomNav({ pages, activePage, onPage }: { pages: RolePage[]; activePage: string; onPage: (id: string) => void }) {
  return (
    <View style={styles.bottomNav}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navRow}>
        {pages.map((p) => {
          const active = p.id === activePage;
          return (
            <Pressable key={p.id} onPress={() => onPage(p.id)} style={[styles.item, active && styles.itemActive]}>
              <Text style={[styles.text, active && styles.textActive]}>{p.emoji} {p.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.card,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: theme.line,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 6,
  },
  navRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: theme.bg,
  },
  itemActive: {
    backgroundColor: theme.primary,
  },
  text: {
    color: theme.secondary,
    fontSize: 12,
    fontWeight: "700",
  },
  textActive: {
    color: "#fff",
  },
});
