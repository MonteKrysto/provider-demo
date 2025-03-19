// import { createMachine, assign } from 'xstate';
// import { Medication, Patient, PracticeEvent } from '../types';

// interface PatientContext {
//   patients: Patient[];
//   activePatient: Patient | null;
// }

// export const patientMachine = createMachine({
//   id: 'patient',
//   initial: 'idle',
//   context: { patients: [], activePatient: null } as PatientContext,
//   types: {} as { context: PatientContext; events: PracticeEvent },
//   states: {
//     idle: {
//       on: {
//         EDIT_PATIENT: 'editing',
//         PRESCRIBE: 'prescribing',
//       },
//     },
//     editing: {
//       entry: assign({
//         activePatient: ({ context, event }) => {
//           if (event.type === 'EDIT_PATIENT') {
//             return { ...context.activePatient!, ...event.data } as Patient;
//           }
//           return context.activePatient; // Return the current activePatient if the event type doesn't match
//         },
//       }),
//       on: { SAVE: 'idle' },
//     },
//     prescribing: {
//       invoke: {
//         src: 'checkDrugInteractions',
//         onDone: {
//           target: 'idle',
//           actions: assign({
//             activePatient: ({ context, event }) => {
//               const doneEvent = event as unknown as { data: { med: Medication } };
//               return {
//                 ...context.activePatient!,
//                 medications: [...context.activePatient!.medications, doneEvent.data.med],
//               };
//             },
//           }),
//         },
//         onError: 'idle', // TODO: Add error state
//       },
//     },
//   },
// });


import { createMachine, assign } from 'xstate';
import { Patient, PracticeEvent } from '../types';

interface PatientContext {
  patients: Patient[];
  activePatient: Patient | null;
}

export const patientMachine = createMachine({
  id: 'patient',
  initial: 'idle',
  context: {
    patients: [],
    activePatient: null,
  } satisfies PatientContext,
  types: {} as { context: PatientContext; events: PracticeEvent },
  states: {
    idle: {
      on: {
        EDIT_PATIENT: {
          actions: assign({
            activePatient: ({ context, event }) => {
              const editEvent = event as Extract<PracticeEvent, { type: 'EDIT_PATIENT' }>;
              return context.patients.find((p) => p.id === editEvent.data.id) || null;
            },
          }),
        },
        PRESCRIBE: {
          target: 'prescribing',
        },
        INITIALIZE: {
          actions: assign({
            patients: (_, event: Extract<PracticeEvent, { type: 'INITIALIZE' }>) => event.data || [],
          }),
        },
      },
    },
    editing: {
      entry: assign({
        activePatient: ({ context, event }) => {
          const editEvent = event as Extract<PracticeEvent, { type: 'EDIT_PATIENT' }>;
          return { ...context.activePatient!, ...editEvent.data } as Patient;
        },
      }),
      on: {
        SAVE: {
          actions: assign({
            patients: ({ context }) => {
              const activePatient = context.activePatient;
              if (activePatient) {
                return context.patients.map((p) =>
                  p.id === activePatient.id ? activePatient : p
                );
              }
              return context.patients;
            },
            activePatient: () => null,
          }),
          target: 'idle',
        },
      },
    },
    prescribing: {
      entry: assign({
        activePatient: ({ context, event }) => {
          const prescribeEvent = event as Extract<PracticeEvent, { type: 'PRESCRIBE' }>;
          return {
            ...context.activePatient!,
            medications: [...(context.activePatient!.medications || []), prescribeEvent.med],
          } as Patient;
        },
      }),
      on: {
        SAVE: {
          actions: assign({
            patients: ({ context }) => {
              if (context.activePatient) {
                return context.patients.map((p) =>
                  p.id === context.activePatient?.id ? context.activePatient : p
                ).filter((p): p is Patient => p !== null);
              }
              return context.patients;
            },
            activePatient: () => null,
          }),
          target: 'idle',
        },
      },
    },
  },
});
