import type { SourceKey } from '../theme';

export type NewsListItem = {
  id: number;
  title: string;
  themes: string[];
  source: string;
  source_key?: SourceKey;
  published_at: string;
  summary?: string;
};

export type NewsDetail = {
  id: number;
  title: string;
  summary: string | string[];
  themes: string[];
  source: string;
  source_key?: SourceKey;
  published_at: string;
  url: string;
  reading_time?: string;
};
