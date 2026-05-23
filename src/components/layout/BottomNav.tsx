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
  bottomNav: { position: "absolute", bottom: 0, left: 0, right: 0, borderTopWidth: 1, borderTopColor: theme.line, backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 8 },
  navRow: { gap: 8 },
  item: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: theme.line, backgroundColor: "#fff" },
  itemActive: { backgroundColor: theme.navy, borderColor: theme.navy },
  text: { color: theme.ink, fontSize: 12, fontWeight: "700" },
  textActive: { color: "#fff" },
});
