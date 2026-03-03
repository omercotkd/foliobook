import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "@/providers";
import { EditIcon } from "@/components/icons/EditIcon";
import { TrendUpIcon } from "@/components/icons/TrendUpIcon";
import i18n from "@/i18n";
import type { Position } from "@foliobook/shared-types";

interface OverviewTabProps {
  position: Position;
}

export function OverviewTab({ position }: OverviewTabProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const isLong = position.direction === "long";
  const directionColor = isLong ? colors.primary.main : colors.danger.main;
  const directionBgColor = isLong ? colors.primary.subtle : colors.danger.subtle;

  const entryTotal = position.quantity * position.entryPrice;
  const currentTotal = position.quantity * position.currentPrice;
  const totalGain = isLong
    ? currentTotal - entryTotal
    : entryTotal - currentTotal;
  const gainPercent = entryTotal > 0 ? (totalGain / entryTotal) * 100 : 0;
  const isPositiveGain = totalGain >= 0;

  const potentialGain =
    position.takeProfitPrice != null
      ? isLong
        ? (position.takeProfitPrice - position.entryPrice) * position.quantity
        : (position.entryPrice - position.takeProfitPrice) * position.quantity
      : undefined;

  const potentialLoss =
    position.stopLossPrice != null
      ? isLong
        ? (position.stopLossPrice - position.entryPrice) * position.quantity
        : (position.entryPrice - position.stopLossPrice) * position.quantity
      : undefined;

  const curr = position.currency;

  const formatMoney = (amount: number, showSign = false): string => {
    const abs = Math.abs(amount);
    const formatted = `${curr}${abs.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    if (showSign) {
      return amount >= 0 ? `+${formatted}` : `-${formatted}`;
    }
    return amount < 0 ? `-${formatted}` : formatted;
  };

  const sectorExchange = [position.sector, position.exchange]
    .filter(Boolean)
    .join(" \u2022 ");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingHorizontal: spacing.md }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header info */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.companyName,
              {
                color: colors.text.primary,
                fontFamily: typography.display.fontFamily,
                fontSize: 28,
              },
            ]}
          >
            {position.companyName}
          </Text>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.directionBadge,
                {
                  backgroundColor: directionBgColor,
                  borderRadius: borderRadius.small,
                },
              ]}
            >
              <Text
                style={[
                  styles.directionText,
                  {
                    color: directionColor,
                    fontFamily: typography.body.fontFamily,
                  },
                ]}
              >
                {isLong ? "LONG" : "SHORT"}
              </Text>
            </View>
            {sectorExchange ? (
              <Text
                style={[
                  styles.sectorExchange,
                  {
                    color: colors.text.secondary,
                    fontFamily: typography.body.fontFamily,
                  },
                ]}
              >
                {sectorExchange}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={styles.priceColumn}>
          <Text
            style={[
              styles.priceLabel,
              {
                color: colors.text.secondary,
                fontFamily: typography.body.fontFamily,
              },
            ]}
          >
            {i18n.t("positionDetail.currentPrice")}
          </Text>
          <Text
            style={[
              styles.currentPriceValue,
              {
                color: colors.text.primary,
                fontFamily: typography.display.fontFamily,
              },
            ]}
          >
            {formatMoney(position.currentPrice)}
          </Text>
        </View>
      </View>

      {/* Total Gain/Loss card */}
      <View
        style={[
          styles.gainCard,
          {
            backgroundColor: colors.surface,
            borderRadius: borderRadius.medium,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          },
        ]}
      >
        <View>
          <Text
            style={[
              styles.gainLabel,
              {
                color: colors.text.secondary,
                fontFamily: typography.body.fontFamily,
              },
            ]}
          >
            {i18n.t("positionDetail.totalGainLoss")}
          </Text>
          <Text
            style={[
              styles.gainValue,
              {
                color: isPositiveGain
                  ? colors.primary.main
                  : colors.danger.main,
                fontFamily: typography.display.fontFamily,
              },
            ]}
          >
            {formatMoney(totalGain, true)}
          </Text>
        </View>
        <View
          style={[
            styles.percentBadge,
            {
              backgroundColor: colors.inputBackground,
              borderRadius: borderRadius.large,
            },
          ]}
        >
          <TrendUpIcon
            size={18}
            color={
              isPositiveGain ? colors.primary.main : colors.danger.main
            }
          />
          <Text
            style={[
              styles.percentText,
              {
                color: isPositiveGain
                  ? colors.primary.main
                  : colors.danger.main,
                fontFamily: typography.data.fontFamily,
              },
            ]}
          >
            {`${isPositiveGain ? "+" : ""}${gainPercent.toFixed(2)}%`}
          </Text>
        </View>
      </View>

      {/* Position data grid */}
      <View style={[styles.dataGrid, { gap: spacing.md }]}>
        {/* Row 1: Position Size / Entry Price */}
        <View style={styles.dataRow}>
          <DataCell
            label={i18n.t("positionDetail.positionSize")}
            value={`${position.quantity.toFixed(1)} ${i18n.t("positionDetail.shares")}`}
            colors={colors}
            typography={typography}
          />
          <DataCell
            label={i18n.t("positionDetail.entryPrice")}
            value={formatMoney(position.entryPrice)}
            colors={colors}
            typography={typography}
          />
        </View>

        {/* Row 2: Entry Total / Current Total */}
        <View style={styles.dataRow}>
          <DataCell
            label={i18n.t("positionDetail.entryTotal")}
            value={formatMoney(entryTotal)}
            colors={colors}
            typography={typography}
          />
          <DataCell
            label={i18n.t("positionDetail.currentTotal")}
            value={formatMoney(currentTotal)}
            colors={colors}
            typography={typography}
          />
        </View>

        {/* Row 3: Take Profit / Stop Loss */}
        <View style={styles.dataRow}>
          <DataCell
            label={i18n.t("positionDetail.takeProfit")}
            value={
              position.takeProfitPrice != null
                ? formatMoney(position.takeProfitPrice)
                : undefined
            }
            colors={colors}
            typography={typography}
          />
          <DataCell
            label={i18n.t("positionDetail.stopLoss")}
            value={
              position.stopLossPrice != null
                ? formatMoney(position.stopLossPrice)
                : undefined
            }
            colors={colors}
            typography={typography}
          />
        </View>

        {/* Row 4: Potential Gain / Potential Loss */}
        <View style={styles.dataRow}>
          <DataCell
            label={i18n.t("positionDetail.potentialGain")}
            value={
              potentialGain != null
                ? formatMoney(potentialGain, true)
                : undefined
            }
            valueColor={
              potentialGain != null && potentialGain >= 0
                ? colors.primary.main
                : colors.danger.main
            }
            colors={colors}
            typography={typography}
          />
          <DataCell
            label={i18n.t("positionDetail.potentialLoss")}
            value={
              potentialLoss != null
                ? formatMoney(potentialLoss, true)
                : undefined
            }
            valueColor={colors.danger.main}
            colors={colors}
            typography={typography}
          />
        </View>
      </View>

      {/* Edit Position button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.editButton,
          {
            backgroundColor: colors.text.primary,
            borderRadius: borderRadius.large,
          },
        ]}
        onPress={() => {
          /* no-op */
        }}
      >
        <EditIcon size={18} color={colors.primary.on} />
        <Text
          style={[
            styles.editButtonText,
            {
              color: colors.primary.on,
              fontFamily: typography.body.fontFamily,
            },
          ]}
        >
          {i18n.t("positionDetail.editPosition")}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---- helper ---- */
interface DataCellProps {
  label: string;
  value?: string;
  valueColor?: string;
  colors: ReturnType<typeof useTheme>["colors"];
  typography: ReturnType<typeof useTheme>["typography"];
}

function DataCell({ label, value, valueColor, colors, typography }: DataCellProps) {
  return (
    <View style={styles.dataCell}>
      <Text
        style={[
          styles.dataCellLabel,
          {
            color: colors.text.secondary,
            fontFamily: typography.body.fontFamily,
          },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.dataCellValue,
          {
            color: valueColor ?? colors.text.primary,
            fontFamily: typography.data.fontFamily,
          },
        ]}
      >
        {value ?? "––"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 4,
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  companyName: {
    letterSpacing: -0.5,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  directionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  directionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  sectorExchange: {
    fontSize: 13,
  },
  priceColumn: {
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  currentPriceValue: {
    fontSize: 26,
  },
  gainCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginTop: 24,
  },
  gainLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  gainValue: {
    fontSize: 28,
  },
  percentBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  percentText: {
    fontSize: 15,
  },
  dataGrid: {
    marginTop: 28,
  },
  dataRow: {
    flexDirection: "row",
  },
  dataCell: {
    flex: 1,
  },
  dataCellLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  dataCellValue: {
    fontSize: 18,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
    marginTop: 32,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
