import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../../theme';

type Props = {
  themes: string[];
  active: string;
  onPick: (theme: string) => void;
};

export function FilterRow({ themes, active, onPick }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.container}
    >
      {themes.map((theme) => {
        const isActive = theme === active;
        return (
          <Pressable
            key={theme}
            onPress={() => onPick(theme)}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{theme}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    flexGrow: 0,
  },
  row: {
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  chip: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: 'transparent',
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
});
