// import { createMachine, assign, createActor } from 'xstate';
// import { createBrowserInspector } from '@statelyai/inspect';
// import { patientMachine } from './patient';
// import { notesMachine } from './notes';
// import { Patient } from '../types/patient';
// import { PracticeEvent } from '../types/events';
// import { ActorRefFrom } from 'xstate';

// // Inspector (dev-only)
// const inspector = process.env.NODE_ENV === 'development' ? createBrowserInspector() : null;

// // Pre-create actors
// const patientActor = createActor(patientMachine, { inspect: inspector?.inspect });
// const notesActor = createActor(notesMachine, { inspect: inspector?.inspect });

// interface PracticeContext {
//   patientRef: ActorRefFrom<typeof patientMachine>;
//   notesRef: ActorRefFrom<typeof notesMachine>;
//   activePatient: Patient | null;
//   modal: {
//     isOpen: boolean;
//     content: 'patientDetails' | null;
//   };
// }

// export const practiceMachine = createMachine({
//   id: 'practiceManagement',
//   initial: 'running',
//   context: {
//     patientRef: patientActor,
//     notesRef: notesActor,
//     activePatient: null,
//     modal: {
//       isOpen: false,
//       content: null,
//     },
//   } satisfies PracticeContext,
//   types: {} as { context: PracticeContext; events: PracticeEvent },
//   states: {
//     running: {
//       entry: () => {
//         patientActor.start();
//         notesActor.start();
//       },
//       on: {
//         EDIT_PATIENT: {
//           actions: ({ context, event }) => context.patientRef.send(event),
//         },
//         SAVE_DRAFT: {
//           actions: ({ context, event }) =>
//             context.notesRef.send({ ...event, activePatient: context.activePatient }),
//         },
//         LOCK_NOTE: {
//           actions: ({ context }) =>
//             context.notesRef.send({ type: 'LOCK_NOTE', activePatient: context.activePatient }),
//         },
//         PRESCRIBE: {
//           actions: ({ context, event }) => context.patientRef.send(event),
//         },
//         OPEN_MODAL: {
//           actions: assign({
//             modal: (_, event?: { type: 'OPEN_MODAL'; content?: 'patientDetails' }) => {
//               if (event?.type === 'OPEN_MODAL') {
//                 return {
//                   isOpen: true,
//                   content: event.content ?? 'patientDetails',
//                 };
//               }
//               return { isOpen: false, content: null }; // Fallback in case of unexpected event type
//             },
//           }),
//         },
//         CLOSE_MODAL: {
//           actions: assign({
//             modal: () => ({ isOpen: false, content: null }),
//           }),
//         },
//       },
//     },
//   },
// });

