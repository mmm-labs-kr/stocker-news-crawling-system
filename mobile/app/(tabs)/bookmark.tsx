import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookmarkIcon } from '../../src/components/common/Icons';
import { NewsCard } from '../../src/components/news/NewsCard';
import { useBookmarks } from '../../src/hooks/useBookmarks';
import { useAuthStore } from '../../src/stores/authStore';
import { colors, radius } from '../../src/theme';

const SORT_TABS = ['최신순', '오래된순', '테마별'] as const;

export default function BookmarkScreen() {
  const [activeSort, setActiveSort] = useState<(typeof SORT_TABS)[number]>('최신순');
  const token = useAuthStore((s) => s.token);
  const { data, isLoading } = useBookmarks();

  const list = data?.data ?? [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>북마크</Text>
        <Text style={styles.meta}>저장한 뉴스 {list.length}개</Text>
      </View>

      <View style={styles.sortTabs}>
        {SORT_TABS.map((tab) => {
          const isActive = tab === activeSort;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveSort(tab)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{tab}</Text>
            </Pressable>
          );
        })}
      </View>

      {!token ? (
        <LoginPrompt />
      ) : isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent.solid} />
        </View>
      ) : list.length === 0 ? (
        <Empty />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <NewsCard item={item} onPress={() => router.push(`/news/${item.id}`)} />
              <View style={styles.bookmarkOverlay}>
                <BookmarkIcon size={20} filled color={colors.accent.solid} />
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

function LoginPrompt() {
  return (
    <View style={styles.empty}>
      <BookmarkIcon size={48} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>로그인이 필요해요</Text>
      <Text style={styles.emptyDesc}>로그인 후 북마크한 뉴스를{'\n'}확인할 수 있어요.</Text>
    </View>
  );
}

function Empty() {
  return (
    <View style={styles.empty}>
      <BookmarkIcon size={48} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>아직 저장한 뉴스가 없어요</Text>
      <Text style={styles.emptyDesc}>
        뉴스 상세에서 북마크 버튼을 눌러{'\n'}
        나중에 다시 볼 기사를 저장해보세요.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    letterSpacing: -0.52,
    color: colors.text.primary,
  },
  meta: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Pretendard-Medium',
    color: colors.text.tertiary,
    marginTop: 4,
  },
  sortTabs: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  chip: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.accent.glass,
    borderColor: colors.accent.glassBorder,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Pretendard-Medium',
    color: colors.text.secondary,
  },
  chipTextActive: {
    color: colors.accent.solid,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
  },
  cardWrap: {
    position: 'relative',
  },
  bookmarkOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: colors.text.primary,
  },
  emptyDesc: {
    fontSize: 13,
    color: colors.text.tertiary,
    lineHeight: 19,
    textAlign: 'center',
  },
});
