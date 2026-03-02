import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/providers";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { CheckCircleIcon } from "@/components/icons/CheckCircleIcon";
import { BadgeIcon } from "@/components/icons/BadgeIcon";
import { SearchBar } from "@/components/SearchBar";
import i18n from "@/i18n";

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  price?: string;
  onSubscribe: () => void;
}

interface Benefit {
  titleKey: string;
  descriptionKey: string;
}

const BENEFITS: Benefit[] = [
  {
    titleKey: "subscription.benefits.unlimitedPortfolios",
    descriptionKey: "subscription.benefits.unlimitedPortfoliosDesc",
  },
  {
    titleKey: "subscription.benefits.realTimeSync",
    descriptionKey: "subscription.benefits.realTimeSyncDesc",
  },
  {
    titleKey: "subscription.benefits.advancedAnalytics",
    descriptionKey: "subscription.benefits.advancedAnalyticsDesc",
  },
];

interface Broker {
  name: string;
  abbr: string;
  color: string;
}

const SUPPORTED_BROKERS: Broker[] = [
  { name: "Interactive Brokers", abbr: "IB", color: "#D4322C" },
  { name: "Robinhood", abbr: "RH", color: "#00C805" },
  { name: "TD Ameritrade", abbr: "TD", color: "#2D8B3C" },
  { name: "Charles Schwab", abbr: "CS", color: "#00A3E0" },
];

export function SubscriptionModal({
  visible,
  onClose,
  price = "$9.99/mo",
  onSubscribe,
}: SubscriptionModalProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const [step, setStep] = useState<1 | 2>(1);
  const [brokerSearch, setBrokerSearch] = useState("");

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(1);
    setBrokerSearch("");
    onClose();
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep(2);
  };

  const handleSubscribe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSubscribe();
  };

  const handleTermsPress = () => {
    Linking.openURL("https://foliobook.app/terms");
  };

  const handlePrivacyPress = () => {
    Linking.openURL("https://foliobook.app/privacy");
  };

  const renderStep1 = () => (
    <>
      {/* Badge Icon */}
      <View style={styles.badgeContainer}>
        <View
          style={[
            styles.badgeCircle,
            { backgroundColor: colors.primary.subtle },
          ]}
        >
          <BadgeIcon size={32} color={colors.primary.main} />
        </View>
      </View>

      {/* Title */}
      <Text
        style={[
          styles.heroTitle,
          {
            color: colors.text.primary,
            fontFamily: typography.display.fontFamily,
          },
        ]}
      >
        {i18n.t("subscription.title")}
      </Text>

      {/* Benefits List */}
      <View style={[styles.benefitsList, { gap: spacing.md }]}>
        {BENEFITS.map((benefit, index) => (
          <View key={index} style={styles.benefitRow}>
            <CheckCircleIcon size={22} color={colors.primary.main} />
            <View style={styles.benefitText}>
              <Text
                style={[
                  styles.benefitTitle,
                  {
                    color: colors.text.primary,
                    fontFamily: typography.body.fontFamily,
                  },
                ]}
              >
                {i18n.t(benefit.titleKey)}
              </Text>
              <Text
                style={[
                  styles.benefitDescription,
                  {
                    color: colors.text.secondary,
                    fontFamily: typography.body.fontFamily,
                  },
                ]}
              >
                {i18n.t(benefit.descriptionKey)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        onPress={handleContinue}
        activeOpacity={0.8}
        style={[
          styles.primaryButton,
          {
            backgroundColor: colors.primary.main,
            borderRadius: borderRadius.large,
          },
        ]}
      >
        <Text
          style={[
            styles.primaryButtonText,
            {
              color: colors.primary.on,
              fontFamily: typography.body.fontFamily,
            },
          ]}
        >
          {i18n.t("subscription.continue")}
        </Text>
      </TouchableOpacity>

      {/* Cancel */}
      <TouchableOpacity
        onPress={handleClose}
        activeOpacity={0.7}
        style={styles.cancelButton}
      >
        <Text
          style={[
            styles.cancelText,
            {
              color: colors.text.disabled,
              fontFamily: typography.body.fontFamily,
            },
          ]}
        >
          {i18n.t("subscription.cancel")}
        </Text>
      </TouchableOpacity>

      {/* Legal Links */}
      <View style={styles.legalRow}>
        <TouchableOpacity onPress={handleTermsPress} activeOpacity={0.7}>
          <Text
            style={[
              styles.legalLink,
              {
                color: colors.text.disabled,
                fontFamily: typography.body.fontFamily,
              },
            ]}
          >
            {i18n.t("subscription.termsOfService")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePrivacyPress} activeOpacity={0.7}>
          <Text
            style={[
              styles.legalLink,
              {
                color: colors.text.disabled,
                fontFamily: typography.body.fontFamily,
              },
            ]}
          >
            {i18n.t("subscription.privacyPolicy")}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      {/* Header with close */}
      <View style={[styles.step2Header, { paddingHorizontal: spacing.md }]}>
        <Text
          style={[
            styles.heroTitle,
            {
              color: colors.text.primary,
              fontFamily: typography.display.fontFamily,
              flex: 1,
              textAlign: "left",
            },
          ]}
        >
          {i18n.t("subscription.brokerTitle")}
        </Text>
        <TouchableOpacity
          onPress={handleClose}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <CloseIcon size={22} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: spacing.md }}>
        <SearchBar
          value={brokerSearch}
          onChangeText={setBrokerSearch}
          placeholder={i18n.t("subscription.searchBrokerPlaceholder")}
        />
      </View>

      {/* Supported Platforms Label */}
      <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.md }}>
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
          {i18n.t("subscription.supportedPlatforms")}
        </Text>
      </View>

      {/* Broker List */}
      <ScrollView
        style={styles.brokerList}
        contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.xs }}
        showsVerticalScrollIndicator={false}
      >
        {SUPPORTED_BROKERS.map((broker, index) => (
          <View
            key={index}
            style={[
              styles.brokerRow,
              {
                backgroundColor: colors.inputBackground,
                borderRadius: borderRadius.medium,
              },
            ]}
          >
            <View
              style={[
                styles.brokerAvatar,
                { backgroundColor: broker.color },
              ]}
            >
              <Text style={styles.brokerAvatarText}>{broker.abbr}</Text>
            </View>
            <Text
              style={[
                styles.brokerName,
                {
                  color: colors.text.primary,
                  fontFamily: typography.body.fontFamily,
                },
              ]}
            >
              {broker.name}
            </Text>
            <CheckCircleIcon size={22} color={colors.primary.main} />
          </View>
        ))}
      </ScrollView>

      {/* Disclaimer */}
      <Text
        style={[
          styles.disclaimer,
          {
            color: colors.text.secondary,
            fontFamily: typography.body.fontFamily,
          },
        ]}
      >
        {i18n.t("subscription.brokerDisclaimer")}
      </Text>

      {/* Subscribe Button */}
      <View style={{ paddingHorizontal: spacing.md }}>
        <TouchableOpacity
          onPress={handleSubscribe}
          activeOpacity={0.8}
          style={[
            styles.primaryButton,
            {
              backgroundColor: colors.primary.main,
              borderRadius: borderRadius.large,
            },
          ]}
        >
          <Text
            style={[
              styles.primaryButtonText,
              {
                color: colors.primary.on,
                fontFamily: typography.body.fontFamily,
              },
            ]}
          >
            {i18n.t("subscription.subscribeFor", { price })}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Secure Connection */}
      <Text
        style={[
          styles.secureText,
          {
            color: colors.text.disabled,
            fontFamily: typography.body.fontFamily,
          },
        ]}
      >
        {i18n.t("subscription.secureConnection")}
      </Text>

      {/* Legal Links */}
      <View style={styles.legalRow}>
        <TouchableOpacity onPress={handleTermsPress} activeOpacity={0.7}>
          <Text
            style={[
              styles.legalLink,
              {
                color: colors.text.disabled,
                fontFamily: typography.body.fontFamily,
              },
            ]}
          >
            {i18n.t("subscription.termsOfService")}
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.legalDot,
            { color: colors.text.disabled },
          ]}
        >
          •
        </Text>
        <TouchableOpacity onPress={handlePrivacyPress} activeOpacity={0.7}>
          <Text
            style={[
              styles.legalLink,
              {
                color: colors.text.disabled,
                fontFamily: typography.body.fontFamily,
              },
            ]}
          >
            {i18n.t("subscription.privacyPolicy")}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: colors.background,
                  borderTopLeftRadius: borderRadius.large,
                  borderTopRightRadius: borderRadius.large,
                },
              ]}
            >
              {/* Drag Handle */}
              <View style={styles.handleContainer}>
                <View
                  style={[
                    styles.handle,
                    { backgroundColor: colors.text.disabled },
                  ]}
                />
              </View>

              {step === 1 ? renderStep1() : renderStep2()}
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
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    paddingBottom: 32,
    overflow: "hidden",
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.4,
  },
  badgeContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  badgeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 24,
  },
  benefitsList: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  benefitDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    marginHorizontal: 24,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    alignItems: "center",
    marginTop: 16,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  legalRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 16,
  },
  legalLink: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  legalDot: {
    fontSize: 11,
  },
  step2Header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  brokerList: {
    maxHeight: 320,
  },
  brokerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 14,
  },
  brokerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  brokerAvatarText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  brokerName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  disclaimer: {
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 32,
    marginTop: 16,
    marginBottom: 16,
    lineHeight: 18,
  },
  secureText: {
    fontSize: 11,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 16,
  },
});
