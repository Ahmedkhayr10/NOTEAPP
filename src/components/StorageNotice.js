import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export function StorageNotice({ message, onDismiss }) {
  if (!message) {
    return null;
  }

  return (
    <View accessibilityRole="alert" style={styles.notice}>
      <Feather color={colors.danger} name="alert-circle" size={17} />
      <Text style={styles.message}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss storage message"
        hitSlop={8}
        onPress={onDismiss}
      >
        <Feather color={colors.muted} name="x" size={17} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    alignItems: 'center',
    backgroundColor: '#F9E9E5',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 9,
    marginHorizontal: 22,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  message: {
    color: '#763C34',
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
});