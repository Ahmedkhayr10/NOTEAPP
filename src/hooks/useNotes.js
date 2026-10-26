import { useCallback, useEffect, useRef, useState } from 'react';
import { starterNotes } from '../data/starterNotes';
import { loadNotes, saveNotes } from '../storage/notesStorage';

function getErrorMessage(error) {
  return error instanceof Error
    ? error.message
    : 'Your notes could not be saved. Please try again.';
}

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const notesRef = useRef([]);
  const writeQueue = useRef(Promise.resolve());

  useEffect(() => {
    let isMounted = true;

    loadNotes()
      .then((savedNotes) => {
        if (!isMounted) {
          return;
        }

        const initialNotes = savedNotes ?? starterNotes;
        notesRef.current = initialNotes;
        setNotes(initialNotes);
      })
      .catch((error) => {
        if (isMounted) {
          setStorageError(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const commitNotes = useCallback((update) => {
    if (!isReady) {
      return;
    }

    const nextNotes = update(notesRef.current);
    notesRef.current = nextNotes;
    setNotes(nextNotes);

    writeQueue.current = writeQueue.current
      .catch(() => {})
      .then(() => saveNotes(nextNotes))
      .then(
        () => setStorageError(''),
        (error) => setStorageError(getErrorMessage(error)),
      );
  }, [isReady]);

  const addNote = useCallback((note) => {
    const now = Date.now();
    const newNote = {
      ...note,
      id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
      isPinned: false,
      isArchived: false,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    commitNotes((currentNotes) => [newNote, ...currentNotes]);
  }, [commitNotes]);

  const updateNote = useCallback((id, changes) => {
    commitNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? { ...note, ...changes, updatedAt: Date.now() }
          : note,
      ),
    );
  }, [commitNotes]);

  const togglePinned = useCallback((id) => {
    commitNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? { ...note, isPinned: !note.isPinned, updatedAt: Date.now() }
          : note,
      ),
    );
  }, [commitNotes]);

  const toggleArchived = useCallback((id) => {
    commitNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              isArchived: !note.isArchived,
              isDeleted: false,
              updatedAt: Date.now(),
            }
          : note,
      ),
    );
  }, [commitNotes]);

  const moveToTrash = useCallback((id) => {
    commitNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? { ...note, isDeleted: true, isArchived: false, updatedAt: Date.now() }
          : note,
      ),
    );
  }, [commitNotes]);

  const restoreNote = useCallback((id) => {
    commitNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? { ...note, isDeleted: false, updatedAt: Date.now() }
          : note,
      ),
    );
  }, [commitNotes]);

  const permanentlyDelete = useCallback((id) => {
    commitNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
  }, [commitNotes]);

  const dismissStorageError = useCallback(() => setStorageError(''), []);

  return {
    notes,
    isReady,
    storageError,
    addNote,
    updateNote,
    togglePinned,
    toggleArchived,
    moveToTrash,
    restoreNote,
    permanentlyDelete,
    dismissStorageError,
  };
}