import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useTheme } from "@/providers";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components";
import { IconButton } from "@/components";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import i18n from "@/i18n";

export function EmailAuthScreen() {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const { sendMagicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendLink = async () => {
    if (!isValidEmail) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    try {
      await sendMagicLink(email);
      setIsSent(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Failed to send magic link:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        i18n.t("emailAuth.errorTitle"),
        i18n.t("emailAuth.errorMessage")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLoading(true);

    try {
      await sendMagicLink(email);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: spacing.sm }]}>
          <IconButton
            onPress={handleBack}
            icon={<ChevronLeftIcon size={24} color={colors.text.primary} />}
          />
        </View>

        <View style={[styles.content, { paddingHorizontal: spacing.md }]}>
          {!isSent ? (
            /* Email Input State */
            <>
              <View style={[styles.titleSection, { gap: spacing.xs }]}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: colors.text.primary,
                      fontFamily: typography.display.fontFamily,
                      fontSize: 32,
                      letterSpacing: typography.display.letterSpacing,
                    },
                  ]}
                >
                  {i18n.t("emailAuth.title")}
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    {
                      color: colors.text.secondary,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                    },
                  ]}
                >
                  {i18n.t("emailAuth.subtitle")}
                </Text>
              </View>

              <View style={[styles.inputSection, { gap: spacing.sm }]}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text.secondary,
                      fontFamily: typography.body.fontFamily,
                    },
                  ]}
                >
                  {i18n.t("emailAuth.emailLabel")}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.inputBackground,
                      color: colors.text.primary,
                      borderColor: colors.border,
                      borderRadius: borderRadius.medium,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      paddingHorizontal: spacing.sm,
                      paddingVertical: spacing.sm,
                    },
                  ]}
                  placeholder={i18n.t("emailAuth.emailPlaceholder")}
                  placeholderTextColor={colors.text.disabled}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoFocus
                />
              </View>

              <View style={{ marginTop: spacing.md }}>
                <Button
                  label={i18n.t("emailAuth.sendLink")}
                  onPress={handleSendLink}
                  variant="primary"
                  loading={isLoading}
                  disabled={!isValidEmail}
                />
              </View>
            </>
          ) : (
            /* Link Sent State */
            <>
              <View style={[styles.titleSection, { gap: spacing.xs }]}>
                <Text style={styles.checkIcon}>✉️</Text>
                <Text
                  style={[
                    styles.title,
                    {
                      color: colors.text.primary,
                      fontFamily: typography.display.fontFamily,
                      fontSize: 32,
                      letterSpacing: typography.display.letterSpacing,
                    },
                  ]}
                >
                  {i18n.t("emailAuth.checkInboxTitle")}
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    {
                      color: colors.text.secondary,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                    },
                  ]}
                >
                  {i18n.t("emailAuth.checkInboxSubtitle", { email })}
                </Text>
              </View>

              <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
                <Button
                  label={i18n.t("emailAuth.resendLink")}
                  onPress={handleResend}
                  variant="secondary"
                  loading={isLoading}
                />
                <Button
                  label={i18n.t("emailAuth.changeEmail")}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setIsSent(false);
                  }}
                  variant="ghost"
                />
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontWeight: "700",
  },
  subtitle: {
    lineHeight: 22,
  },
  inputSection: {},
  label: {
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
  },
  checkIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
});
