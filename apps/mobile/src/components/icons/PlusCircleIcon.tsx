import React from "react";
import Svg, { Circle as SvgCircle, Line } from "react-native-svg";

interface PlusCircleIconProps {
  size?: number;
  color?: string;
}

export function PlusCircleIcon({
  size = 22,
  color = "#AEAEB2",
}: PlusCircleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle
        cx={12}
        cy={12}
        r={10}
        stroke={color}
        strokeWidth={1.8}
      />
      <Line
        x1={12}
        y1={8}
        x2={12}
        y2={16}
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Line
        x1={8}
        y1={12}
        x2={16}
        y2={12}
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}
