import { useQuery } from '@tanstack/react-query';
import { getNewsDetail } from '../api/news';

export function useNewsDetail(id: number) {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => getNewsDetail(id),
    enabled: !!id,
  });
}
