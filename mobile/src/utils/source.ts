import type { SourceKey } from '../theme';

const SOURCE_NAME_TO_KEY: Record<string, SourceKey> = {
  '한국경제': 'hk',
  '매일경제': 'mk',
  '조선비즈': 'cb',
};

export function getSourceKey(sourceName: string): SourceKey | undefined {
  return SOURCE_NAME_TO_KEY[sourceName];
}
