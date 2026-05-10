import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme';
import type { NewsListItem } from '../../types';
import { ThemeTag } from '../common/ThemeTag';
import { SourceMeta } from './SourceMeta';

type Props = {
  item: NewsListItem;
  onPress?: () => void;
};

export function NewsCard({ item, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <SourceMeta source={item.source} sourceKey={item.source_key} time={item.published_at} />
      <Text style={styles.title} numberOfLines={3}>
        {item.title}
      </Text>
      {item.summary ? (
        <Text style={styles.summary} numberOfLines={2}>
          {item.summary}
        </Text>
      ) : null}
      <View style={styles.tags}>
        {(item.themes ?? []).map((t) => (
          <ThemeTag key={t}>{t}</ThemeTag>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    backgroundColor: colors.bg.base,
  },
  cardPressed: {
    backgroundColor: colors.bg.surface,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    lineHeight: 22,
    letterSpacing: -0.24,
    color: colors.text.primary,
    marginBottom: 4,
  },
  summary: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.text.secondary,
    marginBottom: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
});
