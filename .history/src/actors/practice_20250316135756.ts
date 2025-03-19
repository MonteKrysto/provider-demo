import { createMachine, spawn } from 'xstate';
import { patientMachine } from './patient';
import { notesMachine } from './notes';
import { Patient, PracticeEvent } from '~/types';
// Import other machines...

interface PracticeContext {
  patientRef: any;
  notesRef: any;
  activePatient: Patient | null; // Shared context
}

export const practiceMachine = createMachine({
  id: 'practiceManagement',
  initial: 'running',
  context: {
    patientRef: null,
    notesRef: null,
    activePatient: null,
  } as PracticeContext,
  types: {} as { context: PracticeContext; events: PracticeEvent },
  states: {
    running: {
      entry: assign({
        patientRef: () => spawn(patientMachine, { sync: true }),
        notesRef: () => spawn(notesMachine, { sync: true }),
      }),
      on: {
        EDIT_PATIENT: {
          actions: ({ context, event }) => context.patientRef.send(event),
        },
        SAVE_DRAFT: {
          actions: ({ context, event }) => context.notesRef.send(event),
        },
        LOCK_NOTE: {
          actions: ({ context }) => context.notesRef.send('LOCK_NOTE'),
        },
      },
    },
  },
});
