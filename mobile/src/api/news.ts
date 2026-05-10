import type { NewsDetail, NewsListItem } from '../types/news';
import { getSourceKey } from '../utils/source';
import client from './client';

type RawListItem = Omit<NewsListItem, 'source_key' | 'themes'> & { themes: unknown };
type ListResponse = { total_count: number; page: number; data: RawListItem[] };
type RawDetail = Omit<NewsDetail, 'source_key' | 'summary' | 'themes'> & { summary: string; themes: unknown };

export async function getNewsList(params: { page?: number; theme?: string } = {}): Promise<ListResponse & { data: NewsListItem[] }> {
  const query: Record<string, unknown> = { page: params.page ?? 1 };
  if (params.theme && params.theme !== '전체') query.theme = params.theme;

  const { data } = await client.get<ListResponse>('/news/', { params: query });
  return {
    ...data,
    data: data.data.map((item) => ({
      ...item,
      themes: parseThemes(item.themes),
      source_key: getSourceKey(item.source),
    })),
  };
}

export async function getNewsDetail(id: number): Promise<NewsDetail> {
  const { data } = await client.get<RawDetail>(`/news/${id}`);
  return {
    ...data,
    themes: parseThemes(data.themes),
    summary: parseSummary(data.summary),
    source_key: getSourceKey(data.source ?? ''),
  };
}

function parseThemes(themes: unknown): string[] {
  if (Array.isArray(themes)) return themes;
  if (typeof themes === 'string') return themes ? [themes] : [];
  return [];
}

function parseSummary(text: string): string[] {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  return lines.length > 0 ? lines : [text];
}
