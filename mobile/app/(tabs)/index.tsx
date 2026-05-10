import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FilterRow } from '../../src/components/common/FilterRow';
import { SearchIcon } from '../../src/components/common/Icons';
import { NewsCard } from '../../src/components/news/NewsCard';
import { useNewsList } from '../../src/hooks/useNewsList';
import { ALL_THEMES } from '../../src/mock/news';
import { colors } from '../../src/theme';

export default function HomeScreen() {
  const [activeTheme, setActiveTheme] = useState('전체');
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useNewsList(activeTheme);

  const items = data?.pages.flatMap((p) => p.data) ?? [];
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace('.', '');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>최신 뉴스</Text>
          <Text style={styles.meta}>{today}</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]} hitSlop={8}>
          <SearchIcon />
        </Pressable>
      </View>

      <FilterRow themes={ALL_THEMES} active={activeTheme} onPick={setActiveTheme} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent.solid} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <NewsCard item={item} onPress={() => router.push(`/news/${item.id}`)} />
          )}
          style={styles.list}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator color={colors.accent.solid} style={styles.footer} />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>뉴스가 없습니다.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
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
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    letterSpacing: -0.52,
    lineHeight: 32,
    color: colors.text.primary,
  },
  meta: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Pretendard-Medium',
    color: colors.text.tertiary,
    marginTop: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  list: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: colors.text.tertiary,
    fontSize: 14,
  },
  footer: {
    paddingVertical: 16,
  },
});
