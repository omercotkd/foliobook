import { useEffect, useCallback } from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import {
  PlayfairDisplaySC_400Regular,
} from "@expo-google-fonts/playfair-display-sc";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import {
  IBMPlexSans_500Medium,
} from "@expo-google-fonts/ibm-plex-sans";
import { ThemeProvider } from "@/providers";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    PlayfairDisplaySC_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    IBMPlexSans_500Medium,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <StatusBar style="dark" />
      <Slot />
    </ThemeProvider>
  );
}
