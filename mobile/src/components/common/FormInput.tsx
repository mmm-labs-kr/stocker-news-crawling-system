import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius } from '../../theme';

type Props = TextInputProps & {
  label: string;
};

export function FormInput({ label, style, ...rest }: Props) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.text.tertiary}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
    letterSpacing: 0.44,
    color: colors.text.tertiary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: colors.bg.elevated,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: radius.lg,
    color: colors.text.primary,
    fontSize: 14,
    letterSpacing: -0.14,
  },
});
