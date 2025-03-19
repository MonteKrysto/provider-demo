
import { createMachine, createActor, assign } from 'xstate';
import { createBrowserInspector } from '@statelyai/inspect';
import { patientMachine } from './patient';
import { notesMachine } from './notes';
import { billingMachine } from './billing';
import { appointmentsMachine } from './appointments';
import { Patient } from '../types/patient';
import { PracticeEvent } from '../types/events';
import { ActorRefFrom } from 'xstate';

// Inspector (dev-only)
const inspector = process.env.NODE_ENV === 'development' ? createBrowserInspector() : null;

// Pre-create actors
const patientActor = createActor(patientMachine, { inspect: inspector?.inspect });
const notesActor = createActor(notesMachine, { inspect: inspector?.inspect });
const billingActor = createActor(billingMachine, { inspect: inspector?.inspect });
const appointmentsActor = createActor(appointmentsMachine, { inspect: inspector?.inspect });

interface PracticeContext {
  patientRef: ActorRefFrom<typeof patientMachine>;
  notesRef: ActorRefFrom<typeof notesMachine>;
  billingRef: ActorRefFrom<typeof billingMachine>;
  appointmentsRef: ActorRefFrom<typeof appointmentsMachine>;
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
    patientRef: patientActor,
    notesRef: notesActor,
    billingRef: billingActor,
    appointmentsRef: appointmentsActor,
    activePatient: null,
    modal: {
      isOpen: false,
      content: null,
    },
  } satisfies PracticeContext,
  types: {} as { context: PracticeContext; events: PracticeEvent },
  states: {
    running: {
      entry: () => {
        patientActor.start();
        notesActor.start();
        billingActor.start();
        appointmentsActor.start();
      },
      on: {
        EDIT_PATIENT: {
          actions: ({ context, event }) => context.patientRef.send(event),
        },
        SAVE_DRAFT: {
          actions: ({ context, event }) => context.notesRef.send(event),
        },
        LOCK_NOTE: {
          actions: ({ context, event }) => context.notesRef.send(event),
        },
        GENERATE_INVOICE: {
          actions: ({ context, event }) => context.billingRef.send(event),
        },
        PROCESS_PAYMENT: {
          actions: ({ context, event }) => context.billingRef.send(event),
        },
        SCHEDULE: {
          actions: ({ context, event }) => context.appointmentsRef.send(event),
        },
        RESCHEDULE: {
          actions: ({ context, event }) => context.appointmentsRef.send(event),
        },
        CANCEL: {
          actions: ({ context, event }) => context.appointmentsRef.send(event),
        },
        OPEN_MODAL: {
          actions: assign({
            modal: (_, event) => {
              const openEvent = (event as unknown as Extract<PracticeEvent, { type: 'OPEN_MODAL' }>); // Two-step assertion
              return {
                isOpen: true,
                content: openEvent.content ?? 'patientDetails',
              };
            },
          }),
        },
        CLOSE_MODAL: {
          actions: assign({
            modal: () => ({ isOpen: false, content: null }),
          }),
        },
      },
    },
  },
});
