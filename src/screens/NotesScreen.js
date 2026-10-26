import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { FilterChips } from '../components/FilterChips';
import { NoteCard } from '../components/NoteCard';
import { StorageNotice } from '../components/StorageNotice';
import { categories, colors } from '../theme';

const tabs = [
  { id: 'notes', label: 'Notes', icon: 'grid' },
  { id: 'pinned', label: 'Pinned', icon: 'bookmark' },
  { id: 'archive', label: 'Archive', icon: 'archive' },
  { id: 'trash', label: 'Trash', icon: 'trash-2' },
];

function getTabNotes(notes, activeTab) {
  if (activeTab === 'trash') {
    return notes.filter((note) => note.isDeleted);
  }
  if (activeTab === 'archive') {
    return notes.filter((note) => note.isArchived && !note.isDeleted);
  }
  if (activeTab === 'pinned') {
    return notes.filter(
      (note) => note.isPinned && !note.isArchived && !note.isDeleted,
    );
  }
  return notes.filter((note) => !note.isArchived && !note.isDeleted);
}

export function NotesScreen({
  activeTab,
  isReady,
  noteActions,
  notes,
  onCreate,
  onEdit,
  onSelectTab,
  storageError,
  onDismissStorageError,
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const visibleNotes = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return getTabNotes(notes, activeTab)
      .filter(
        (note) =>
          selectedCategory === 'All' || note.category === selectedCategory,
      )
      .filter(
        (note) =>
          !query ||
          note.title.toLocaleLowerCase().includes(query) ||
          note.content.toLocaleLowerCase().includes(query) ||
          note.category.toLocaleLowerCase().includes(query),
      )
      .sort(
        (a, b) =>
          Number(b.isPinned) - Number(a.isPinned) || b.updatedAt - a.updatedAt,
      );
  }, [activeTab, notes, search, selectedCategory]);

  const tabCounts = useMemo(
    () => ({
      notes: notes.filter((note) => !note.isArchived && !note.isDeleted).length,
      pinned: notes.filter(
        (note) => note.isPinned && !note.isArchived && !note.isDeleted,
      ).length,
      archive: notes.filter((note) => note.isArchived && !note.isDeleted).length,
      trash: notes.filter((note) => note.isDeleted).length,
    }),
    [notes],
  );

  const activeLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? 'Notes';

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>A CALMER PLACE TO THINK</Text>
          <Text style={styles.wordmark}>margin<Text style={styles.period}>.</Text></Text>
        </View>
        <View style={styles.avatar}>
          <Feather color={colors.accent} name="feather" size={19} />
        </View>
      </View>

      <View style={styles.intro}>
        <Text style={styles.greeting}>Your thoughts,</Text>
        <Text style={styles.greetingSecond}>all in one place.</Text>
        <Text style={styles.noteCount}>
          {tabCounts.notes} {tabCounts.notes === 1 ? 'note' : 'notes'} to come back to
        </Text>
      </View>

      <View style={styles.searchBox}>
        <Feather color={colors.faint} name="search" size={18} />
        <TextInput
          accessibilityLabel="Search notes"
          onChangeText={setSearch}
          placeholder="Search your notes..."
          placeholderTextColor={colors.faint}
          returnKeyType="search"
          style={styles.searchInput}
          value={search}
        />
        {search.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => setSearch('')}
          >
            <Feather color={colors.muted} name="x-circle" size={17} />
          </Pressable>
        )}
      </View>

      <StorageNotice
        message={storageError}
        onDismiss={onDismissStorageError}
      />

      {activeTab === 'notes' && (
        <FilterChips
          categories={['All', ...categories]}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{activeLabel}</Text>
        <Text style={styles.sectionCount}>
          {visibleNotes.length} {visibleNotes.length === 1 ? 'note' : 'notes'}
        </Text>
      </View>

      {isReady ? (
        <FlatList
          key={activeTab}
          contentContainerStyle={[
            styles.list,
            visibleNotes.length === 0 && styles.emptyList,
          ]}
          data={visibleNotes}
          keyExtractor={(note) => note.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <NoteCard
                activeTab={activeTab}
                note={item}
                onPress={() => activeTab !== 'trash' && onEdit(item)}
                onTogglePinned={() => noteActions.togglePinned(item.id)}
                onToggleArchived={() => noteActions.toggleArchived(item.id)}
                onMoveToTrash={() => noteActions.moveToTrash(item.id)}
                onRestore={() => noteActions.restoreNote(item.id)}
                onPermanentlyDelete={() =>
                  noteActions.permanentlyDelete(item.id)
                }
              />
            </View>
          )}
          ListEmptyComponent={
            <EmptyState
              activeTab={activeTab}
              hasSearch={
                search.trim().length > 0 ||
                (activeTab === 'notes' && selectedCategory !== 'All')
              }
              onCreate={onCreate}
            />
          }
        />
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text style={styles.loadingText}>Opening your notes...</Text>
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create a note"
        accessibilityState={{ disabled: !isReady }}
        disabled={!isReady}
        onPress={onCreate}
        style={({ pressed }) => [
          styles.fab,
          !isReady && styles.fabDisabled,
          pressed && styles.fabPressed,
        ]}
      >
        <Feather color={colors.white} name="plus" size={22} />
        <Text style={styles.fabLabel}>New note</Text>
      </Pressable>

      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelectTab(tab.id)}
              style={styles.tab}
            >
              <View style={styles.tabIconWrap}>
                <Feather
                  color={isSelected ? colors.accent : colors.faint}
                  name={tab.icon}
                  size={19}
                />
                {tabCounts[tab.id] > 0 && (
                  <View
                    style={[
                      styles.badge,
                      isSelected && styles.badgeSelected,
                    ]}
                  />
                )}
              </View>
              <Text
                style={[styles.tabLabel, isSelected && styles.tabLabelSelected]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
  },
  wordmark: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -1.5,
    marginTop: 1,
  },
  period: {
    color: colors.accent,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    borderRadius: 23,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  intro: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  greeting: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: -0.7,
  },
  greetingSecond: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: -0.7,
    marginTop: 1,
  },
  noteCount: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 7,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    height: 48,
    marginHorizontal: 22,
    marginTop: 20,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: colors.ink,
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 23,
    paddingTop: 17,
    paddingBottom: 11,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionCount: {
    color: colors.muted,
    fontSize: 12,
  },
  list: {
    paddingBottom: 110,
    paddingHorizontal: 17,
  },
  emptyList: {
    flexGrow: 1,
  },
  row: {
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  cardWrapper: {
    flex: 1,
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    gap: 14,
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.muted,
    fontSize: 13,
  },
  fab: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 28,
    bottom: 77,
    elevation: 5,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    position: 'absolute',
    right: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  fabPressed: {
    opacity: 0.86,
  },
  fabDisabled: {
    opacity: 0.55,
  },
  fabLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 5,
    paddingTop: 10,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
    paddingVertical: 3,
  },
  tabIconWrap: {
    alignItems: 'center',
    height: 22,
    justifyContent: 'center',
    width: 28,
  },
  badge: {
    backgroundColor: colors.faint,
    borderColor: colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    height: 7,
    position: 'absolute',
    right: 1,
    top: 0,
    width: 7,
  },
  badgeSelected: {
    backgroundColor: colors.accent,
  },
  tabLabel: {
    color: colors.faint,
    fontSize: 10,
    fontWeight: '600',
  },
  tabLabelSelected: {
    color: colors.accent,
  },
});