import { TextStyle } from 'react-native';
import { colors } from './colors';

export const fontFamily = {
  sans: 'Pretendard',
  sansBold: 'Pretendard-Bold',
  sansSemibold: 'Pretendard-SemiBold',
  sansMedium: 'Pretendard-Medium',
  num: 'SpaceMono',
} as const;

export const typography = {
  h1: {
    fontFamily: fontFamily.sansBold,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.56,
    lineHeight: 34,
    color: colors.text.primary,
  } satisfies TextStyle,
  h2: {
    fontFamily: fontFamily.sansBold,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.255,
    lineHeight: 23,
    color: colors.text.primary,
  } satisfies TextStyle,
  h3: {
    fontFamily: fontFamily.sansSemibold,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.52,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  body: {
    fontFamily: fontFamily.sans,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.text.secondary,
  } satisfies TextStyle,
  meta: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.tertiary,
  } satisfies TextStyle,
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: 11,
    color: colors.text.tertiary,
  } satisfies TextStyle,
} as const;
