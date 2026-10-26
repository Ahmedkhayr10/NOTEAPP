import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, noteColors } from '../theme';

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return `Today · ${date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function NoteCard({
  note,
  activeTab,
  onPress,
  onTogglePinned,
  onToggleArchived,
  onMoveToTrash,
  onRestore,
  onPermanentlyDelete,
}) {
  const backgroundColor =
    noteColors.find((color) => color.name === note.color)?.value ??
    colors.note.white;
  const preview = note.content.trim();

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Edit ${note.title || 'untitled note'}`}
        onPress={onPress}
        style={styles.content}
      >
        <View style={styles.heading}>
          <Text numberOfLines={2} style={styles.title}>
            {note.title.trim() || 'Untitled'}
          </Text>
          {note.isPinned && activeTab !== 'trash' && (
            <Feather color={colors.accent} name="bookmark" size={15} />
          )}
        </View>
        {preview ? (
          <Text numberOfLines={4} style={styles.preview}>
            {preview}
          </Text>
        ) : (
          <Text style={styles.placeholder}>No additional text</Text>
        )}
        <View style={styles.meta}>
          <Text style={styles.category}>{note.category}</Text>
          <Text style={styles.date}>{formatDate(note.updatedAt)}</Text>
        </View>
      </Pressable>

      <View style={styles.actions}>
        {activeTab === 'trash' ? (
          <>
            <ActionButton
              icon="rotate-ccw"
              label="Restore note"
              onPress={onRestore}
            />
            <ActionButton
              icon="trash-2"
              label="Delete forever"
              onPress={onPermanentlyDelete}
              destructive
            />
          </>
        ) : (
          <>
            <ActionButton
              icon={note.isPinned ? 'bookmark' : 'bookmark'}
              label={note.isPinned ? 'Unpin note' : 'Pin note'}
              onPress={onTogglePinned}
              active={note.isPinned}
            />
            <ActionButton
              icon={note.isArchived ? 'corner-up-left' : 'archive'}
              label={note.isArchived ? 'Unarchive note' : 'Archive note'}
              onPress={onToggleArchived}
            />
            <ActionButton
              icon="trash-2"
              label="Move to trash"
              onPress={onMoveToTrash}
            />
          </>
        )}
      </View>
    </View>
  );
}

function ActionButton({ icon, label, onPress, active, destructive }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={styles.actionButton}
    >
      <Feather
        color={destructive ? colors.danger : active ? colors.accent : colors.muted}
        name={icon}
        size={16}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: 'rgba(35, 35, 31, 0.06)',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    minHeight: 156,
    padding: 17,
    paddingBottom: 10,
  },
  heading: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  title: {
    color: colors.ink,
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  preview: {
    color: '#67665F',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 9,
  },
  placeholder: {
    color: colors.faint,
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 9,
  },
  meta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 14,
  },
  category: {
    color: '#55564E',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  date: {
    color: '#77776E',
    fontSize: 11,
  },
  actions: {
    alignItems: 'center',
    borderTopColor: 'rgba(35, 35, 31, 0.08)',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 20,
    height: 44,
    paddingHorizontal: 16,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
    minWidth: 24,
  },
});