const palette = {
  cream: "#F5F5F0",
  white: "#FFFFFF",
  charcoal: "#1C1C1E",
  darkSurface: "#2C2C2E",
  darkBackground: "#1C1C1E",
  darkBorder: "#3A3A3C",

  sage: "#8B9D83",
  sageMuted: "#C8D5C4",
  coral: "#C67C72",
  coralMuted: "#F2DAD8",

  grey100: "#F9F9F7",
  grey200: "#E5E5E0",
  grey400: "#AEAEB2",
  grey600: "#636366",
  grey700: "#6B7280",
} as const;


interface ColorScheme {
  background: string;
  surface: string;
  border: string;
  inputBackground: string;
  primary: { main: string; subtle: string; on: string };
  danger: { main: string; subtle: string; on: string };
  text: { primary: string; secondary: string; disabled: string };
}

export const lightColors: ColorScheme = {
  background: palette.cream,
  surface: palette.white,
  border: palette.grey200,
  inputBackground: palette.grey100,
  primary: { main: palette.sage, subtle: palette.sageMuted, on: palette.white },
  danger: { main: palette.coral, subtle: palette.coralMuted, on: palette.white },
  text: { primary: palette.charcoal, secondary: palette.grey600, disabled: palette.grey400 },
};

export const darkColors: ColorScheme = {
  background: palette.darkBackground,
  surface: palette.darkSurface,
  border: palette.darkBorder,
  inputBackground: palette.darkSurface,
  primary: { main: palette.sage, subtle: "#3A4A38", on: palette.white },
  danger: { main: palette.coral, subtle: "#4A2E2C", on: palette.white },
  text: { primary: palette.white, secondary: palette.grey400, disabled: palette.grey600 },
};


export const Theme = {
  typography: {
    brandName: {
      fontFamily: "PlayfairDisplaySC_400Regular",
      fontSize: 20,
      letterSpacing: 6,
    },
    display: {
      fontFamily: "PlayfairDisplay_700Bold",
      fontSize: 30,
      letterSpacing: -0.5,
    },
    body: {
      fontFamily: "Inter_400Regular",
      fontSize: 16,
      lineHeight: 24,
    },
    data: {
      fontFamily: "IBMPlexSans_500Medium",
      fontSize: 18,
    },
  },

  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
  },

  borderRadius: {
    small: 8,
    medium: 16,
    large: 24,
  },

  colors: {
    light: lightColors,
    dark: darkColors,
  },
} as const;

export type { ColorScheme };
