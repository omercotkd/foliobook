import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/providers";
import i18n from "@/i18n";

interface PositionUpdatePopupProps {
  visible: boolean;
  ticker: string;
  currentShares: number;
  currentAvgPrice: number;
  newShares: number;
  newAvgPrice: number;
  onUpdate: () => void;
  onCancel: () => void;
}

function WarningIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ArrowDownIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5v14M19 12l-7 7-7-7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PositionUpdatePopup({
  visible,
  ticker,
  currentShares,
  currentAvgPrice,
  newShares,
  newAvgPrice,
  onUpdate,
  onCancel,
}: PositionUpdatePopupProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const handleUpdate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onUpdate();
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCancel();
  };

  const formatPrice = (price: number) =>
    price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.popupContainer,
                {
                  backgroundColor: colors.background,
                  borderRadius: borderRadius.large,
                  marginHorizontal: spacing.lg,
                },
              ]}
            >
              {/* Warning Icon */}
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: colors.danger.subtle },
                  ]}
                >
                  <WarningIcon size={28} color={colors.danger.main} />
                </View>
              </View>

              {/* Title */}
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.text.primary,
                    fontFamily: typography.display.fontFamily,
                  },
                ]}
              >
                {i18n.t("positionUpdate.title")}
              </Text>

              {/* Description */}
              <Text
                style={[
                  styles.description,
                  {
                    color: colors.text.secondary,
                    fontFamily: typography.body.fontFamily,
                  },
                ]}
              >
                {i18n.t("positionUpdate.descriptionPrefix")}
                <Text
                  style={{
                    fontWeight: "700",
                    color: colors.text.primary,
                  }}
                >
                  {`$${ticker}`}
                </Text>
                {i18n.t("positionUpdate.descriptionSuffix")}
              </Text>

              {/* Current Position Card */}
              <View
                style={[
                  styles.positionCard,
                  {
                    backgroundColor: colors.inputBackground,
                    borderRadius: borderRadius.medium,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cardLabel,
                    {
                      color: colors.text.disabled,
                      fontFamily: typography.body.fontFamily,
                    },
                  ]}
                >
                  {i18n.t("positionUpdate.currentPosition")}
                </Text>
                <Text
                  style={[
                    styles.cardValue,
                    {
                      color: colors.text.primary,
                      fontFamily: typography.data.fontFamily,
                    },
                  ]}
                >
                  {i18n.t("positionUpdate.sharesAt", {
                    shares: currentShares,
                    price: formatPrice(currentAvgPrice),
                  })}
                </Text>
              </View>

              {/* Arrow Down */}
              <View style={styles.arrowContainer}>
                <ArrowDownIcon size={20} color={colors.text.disabled} />
              </View>

              {/* Updated Position Card */}
              <View
                style={[
                  styles.positionCard,
                  {
                    backgroundColor: colors.inputBackground,
                    borderRadius: borderRadius.medium,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cardLabel,
                    {
                      color: colors.text.disabled,
                      fontFamily: typography.body.fontFamily,
                    },
                  ]}
                >
                  {i18n.t("positionUpdate.updatedPosition")}
                </Text>
                <Text
                  style={[
                    styles.cardValue,
                    {
                      color: colors.text.primary,
                      fontFamily: typography.data.fontFamily,
                    },
                  ]}
                >
                  {i18n.t("positionUpdate.sharesAt", {
                    shares: newShares,
                    price: formatPrice(newAvgPrice),
                  })}
                </Text>
              </View>

              {/* Update Button */}
              <TouchableOpacity
                onPress={handleUpdate}
                activeOpacity={0.8}
                style={[
                  styles.updateButton,
                  {
                    backgroundColor: colors.primary.main,
                    borderRadius: borderRadius.large,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.updateButtonText,
                    {
                      color: colors.primary.on,
                      fontFamily: typography.body.fontFamily,
                    },
                  ]}
                >
                  {i18n.t("positionUpdate.updatePosition")}
                </Text>
              </TouchableOpacity>

              {/* Cancel */}
              <TouchableOpacity
                onPress={handleCancel}
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
                  {i18n.t("positionUpdate.cancel")}
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    width: "100%",
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },
  positionCard: {
    width: "100%",
    padding: 18,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 17,
  },
  arrowContainer: {
    paddingVertical: 10,
  },
  updateButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    marginTop: 24,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1.5,
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
});
