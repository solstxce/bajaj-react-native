import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Animated } from "react-native";
import { X, Save, User, Phone, Mail, Clock, Shield, Smartphone } from "lucide-react-native";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius, shadows } from "../../theme/theme";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function EditProfileModal({ visible, onClose }: Props) {
  const { currentUser, editUser, showToast } = useApp();
  const translateY = useRef(new Animated.Value(18)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [shift, setShift] = useState(currentUser.shift);
  const [emergencyContact, setEmergencyContact] = useState(currentUser.emergencyContact);
  const [skills, setSkills] = useState(currentUser.skills.join(", "));

  useEffect(() => {
    if (visible) {
      setPhone(currentUser.phone);
      setEmail(currentUser.email);
      setShift(currentUser.shift);
      setEmergencyContact(currentUser.emergencyContact);
      setSkills(currentUser.skills.join(", "));
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
      ]).start();
    } else {
      translateY.setValue(18);
      opacity.setValue(0);
    }
  }, [visible]);

  const handleSave = () => {
    if (!phone.trim() || !email.trim()) {
      showToast("Phone and email are required");
      return;
    }
    editUser(currentUser.id, {
      phone: phone.trim(),
      email: email.trim(),
      shift: shift.trim(),
      emergencyContact: emergencyContact.trim(),
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
    });
    onClose();
  };

  const inputField = (label: string, icon: any, value: string, setter: (v: string) => void, placeholder: string) => (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs }}>
        <icon size={12} color={colors.textSecondary} strokeWidth={2} />
        <Text style={{ fontSize: fontSize.xs, fontWeight: "400", color: colors.textSecondary }}>{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={setter}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        style={{ borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, fontSize: fontSize.sm, color: colors.text }}
      />
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} onPress={onClose} style={{ flex: 1, backgroundColor: "rgba(15,23,42,0.5)", justifyContent: "center", alignItems: "center", padding: spacing.xl }}>
        <Animated.View style={{ backgroundColor: colors.card, borderRadius: borderRadius["6xl"], width: "100%", maxWidth: 420, maxHeight: "85%", opacity, transform: [{ translateY }], ...shadows.modal }}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.xl, paddingTop: spacing.xl }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>Edit profile</Text>
                <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs }}>Update your contact information and preferences</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={{ padding: spacing.sm, borderRadius: borderRadius.md, backgroundColor: colors.slate50 }}>
                <X size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }} contentContainerStyle={{ padding: spacing.xl, gap: spacing.xl }}>
              <View style={{ backgroundColor: colors.text, borderRadius: borderRadius.xl, padding: spacing.xl, flexDirection: "row", alignItems: "center", gap: spacing.lg }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: fontSize.xl, fontWeight: "400", color: colors.white }}>
                    {currentUser.name.split(" ").map((n) => n[0]).join("")}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.white }}>{currentUser.name}</Text>
                  <Text style={{ fontSize: fontSize.sm, color: colors.slate300 }}>{currentUser.position}</Text>
                </View>
              </View>

              <View style={{ gap: spacing.lg }}>
                {inputField("Phone", Phone, phone, setPhone, "Enter phone number")}
                {inputField("Email", Mail, email, setEmail, "Enter email address")}
                {inputField("Shift", Clock, shift, setShift, "e.g. 09:00 - 18:00")}
                {inputField("Emergency Contact", Shield, emergencyContact, setEmergencyContact, "Name and phone")}
                {inputField("Skills", User, skills, setSkills, "Comma separated skills")}
              </View>

              <TouchableOpacity onPress={handleSave} style={{ backgroundColor: colors.brand, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: spacing.sm }}>
                <Save size={14} color={colors.white} strokeWidth={2} />
                <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.white }}>Save changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
