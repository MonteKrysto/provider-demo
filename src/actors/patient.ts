import { createMachine, assign } from 'xstate';
import { Patient } from '../types/patient';
import { PracticeEvent } from '../types/events';

interface PatientContext {
  patients: Patient[];
}

export const patientMachine = createMachine({
  id: 'patient',
  initial: 'idle',
  context: {
    patients: [],
  } satisfies PatientContext,
  types: {} as { context: PatientContext; events: PracticeEvent },
  states: {
    idle: {
      on: {
        CREATE_PATIENT: {
          actions: assign({
            patients: ({ context, event }) => {
              const createEvent = event as Extract<PracticeEvent, { type: 'CREATE_PATIENT' }>;
              console.log('Adding patient to patientMachine:', createEvent.patient);
              return [...context.patients, createEvent.patient];
            },
          }),
        },
        EDIT_PATIENT: {
          actions: assign({
            patients: ({ context, event }) => {
              const editEvent = event as Extract<PracticeEvent, { type: 'EDIT_PATIENT' }>;
              console.log('Editing patient in patientMachine:', editEvent.data);
              return context.patients.map((patient) =>
                patient.id === editEvent.data.id ? editEvent.data : patient
              );
            },
          }),
        },
        INITIALIZE: {
          actions: assign({
            patients: ({ context, event }) => {
              console.log('INITIALIZE event in patientMachine:', event);
              if ('data' in event && event.data) {
                return event.data as Patient[] || [];
              }
              return context.patients; // Fallback to current state
            },
          }),
        },
      },
    },
  },
});
