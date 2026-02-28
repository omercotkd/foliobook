import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "@/providers";

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search symbols or names",
}: SearchBarProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.inputBackground,
          borderRadius: borderRadius.medium,
          paddingHorizontal: spacing.sm,
        },
      ]}
    >
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Path
          d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          stroke={colors.text.disabled}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.disabled}
        style={[
          styles.input,
          {
            color: colors.text.primary,
            fontFamily: typography.body.fontFamily,
            fontSize: 15,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    gap: 8,
  },
  input: {
    flex: 1,
    height: "100%",
  },
});
