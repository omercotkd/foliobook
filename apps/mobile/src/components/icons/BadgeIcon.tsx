import React from "react";
import Svg, { Path, Circle as SvgCircle } from "react-native-svg";

interface BadgeIconProps {
  size?: number;
  color?: string;
}

export function BadgeIcon({ size = 40, color = "#8B9D83" }: BadgeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Star in circle badge */}
      <SvgCircle
        cx={12}
        cy={10}
        r={7}
        stroke={color}
        strokeWidth={1.6}
      />
      <Path
        d="M12 6.5l1.3 2.6 2.9.4-2.1 2 .5 2.9L12 13l-2.6 1.4.5-2.9-2.1-2 2.9-.4L12 6.5z"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Ribbon tails */}
      <Path
        d="M8.5 16l-1.5 4 3-1.5L12 20"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M15.5 16l1.5 4-3-1.5L12 20"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
