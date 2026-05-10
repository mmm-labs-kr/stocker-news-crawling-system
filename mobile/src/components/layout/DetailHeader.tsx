import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../../theme';
import { BackIcon, ShareIcon } from '../common/Icons';

type Props = {
  onBack?: () => void;
  onShare?: () => void;
  transparent?: boolean;
};

export function DetailHeader({ onBack, onShare, transparent }: Props) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: transparent ? 'transparent' : colors.bg.base },
      ]}
    >
      <Pressable
        onPress={onBack}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
        hitSlop={8}
      >
        <BackIcon />
      </Pressable>
      <Pressable
        onPress={onShare}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
        hitSlop={8}
      >
        <ShareIcon />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 48,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
