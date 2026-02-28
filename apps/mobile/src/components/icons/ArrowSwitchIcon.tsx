import React from "react";
import Svg, { Path } from "react-native-svg";

interface ArrowSwitchIconProps {
  size?: number;
  color?: string;
}

export function ArrowSwitchIcon({ size = 22, color = "#1C1C1E" }: ArrowSwitchIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8l4 4m0 0l-4 4m4-4H3"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
