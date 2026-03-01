import React from "react";
import Svg, { Path } from "react-native-svg";

interface ShieldIconProps {
  size?: number;
  color?: string;
}

export function ShieldIcon({
  size = 24,
  color = "#636366",
}: ShieldIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22C9.68333 21.4167 7.77083 20.0875 6.2625 18.0125C4.75417 15.9375 4 13.6333 4 11.1V5L12 2L20 5V11.1C20 13.6333 19.2458 15.9375 17.7375 18.0125C16.2292 20.0875 14.3167 21.4167 12 22ZM12 19.9C13.7333 19.35 15.1667 18.25 16.3 16.6C17.4333 14.95 18.0667 13.1333 18.2 11.15H12V4.15L6 6.35V11.15C6 11.2667 6.00833 11.4 6.025 11.55C6.04167 11.7 6.05 11.8167 6.05 11.9H12V19.9Z"
        fill={color}
      />
    </Svg>
  );
}
