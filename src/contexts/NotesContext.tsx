import { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { usePractice } from './PracticeContext';
import { Note } from '../types/notes';
import { Patient } from '../types/patient';

interface NotesContextType {
  currentNote: Note | null;
  notes: Record<string, Note[]>;
  saveDraft: (content: string, activePatient: Patient) => void;
  lockNote: (activePatient: Patient) => void;
  lockExistingNote: (noteId: string, activePatient: Patient) => void;
  updateNote: (noteId: string, content: string, activePatient: Patient) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const { state, send } = usePractice();
  const [notes, setNotes] = useState(state.context.notesRef.getSnapshot().context.notes);
  const [currentNote, setCurrentNote] = useState(state.context.notesRef.getSnapshot().context.currentNote);

  // Subscribe to notesMachine state changes
  useEffect(() => {
    const subscription = state.context.notesRef.subscribe((newState) => {
      console.log('Notes state updated:', newState.context.notes);
      setNotes(newState.context.notes);
      setCurrentNote(newState.context.currentNote);
    });

    return () => subscription.unsubscribe();
  }, [state.context.notesRef]);

  const saveDraft = (content: string, activePatient: Patient) => {
    send({ type: 'SAVE_DRAFT', content, activePatient });
  };

  const lockNote = (activePatient: Patient) => {
    send({ type: 'LOCK_NOTE', activePatient });
  };

  const lockExistingNote = (noteId: string, activePatient: Patient) => {
    send({ type: 'LOCK_EXISTING_NOTE', noteId, activePatient });
  };

  const updateNote = (noteId: string, content: string, activePatient: Patient) => {
    send({ type: 'UPDATE_NOTE', noteId, content, activePatient });
  };

  const value = useMemo(
    () => ({
      currentNote,
      notes,
      saveDraft,
      lockNote,
      lockExistingNote,
      updateNote,
    }),
    [currentNote, notes] // Re-compute only if these change
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
