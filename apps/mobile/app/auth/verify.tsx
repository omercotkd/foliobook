import { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/providers";
import { useAuth } from "@/providers/AuthProvider";
import i18n from "@/i18n";

/**
 * Deep-link landing page for magic-link email sign-in.
 * The AuthProvider's deep-link listener handles the actual sign-in;
 * this screen shows a loading indicator while it completes.
 */
export default function VerifyRoute() {
  const { colors, typography } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/home");
    }
  }, [user]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary.main} />
      <Text
        style={[
          styles.text,
          {
            color: colors.text.secondary,
            fontFamily: typography.body.fontFamily,
          },
        ]}
      >
        {i18n.t("emailAuth.verifying")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  text: {
    fontSize: 16,
  },
});
