import React from "react";
import Svg, { Path } from "react-native-svg";

interface ChevronRightIconProps {
  size?: number;
  color?: string;
}

export function ChevronRightIcon({
  size = 20,
  color = "#AEAEB2",
}: ChevronRightIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.4 18L8 16.6L12.6 12L8 7.4L9.4 6L15.4 12L9.4 18Z"
        fill={color}
      />
    </Svg>
  );
}
