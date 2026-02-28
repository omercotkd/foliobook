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
import * as Haptics from "expo-haptics";
import { useTheme } from "@/providers";
import { CloseIcon } from "@/components/icons/CloseIcon";
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
const ITEM_HEIGHT = 64;

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
    size = 48,
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
          borderRadius: borderRadius.medium,
          paddingHorizontal: spacing.sm,
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
      {showCheck && (
        <CheckCircleIcon size={24} color={colors.primary.main} />
      )}
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
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: colors.surface,
                  borderRadius: borderRadius.large,
                },
              ]}
            >
              {/* Header */}
              <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: colors.text.primary,
                      fontFamily: typography.display.fontFamily,
                      fontSize: 24,
                    },
                  ]}
                >
                  {i18n.t("switchAccount.title")}
                </Text>
                <TouchableOpacity
                  onPress={handleClose}
                  activeOpacity={0.7}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <CloseIcon size={22} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>

              {/* Current section */}
              {currentPortfolio && (
                <View style={[styles.section, { paddingHorizontal: spacing.md }]}>
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
                <View style={[styles.section, { paddingHorizontal: spacing.md }]}>
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
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    paddingVertical: spacing.sm,
                  },
                ]}
              >
                <PlusCircleIcon size={22} color={colors.text.disabled} />
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
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 8,
  },
  title: {
    flex: 1,
  },
  section: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 12,
  },
  portfolioRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 14,
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
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  portfolioBroker: {
    fontSize: 13,
  },
  addAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addAccountText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
