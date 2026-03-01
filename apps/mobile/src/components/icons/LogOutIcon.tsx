import React from "react";
import Svg, { Path } from "react-native-svg";

interface LogOutIconProps {
  size?: number;
  color?: string;
}

export function LogOutIcon({
  size = 24,
  color = "#C67C72",
}: LogOutIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H12V5H5V19H12V21H5ZM16 17L14.625 15.55L17.175 13H9V11H17.175L14.625 8.45L16 7L21 12L16 17Z"
        fill={color}
      />
    </Svg>
  );
}
