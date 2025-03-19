import { createMachine, assign } from 'xstate';
import { Note, PracticeEvent } from '../types';

interface NotesContext {
  notes: Record<string, Note[]>;
  currentNote: Note | null;
}

export const notesMachine = createMachine({
  id: 'notes',
  initial: 'draft',
  context: { notes: {}, currentNote: null } as NotesContext,
  types: {} as { context: NotesContext; events: PracticeEvent },
  states: {
    draft: {
      on: {
        SAVE_DRAFT: {
          actions: assign({
            notes: ({ context, event }) => {
              const patientId = event.activePatient?.id ?? '';
              const newNote: Note = {
                id: crypto.randomUUID(),
                patientId,
                content: event.content,
                status: 'draft',
                timestamp: new Date().toISOString(),
                version: 1,
              };
              return {
                ...context.notes,
                [patientId]: [...(context.notes[patientId] || []), newNote],
              };
            },
            currentNote: (_, event) => {
              if (event && typeof event === 'object' && 'content' in event) {
                const noteEvent = event as { content: string; [key: string]: any };
                return { ...noteEvent, status: 'draft' } as Note;
              }
              return null; // or handle the case where event is not as expected
            },
          }),
        },
        LOCK_NOTE: {
          target: 'locked',
          actions: assign({
            notes: ({ context }, { activePatient }) => {
              const patientId = activePatient?.id ?? '';
              return {
                ...context.notes,
                [patientId]: context.notes[patientId].map((n) =>
                  n.id === context.currentNote?.id ? { ...n, status: 'locked' } : n
                ),
              };
            },
          }),
        },
      },
    },
    locked: {},
  },
});
