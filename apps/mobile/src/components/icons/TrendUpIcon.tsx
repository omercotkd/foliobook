import React from "react";
import Svg, { Path } from "react-native-svg";

interface TrendUpIconProps {
  size?: number;
  color?: string;
}

export function TrendUpIcon({
  size = 24,
  color = "#8B9D83",
}: TrendUpIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z"
        fill={color}
      />
    </Svg>
  );
}
