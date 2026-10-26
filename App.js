import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NoteEditorScreen } from './src/screens/NoteEditorScreen';
import { NotesScreen } from './src/screens/NotesScreen';
import { useNotes } from './src/hooks/useNotes';
import { colors } from './src/theme';
import { StyleSheet } from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState('notes');
  const [editingNote, setEditingNote] = useState(null);
  const notesState = useNotes();

  function handleSave(note) {
    if (editingNote?.id) {
      notesState.updateNote(editingNote.id, note);
    } else {
      notesState.addNote(note);
    }

    setEditingNote(null);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        {editingNote !== null ? (
          <NoteEditorScreen
            note={editingNote}
            onBack={() => setEditingNote(null)}
            onSave={handleSave}
          />
        ) : (
          <NotesScreen
            activeTab={activeTab}
            isReady={notesState.isReady}
            noteActions={notesState}
            notes={notesState.notes}
            onCreate={() => {
              if (notesState.isReady) {
                setEditingNote({});
              }
            }}
            onEdit={setEditingNote}
            onSelectTab={setActiveTab}
            storageError={notesState.storageError}
            onDismissStorageError={notesState.dismissStorageError}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});