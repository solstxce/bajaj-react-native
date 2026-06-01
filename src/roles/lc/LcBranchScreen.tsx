import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Image, TextInput, ScrollView } from "react-native";
import { Building, TrendingUp, UserCheck, Clock, ShieldCheck, TriangleAlert, CalendarDays, MapPin, Wrench, Edit, X, Calendar, Image as ImageIcon } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { ProgressBar } from "../../shared/components/ProgressBar";
import { SegmentedControl } from "../../shared/components/SegmentedControl";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";
import { formatMoney } from "../../utils/helpers";

export function LcBranchScreen() {
  const { state, setTab, currentUser, getBranch, scopedComplaints, scopedAppliances, openComplaintDetail, openApplianceDetail } = useApp();
  const branch = getBranch(currentUser.branchId)!;
  const activeTab = state.tabs.lcBranch || "details";
  const budgetPct = Math.round((branch.usedBudget / branch.monthlyBudget) * 100);
  const branchIssues = scopedComplaints.filter((c) => c.branchId === branch.id);
  const branchAssets = scopedAppliances.filter((a) => a.branchId === branch.id);

  const [viewApplianceId, setViewApplianceId] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState("2026-04-20");
  const [toDate, setToDate] = useState("2026-04-26");

  const viewingAppliance = branchAssets.find((a) => a.id === viewApplianceId);

  return (
    <ScreenWrapper>
      <SectionHeader
        title={branch.name}
        subtitle={branch.city}
        action={
          <SegmentedControl
            tabs={[
              { label: "Branch details", value: "details" },
              { label: "Appliances", value: "appliances" },
            ]}
            activeKey={activeTab}
            onChange={(v) => setTab("lcBranch", v)}
          />
        }
      />

      <View style={{ gap: spacing.xl, marginTop: spacing.xl }}>
        {activeTab === "details" && (
          <>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: spacing.sm }}>
              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.white, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border }}>
                <Edit size={16} color={colors.text} strokeWidth={2} />
                <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.text }}>Edit Branch Details</Text>
              </TouchableOpacity>
            </View>

            <Card variant="glass">
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
                <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                  <Building size={16} color={colors.brand} strokeWidth={2} />
                </View>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>Branch info</Text>
              </View>
              <View style={{ gap: spacing.md }}>
                {[
                  { label: "Code", value: branch.code, icon: Building },
                  { label: "Address", value: branch.address, icon: MapPin },
                  { label: "Shift window", value: branch.shiftWindow, icon: Clock },
                  { label: "Last visit", value: branch.lastVisit, icon: CalendarDays },
                ].map((row) => (
                  <View key={row.label} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                      <row.icon size={14} color={colors.textSecondary} strokeWidth={2} />
                      <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{row.label}</Text>
                    </View>
                    <Text numberOfLines={1} style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.text, maxWidth: 180 }}>{row.value}</Text>
                  </View>
                ))}
              </View>
            </Card>

            <Card variant="glass">
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
                <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.success + "15", alignItems: "center", justifyContent: "center" }}>
                  <ShieldCheck size={16} color={colors.success} strokeWidth={2} />
                </View>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>Audit readiness</Text>
              </View>
              <View style={{ gap: spacing.md }}>
                <View style={{ backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.xl }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm }}>
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Audit score</Text>
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.text }}>{branch.auditScore}%</Text>
                  </View>
                  <ProgressBar value={branch.auditScore} color={branch.auditScore >= 80 ? colors.success : branch.auditScore >= 60 ? colors.warning : colors.error} />
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md }}>
                  <View style={{ flex: 1, minWidth: 120, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.xl }}>
                    <Clock size={16} color={colors.textSecondary} strokeWidth={2} />
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.text, marginTop: spacing.sm }}>Shift window</Text>
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{branch.shiftWindow}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 120, backgroundColor: colors.slate50, borderRadius: borderRadius.lg, padding: spacing.xl }}>
                    <MapPin size={16} color={colors.textSecondary} strokeWidth={2} />
                    <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.text, marginTop: spacing.sm }}>Geo radius</Text>
                    <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{branch.geoRadius}m</Text>
                  </View>
                </View>
              </View>
            </Card>

            <Card variant="glass">
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
                <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                  <TrendingUp size={16} color={colors.brand} strokeWidth={2} />
                </View>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>Budget usage</Text>
              </View>
              <View style={{ gap: spacing.sm }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Monthly budget</Text>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.text }}>{formatMoney(branch.monthlyBudget)}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Used</Text>
                  <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.text }}>{formatMoney(branch.usedBudget)}</Text>
                </View>
                <ProgressBar value={budgetPct} color={budgetPct > 80 ? colors.error : budgetPct > 60 ? colors.warning : colors.success} />
                <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{budgetPct}% utilised</Text>
              </View>
            </Card>

            <Card variant="glass">
              <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>Open issues</Text>
              <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
                {branchIssues.slice(0, 5).map((c) => (
                  <TouchableOpacity key={c.id} onPress={() => openComplaintDetail(c.id)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.slate50, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.text }}>{c.title}</Text>
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{c.status} | {c.priority}</Text>
                    </View>
                    <Badge label={c.status} type={c.status} />
                  </TouchableOpacity>
                ))}
                {branchIssues.length === 0 && (
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>No open issues in this branch</Text>
                )}
              </View>
            </Card>
          </>
        )}

        {activeTab === "appliances" && (
          <>
            <Card variant="glass">
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.lg }}>
                <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>Appliance status</Text>
                <Badge label={String(branchAssets.filter((a) => a.status !== "Operational").length) + " at risk"} type="Warning" />
              </View>
              <View style={{ gap: spacing.md }}>
                {branchAssets.map((app) => (
                  <View key={app.id} style={{ backgroundColor: colors.white, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border, gap: spacing.md }}>
                    <TouchableOpacity onPress={() => openApplianceDetail(app.id)} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                        <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: (app.status === "Operational" ? colors.success : colors.warning) + "15", alignItems: "center", justifyContent: "center" }}>
                          <Wrench size={16} color={app.status === "Operational" ? colors.success : colors.warning} strokeWidth={2} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: colors.text }}>{app.name}</Text>
                          <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{app.zone} | {app.category}</Text>
                        </View>
                      </View>
                      <Badge label={app.status} type={app.status} />
                    </TouchableOpacity>
                    <View style={{ borderTopWidth: 1, borderColor: colors.border, paddingTop: spacing.md, flexDirection: "row", justifyContent: "flex-end" }}>
                      <TouchableOpacity onPress={() => setViewApplianceId(app.id)} style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, backgroundColor: colors.brand, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full }}>
                        <ImageIcon size={14} color={colors.white} strokeWidth={2} />
                        <Text style={{ fontSize: fontSize.sm, color: colors.white }}>View Image</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                {branchAssets.length === 0 && (
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>No appliances in this branch</Text>
                )}
              </View>
            </Card>
          </>
        )}
      </View>

      <Modal visible={!!viewApplianceId} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: spacing.xl }}>
          <View style={{ backgroundColor: colors.white, borderRadius: borderRadius["2xl"], padding: spacing.xl, maxHeight: '80%' }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg }}>
              <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>View Appliance</Text>
              <TouchableOpacity onPress={() => setViewApplianceId(null)} style={{ padding: spacing.sm }}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {viewingAppliance && (
                <View style={{ gap: spacing.lg }}>
                  <Text style={{ fontSize: fontSize.md, fontWeight: "400", color: colors.text }}>{viewingAppliance.name}</Text>

                  <View style={{ flexDirection: "row", gap: spacing.md }}>
                    <View style={{ flex: 1, gap: spacing.xs }}>
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>From Date</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, backgroundColor: colors.slate50 }}>
                        <Calendar size={14} color={colors.textSecondary} />
                        <TextInput value={fromDate} onChangeText={setFromDate} style={{ flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.sm, color: colors.text, fontSize: fontSize.sm }} />
                      </View>
                    </View>
                    <View style={{ flex: 1, gap: spacing.xs }}>
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>To Date</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, backgroundColor: colors.slate50 }}>
                        <Calendar size={14} color={colors.textSecondary} />
                        <TextInput value={toDate} onChangeText={setToDate} style={{ flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.sm, color: colors.text, fontSize: fontSize.sm }} />
                      </View>
                    </View>
                  </View>

                  <View style={{ height: 250, backgroundColor: colors.slate100, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <Image 
                      source={{ uri: "https://images.unsplash.com/photo-1581092921461-7031e4bfb83e?auto=format&fit=crop&q=80&w=800&h=600" }} 
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                    <View style={{ position: "absolute", bottom: spacing.md, right: spacing.md, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full }}>
                      <Text style={{ color: colors.white, fontSize: fontSize.xs }}>Current latest image</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity style={{ backgroundColor: colors.brand, borderRadius: borderRadius.lg, paddingVertical: spacing.md, alignItems: "center", marginTop: spacing.sm }}>
                    <Text style={{ color: colors.white, fontSize: fontSize.sm, fontWeight: "400" }}>Apply Dates</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
