import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeTag } from '../../../src/components/common/ThemeTag';
import { DetailFooter } from '../../../src/components/layout/DetailFooter';
import { DetailHeader } from '../../../src/components/layout/DetailHeader';
import { SummaryBox } from '../../../src/components/news/SummaryBox';
import { useAddBookmark } from '../../../src/hooks/useBookmarks';
import { useNewsDetail } from '../../../src/hooks/useNewsDetail';
import { colors, radius } from '../../../src/theme';
import { formatPublishedAt } from '../../../src/utils/date';

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: news, isLoading } = useNewsDetail(Number(id));
  const { mutate: addBookmark } = useAddBookmark();

  if (isLoading || !news) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <DetailHeader transparent onBack={() => router.back()} />
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent.solid} />
        </View>
      </SafeAreaView>
    );
  }

  const summary = Array.isArray(news.summary) ? news.summary : [news.summary];
  const dotColor = news.source_key ? colors.source[news.source_key] : colors.text.tertiary;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <DetailHeader transparent onBack={() => router.back()} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <LinearGradient
          colors={['#0e1f17', '#1a3024']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <View style={[styles.dot, { backgroundColor: dotColor }]} />
            <Text style={styles.heroSource}>{news.source}</Text>
            <Text style={styles.heroDot}>·</Text>
            <Text style={styles.heroTime}>{formatPublishedAt(news.published_at)}</Text>
          </View>
          <View>
            <Text style={styles.heroThemeLabel}>{(news.themes ?? [])[0]}</Text>
            <Text style={styles.heroTitle}>{news.title}</Text>
          </View>
        </LinearGradient>

        <View style={styles.tags}>
          {(news.themes ?? []).map((t) => (
            <ThemeTag key={t}>{t}</ThemeTag>
          ))}
        </View>

        <SummaryBox summary={summary} />
      </ScrollView>
      <DetailFooter
        onToggleBookmark={() => addBookmark(Number(id))}
        onOpenOriginal={() => Linking.openURL(news.url)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    marginHorizontal: 16,
    marginBottom: 20,
    aspectRatio: 4 / 3,
    borderRadius: radius.lg,
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  heroSource: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
    color: colors.text.primary,
  },
  heroDot: {
    color: colors.text.tertiary,
    fontSize: 12,
  },
  heroTime: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  heroThemeLabel: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    letterSpacing: 1.2,
    color: colors.accent.solid,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'Pretendard-Bold',
    letterSpacing: -0.484,
    lineHeight: 28,
    color: '#fff',
  },
  tags: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 24,
  },
});
