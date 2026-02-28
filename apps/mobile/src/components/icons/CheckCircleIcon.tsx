import React from "react";
import Svg, { Path, Circle as SvgCircle } from "react-native-svg";

interface CheckCircleIconProps {
  size?: number;
  color?: string;
}

export function CheckCircleIcon({
  size = 24,
  color = "#8B9D83",
}: CheckCircleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle
        cx={12}
        cy={12}
        r={10}
        stroke={color}
        strokeWidth={1.8}
      />
      <Path
        d="M9 12l2 2 4-4"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
