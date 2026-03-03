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
      icon: <AccountSettingsIcon size={20} color={colors.text.secondary} />,
      label: i18n.t("settings.accountSettings"),
      onPress: onAccountSettings,
    },
    {
      icon: <ShieldIcon size={20} color={colors.text.secondary} />,
      label: i18n.t("settings.security"),
      onPress: onSecurity,
    },
    {
      icon: <BellIcon size={20} color={colors.text.secondary} />,
      label: i18n.t("settings.notifications"),
      onPress: onNotifications,
      badge: notificationCount > 0 ? `${notificationCount} ${i18n.t("settings.newBadge")}` : undefined,
    },
    {
      icon: <HelpCircleIcon size={20} color={colors.text.secondary} />,
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
                styles.popup,
                {
                  backgroundColor: colors.surface,
                  borderRadius: borderRadius.medium,
                },
              ]}
            >
              {/* Triangle pointer → points up toward the Profile button (top-right) */}
              <View
                style={[
                  styles.triangle,
                  { borderBottomColor: colors.surface },
                ]}
              />

              {/* Avatar Section */}
              <View style={styles.avatarSection}>
                <View style={styles.avatarWrapper}>
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: colors.border },
                    ]}
                  >
                    <ProfileIcon size={32} color={colors.primary.main} />
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
                    <EditIcon size={12} color={colors.text.primary} />
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

              {/* Divider */}
              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              {/* Menu Items */}
              <View style={styles.menuSection}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handlePress(item.onPress)}
                    activeOpacity={0.7}
                    style={[
                      styles.menuRow,
                      index < menuItems.length - 1 && {
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: colors.border,
                      },
                    ]}
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
                      <ChevronRightIcon size={16} color={colors.text.disabled} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Log Out */}
              <TouchableOpacity
                onPress={() => handlePress(onLogOut)}
                activeOpacity={0.7}
                style={[
                  styles.logOutRow,
                  {
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: colors.border,
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
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: 20,
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
    right: 14,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  avatarSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  displayName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  membershipLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
  },
  menuSection: {
    paddingVertical: 4,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuRowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  logOutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  logOutText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
