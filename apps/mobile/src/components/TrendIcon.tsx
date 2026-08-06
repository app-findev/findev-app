import Svg, { Path } from 'react-native-svg';

type TrendIconProps = {
  size?: number;
  color?: string;
};

export default function TrendIcon({ size = 18, color = '#8fe05a' }: TrendIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 17l6-6 4 4 8-8"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 7h6v6"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
