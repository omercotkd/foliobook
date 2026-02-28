import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useTheme } from "@/providers";
import { Button } from "@/components";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { LogoIcon } from "@/components/icons/LogoIcon";
import i18n from "@/i18n";

export default function LoginScreen() {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const handleGoogleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Wire up Firebase Google Auth
    console.log("Google login pressed");
  };

  const handleEmailLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Navigate to email auth screen
    console.log("Email login pressed");
  };

  const handleGuestContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to main app in guest mode
    router.replace("/home");
  };

  const handleTermsPress = () => {
    Linking.openURL("https://foliobook.app/terms");
  };

  const handlePrivacyPress = () => {
    Linking.openURL("https://foliobook.app/privacy");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={[styles.logoSection, { gap: spacing.xs }]}>
          <LogoIcon size={56} color={colors.primary.main} />
          <Text
            style={[
              styles.brandName,
              {
                color: colors.text.secondary,
                fontFamily: typography.brandName.fontFamily,
                fontSize: typography.brandName.fontSize,
                letterSpacing: typography.brandName.letterSpacing,
              },
            ]}
          >
            foliobook
          </Text>
        </View>

        {/* Welcome Title */}
        <Text
          style={[
            styles.welcomeTitle,
            {
              color: colors.text.primary,
              fontFamily: typography.display.fontFamily,
              fontSize: 60,
              letterSpacing: typography.display.letterSpacing,
            },
          ]}
        >
          {i18n.t("welcome.title")}
        </Text>

        {/* Auth Buttons */}
        <View style={[styles.buttonsSection, { gap: spacing.sm }]}>
          <Button
            label={i18n.t("welcome.continueWithGoogle")}
            onPress={handleGoogleLogin}
            variant="secondary"
            icon={<GoogleIcon size={22} />}
          />
          <Button
            label={i18n.t("welcome.signInWithEmail")}
            onPress={handleEmailLogin}
            variant="primary"
          />
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            onPress={handleGuestContinue}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.guestText,
                {
                  color: colors.primary.main,
                  fontFamily: typography.body.fontFamily,
                },
              ]}
            >
              {i18n.t("welcome.continueAsGuest")}
            </Text>
          </TouchableOpacity>

          <View style={[styles.legalSection, { marginTop: spacing.md }]}>
            <Text
              style={[
                styles.legalText,
                {
                  color: colors.text.secondary,
                  fontFamily: typography.body.fontFamily,
                },
              ]}
            >
              {i18n.t("welcome.termsPrefix")}
              <Text
                style={{ color: colors.primary.main }}
                onPress={handleTermsPress}
              >
                {i18n.t("welcome.termsOfService")}
              </Text>
              {i18n.t("welcome.termsAnd")}
              <Text
                style={{ color: colors.primary.main }}
                onPress={handlePrivacyPress}
              >
                {i18n.t("welcome.privacyPolicy")}
              </Text>
              {i18n.t("welcome.termsSuffix")}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    
  },
  logoSection: {
    alignItems: "center",
    marginTop: 48,
  },
  brandName: {
    fontSize: 14,
    fontWeight: "400",
  },
  welcomeTitle: {
    textAlign: "center",
    marginTop: -40,
  },
  buttonsSection: {
    marginBottom: 16,
  },
  bottomSection: {
    alignItems: "center",
    paddingBottom: 24,
  },
  guestText: {
    fontSize: 16,
    fontWeight: "500",
  },
  legalSection: {
    alignItems: "center",
  },
  legalText: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});
