import { createMachine, assign } from 'xstate';
import { Note } from '../types/notes';
import { PracticeEvent } from '../types/events';

interface NotesContext {
  notes: Record<string, Note[]>;
  currentNote: Note | null;
}

export const notesMachine = createMachine({
  id: 'notes',
  initial: 'draft',
  context: {
    notes: {},
    currentNote: null,
  } satisfies NotesContext,
  types: {} as { context: NotesContext; events: PracticeEvent },
  states: {
    draft: {
      on: {
        SAVE_DRAFT: {
          actions: [
            assign({
              currentNote: ({ event }) => {
                const saveEvent = event as Extract<PracticeEvent, { type: 'SAVE_DRAFT' }>;
                return {
                  id: crypto.randomUUID(),
                  patientId: saveEvent.activePatient?.id ?? '',
                  content: saveEvent.content,
                  status: 'draft' as const,
                  timestamp: new Date().toISOString(),
                  version: 1,
                };
              },
            }),
          ],
        },
        LOCK_NOTE: {
          target: 'locked',
          actions: [
            assign({
              notes: ({ context, event }) => {
                const lockEvent = event as Extract<PracticeEvent, { type: 'LOCK_NOTE' }>;
                const patientId = lockEvent.activePatient?.id ?? '';
                return {
                  ...context.notes,
                  [patientId]: context.notes[patientId].map((n) =>
                    n.id === context.currentNote?.id ? { ...n, status: 'locked' as const } : n
                  ),
                };
              },
            }),
            assign({
              currentNote: ({ context }) => ({
                ...context.currentNote!,
                status: 'locked' as const,
              }),
            }),
          ],
        },
        ADD_NOTE: {
          actions: assign({
            notes: ({ context, event }) => {
              const addEvent = event as Extract<PracticeEvent, { type: 'ADD_NOTE' }>;
              const note = addEvent.note;
              const patientId = note.patientId;
              console.log('Adding note to notesMachine:', note);
              return {
                ...context.notes,
                [patientId]: [...(context.notes[patientId] || []), note],
              };
            },
          }),
        },
        UPDATE_NOTE_WITH_RESPONSE: {
          actions: assign({
            notes: ({ context, event }) => {
              const updateEvent = event as Extract<PracticeEvent, { type: 'UPDATE_NOTE_WITH_RESPONSE' }>;
              const updatedNote = updateEvent.note;
              const patientId = updatedNote.patientId;
              console.log('Updating note in notesMachine:', updatedNote);
              return {
                ...context.notes,
                [patientId]: context.notes[patientId].map((n) =>
                  n.id === updatedNote.id ? updatedNote : n
                ),
              };
            },
          }),
        },
        CLEAR_CURRENT_NOTE: {
          actions: assign({
            currentNote: () => null,
          }),
        },
        INITIALIZE: {
          actions: assign({
            notes: ({ context, event }) => {
              console.log('INITIALIZE event in notesMachine:', event);
              if ('data' in event && event.data) {
                return event.data as Record<string, Note[]> || {};
              }
              return context.notes; // Fallback to current state
            },
          }),
        },
      },
    },
    locked: {
      type: 'final',
    },
  },
});
