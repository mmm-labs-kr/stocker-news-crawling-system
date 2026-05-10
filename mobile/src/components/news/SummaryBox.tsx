import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme';
import { SparkIcon } from '../common/Icons';

type Props = {
  summary: string[];
};

export function SummaryBox({ summary }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.labelWrap}>
        <SparkIcon />
        <Text style={styles.label}>AI 요약</Text>
      </View>
      <View>
        {summary.map((line, i) => (
          <Text key={i} style={[styles.text, i < summary.length - 1 && styles.textGap]}>
            {line}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 28,
    paddingVertical: 4,
    paddingLeft: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.solid,
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    letterSpacing: 1.2,
    color: colors.accent.solid,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 15,
    lineHeight: 25,
    color: colors.text.primary,
  },
  textGap: {
    marginBottom: 12,
  },
});
