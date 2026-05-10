import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addBookmark, getBookmarks } from '../api/bookmarks';
import { useAuthStore } from '../stores/authStore';

export function useBookmarks() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => getBookmarks(),
    enabled: !!token,
  });
}

export function useAddBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newsId: number) => addBookmark(newsId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
  });
}
