import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius } from '../../theme';

type Props = {
  variant?: 'outline' | 'solid' | 'accent';
  children: React.ReactNode;
  style?: ViewStyle;
};

export function ThemeTag({ variant = 'outline', children, style }: Props) {
  return (
    <View
      style={[
        styles.tag,
        variant === 'solid' && styles.solid,
        variant === 'accent' && styles.accent,
        style,
      ]}
    >
      <Text style={[styles.text, variant === 'accent' && styles.accentText]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    height: 22,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.pill,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  solid: {
    backgroundColor: colors.bg.pill,
    borderColor: 'transparent',
  },
  accent: {
    borderColor: colors.accent.solid,
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Pretendard-Medium',
    color: colors.text.secondary,
  },
  accentText: {
    color: colors.accent.solid,
  },
});
