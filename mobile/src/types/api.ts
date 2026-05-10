import type { NewsListItem } from './news';

export type NewsListResponse = {
  total_count: number;
  page: number;
  data: NewsListItem[];
};

export type BookmarkListResponse = {
  page: number;
  data: (NewsListItem & { bookmarked_at: string })[];
};
