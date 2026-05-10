import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius } from '../../theme';

type Variant = 'default' | 'primary' | 'ghost' | 'icon';

type Props = {
  variant?: Variant;
  onPress?: () => void;
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
};

export function Button({
  variant = 'default',
  onPress,
  children,
  leftIcon,
  rightIcon,
  style,
  disabled,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'ghost' && styles.ghost,
        variant === 'icon' && styles.icon,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {leftIcon && <View>{leftIcon}</View>}
      {children !== undefined && (
        <Text
          style={[
            styles.text,
            variant === 'primary' && styles.primaryText,
          ]}
        >
          {children}
        </Text>
      )}
      {rightIcon && <View>{rightIcon}</View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.pill,
    backgroundColor: 'transparent',
  },
  primary: {
    backgroundColor: colors.accent.glass,
    borderColor: colors.accent.glassBorder,
  },
  ghost: {
    backgroundColor: colors.bg.elevated,
    borderColor: 'transparent',
  },
  icon: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
    borderRadius: 9999,
    borderColor: colors.border.subtle,
    backgroundColor: colors.bg.elevated,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
    letterSpacing: -0.14,
  },
  primaryText: {
    color: colors.accent.solid,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
  },
});
