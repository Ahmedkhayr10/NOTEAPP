import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

const emptyStates = {
  notes: {
    icon: 'edit-3',
    title: 'A fresh page',
    description: 'Your next great idea can start with a single note.',
    action: 'Write a note',
  },
  pinned: {
    icon: 'bookmark',
    title: 'Nothing pinned yet',
    description: 'Pin the notes you want to keep close at hand.',
  },
  archive: {
    icon: 'archive',
    title: 'Your archive is quiet',
    description: 'Notes you want to keep out of the way will live here.',
  },
  trash: {
    icon: 'trash-2',
    title: 'All clear',
    description: 'Notes you remove will stay here until you delete them forever.',
  },
};

export function EmptyState({ activeTab, hasSearch, onCreate }) {
  const content = hasSearch
    ? {
        icon: 'search',
        title: 'No notes found',
        description: 'Try another search or clear the search field.',
      }
    : emptyStates[activeTab];

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Feather color={colors.accent} name={content.icon} size={24} />
      </View>
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.description}>{content.description}</Text>
      {content.action && (
        <Pressable accessibilityRole="button" onPress={onCreate} style={styles.button}>
          <Text style={styles.buttonText}>{content.action}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 76,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  title: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: '700',
    marginTop: 18,
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 24,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});