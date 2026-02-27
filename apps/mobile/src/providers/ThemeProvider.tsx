import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";
import { Theme, lightColors, darkColors } from "@foliobook/ui-config/theme";
import type { ColorScheme } from "@foliobook/ui-config/theme";

interface ThemeContextValue {
  colors: ColorScheme;
  typography: typeof Theme.typography;
  spacing: typeof Theme.spacing;
  borderRadius: typeof Theme.borderRadius;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const value: ThemeContextValue = {
    colors: isDark ? darkColors : lightColors,
    typography: Theme.typography,
    spacing: Theme.spacing,
    borderRadius: Theme.borderRadius,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
