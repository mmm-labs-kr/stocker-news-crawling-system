export const fontFamilyByWeight = {
  '400': 'Pretendard',
  '500': 'Pretendard-Medium',
  '600': 'Pretendard-SemiBold',
  '700': 'Pretendard-Bold',
  '800': 'Pretendard-Bold',
} as const;

export type FontWeightKey = keyof typeof fontFamilyByWeight;
