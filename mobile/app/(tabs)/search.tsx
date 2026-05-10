import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchIcon } from '../../src/components/common/Icons';
import { colors } from '../../src/theme';

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>탐색</Text>
      </View>
      <View style={styles.empty}>
        <SearchIcon size={48} color={colors.text.tertiary} />
        <Text style={styles.emptyTitle}>곧 만날 수 있어요</Text>
        <Text style={styles.emptyDesc}>
          뉴스 검색과 테마 탐색 기능을{'\n'}
          준비하고 있어요.
        </Text>
      </View>
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
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    letterSpacing: -0.52,
    color: colors.text.primary,
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
