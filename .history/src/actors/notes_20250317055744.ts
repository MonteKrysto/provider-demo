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
              notes: ({ context, event }) => {
                const saveEvent = event as Extract<PracticeEvent, { type: 'SAVE_DRAFT' }>;
                const patientId = saveEvent.activePatient?.id ?? '';
                const newNote: Note = {
                  id: crypto.randomUUID(),
                  patientId,
                  content: saveEvent.content,
                  status: 'draft' as const,
                  timestamp: new Date().toISOString(),
                  version: 1,
                };
                return {
                  ...context.notes,
                  [patientId]: [...(context.notes[patientId] || []), newNote],
                };
              },
            }),
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
      },
    },
    locked: {
      type: 'final',
    },
  },
});
