import type { NewsListItem } from '../types/news';
import { getSourceKey } from '../utils/source';
import client from './client';

type RawBookmarkItem = Omit<NewsListItem, 'source_key'> & { bookmarked_at: string };
type BookmarksResponse = { page: number; data: RawBookmarkItem[] };

export async function getBookmarks(page = 1): Promise<{ page: number; data: NewsListItem[] }> {
  const { data } = await client.get<BookmarksResponse>('/user/me/bookmarks', { params: { page } });
  return {
    ...data,
    data: data.data.map((item) => ({ ...item, source_key: getSourceKey(item.source) })),
  };
}

export async function addBookmark(newsId: number): Promise<void> {
  await client.post('/user/me/bookmarks', { news_id: newsId });
}
