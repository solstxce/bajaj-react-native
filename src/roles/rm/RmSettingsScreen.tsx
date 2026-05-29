import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Sliders, Bell, MapPin, Clock, Shield, Globe, Database, RefreshCw, ChevronRight } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { Card } from "../../shared/components/Card";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function RmSettingsScreen() {
  const { showToast } = useApp();

  const sections = [
    {
      title: "Alert Configuration",
      icon: Bell,
      iconColor: colors.brand,
      items: [
        { label: "Critical alert rule", value: "2 misses in 3 days" },
        { label: "Deadline rule", value: "Auto escalate until RM if proof is missing" },
        { label: "Escalation timeout", value: "45 min worker / 120 min employee" },
      ],
    },
    {
      title: "Geo-fence Settings",
      icon: MapPin,
      iconColor: colors.brandSecondary,
      items: [
        { label: "Default geo-radius", value: "180 meters" },
        { label: "Location proof required", value: "Enabled for all attendance" },
        { label: "Selfie verification", value: "Enabled" },
      ],
    },
    {
      title: "Shift & Scheduling",
      icon: Clock,
      iconColor: colors.warning,
      items: [
        { label: "Worker shift window", value: "07:00 - 15:00" },
        { label: "Employee shift window", value: "09:00 - 18:00" },
        { label: "Weekend schedule", value: "Alternate Saturdays off" },
      ],
    },
    {
      title: "Regional Policies",
      icon: Shield,
      iconColor: colors.success,
      items: [
        { label: "Budget approval limit", value: "25,000 for BM, 50,000 for RM" },
        { label: "Proof policy", value: "Geo + photo for all checklists" },
        { label: "Audit frequency", value: "Quarterly internal audit" },
      ],
    },
    {
      title: "Data & Sync",
      icon: Database,
      iconColor: colors.slate600,
      items: [
        { label: "Auto sync interval", value: "Every 5 minutes" },
        { label: "Offline mode", value: "Enabled" },
        { label: "Data retention", value: "90 days" },
      ],
    },
  ];

  return (
    <ScreenWrapper>
      <SectionHeader title="Settings" />

      <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
        {sections.map((section, idx) => (
          <Card variant="glass" key={idx}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
              <View style={{ width: 36, height: 36, borderRadius: borderRadius.md, backgroundColor: section.iconColor + "15", alignItems: "center", justifyContent: "center" }}>
                <section.icon size={18} color={section.iconColor} strokeWidth={2} />
              </View>
              <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, flex: 1 }}>{section.title}</Text>
            </View>
            <View style={{ gap: spacing.sm }}>
              {section.items.map((item, i) => (
                <TouchableOpacity key={i} onPress={() => showToast(item.label + " settings")} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>{item.label}</Text>
                    <Text numberOfLines={1} style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>{item.value}</Text>
                  </View>
                  <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center" }}>
                    <ChevronRight size={14} color={colors.white} strokeWidth={2} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        ))}
      </View>
    </ScreenWrapper>
  );
}
