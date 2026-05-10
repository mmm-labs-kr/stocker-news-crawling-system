import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/common/Button';
import { ChevronRightIcon } from '../../src/components/common/Icons';
import { colors, radius } from '../../src/theme';

type Row = { label: string; value?: string; valueAccent?: boolean; danger?: boolean };

const SECTIONS: { title: string; rows: Row[] }[] = [
  {
    title: '내 콘텐츠',
    rows: [
      { label: '북마크한 뉴스', value: '24개' },
      { label: '최근 본 뉴스' },
    ],
  },
  {
    title: '알림 & 설정',
    rows: [
      { label: '새 뉴스 알림', value: 'ON', valueAccent: true },
      { label: '관심 테마 관리', value: '3개 선택됨' },
      { label: '등락 색상', value: '글로벌식' },
      { label: '다크모드', value: '항상' },
    ],
  },
  {
    title: '계정',
    rows: [
      { label: '공지사항' },
      { label: '문의하기' },
      { label: '버전 정보', value: '1.0.0' },
      { label: '로그아웃', danger: true },
    ],
  },
];

export default function MyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>마이</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>김</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>김투자</Text>
            <Text style={styles.profileEmail}>kim@example.com</Text>
          </View>
          <Button style={styles.editBtn}>편집</Button>
        </View>

        <View style={styles.stats}>
          <Stat n="24" label="북마크" />
          <Stat n="142" label="읽은 뉴스" />
        </View>

        {SECTIONS.map((section) => (
          <View key={section.title}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.rows.map((row) => (
              <MyRow key={row.label} {...row} />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statN}>{n}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MyRow({ label, value, valueAccent, danger }: Row) {
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <Text style={[styles.rowLabel, danger && styles.rowDanger]}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? (
          <Text style={[styles.rowValue, valueAccent && styles.rowValueAccent]}>{value}</Text>
        ) : null}
        {!danger && <ChevronRightIcon />}
      </View>
    </Pressable>
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
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    letterSpacing: -0.52,
    color: colors.text.primary,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: colors.text.primary,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: colors.text.primary,
  },
  profileEmail: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 3,
  },
  editBtn: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
  },
  stats: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statN: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'Pretendard-Bold',
    letterSpacing: -0.44,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    letterSpacing: 0.66,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  rowPressed: {
    backgroundColor: colors.bg.surface,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Pretendard-Medium',
    color: colors.text.primary,
  },
  rowDanger: {
    color: colors.price.down,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Pretendard-Medium',
    color: colors.text.tertiary,
  },
  rowValueAccent: {
    color: colors.accent.solid,
  },
});
