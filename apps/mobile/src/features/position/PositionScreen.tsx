import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useTheme } from "@/providers";
import { IconButton } from "@/components";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { GearIcon } from "@/components/icons/GearIcon";
import { PositionSettingsPopup } from "./PositionSettingsPopup";
import { OverviewTab } from "./OverviewTab";
import { ChartTab } from "./ChartTab";
import { NewsTab } from "./NewsTab";
import i18n from "@/i18n";
import type { Position, NewsArticle } from "@foliobook/shared-types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TABS = ["overview", "chart", "news"] as const;
type TabKey = (typeof TABS)[number];

interface PositionScreenProps {
  positionId?: string;
}

// ─── Mock data ───────────────────────────────────────────────
const MOCK_POSITION: Position = {
  id: "1",
  ticker: "AAPL",
  companyName: "Apple Inc.",
  direction: "long",
  quantity: 45,
  entryPrice: 164.85,
  currentPrice: 192.42,
  currency: "$",
  exchange: "NASDAQ",
  sector: "Technology",
  takeProfitPrice: 210.0,
  stopLossPrice: 158.5,
  thesis: {
    id: "t1",
    ticker: "AAPL",
    entryPrice: 164.85,
    why: "AI integration into iPhone ecosystem expected to boost services revenue.",
    targetPrice: 210.0,
    stopPrice: 158.5,
    createdAt: Date.now(),
  },
};

const MOCK_NEWS: NewsArticle[] = [
  {
    id: "n1",
    title: "Analysts Increase Price Target as Services Growth Accelerates",
    source: "Financial Times",
    timeAgo: "2H AGO",
    summary:
      "Major investment banks are revising their outlook for the tech giant following a...",
    url: "https://example.com",
  },
  {
    id: "n2",
    title: "New Product Launch Scheduled for Late September",
    source: "Tech Insider",
    timeAgo: "5H AGO",
    summary:
      "Sources close to the supply chain suggest that the upcoming flagship device producti...",
    url: "https://example.com",
  },
  {
    id: "n3",
    title: "Strategic Partnership in AI Infrastructure Confirmed",
    source: "Bloomberg News",
    timeAgo: "8H AGO",
    summary:
      "The company has reached a landmark agreement to utilize next-generation chip...",
    url: "https://example.com",
  },
  {
    id: "n4",
    title: "Quarterly Dividend Payout Declared for Shareholders",
    source: "Market Watch",
    timeAgo: "12H AGO",
    summary:
      "The board of directors announced a 5% increase in the quarterly cash dividend,...",
    url: "https://example.com",
  },
];

// ─── Screen ──────────────────────────────────────────────────
export function PositionScreen({ positionId }: PositionScreenProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  // In a real app we'd look up by positionId — for now use mock
  const position = MOCK_POSITION;

  const [activeTab, setActiveTab] = useState(0);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSettingsVisible(true);
  };

  const handleTabPress = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(index);
    scrollViewRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== activeTab && index >= 0 && index < TABS.length) {
      setActiveTab(index);
    }
  };

  const tabLabels: Record<TabKey, string> = {
    overview: i18n.t("positionDetail.overview"),
    chart: i18n.t("positionDetail.chart"),
    news: i18n.t("positionDetail.news"),
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* ── Header ── */}
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <IconButton
          icon={<ChevronLeftIcon size={22} color={colors.text.primary} />}
          onPress={handleBack}
        />
        <Text
          style={[
            styles.headerTitle,
            {
              color: colors.text.primary,
              fontFamily: typography.display.fontFamily,
            },
          ]}
        >
          {`$${position.ticker}`}
        </Text>
        <IconButton
          icon={<GearIcon size={20} color={colors.text.primary} />}
          onPress={handleSettings}
        />
      </View>

      {/* ── Tab bar ── */}
      <View
        style={[
          styles.tabBar,
          {
            marginHorizontal: spacing.md,
            backgroundColor: colors.inputBackground,
            borderRadius: borderRadius.medium,
          },
        ]}
      >
        {TABS.map((tab, index) => {
          const isActive = index === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabPress(index)}
              activeOpacity={0.7}
              style={[
                styles.tabButton,
                {
                  backgroundColor: isActive ? colors.surface : "transparent",
                  borderRadius: borderRadius.medium - 4,
                  shadowColor: isActive ? "#000" : "transparent",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: isActive ? 0.08 : 0,
                  shadowRadius: 4,
                  elevation: isActive ? 2 : 0,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive
                      ? colors.text.primary
                      : colors.text.secondary,
                    fontFamily: typography.body.fontFamily,
                    fontWeight: isActive ? "600" : "400",
                  },
                ]}
              >
                {tabLabels[tab]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Swipeable tab content ── */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.pager}
      >
        <View style={{ width: SCREEN_WIDTH }}>
          <OverviewTab position={position} />
        </View>
        <View style={{ width: SCREEN_WIDTH }}>
          <ChartTab position={position} />
        </View>
        <View style={{ width: SCREEN_WIDTH }}>
          <NewsTab articles={MOCK_NEWS} />
        </View>
      </ScrollView>

      {/* ── Settings popup ── */}
      <PositionSettingsPopup
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onToggleNotifications={(enabled) =>
          console.log("Notifications:", enabled)
        }
        onSetPriceAlert={() => {
          setSettingsVisible(false);
          console.log("Set price alert");
        }}
        onRemovePosition={() => {
          setSettingsVisible(false);
          console.log("Remove position");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 18,
    letterSpacing: 0.5,
  },
  tabBar: {
    flexDirection: "row",
    padding: 4,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  tabLabel: {
    fontSize: 15,
  },
  pager: {
    flex: 1,
  },
});
