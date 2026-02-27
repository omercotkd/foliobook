import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/providers";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  icon,
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.large,
      minHeight: 56,
      gap: spacing.xs,
    };

    switch (variant) {
      case "primary":
        return {
          ...base,
          backgroundColor: colors.text.primary,
        };
      case "secondary":
        return {
          ...base,
          backgroundColor: colors.surface,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        };
      case "outline":
        return {
          ...base,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.border,
        };
      case "ghost":
        return {
          ...base,
          backgroundColor: "transparent",
        };
      default:
        return base;
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontFamily: typography.body.fontFamily,
      fontSize: typography.body.fontSize,
      fontWeight: "500",
    };

    switch (variant) {
      case "primary":
        return { ...base, color: colors.primary.on };
      case "secondary":
        return { ...base, color: colors.text.primary };
      case "outline":
        return { ...base, color: colors.text.primary };
      case "ghost":
        return { ...base, color: colors.primary.main };
      default:
        return base;
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        getContainerStyle(),
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.primary.on : colors.text.primary}
        />
      ) : (
        <>
          {icon && <View>{icon}</View>}
          <Text style={getTextStyle()}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
