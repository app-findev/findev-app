export const colors = {
  darkGreen: '#173308',
  green: '#8fe05a',
  background: '#ffffff',
  heroBg: '#eaf4e2',
  inputBg: '#fafcf8',
  inputBorder: '#d8ded1',
  muted: '#7c8a72',
  mutedLight: '#9aa393',
  text: '#173308',
  track: '#e7ebe1',
} as const;

export type ThemeColor = keyof typeof colors;
