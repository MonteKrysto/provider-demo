import { createMachine, assign, spawn } from 'xstate'; // spawn is an action creator
import { createBrowserInspector } from '@statelyai/inspect';
import { patientMachine } from './patient';
import { notesMachine } from './notes';
import { Patient } from '../types/patient';
import { PracticeEvent } from '../types/events';
import { ActorRefFrom } from 'xstate';

// Inspector (dev-only)
const inspector = process.env.NODE_ENV === 'development' ? createBrowserInspector() : null;

interface PracticeContext {
  patientRef: ActorRefFrom<typeof patientMachine>;
  notesRef: ActorRefFrom<typeof notesMachine>;
  activePatient: Patient | null;
  modal: {
    isOpen: boolean;
    content: 'patientDetails' | null;
  };
}

export const practiceMachine = createMachine({
  id: 'practiceManagement',
  initial: 'running',
  context: {
    patientRef: null as any, // Will be set by spawn
    notesRef: null as any,   // Will be set by spawn
    activePatient: null,
    modal: {
      isOpen: false,
      content: null,
    },
  } satisfies PracticeContext,
  types: {} as { context: PracticeContext; events: PracticeEvent },
  states: {
    running: {
      entry: assign({
        patientRef: () =>
          spawn(patientMachine, {
            name: 'patient',
            sync: true,
            inspect: inspector?.inspect,
          }),
        notesRef: () =>
          spawn(notesMachine, {
            name: 'notes',
            sync: true,
            inspect: inspector?.inspect,
          }),
      }),
      on: {
        EDIT_PATIENT: {
          actions: ({ context, event }) => context.patientRef.send(event),
        },
        SAVE_DRAFT: {
          actions: ({ context, event }) =>
            context.notesRef.send({ ...event, activePatient: context.activePatient }),
        },
        LOCK_NOTE: {
          actions: ({ context }) =>
            context.notesRef.send({ type: 'LOCK_NOTE', activePatient: context.activePatient }),
        },
        PRESCRIBE: {
          actions: ({ context, event }) => context.patientRef.send(event),
        },
        OPEN_MODAL: {
          actions: assign({
            modal: (_, event) => ({
              isOpen: true,
              content: event.content || 'patientDetails',
            }),
          }),
        },
        CLOSE_MODAL: {
          actions: assign({
            modal: { isOpen: false, content: null },
          }),
        },
      },
    },
  },
});
