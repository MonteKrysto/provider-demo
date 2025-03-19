import { createMachine, assign } from 'xstate';
import { Patient } from '../types';

interface PatientContext {
  patients: Patient[];
  activePatient: Patient | null;
}

export const patientMachine = createMachine({
  id: 'patient',
  initial: 'idle',
  context: { patients: [], activePatient: null } as PatientContext,
  types: {} as { context: PatientContext; events: PracticeEvent },
  states: {
    idle: {
      on: {
        EDIT_PATIENT: 'editing',
        PRESCRIBE: 'prescribing',
      },
    },
    editing: {
      entry: assign({
        activePatient: ({ context, event }) =>
          ({ ...context.activePatient!, ...event.data } as Patient),
      }),
      on: { SAVE: 'idle' },
    },
    prescribing: {
      invoke: {
        src: 'checkDrugInteractions',
        onDone: {
          target: 'idle',
          actions: assign({
            activePatient: ({ context, event }) => ({
              ...context.activePatient!,
              medications: [...context.activePatient!.medications, event.data.med],
            }),
          }),
        },
        onError: 'idle', // TODO: Add error state
      },
    },
  },
});
