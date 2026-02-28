import React from "react";
import Svg, { Path } from "react-native-svg";

interface ArrowSwitchIconProps {
  size?: number;
  color?: string;
}

export function ArrowSwitchIcon({
  size = 22,
  color = "#4B5563",
}: ArrowSwitchIconProps) {
  return (
    <Svg width={size} height={(size * 16) / 20} viewBox="0 0 20 16" fill="none">
      <Path
        d="M5 16L0 11L5 6L6.4 7.425L3.825 10H11V12H3.825L6.4 14.575L5 16ZM15 10L13.6 8.575L16.175 6H9V4H16.175L13.6 1.425L15 0L20 5L15 10Z"
        fill={color}
      />
    </Svg>
  );
}
