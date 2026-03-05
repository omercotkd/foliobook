import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/providers";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { SearchBar } from "@/components/SearchBar";
import i18n from "@/i18n";
import type { PositionDirection } from "@foliobook/shared-types";
import { PositionUpdatePopup } from "./PositionUpdatePopup";

interface AddPositionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: NewPositionData) => void;
}

export interface NewPositionData {
  ticker: string;
  direction: PositionDirection;
  shares: string;
  entryPrice: string;
  takeProfitPrice: string;
  stopLossPrice: string;
}

export function AddPositionModal({
  visible,
  onClose,
  onSave,
}: AddPositionModalProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const [ticker, setTicker] = useState("");
  const [direction, setDirection] = useState<PositionDirection>("long");
  const [shares, setShares] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [takeProfitPrice, setTakeProfitPrice] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");
  const [updatePopupVisible, setUpdatePopupVisible] = useState(false);

  // Mock existing position — in a real app this would come from Firestore/state
  const MOCK_EXISTING = { shares: 10, avgPrice: 175.5 };

  const totalEntryCost = useMemo(() => {
    const qty = parseFloat(shares);
    const price = parseFloat(entryPrice);
    if (isNaN(qty) || isNaN(price)) return 0;
    return qty * price;
  }, [shares, entryPrice]);

  const formattedTotal = useMemo(() => {
    return totalEntryCost.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }, [totalEntryCost]);

  const resetForm = () => {
    setTicker("");
    setDirection("long");
    setShares("");
    setEntryPrice("");
    setTakeProfitPrice("");
    setStopLossPrice("");
    setUpdatePopupVisible(false);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetForm();
    onClose();
  };

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Always show the update popup for now
    setUpdatePopupVisible(true);
  };

  const handleConfirmUpdate = () => {
    onSave({ ticker, direction, shares, entryPrice, takeProfitPrice, stopLossPrice });
    resetForm();
  };

  const handleDirectionChange = (dir: PositionDirection) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDirection(dir);
  };

  const isSaveDisabled = !ticker.trim() || !shares.trim() || !entryPrice.trim();

  // Compute updated position values (weighted average)
  const newQty = parseFloat(shares) || 0;
  const newPrice = parseFloat(entryPrice) || 0;
  const mergedShares = MOCK_EXISTING.shares + newQty;
  const mergedAvgPrice =
    mergedShares > 0
      ? (MOCK_EXISTING.shares * MOCK_EXISTING.avgPrice + newQty * newPrice) /
        mergedShares
      : 0;

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

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 32 }}
              >
                {/* Header row with close */}
                <View
                  style={[
                    styles.headerRow,
                    { paddingHorizontal: spacing.md },
                  ]}
                >
                  <View style={styles.headerTextGroup}>
                    <Text
                      style={[
                        styles.title,
                        {
                          color: colors.text.primary,
                          fontFamily: typography.display.fontFamily,
                        },
                      ]}
                    >
                      {i18n.t("addPosition.title")}
                    </Text>
                    <Text
                      style={[
                        styles.subtitle,
                        {
                          color: colors.text.secondary,
                          fontFamily: typography.body.fontFamily,
                        },
                      ]}
                    >
                      {i18n.t("addPosition.subtitle")}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleClose}
                    activeOpacity={0.7}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <CloseIcon size={22} color={colors.text.secondary} />
                  </TouchableOpacity>
                </View>

                {/* Symbol Search */}
                <View style={{ paddingHorizontal: spacing.md }}>
                  <Text
                    style={[
                      styles.sectionLabel,
                      {
                        color: colors.text.disabled,
                        fontFamily: typography.body.fontFamily,
                      },
                    ]}
                  >
                    {i18n.t("addPosition.symbolSearch")}
                  </Text>
                  <SearchBar
                    value={ticker}
                    onChangeText={setTicker}
                    placeholder={i18n.t("addPosition.symbolPlaceholder")}
                  />
                </View>

                {/* Direction Toggle */}
                <View
                  style={[
                    styles.directionToggle,
                    {
                      marginHorizontal: spacing.md,
                      backgroundColor: colors.inputBackground,
                      borderRadius: borderRadius.medium,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleDirectionChange("long")}
                    activeOpacity={0.7}
                    style={[
                      styles.directionButton,
                      {
                        backgroundColor:
                          direction === "long"
                            ? colors.text.primary
                            : "transparent",
                        borderRadius: borderRadius.medium - 4,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.directionLabel,
                        {
                          color:
                            direction === "long"
                              ? colors.background
                              : colors.text.secondary,
                          fontFamily: typography.body.fontFamily,
                        },
                      ]}
                    >
                      {i18n.t("addPosition.long")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDirectionChange("short")}
                    activeOpacity={0.7}
                    style={[
                      styles.directionButton,
                      {
                        backgroundColor:
                          direction === "short"
                            ? colors.text.primary
                            : "transparent",
                        borderRadius: borderRadius.medium - 4,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.directionLabel,
                        {
                          color:
                            direction === "short"
                              ? colors.background
                              : colors.text.secondary,
                          fontFamily: typography.body.fontFamily,
                        },
                      ]}
                    >
                      {i18n.t("addPosition.short")}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Shares & Entry Price */}
                <View
                  style={[styles.inputRow, { paddingHorizontal: spacing.md }]}
                >
                  <View style={styles.inputColumn}>
                    <Text
                      style={[
                        styles.sectionLabel,
                        {
                          color: colors.text.disabled,
                          fontFamily: typography.body.fontFamily,
                        },
                      ]}
                    >
                      {i18n.t("addPosition.shares")}
                    </Text>
                    <View
                      style={[
                        styles.inputBox,
                        {
                          backgroundColor: colors.inputBackground,
                          borderRadius: borderRadius.medium,
                        },
                      ]}
                    >
                      <TextInput
                        value={shares}
                        onChangeText={setShares}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={colors.text.disabled}
                        style={[
                          styles.textInput,
                          {
                            color: colors.text.primary,
                            fontFamily: typography.body.fontFamily,
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.inputColumn}>
                    <Text
                      style={[
                        styles.sectionLabel,
                        {
                          color: colors.text.disabled,
                          fontFamily: typography.body.fontFamily,
                        },
                      ]}
                    >
                      {i18n.t("addPosition.entryPrice")}
                    </Text>
                    <View
                      style={[
                        styles.inputBox,
                        {
                          backgroundColor: colors.inputBackground,
                          borderRadius: borderRadius.medium,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.currencyPrefix,
                          {
                            color: colors.text.disabled,
                            fontFamily: typography.body.fontFamily,
                          },
                        ]}
                      >
                        $
                      </Text>
                      <TextInput
                        value={entryPrice}
                        onChangeText={setEntryPrice}
                        keyboardType="decimal-pad"
                        placeholder="0.00"
                        placeholderTextColor={colors.text.disabled}
                        style={[
                          styles.textInput,
                          {
                            color: colors.text.primary,
                            fontFamily: typography.body.fontFamily,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>

                {/* Total Entry Cost */}
                <View
                  style={[
                    styles.totalRow,
                    {
                      marginHorizontal: spacing.md,
                      backgroundColor: colors.inputBackground,
                      borderRadius: borderRadius.medium,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.totalLabel,
                      {
                        color: colors.text.disabled,
                        fontFamily: typography.body.fontFamily,
                      },
                    ]}
                  >
                    {i18n.t("addPosition.totalEntryCost")}
                  </Text>
                  <Text
                    style={[
                      styles.totalValue,
                      {
                        color: colors.text.primary,
                        fontFamily: typography.display.fontFamily,
                      },
                    ]}
                  >
                    {formattedTotal}
                  </Text>
                </View>

                {/* Risk Management */}
                <View style={{ paddingHorizontal: spacing.md }}>
                  <View style={styles.riskDivider}>
                    <View
                      style={[
                        styles.dividerLine,
                        { backgroundColor: colors.border },
                      ]}
                    />
                    <Text
                      style={[
                        styles.riskLabel,
                        {
                          color: colors.text.disabled,
                          fontFamily: typography.body.fontFamily,
                        },
                      ]}
                    >
                      {i18n.t("addPosition.riskManagement")}
                    </Text>
                    <View
                      style={[
                        styles.dividerLine,
                        { backgroundColor: colors.border },
                      ]}
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <View style={styles.inputColumn}>
                      <Text
                        style={[
                          styles.sectionLabel,
                          {
                            color: colors.text.disabled,
                            fontFamily: typography.body.fontFamily,
                          },
                        ]}
                      >
                        {i18n.t("addPosition.takeProfit")}
                      </Text>
                      <View
                        style={[
                          styles.inputBox,
                          styles.dashedInput,
                          {
                            borderColor: colors.border,
                            borderRadius: borderRadius.medium,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.currencyPrefix,
                            {
                              color: colors.text.disabled,
                              fontFamily: typography.body.fontFamily,
                            },
                          ]}
                        >
                          $
                        </Text>
                        <TextInput
                          value={takeProfitPrice}
                          onChangeText={setTakeProfitPrice}
                          keyboardType="decimal-pad"
                          placeholder={i18n.t("addPosition.targetPlaceholder")}
                          placeholderTextColor={colors.text.disabled}
                          style={[
                            styles.textInput,
                            {
                              color: colors.text.primary,
                              fontFamily: typography.body.fontFamily,
                            },
                          ]}
                        />
                      </View>
                    </View>
                    <View style={styles.inputColumn}>
                      <Text
                        style={[
                          styles.sectionLabel,
                          {
                            color: colors.text.disabled,
                            fontFamily: typography.body.fontFamily,
                          },
                        ]}
                      >
                        {i18n.t("addPosition.stopLoss")}
                      </Text>
                      <View
                        style={[
                          styles.inputBox,
                          styles.dashedInput,
                          {
                            borderColor: colors.border,
                            borderRadius: borderRadius.medium,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.currencyPrefix,
                            {
                              color: colors.text.disabled,
                              fontFamily: typography.body.fontFamily,
                            },
                          ]}
                        >
                          $
                        </Text>
                        <TextInput
                          value={stopLossPrice}
                          onChangeText={setStopLossPrice}
                          keyboardType="decimal-pad"
                          placeholder={i18n.t("addPosition.exitPlaceholder")}
                          placeholderTextColor={colors.text.disabled}
                          style={[
                            styles.textInput,
                            {
                              color: colors.text.primary,
                              fontFamily: typography.body.fontFamily,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                {/* Save Button */}
                <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.md }}>
                  <TouchableOpacity
                    onPress={handleSave}
                    activeOpacity={0.8}
                    disabled={isSaveDisabled}
                    style={[
                      styles.saveButton,
                      {
                        backgroundColor: isSaveDisabled
                          ? colors.primary.subtle
                          : colors.primary.main,
                        borderRadius: borderRadius.large,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.saveButtonText,
                        {
                          color: colors.primary.on,
                          fontFamily: typography.body.fontFamily,
                        },
                      ]}
                    >
                      {i18n.t("addPosition.savePosition")}
                    </Text>
                  </TouchableOpacity>
                </View>

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
                    {i18n.t("addPosition.cancel")}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      {/* Position Update Warning Popup */}
      <PositionUpdatePopup
        visible={updatePopupVisible}
        ticker={ticker}
        currentShares={MOCK_EXISTING.shares}
        currentAvgPrice={MOCK_EXISTING.avgPrice}
        newShares={mergedShares}
        newAvgPrice={mergedAvgPrice}
        onUpdate={handleConfirmUpdate}
        onCancel={() => setUpdatePopupVisible(false)}
      />
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
    maxHeight: "92%",
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 20,
  },
  headerTextGroup: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  directionToggle: {
    flexDirection: "row",
    padding: 4,
    marginTop: 16,
    marginBottom: 20,
  },
  directionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  directionLabel: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputColumn: {
    flex: 1,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    minHeight: 56,
  },
  dashedInput: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  currencyPrefix: {
    fontSize: 16,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    marginTop: 16,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  totalValue: {
    fontSize: 26,
  },
  riskDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  riskLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  saveButtonText: {
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
