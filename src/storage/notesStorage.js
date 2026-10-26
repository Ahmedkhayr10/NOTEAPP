import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_STORAGE_KEY = '@margin/notes-v1';

export async function loadNotes() {
  const savedNotes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);

  if (savedNotes === null) {
    return null;
  }

  const notes = JSON.parse(savedNotes);
  if (!Array.isArray(notes)) {
    throw new Error('Your saved notes could not be read. Please try again.');
  }

  return notes;
}

export async function saveNotes(notes) {
  await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}