import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, Animated } from "react-native";
import { X, History, Activity, FileText, CheckCircle, AlertTriangle, RefreshCw, Plus, Wrench, DollarSign, Calendar, UserPlus, Edit, Settings, Zap, XCircle } from "lucide-react-native";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius, shadows } from "../../theme/theme";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const iconMap: Record<string, any> = {
  Activity, FileText, CheckCircle, AlertTriangle, RefreshCw, Plus, Wrench,
  DollarSign, Calendar, UserPlus, Edit, Settings, Zap, XCircle, History,
};

const defaultEntries = [
  { time: "11:01", text: "System initialized with mock data snapshot.", icon: Activity, color: colors.info },
  { time: "10:18", text: "Expense request 402 routed to manager queue.", icon: FileText, color: colors.brandSecondary },
  { time: "09:36", text: "Complaint 201 updated with probable low gas diagnosis.", icon: CheckCircle, color: colors.success },
  { time: "08:05", text: "Critical safety complaint 205 created from patrol proof.", icon: AlertTriangle, color: colors.error },
  { time: "07:30", text: "Branch health score recalculated for 3 branches.", icon: Activity, color: colors.info },
  { time: "06:45", text: "Daily attendance snapshot generated.", icon: History, color: colors.textSecondary },
];

export function AuditTrailModal({ visible, onClose }: Props) {
  const { auditLog } = useApp();
  const translateY = useRef(new Animated.Value(18)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
      ]).start();
    } else {
      translateY.setValue(18);
      opacity.setValue(0);
    }
  }, [visible]);

  const allEntries = [
    ...auditLog.map((entry) => ({
      time: entry.time,
      text: entry.text,
      icon: iconMap[entry.icon] || Activity,
      color: entry.color,
    })),
    ...defaultEntries,
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} onPress={onClose} style={{ flex: 1, backgroundColor: "rgba(15,23,42,0.5)", justifyContent: "center", alignItems: "center", padding: spacing.xl }}>
        <Animated.View style={{ backgroundColor: colors.card, borderRadius: borderRadius["6xl"], width: "100%", maxWidth: 420, maxHeight: "85%", opacity, transform: [{ translateY }], borderWidth: 1, borderColor: "rgba(255,255,255,0.6)", ...shadows.modal }}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.xl, paddingTop: spacing.xl }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>Audit trail</Text>
                <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>
                  {auditLog.length > 0 ? `${auditLog.length} actions tracked in this session` : "Recent system actions, approvals and proof-based movements"}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={{ padding: spacing.sm, borderRadius: borderRadius.md, backgroundColor: colors.slate50 }}>
                <X size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }} contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}>
              {allEntries.length > 0 ? allEntries.map((entry, i) => (
                <View key={i} style={{ flexDirection: "row", gap: spacing.lg, backgroundColor: colors.slate50, borderRadius: borderRadius.xl, padding: spacing.xl }}>
                  <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: entry.color + "15", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                    <entry.icon size={16} color={entry.color} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.text }}>{entry.time}</Text>
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{entry.text}</Text>
                  </View>
                </View>
              )) : (
                <View style={{ alignItems: "center", padding: spacing["4xl"] }}>
                  <History size={32} color={colors.textSecondary} strokeWidth={1.5} />
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.lg }}>No audit entries yet</Text>
                </View>
              )}
            </ScrollView>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
