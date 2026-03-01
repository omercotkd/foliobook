import React from "react";
import Svg, { Path } from "react-native-svg";

interface TrashIconProps {
  size?: number;
  color?: string;
}

export function TrashIcon({
  size = 24,
  color = "#C67C72",
}: TrashIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z"
        fill={color}
      />
    </Svg>
  );
}
