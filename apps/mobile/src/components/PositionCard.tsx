import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import { useTheme } from "@/providers";
import type { Position } from "@foliobook/shared-types";

const CARD_HORIZONTAL_MARGIN = 24;
const CARD_WIDTH = Dimensions.get("window").width - CARD_HORIZONTAL_MARGIN * 2;

interface PositionCardProps {
  position: Position;
}

export function PositionCard({ position }: PositionCardProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CARD_WIDTH);
    setActiveIndex(index);
  };

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

  const DirectionBadge = () => (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: directionBgColor,
          borderRadius: borderRadius.small,
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            color: directionColor,
            fontFamily: typography.body.fontFamily,
          },
        ]}
      >
        {isLong ? "Long" : "Short"}
      </Text>
    </View>
  );

  // Page 1: Thesis view
  const ThesisPage = () => (
    <View style={[styles.page, { width: CARD_WIDTH }]}>
      <View style={styles.pageContent}>
        <View style={styles.cardHeader}>
          <View>
            <Text
              style={[
                styles.positionLabel,
                {
                  color: colors.text.secondary,
                  fontFamily: typography.body.fontFamily,
                },
              ]}
            >
              {isLong ? "Long position" : "Short position"}
            </Text>
            <Text
              style={[
                styles.ticker,
                {
                  color: colors.text.primary,
                  fontFamily: typography.display.fontFamily,
                },
              ]}
            >
              {`$${position.ticker}`}
            </Text>
            <Text
              style={[
                styles.companyName,
                {
                  color: colors.text.secondary,
                  fontFamily: typography.body.fontFamily,
                },
              ]}
            >
              {position.companyName}
            </Text>
          </View>
          <DirectionBadge />
        </View>

        {position.thesis && (
          <Text
            style={[
              styles.thesisText,
              {
                color: colors.text.primary,
                fontFamily: typography.body.fontFamily,
                lineHeight: typography.body.lineHeight,
              },
            ]}
            numberOfLines={4}
          >
            {position.thesis.why}
          </Text>
        )}

        <View style={styles.thesisFooter}>
          <View>
            <Text
              style={[
                styles.metaLabel,
                {
                  color: colors.text.secondary,
                  fontFamily: typography.body.fontFamily,
                },
              ]}
            >
              Total gain
            </Text>
            <Text
              style={[
                styles.gainValue,
                {
                  color: isPositiveGain
                    ? colors.primary.main
                    : colors.danger.main,
                  fontFamily: typography.data.fontFamily,
                },
              ]}
            >
              {formatMoney(totalGain, true)}
            </Text>
          </View>
          <View style={styles.rightAlign}>
            <Text
              style={[
                styles.metaLabel,
                {
                  color: colors.text.secondary,
                  fontFamily: typography.body.fontFamily,
                },
              ]}
            >
              Since entry
            </Text>
            <Text
              style={[
                styles.percentValue,
                {
                  color: isPositiveGain
                    ? colors.primary.main
                    : colors.danger.main,
                  fontFamily: typography.data.fontFamily,
                },
              ]}
            >
              {`↗ ${isPositiveGain ? "+" : ""}${gainPercent.toFixed(2)}%`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Page 2: Data view
  const DataPage = () => (
    <View style={[styles.page, { width: CARD_WIDTH }]}>
      <View style={styles.pageContent}>
        <View style={styles.cardHeader}>
          <Text
            style={[
              styles.ticker,
              {
                color: colors.text.primary,
                fontFamily: typography.display.fontFamily,
              },
            ]}
          >
            {`${curr}${position.ticker}`}
          </Text>
          <DirectionBadge />
        </View>

        <Text
          style={[
            styles.companyName,
            {
              color: colors.text.secondary,
              fontFamily: typography.body.fontFamily,
              marginTop: -4,
              marginBottom: spacing.sm,
            },
          ]}
        >
          {position.companyName}
        </Text>

        {/* Row: Position size / Entry price / Entry total */}
        <DataRow
          items={[
            { label: "Position size", value: `${position.quantity} Shares` },
            { label: "Entry price", value: formatMoney(position.entryPrice) },
            { label: "Entry total", value: formatMoney(entryTotal) },
          ]}
          colors={colors}
          typography={typography}
        />

        {/* Row: Current price / Current total */}
        <DataRow
          items={[
            {
              label: "Current price",
              value: formatMoney(position.currentPrice),
            },
            { label: "Current total", value: formatMoney(currentTotal) },
          ]}
          colors={colors}
          typography={typography}
        />

        {/* Row: Take profit / Potential gain */}
        <DataRow
          items={[
            {
              label: "Take profit",
              value:
                position.takeProfitPrice != null
                  ? formatMoney(position.takeProfitPrice)
                  : undefined,
              notSet: position.takeProfitPrice == null,
            },
            {
              label: "Potential gain",
              value:
                potentialGain != null
                  ? formatMoney(potentialGain, true)
                  : undefined,
              notSet: potentialGain == null,
              valueColor:
                potentialGain != null && potentialGain >= 0
                  ? colors.primary.main
                  : colors.danger.main,
            },
          ]}
          colors={colors}
          typography={typography}
        />

        {/* Row: Stop loss / Potential loss */}
        <DataRow
          items={[
            {
              label: "Stop loss",
              value:
                position.stopLossPrice != null
                  ? formatMoney(position.stopLossPrice)
                  : undefined,
              notSet: position.stopLossPrice == null,
            },
            {
              label: "Potential loss",
              value:
                potentialLoss != null
                  ? formatMoney(potentialLoss, true)
                  : undefined,
              notSet:
                potentialLoss == null ||
                position.stopLossPrice == null,
              valueColor: colors.danger.main,
            },
          ]}
          colors={colors}
          typography={typography}
        />
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.cardContainer,
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
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <ThesisPage />
        <DataPage />
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {[0, 1].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === activeIndex
                    ? colors.text.primary
                    : colors.text.disabled,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

// Helper component for data rows
interface DataRowItem {
  label: string;
  value?: string;
  notSet?: boolean;
  valueColor?: string;
}

interface DataRowProps {
  items: DataRowItem[];
  colors: ReturnType<typeof useTheme>["colors"];
  typography: ReturnType<typeof useTheme>["typography"];
}

function DataRow({ items, colors, typography }: DataRowProps) {
  return (
    <View style={styles.dataRow}>
      {items.map((item, i) => (
        <View key={i} style={styles.dataCell}>
          <Text
            style={[
              styles.dataLabel,
              {
                color: colors.text.secondary,
                fontFamily: typography.body.fontFamily,
              },
            ]}
          >
            {item.label}
          </Text>
          {item.notSet ? (
            <Text
              style={[
                styles.dataNotSet,
                {
                  color: colors.text.disabled,
                  fontFamily: typography.body.fontFamily,
                  fontStyle: "italic",
                },
              ]}
            >
              Not set
            </Text>
          ) : (
            <Text
              style={[
                styles.dataValue,
                {
                  color: item.valueColor ?? colors.text.primary,
                  fontFamily: typography.data.fontFamily,
                },
              ]}
            >
              {item.value ?? "––"}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    overflow: "hidden",
  },
  page: {
    overflow: "hidden",
  },
  pageContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  positionLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  ticker: {
    fontSize: 28,
    marginBottom: 2,
  },
  companyName: {
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "500",
  },
  thesisText: {
    fontSize: 15,
    marginTop: 16,
  },
  thesisFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 20,
  },
  metaLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  gainValue: {
    fontSize: 22,
  },
  percentValue: {
    fontSize: 16,
  },
  rightAlign: {
    alignItems: "flex-end",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingBottom: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dataRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  dataCell: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 15,
  },
  dataNotSet: {
    fontSize: 15,
  },
});
