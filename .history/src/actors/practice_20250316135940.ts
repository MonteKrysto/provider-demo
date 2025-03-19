import { createMachine, assign, spawn } from 'xstate';
import { patientMachine } from './patient';
import { notesMachine } from './notes';
import { Patient } from '../types/patient';
import { PracticeEvent } from '../types/events';
import { ActorRefFrom } from 'xstate';

interface PracticeContext {
  patientRef: ActorRefFrom<typeof patientMachine>;
  notesRef: ActorRefFrom<typeof notesMachine>;
  activePatient: Patient | null;
}

export const practiceMachine = createMachine({
  id: 'practiceManagement',
  initial: 'running',
  context: {
    patientRef: null as any, // Will be set by spawn
    notesRef: null as any, // Will be set by spawn
    activePatient: null,
  } satisfies PracticeContext,
  types: {} as { context: PracticeContext; events: PracticeEvent },
  states: {
    running: {
      entry: assign({
        patientRef: () => spawn(patientMachine, { name: 'patient', sync: true }),
        notesRef: () => spawn(notesMachine, { name: 'notes', sync: true }),
      }),
      on: {
        EDIT_PATIENT: {
          actions: ({ context, event }) => context.patientRef.send(event),
        },
        SAVE_DRAFT: {
          actions: ({ context, event }) => context.notesRef.send({
            ...event,
            activePatient: context.activePatient, // Pass shared context
          }),
        },
        LOCK_NOTE: {
          actions: ({ context }) => context.notesRef.send({
            type: 'LOCK_NOTE',
            activePatient: context.activePatient,
          }),
        },
        PRESCRIBE: {
          actions: ({ context, event }) => context.patientRef.send(event),
        },
      },
    },
  },
});