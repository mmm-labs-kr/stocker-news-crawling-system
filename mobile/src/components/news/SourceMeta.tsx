import { StyleSheet, Text, View } from 'react-native';
import { colors, SourceKey } from '../../theme';

type Props = {
  source: string;
  sourceKey?: SourceKey;
  time: string;
};

export function SourceMeta({ source, sourceKey, time }: Props) {
  const dotColor = sourceKey ? colors.source[sourceKey] : colors.text.tertiary;
  return (
    <View style={styles.container}>
      <View style={styles.sourceWrap}>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
        <Text style={styles.source}>{source}</Text>
      </View>
      <Text style={styles.dotSep}>·</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sourceWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  source: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Pretendard-Medium',
    color: colors.text.secondary,
  },
  dotSep: {
    color: colors.text.tertiary,
    opacity: 0.5,
    fontSize: 11,
  },
  time: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
});
