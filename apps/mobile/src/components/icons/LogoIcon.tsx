import React from "react";
import Svg, { Rect, Path } from "react-native-svg";

interface LogoIconProps {
  size?: number;
  color?: string;
}

export function LogoIcon({ size = 48, color = "#8B9D83" }: LogoIconProps) {
  const barWidth = size * 0.15;
  const gap = size * 0.08;
  const cornerRadius = size * 0.1;
  const padding = size * 0.2;
  const innerWidth = size - padding * 2;
  const innerHeight = size - padding * 2;

  const barHeights = [0.4, 0.7, 1.0];
  const totalBarsWidth = 3 * barWidth + 2 * gap;
  const startX = padding + (innerWidth - totalBarsWidth) / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect
        x={2}
        y={2}
        width={size - 4}
        height={size - 4}
        rx={cornerRadius}
        ry={cornerRadius}
        fill={color}
        opacity={0.15}
      />
      {barHeights.map((heightFactor, i) => {
        const barH = innerHeight * heightFactor;
        const x = startX + i * (barWidth + gap);
        const y = padding + innerHeight - barH;
        return (
          <Rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barH}
            rx={barWidth * 0.3}
            ry={barWidth * 0.3}
            fill={color}
          />
        );
      })}
    </Svg>
  );
}
