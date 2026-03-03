import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/providers";
import { CheckCircleIcon } from "@/components/icons/CheckCircleIcon";
import { PlusCircleIcon } from "@/components/icons/PlusCircleIcon";
import i18n from "@/i18n";
import type { Portfolio } from "@foliobook/shared-types";

interface SwitchAccountModalProps {
  visible: boolean;
  onClose: () => void;
  currentPortfolioId: string;
  portfolios: Portfolio[];
  onSelect: (portfolio: Portfolio) => void;
  onAddAccount: () => void;
}

const MAX_VISIBLE_ITEMS = 3;
const ITEM_HEIGHT = 56;

export function SwitchAccountModal({
  visible,
  onClose,
  currentPortfolioId,
  portfolios,
  onSelect,
  onAddAccount,
}: SwitchAccountModalProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const currentPortfolio = portfolios.find((p) => p.id === currentPortfolioId);
  const otherPortfolios = portfolios.filter((p) => p.id !== currentPortfolioId);
  const isScrollable = otherPortfolios.length > MAX_VISIBLE_ITEMS;

  const handleSelect = (portfolio: Portfolio) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(portfolio);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleAddAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddAccount();
  };

  const PortfolioAvatar = ({
    portfolio,
    size = 40,
  }: {
    portfolio: Portfolio;
    size?: number;
  }) => (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: portfolio.avatarColor,
        },
      ]}
    >
      <Text
        style={[
          styles.avatarText,
          {
            color: colors.primary.on,
            fontFamily: typography.body.fontFamily,
            fontSize: size * 0.3,
          },
        ]}
      >
        {portfolio.brokerAbbr}
      </Text>
    </View>
  );

  const PortfolioRow = ({
    portfolio,
    showCheck = false,
    onPress,
    highlighted = false,
  }: {
    portfolio: Portfolio;
    showCheck?: boolean;
    onPress?: () => void;
    highlighted?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        styles.portfolioRow,
        highlighted && {
          backgroundColor: colors.inputBackground,
          borderRadius: borderRadius.small,
        },
      ]}
    >
      <PortfolioAvatar portfolio={portfolio} />
      <View style={styles.portfolioInfo}>
        <Text
          style={[
            styles.portfolioName,
            {
              color: colors.text.primary,
              fontFamily: typography.body.fontFamily,
            },
          ]}
        >
          {portfolio.name}
        </Text>
        <Text
          style={[
            styles.portfolioBroker,
            {
              color: colors.text.secondary,
              fontFamily: typography.body.fontFamily,
            },
          ]}
        >
          {portfolio.broker}
        </Text>
      </View>
      {showCheck && <CheckCircleIcon size={20} color={colors.primary.main} />}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <BlurView
          intensity={85}
          tint="default"
          style={styles.overlay}
        >
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.popup,
                {
                  backgroundColor: colors.surface,
                  borderRadius: borderRadius.medium,
                },
              ]}
            >
              {/* Triangle pointer → points up toward the Switch button (top-left) */}
              <View
                style={[
                  styles.triangle,
                  { borderBottomColor: colors.surface },
                ]}
              />

              {/* Header */}
              <View style={styles.header}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: colors.text.primary,
                      fontFamily: typography.display.fontFamily,
                    },
                  ]}
                >
                  {i18n.t("switchAccount.title")}
                </Text>
              </View>

              {/* Current section */}
              {currentPortfolio && (
                <View style={styles.section}>
                  <Text
                    style={[
                      styles.sectionLabel,
                      {
                        color: colors.text.disabled,
                        fontFamily: typography.body.fontFamily,
                        letterSpacing: 2,
                      },
                    ]}
                  >
                    {i18n.t("switchAccount.current")}
                  </Text>
                  <PortfolioRow
                    portfolio={currentPortfolio}
                    showCheck
                    highlighted
                  />
                </View>
              )}

              {/* Other portfolios section */}
              {otherPortfolios.length > 0 && (
                <View style={styles.section}>
                  <Text
                    style={[
                      styles.sectionLabel,
                      {
                        color: colors.text.disabled,
                        fontFamily: typography.body.fontFamily,
                        letterSpacing: 2,
                      },
                    ]}
                  >
                    {i18n.t("switchAccount.otherPortfolios")}
                  </Text>
                  <ScrollView
                    style={
                      isScrollable
                        ? { maxHeight: MAX_VISIBLE_ITEMS * ITEM_HEIGHT }
                        : undefined
                    }
                    showsVerticalScrollIndicator={isScrollable}
                    scrollEnabled={isScrollable}
                  >
                    {otherPortfolios.map((portfolio) => (
                      <PortfolioRow
                        key={portfolio.id}
                        portfolio={portfolio}
                        onPress={() => handleSelect(portfolio)}
                      />
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Add Account button */}
              <TouchableOpacity
                onPress={handleAddAccount}
                activeOpacity={0.7}
                style={[
                  styles.addAccountButton,
                  {
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: colors.border,
                  },
                ]}
              >
                <PlusCircleIcon size={20} color={colors.text.disabled} />
                <Text
                  style={[
                    styles.addAccountText,
                    {
                      color: colors.text.disabled,
                      fontFamily: typography.body.fontFamily,
                    },
                  ]}
                >
                  {i18n.t("switchAccount.addAccount")}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 60,
    paddingLeft: 20,
  },
  popup: {
    width: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  triangle: {
    position: "absolute",
    top: -10,
    left: 14,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 8,
  },
  portfolioRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    gap: 12,
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontWeight: "600",
    textTransform: "uppercase",
  },
  portfolioInfo: {
    flex: 1,
  },
  portfolioName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 1,
  },
  portfolioBroker: {
    fontSize: 12,
  },
  addAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  addAccountText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
