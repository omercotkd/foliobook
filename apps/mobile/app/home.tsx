import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/providers";
import { IconButton, SearchBar, PositionCard, SwitchAccountModal } from "@/components";
import { ArrowSwitchIcon } from "@/components/icons/ArrowSwitchIcon";
import { ProfileIcon } from "@/components/icons/ProfileIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import i18n from "@/i18n";
import type { Position, Portfolio } from "@foliobook/shared-types";

// Mock data — will be replaced with Firestore/local data
const MOCK_POSITIONS: Position[] = [
  {
    id: "1",
    ticker: "AAPL",
    companyName: "Apple Inc.",
    direction: "long",
    quantity: 25,
    entryPrice: 198.0,
    currentPrice: 247.62,
    currency: "$",
    takeProfitPrice: 155.0,
    stopLossPrice: 195.2,
    thesis: {
      id: "t1",
      ticker: "AAPL",
      entryPrice: 198.0,
      why: "AI integration into iPhone 17 expected to boost ecosystem growth and services revenue significantly in Q4.",
      targetPrice: 155.0,
      stopPrice: 195.2,
      createdAt: Date.now(),
    },
  },
  {
    id: "2",
    ticker: "TSLA",
    companyName: "Tesla Inc.",
    direction: "short",
    quantity: 50,
    entryPrice: 185.5,
    currentPrice: 175.3,
    currency: "$",
    takeProfitPrice: 155.0,
    stopLossPrice: 195.2,
    thesis: {
      id: "t2",
      ticker: "TSLA",
      entryPrice: 185.5,
      why: "Overvalued relative to delivery numbers. Expecting a pullback after earnings miss.",
      targetPrice: 155.0,
      stopPrice: 195.2,
      createdAt: Date.now(),
    },
  },
  {
    id: "3",
    ticker: "NVDA",
    companyName: "NVIDIA Corp.",
    direction: "long",
    quantity: 10,
    entryPrice: 820.0,
    currentPrice: 880.15,
    currency: "€",
    thesis: {
      id: "t3",
      ticker: "NVDA",
      entryPrice: 820.0,
      why: "Dominant AI chip position with strong data center revenue growth.",
      createdAt: Date.now(),
    },
  },
];

// Mock portfolio data — will be replaced with Firestore/local data
const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    id: "p1",
    name: "Main Trading",
    broker: "Interactive Brokers",
    brokerAbbr: "IB",
    avatarColor: "#C8B88A",
  },
  {
    id: "p2",
    name: "Growth Tech",
    broker: "Robinhood",
    brokerAbbr: "RH",
    avatarColor: "#2C3E3A",
  },
  {
    id: "p3",
    name: "Retirement IRA",
    broker: "Schwab",
    brokerAbbr: "CS",
    avatarColor: "#3A5A4A",
  },
  {
    id: "p4",
    name: "Dividend Fund",
    broker: "Fidelity",
    brokerAbbr: "FI",
    avatarColor: "#4A5A4A",
  },
];

export default function PortfolioScreen() {
  const { colors, typography, spacing } = useTheme();
  const [switchAccountVisible, setSwitchAccountVisible] = useState(false);
  const [currentPortfolioId, setCurrentPortfolioId] = useState("p1");

  const handleSwitchBroker = () => {
    setSwitchAccountVisible(true);
  };

  const handleProfile = () => {
    // TODO: Navigate to profile screen
    console.log("Profile pressed");
  };

  const handleAddPosition = () => {
    // TODO: Navigate to add position flow
    console.log("Add position pressed");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Top bar */}
      <View style={[styles.topBar, { paddingHorizontal: spacing.md }]}>
        <IconButton
          icon={<ArrowSwitchIcon size={20} color={colors.text.primary} />}
          onPress={handleSwitchBroker}
        />
        <IconButton
          icon={<ProfileIcon size={20} color={colors.text.primary} />}
          onPress={handleProfile}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text
          style={[
            styles.title,
            {
              color: colors.text.primary,
              fontFamily: typography.display.fontFamily,
              fontSize: typography.display.fontSize,
              marginBottom: spacing.sm,
            },
          ]}
        >
          {i18n.t("portfolio.title")}
        </Text>

        {/* Search bar */}
        <SearchBar placeholder={i18n.t("portfolio.searchPlaceholder")} />

        {/* Position cards */}
        <View style={[styles.cardsSection, { gap: spacing.sm }]}>
          {MOCK_POSITIONS.map((position) => (
            <PositionCard key={position.id} position={position} />
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <IconButton
          icon={<PlusIcon size={26} color={colors.primary.on} />}
          onPress={handleAddPosition}
          size={56}
          variant="floating"
        />
      </View>

      {/* Switch Account Modal */}
      <SwitchAccountModal
        visible={switchAccountVisible}
        onClose={() => setSwitchAccountVisible(false)}
        currentPortfolioId={currentPortfolioId}
        portfolios={MOCK_PORTFOLIOS}
        onSelect={(portfolio) => {
          setCurrentPortfolioId(portfolio.id);
          setSwitchAccountVisible(false);
        }}
        onAddAccount={() => {
          // TODO: Navigate to add account flow
          console.log("Add account pressed");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  title: {
    marginTop: 8,
  },
  cardsSection: {
    marginTop: 16,
  },
  fabContainer: {
    position: "absolute",
    bottom: 32,
    right: 24,
  },
});
