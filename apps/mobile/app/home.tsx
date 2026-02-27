import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/providers";

export default function HomeScreen() {
  const { colors, typography } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text.primary,
              fontFamily: typography.display.fontFamily,
            },
          ]}
        >
          Library
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
          Your theses will appear here.
        </Text>
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
});
