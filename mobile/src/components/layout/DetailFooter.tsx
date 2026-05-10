import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme';
import { Button } from '../common/Button';
import { BookmarkIcon } from '../common/Icons';

type Props = {
  bookmarked?: boolean;
  onToggleBookmark?: () => void;
  onOpenOriginal?: () => void;
};

export function DetailFooter({ bookmarked, onToggleBookmark, onOpenOriginal }: Props) {
  return (
    <View style={styles.container}>
      <Button
        variant="ghost"
        onPress={onToggleBookmark}
        style={styles.bookmarkBtn}
        leftIcon={
          <BookmarkIcon
            filled={bookmarked}
            color={bookmarked ? colors.accent.solid : colors.text.primary}
          />
        }
      >
        북마크
      </Button>
      <Button variant="primary" onPress={onOpenOriginal} style={styles.openBtn}>
        원문 보기
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 22,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    backgroundColor: colors.bg.base,
  },
  bookmarkBtn: {
    flex: 1,
  },
  openBtn: {
    flex: 2,
  },
});
