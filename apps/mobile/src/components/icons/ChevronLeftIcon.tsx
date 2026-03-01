import React from "react";
import Svg, { Path } from "react-native-svg";

interface ChevronLeftIconProps {
  size?: number;
  color?: string;
}

export function ChevronLeftIcon({
  size = 24,
  color = "#1C1C1E",
}: ChevronLeftIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
        fill={color}
      />
    </Svg>
  );
}
