import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Wallet, DollarSign, Building, Clock, Calendar, Search, MapPin } from "lucide-react-native";
import { ScreenWrapper } from "../../shared/layout/ScreenWrapper";
import { SectionHeader } from "../../shared/components/SectionHeader";
import { StatCard } from "../../shared/components/StatCard";
import { Card } from "../../shared/components/Card";
import { Badge } from "../../shared/components/Badge";
import { ProgressBar } from "../../shared/components/ProgressBar";
import { useApp } from "../../context/AppContext";
import { colors, fontSize, spacing, borderRadius } from "../../theme/theme";
import { formatMoney } from "../../utils/helpers";

export function RmFinanceScreen() {
  const { scopedBranches, scopedApprovals, openBranchDetail } = useApp();
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [locationMode, setLocationMode] = useState<"state" | "district">("state");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("2026-04-01");
  const [toDate, setToDate] = useState("2026-04-30");

  const getDistrict = (branch: typeof scopedBranches[number]) => branch.name || branch.city || "Unknown district";
  const getState = (branch: typeof scopedBranches[number]) => {
    const parts = branch.address?.split(",").map((part) => part.trim()).filter(Boolean) || [];
    return parts[parts.length - 1] || branch.city || "Unknown state";
  };
  const getLocation = (branch: typeof scopedBranches[number]) => locationMode === "state" ? getState(branch) : getDistrict(branch);
  const locationGroups = scopedBranches.reduce<Record<string, number>>((acc, branch) => {
    const key = getLocation(branch);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const locationEntries = Object.entries(locationGroups).sort((a, b) => b[1] - a[1]);
  const query = searchQuery.trim().toLowerCase();
  const filtered = scopedBranches.filter((branch) => {
    if (selectedLocation && getLocation(branch) !== selectedLocation) return false;
    if (selectedBranch && branch.id !== selectedBranch) return false;
    if (!query) return true;
    return [branch.name, branch.city, branch.address, branch.code, getState(branch), getDistrict(branch)]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  const totalBudget = filtered.reduce((s, b) => s + b.monthlyBudget, 0);
  const totalUsed = filtered.reduce((s, b) => s + b.usedBudget, 0);
  const budgetPct = Math.round((totalUsed / totalBudget) * 100);
  const pendingApprovals = scopedApprovals.filter((a) => a.status === "Pending" && (!selectedBranch || a.branchId === selectedBranch));

  return (
    <ScreenWrapper>
      <SectionHeader title="Issues & Costs" />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xl }}>
        {(["state", "district"] as const).map((mode) => (
          <TouchableOpacity key={mode} onPress={() => { setLocationMode(mode); setSelectedLocation(null); setSelectedBranch(null); }} style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: locationMode === mode ? colors.slate900 : colors.white, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: locationMode === mode ? colors.white : colors.slate600, textTransform: "capitalize" }}>{mode} wise</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md }}>
        <TouchableOpacity onPress={() => { setSelectedLocation(null); setSelectedBranch(null); }} style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: !selectedLocation ? colors.brand : colors.white, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
          <MapPin size={14} color={!selectedLocation ? colors.white : colors.slate600} />
          <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: !selectedLocation ? colors.white : colors.slate600 }}>All {locationMode}s</Text>
        </TouchableOpacity>
        {locationEntries.map(([name, count]) => (
          <TouchableOpacity key={name} onPress={() => { setSelectedLocation(name); setSelectedBranch(null); }} style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: selectedLocation === name ? colors.brand : colors.white, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "700", color: selectedLocation === name ? colors.white : colors.slate600 }}>{name} · {count}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md }}>
        <TouchableOpacity onPress={() => setSelectedBranch(null)} style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: !selectedBranch ? colors.slate900 : colors.white, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: !selectedBranch ? colors.white : colors.slate600 }}>All Branches</Text>
        </TouchableOpacity>
        {scopedBranches.filter((b) => !selectedLocation || getLocation(b) === selectedLocation).map((b) => (
          <TouchableOpacity key={b.id} onPress={() => setSelectedBranch(b.id)} style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: selectedBranch === b.id ? colors.slate900 : colors.white, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: fontSize.sm, fontWeight: "400", color: selectedBranch === b.id ? colors.white : colors.slate600 }}>{b.name.split(" ")[0]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: spacing.xl }}>
        <View style={{ flex: 2, minWidth: 220, flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border }}>
          <Search size={16} color={colors.slate400} />
          <TextInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Search state, district, branch or code" placeholderTextColor={colors.slate400} style={{ flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.sm, color: colors.slate900, fontSize: fontSize.sm }} />
        </View>
        <View style={{ flex: 1, minWidth: 140, flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border }}>
          <Calendar size={16} color={colors.slate400} />
          <TextInput value={fromDate} onChangeText={setFromDate} placeholder="From" style={{ flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.sm, color: colors.slate900, fontSize: fontSize.sm }} />
        </View>
        <View style={{ flex: 1, minWidth: 140, flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border }}>
          <Calendar size={16} color={colors.slate400} />
          <TextInput value={toDate} onChangeText={setToDate} placeholder="To" style={{ flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.sm, color: colors.slate900, fontSize: fontSize.sm }} />
        </View>
      </View>

      <Card variant="glass" style={{ marginTop: spacing.xl }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
          <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
            <DollarSign size={16} color={colors.brand} strokeWidth={2} />
          </View>
          <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>Budget Usage Per Branch</Text>
        </View>
        <View style={{ gap: spacing.md }}>
          {filtered.map((branch) => {
            const pct = Math.round((branch.usedBudget / branch.monthlyBudget) * 100);
            return (
              <TouchableOpacity key={branch.id} onPress={() => openBranchDetail(branch.id)} activeOpacity={0.7} style={{ backgroundColor: colors.white, borderRadius: 24, padding: spacing.xl, borderWidth: 1, borderColor: colors.border }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                    <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.brand + "15", alignItems: "center", justifyContent: "center" }}>
                      <Building size={14} color={colors.brand} strokeWidth={2} />
                    </View>
                    <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>{branch.name}</Text>
                  </View>
                  <Badge label={`${pct}% Used`} type={pct >= 80 ? "Critical" : pct >= 60 ? "High" : "Completed"} />
                </View>
                <ProgressBar value={pct} color={pct >= 80 ? colors.error : pct >= 60 ? colors.warning : colors.success} height={8} />
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: spacing.md }}>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Used: {formatMoney(branch.usedBudget)}</Text>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Budget: {formatMoney(branch.monthlyBudget)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      <Card variant="glass" style={{ marginTop: spacing.xl }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg }}>
          <View style={{ width: 32, height: 32, borderRadius: borderRadius.md, backgroundColor: colors.warning + "15", alignItems: "center", justifyContent: "center" }}>
            <Wallet size={16} color={colors.warning} strokeWidth={2} />
          </View>
          <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text }}>Pending Financial Approvals</Text>
        </View>
        <View style={{ gap: spacing.md }}>
          {pendingApprovals.slice(0, 5).map((approval) => (
            <View key={approval.id} style={{ backgroundColor: colors.white, borderRadius: 24, padding: spacing.xl, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", gap: spacing.sm, alignItems: "center" }}>
                    <Badge label={approval.kind} type={approval.priority} />
                    <Badge label={approval.priority} type={approval.priority} />
                  </View>
                  <Text style={{ fontSize: fontSize.lg, fontWeight: "400", color: colors.text, marginTop: spacing.md }}>{approval.title}</Text>
                  <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{approval.note}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.md }}>
                    <Text style={{ fontSize: fontSize["2xl"], fontWeight: "400", color: colors.brand }}>{formatMoney(approval.amount)}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                      <Clock size={12} color={colors.textSecondary} />
                      <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>{approval.age}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
          {pendingApprovals.length === 0 && (
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", padding: spacing.xl }}>No pending approvals</Text>
          )}
        </View>
      </Card>
    </ScreenWrapper>
  );
}
