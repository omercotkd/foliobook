import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Switch,
} from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/providers";
import { BellIcon } from "@/components/icons/BellIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
import i18n from "@/i18n";

interface PositionSettingsPopupProps {
  visible: boolean;
  onClose: () => void;
  onToggleNotifications?: (enabled: boolean) => void;
  onSetPriceAlert?: () => void;
  onRemovePosition?: () => void;
  notificationsEnabled?: boolean;
}

export function PositionSettingsPopup({
  visible,
  onClose,
  onToggleNotifications,
  onSetPriceAlert,
  onRemovePosition,
  notificationsEnabled = true,
}: PositionSettingsPopupProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const [notifEnabled, setNotifEnabled] = useState(notificationsEnabled);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleToggle = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifEnabled(value);
    onToggleNotifications?.(value);
  };

  const handlePress = (callback?: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    callback?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <BlurView intensity={85} tint="default" style={styles.overlay}>
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
              {/* Triangle pointer */}
              <View
                style={[
                  styles.triangle,
                  { borderBottomColor: colors.surface },
                ]}
              />

              {/* Notifications toggle */}
              <View
                style={[
                  styles.row,
                  {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.rowLabel,
                    {
                      color: colors.text.primary,
                      fontFamily: typography.body.fontFamily,
                    },
                  ]}
                >
                  {i18n.t("positionDetail.notifications")}
                </Text>
                <Switch
                  value={notifEnabled}
                  onValueChange={handleToggle}
                  trackColor={{
                    false: colors.border,
                    true: colors.primary.main,
                  }}
                  thumbColor={colors.surface}
                />
              </View>

              {/* Set Price Alert */}
              <TouchableOpacity
                onPress={() => handlePress(onSetPriceAlert)}
                activeOpacity={0.7}
                style={[
                  styles.row,
                  {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <BellIcon size={20} color={colors.text.secondary} />
                <Text
                  style={[
                    styles.rowLabel,
                    {
                      color: colors.text.primary,
                      fontFamily: typography.body.fontFamily,
                      marginLeft: spacing.xs,
                    },
                  ]}
                >
                  {i18n.t("positionDetail.setPriceAlert")}
                </Text>
              </TouchableOpacity>

              {/* Remove Position */}
              <TouchableOpacity
                onPress={() => handlePress(onRemovePosition)}
                activeOpacity={0.7}
                style={styles.row}
              >
                <TrashIcon size={20} color={colors.danger.main} />
                <Text
                  style={[
                    styles.rowLabel,
                    {
                      color: colors.danger.main,
                      fontFamily: typography.body.fontFamily,
                      marginLeft: spacing.xs,
                    },
                  ]}
                >
                  {i18n.t("positionDetail.removePosition")}
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
    width: 260,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  triangle: {
    position: "absolute",
    top: -10,
    right: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  rowLabel: {
    fontSize: 16,
    flex: 1,
  },
});
