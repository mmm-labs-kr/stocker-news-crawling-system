import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../../theme';

type IconProps = {
  size?: number;
  color?: string;
};

export function SparkIcon({ size = 11, color = colors.accent.solid }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path d="M6 1L7 5L11 6L7 7L6 11L5 7L1 6L5 5L6 1Z" fill={color} />
    </Svg>
  );
}

export function ExternalIcon({ size = 14, color = colors.text.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M5 3H3a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V9M8 2h4v4M12 2L6 8"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SearchIcon({ size = 18, color = colors.text.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx={10} cy={10} r={6} stroke={color} strokeWidth={1.7} />
      <Path d="M14.5 14.5L18 18" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

export function BackIcon({ size = 20, color = colors.text.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M14 4l-7 7 7 7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ShareIcon({ size = 18, color = colors.text.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M16 8l-5-5-5 5M11 3v12M5 13v5a1 1 0 001 1h10a1 1 0 001-1v-5"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BookmarkIcon({
  size = 22,
  color = colors.text.primary,
  filled = false,
}: IconProps & { filled?: boolean }) {
  if (filled) {
    return (
      <Svg width={(size * 16) / 20} height={size} viewBox="0 0 16 20" fill={color}>
        <Path d="M0 0h16v20l-8-5-8 5V0z" />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M5 3h12v17l-6-4-6 4V3z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function HomeIcon({ size = 22, color = colors.text.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M3 9.5L11 3l8 6.5V18a1 1 0 01-1 1h-4v-6h-6v6H4a1 1 0 01-1-1V9.5z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PersonIcon({ size = 22, color = colors.text.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx={11} cy={8} r={4} stroke={color} strokeWidth={1.6} />
      <Path
        d="M3 19c1.5-3.5 5-5 8-5s6.5 1.5 8 5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 12, color = colors.text.tertiary }: IconProps) {
  return (
    <Svg width={(size * 7) / 12} height={size} viewBox="0 0 7 12" fill="none">
      <Path
        d="M1 1l5 5-5 5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
