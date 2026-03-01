import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/providers";
import { ProfileIcon } from "@/components/icons/ProfileIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { AccountSettingsIcon } from "@/components/icons/AccountSettingsIcon";
import { ShieldIcon } from "@/components/icons/ShieldIcon";
import { BellIcon } from "@/components/icons/BellIcon";
import { HelpCircleIcon } from "@/components/icons/HelpCircleIcon";
import { LogOutIcon } from "@/components/icons/LogOutIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import i18n from "@/i18n";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  displayName: string;
  membershipLabel?: string;
  notificationCount?: number;
  onAccountSettings?: () => void;
  onSecurity?: () => void;
  onNotifications?: () => void;
  onHelpAndSupport?: () => void;
  onLogOut?: () => void;
  onEditAvatar?: () => void;
}

export function SettingsModal({
  visible,
  onClose,
  displayName,
  membershipLabel,
  notificationCount = 0,
  onAccountSettings,
  onSecurity,
  onNotifications,
  onHelpAndSupport,
  onLogOut,
  onEditAvatar,
}: SettingsModalProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handlePress = (callback?: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    callback?.();
  };

  const menuItems = [
    {
      icon: <AccountSettingsIcon size={22} color={colors.text.secondary} />,
      label: i18n.t("settings.accountSettings"),
      onPress: onAccountSettings,
    },
    {
      icon: <ShieldIcon size={22} color={colors.text.secondary} />,
      label: i18n.t("settings.security"),
      onPress: onSecurity,
    },
    {
      icon: <BellIcon size={22} color={colors.text.secondary} />,
      label: i18n.t("settings.notifications"),
      onPress: onNotifications,
      badge: notificationCount > 0 ? `${notificationCount} ${i18n.t("settings.newBadge")}` : undefined,
    },
    {
      icon: <HelpCircleIcon size={22} color={colors.text.secondary} />,
      label: i18n.t("settings.helpAndSupport"),
      onPress: onHelpAndSupport,
    },
  ];

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
                styles.modalContainer,
                {
                  backgroundColor: colors.surface,
                  borderRadius: borderRadius.large,
                },
              ]}
            >
              {/* Avatar Section */}
              <View style={styles.avatarSection}>
                <View style={styles.avatarWrapper}>
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: colors.border },
                    ]}
                  >
                    <ProfileIcon size={40} color={colors.primary.main} />
                  </View>
                  <TouchableOpacity
                    onPress={() => handlePress(onEditAvatar)}
                    activeOpacity={0.7}
                    style={[
                      styles.editBadge,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <EditIcon size={14} color={colors.text.primary} />
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.displayName,
                    {
                      color: colors.text.primary,
                      fontFamily: typography.display.fontFamily,
                    },
                  ]}
                >
                  {displayName}
                </Text>

                {membershipLabel && (
                  <Text
                    style={[
                      styles.membershipLabel,
                      {
                        color: colors.primary.main,
                        fontFamily: typography.body.fontFamily,
                      },
                    ]}
                  >
                    {membershipLabel}
                  </Text>
                )}
              </View>

              {/* Menu Items */}
              <View style={[styles.menuSection, { paddingHorizontal: spacing.md }]}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handlePress(item.onPress)}
                    activeOpacity={0.7}
                    style={styles.menuRow}
                  >
                    <View style={styles.menuRowLeft}>
                      {item.icon}
                      <Text
                        style={[
                          styles.menuLabel,
                          {
                            color: colors.text.primary,
                            fontFamily: typography.body.fontFamily,
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                    <View style={styles.menuRowRight}>
                      {item.badge && (
                        <View
                          style={[
                            styles.badge,
                            { backgroundColor: colors.danger.subtle },
                          ]}
                        >
                          <Text
                            style={[
                              styles.badgeText,
                              {
                                color: colors.danger.main,
                                fontFamily: typography.body.fontFamily,
                              },
                            ]}
                          >
                            {item.badge}
                          </Text>
                        </View>
                      )}
                      <ChevronRightIcon size={18} color={colors.text.disabled} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Log Out Button */}
              <View style={[styles.logOutSection, { paddingHorizontal: spacing.md }]}>
                <TouchableOpacity
                  onPress={() => handlePress(onLogOut)}
                  activeOpacity={0.7}
                  style={[
                    styles.logOutButton,
                    {
                      backgroundColor: colors.danger.subtle,
                      borderRadius: borderRadius.medium,
                    },
                  ]}
                >
                  <LogOutIcon size={20} color={colors.danger.main} />
                  <Text
                    style={[
                      styles.logOutText,
                      {
                        color: colors.danger.main,
                        fontFamily: typography.body.fontFamily,
                      },
                    ]}
                  >
                    {i18n.t("settings.logOut")}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Close Settings */}
              <TouchableOpacity
                onPress={handleClose}
                activeOpacity={0.7}
                style={styles.closeButton}
              >
                <Text
                  style={[
                    styles.closeText,
                    {
                      color: colors.text.secondary,
                      fontFamily: typography.body.fontFamily,
                    },
                  ]}
                >
                  {i18n.t("settings.closeSettings")}
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
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
    paddingBottom: 20,
  },
  avatarSection: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 8,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  displayName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  membershipLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  menuSection: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  menuRowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  logOutSection: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  logOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  logOutText: {
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    alignItems: "center",
    paddingTop: 8,
  },
  closeText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
