import React from "react";
import { TouchableOpacity, type ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/providers";

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  variant?: "default" | "filled" | "floating";
  disabled?: boolean;
  style?: ViewStyle;
}

export function IconButton({
  icon,
  onPress,
  size = 44,
  variant = "default",
  disabled = false,
  style,
}: IconButtonProps) {
  const { colors, borderRadius } = useTheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      width: size,
      height: size,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: size / 2,
    };

    switch (variant) {
      case "filled":
        return {
          ...base,
          backgroundColor: colors.surface,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
        };
      case "floating":
        return {
          ...base,
          backgroundColor: colors.text.primary,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
        };
      default:
        return {
          ...base,
          backgroundColor: colors.inputBackground,
        };
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[getContainerStyle(), disabled && { opacity: 0.5 }, style]}
    >
      {icon}
    </TouchableOpacity>
  );
}
