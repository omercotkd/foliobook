import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useTheme } from "@/providers";
import i18n from "@/i18n";
import type { Position } from "@foliobook/shared-types";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface ChartTabProps {
  position: Position;
}

const TIME_RANGES = ["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "Max"] as const;
type TimeRange = (typeof TIME_RANGES)[number];

/** Generate mock price data for the chart based on entry and current price */
function generateMockData(entryPrice: number, currentPrice: number) {
  const points = 24;
  const data: { value: number }[] = [];
  const diff = currentPrice - entryPrice;

  for (let i = 0; i <= points; i++) {
    const progress = i / points;
    const base = entryPrice + diff * progress;
    const noise = (Math.random() - 0.5) * Math.abs(diff) * 0.25;
    data.push({ value: Math.round((base + noise) * 100) / 100 });
  }

  // ensure first and last are exact
  data[0] = { value: entryPrice };
  data[data.length - 1] = { value: currentPrice };

  return data;
}

export function ChartTab({ position }: ChartTabProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1Y");

  const isLong = position.direction === "long";
  const lineColor = colors.primary.main;
  const chartData = generateMockData(position.entryPrice, position.currentPrice);

  const curr = position.currency;
  const formatMoney = (amount: number): string =>
    `${curr}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Calculate Y-axis bounds
  const allValues = chartData.map((d) => d.value);
  const dataMin = Math.min(...allValues);
  const dataMax = Math.max(...allValues);
  const yPadding = (dataMax - dataMin) * 0.15;
  const yMin = Math.floor(dataMin - yPadding);

  const entryTotal = position.quantity * position.entryPrice;
  const currentTotal = position.quantity * position.currentPrice;
  const totalGain = isLong
    ? currentTotal - entryTotal
    : entryTotal - currentTotal;
  const gainPercent = entryTotal > 0 ? (totalGain / entryTotal) * 100 : 0;
  const isPositiveGain = totalGain >= 0;

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
                  backgroundColor: isLong
                    ? colors.primary.subtle
                    : colors.danger.subtle,
                  borderRadius: borderRadius.small,
                },
              ]}
            >
              <Text
                style={[
                  styles.directionText,
                  {
                    color: isLong ? colors.primary.main : colors.danger.main,
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
              styles.currentPriceValue,
              {
                color: colors.text.primary,
                fontFamily: typography.display.fontFamily,
              },
            ]}
          >
            {formatMoney(position.currentPrice)}
          </Text>
          <Text
            style={[
              styles.changeText,
              {
                color: isPositiveGain
                  ? colors.primary.main
                  : colors.danger.main,
                fontFamily: typography.data.fontFamily,
              },
            ]}
          >
            {`${isPositiveGain ? "+" : "-"}${curr}${Math.abs(totalGain / position.quantity).toFixed(2)} (${Math.abs(gainPercent).toFixed(2)}%)`}
          </Text>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={SCREEN_WIDTH - spacing.md * 2 - 40}
          height={260}
          spacing={(SCREEN_WIDTH - spacing.md * 2 - 40) / chartData.length}
          color={lineColor}
          thickness={2}
          startFillColor={`${lineColor}30`}
          endFillColor={`${lineColor}05`}
          areaChart
          hideDataPoints
          yAxisOffset={yMin}
          yAxisTextStyle={{
            color: colors.text.disabled,
            fontSize: 11,
            fontFamily: typography.body.fontFamily,
          }}
          xAxisColor="transparent"
          yAxisColor="transparent"
          hideRules={false}
          rulesColor={colors.border}
          rulesType="solid"
          noOfSections={4}
          pointerConfig={{
            pointerStripColor: colors.text.disabled,
            pointerStripWidth: 1,
            pointerColor: colors.primary.main,
            radius: 8,
            pointerLabelWidth: 120,
            pointerLabelHeight: 30,
            pointerLabelComponent: (items: { value: number }[]) => (
              <View
                style={[
                  styles.pointerLabel,
                  {
                    backgroundColor: colors.surface,
                    borderRadius: borderRadius.small,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: colors.text.primary,
                    fontFamily: typography.data.fontFamily,
                    fontSize: 13,
                  }}
                >
                  {formatMoney(items[0]?.value ?? 0)}
                </Text>
              </View>
            ),
          }}
        />

        {/* Entry line label */}
        <View style={[styles.entryLabel, { bottom: 50 }]}>
          <View
            style={[
              styles.labelChip,
              {
                backgroundColor: colors.inputBackground,
                borderRadius: borderRadius.small,
              },
            ]}
          >
            <Text
              style={[
                styles.labelChipText,
                {
                  color: colors.text.secondary,
                  fontFamily: typography.data.fontFamily,
                },
              ]}
            >
              {`${i18n.t("positionDetail.entry")}: ${formatMoney(position.entryPrice)}`}
            </Text>
          </View>
        </View>

        {/* Current line label */}
        <View style={[styles.currentLabel, { top: 30 }]}>
          <View
            style={[
              styles.labelChip,
              {
                backgroundColor: colors.inputBackground,
                borderRadius: borderRadius.small,
              },
            ]}
          >
            <Text
              style={[
                styles.labelChipText,
                {
                  color: colors.text.secondary,
                  fontFamily: typography.data.fontFamily,
                },
              ]}
            >
              {`${i18n.t("positionDetail.current")}: ${formatMoney(position.currentPrice)}`}
            </Text>
          </View>
        </View>
      </View>

      {/* Time range selector */}
      <View style={[styles.rangeRow, { gap: spacing.xs }]}>
        {TIME_RANGES.map((range) => {
          const isActive = range === selectedRange;
          return (
            <TouchableOpacity
              key={range}
              onPress={() => setSelectedRange(range)}
              activeOpacity={0.7}
              style={[
                styles.rangeButton,
                {
                  backgroundColor: isActive
                    ? colors.surface
                    : "transparent",
                  borderRadius: borderRadius.small,
                  borderWidth: isActive ? 1 : 0,
                  borderColor: isActive ? colors.border : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.rangeText,
                  {
                    color: isActive
                      ? colors.text.primary
                      : colors.text.secondary,
                    fontFamily: typography.body.fontFamily,
                    fontWeight: isActive ? "600" : "400",
                  },
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 4,
    paddingBottom: 40,
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
  currentPriceValue: {
    fontSize: 26,
  },
  changeText: {
    fontSize: 14,
    marginTop: 2,
  },
  chartWrapper: {
    marginTop: 24,
    position: "relative",
  },
  pointerLabel: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  entryLabel: {
    position: "absolute",
    left: 0,
  },
  currentLabel: {
    position: "absolute",
    right: 40,
  },
  labelChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  labelChipText: {
    fontSize: 11,
  },
  rangeRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  rangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  rangeText: {
    fontSize: 14,
  },
});
