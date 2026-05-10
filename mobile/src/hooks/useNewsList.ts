import { useInfiniteQuery } from '@tanstack/react-query';
import { getNewsList } from '../api/news';

export function useNewsList(theme?: string) {
  return useInfiniteQuery({
    queryKey: ['news', theme],
    queryFn: ({ pageParam }) => getNewsList({ page: pageParam, theme }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.page * 20;
      return loaded < lastPage.total_count ? lastPage.page + 1 : undefined;
    },
  });
}
