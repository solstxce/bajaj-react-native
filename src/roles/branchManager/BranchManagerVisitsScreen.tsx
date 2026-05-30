import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Route, Calendar, Clock, CheckCircle, MapPin, Send, Eye } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";

export function BranchManagerVisitsScreen() {
  const { scopedBranchIds, visits, getBranch, submitVisitReport, openVisitDetail } = useApp();
  const scopedVisits = visits.filter((v) => scopedBranchIds.includes(v.branchId));

  const upcomingVisits = scopedVisits.filter((v) => v.status === "Scheduled");
  const overdueVisits = scopedVisits.filter((v) => v.status === "Escalated");
  const completedThisMonth = scopedVisits.filter((v) => v.status === "Completed");

  return (
    <ScreenWrapper>
      <SectionHeader title="Visit Management" />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.xl }}>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Upcoming" value={String(upcomingVisits.length)} meta="Scheduled visits" accent={colors.brand} icon={Calendar} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Overdue" value={String(overdueVisits.length)} meta="Needs attention" accent={colors.error} icon={Clock} /></View>
        <View style={{ flex: 1, minWidth: 90 }}><StatCard label="Completed" value={String(completedThisMonth.length)} meta="This month" accent={colors.success} icon={CheckCircle} /></View>
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <Card variant="glass">
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
            <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
              <Route size={16} color={colors.brand} strokeWidth={2} />
            </View>
            <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text }}>Visit Schedule</Text>
          </View>
          <View style={{ gap: spacing.xl }}>
            {scopedVisits.length > 0 ? scopedVisits.map((visit) => {
              const branch = getBranch(visit.branchId);
              return (
                <View key={visit.id} style={{ backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.xl, borderWidth: 1, borderColor: colors.border }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, alignItems: "center" }}>
                        <Badge label={visit.status} type={visit.status} />
                        <Text style={{ fontSize: fontSize.xs, fontWeight: "600", color: colors.textSecondary, textTransform: "uppercase" }}>{visit.purpose}</Text>
                      </View>
                      <Text style={{ fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginTop: spacing.lg }}>{visit.agenda}</Text>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.lg }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                          <MapPin size={14} color={colors.textSecondary} strokeWidth={2} />
                          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{branch?.name || "Branch " + visit.branchId}</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                          <Calendar size={14} color={colors.textSecondary} strokeWidth={2} />
                          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{visit.scheduledAt}</Text>
                        </View>
                      </View>
                      {visit.status === "Completed" && visit.report !== "Pending" ? (
                        <View style={{ marginTop: spacing.lg, backgroundColor: colors.emerald50, borderRadius: borderRadius.lg, padding: spacing.lg, flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}>
                          <CheckCircle size={14} color={colors.emerald700} strokeWidth={2} style={{ marginTop: 2 }} />
                          <Text style={{ fontSize: fontSize.sm, color: colors.emerald700, flex: 1 }}>{visit.report}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  {visit.status === "Scheduled" || visit.status === "Escalated" ? (
                    <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.xl }}>
                      <TouchableOpacity
                        onPress={() => openVisitDetail(visit.id)}
                        style={{ backgroundColor: colors.brand, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm }}
                      >
                        <Eye size={14} color={colors.white} strokeWidth={2} />
                        <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>Detail</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => submitVisitReport(visit.id)}
                        style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm, borderWidth: 1, borderColor: colors.border }}
                      >
                        <Send size={14} color={colors.text} strokeWidth={2} />
                        <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.text }}>Submit Report</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={{ flexDirection: "row", marginTop: spacing.xl }}>
                      <TouchableOpacity
                        onPress={() => openVisitDetail(visit.id)}
                        style={{ backgroundColor: colors.brand, borderRadius: borderRadius.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm }}
                      >
                        <Eye size={14} color={colors.white} strokeWidth={2} />
                        <Text style={{ fontSize: fontSize.sm, fontWeight: "600", color: colors.white }}>Detail</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            }) : (
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", padding: spacing["4xl"] }}>No visits scheduled</Text>
            )}
          </View>
        </Card>
      </View>
    </ScreenWrapper>
  );
}
