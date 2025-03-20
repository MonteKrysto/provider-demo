// import { createMachine, createActor, assign } from 'xstate';
// import { createBrowserInspector } from '@statelyai/inspect';
// import { patientMachine } from './patient';
// import { notesMachine } from './notes';
// import { billingMachine } from './billing';
// import { appointmentsMachine } from './appointments';
// import { Patient } from '../types/patient';
// import { PracticeEvent } from '../types/events';
// import { ActorRefFrom } from 'xstate';

// // Inspector (dev-only)
// const inspector = process.env.NODE_ENV === 'development' ? createBrowserInspector() : null;

// // Pre-create actors
// const patientActor = createActor(patientMachine, { inspect: inspector?.inspect });
// const notesActor = createActor(notesMachine, { inspect: inspector?.inspect });
// const billingActor = createActor(billingMachine, { inspect: inspector?.inspect });
// const appointmentsActor = createActor(appointmentsMachine, { inspect: inspector?.inspect });

// interface PracticeContext {
//   patientRef: ActorRefFrom<typeof patientMachine>;
//   notesRef: ActorRefFrom<typeof notesMachine>;
//   billingRef: ActorRefFrom<typeof billingMachine>;
//   appointmentsRef: ActorRefFrom<typeof appointmentsMachine>;
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
//     billingRef: billingActor,
//     appointmentsRef: appointmentsActor,
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
//         console.log('Starting all actors');
//         patientActor.start();
//         notesActor.start();
//         billingActor.start();
//         appointmentsActor.start();
//       },
//       on: {
//         EDIT_PATIENT: {
//           actions: ({ context, event }) => {
//             context.patientRef.send(event);
//             console.log('EDIT_PATIENT event sent', event);
//           },
//         },
//         SAVE_DRAFT: {
//           actions: ({ context, event }) => {
//             context.notesRef.send(event);
//             console.log('SAVE_DRAFT event sent', event);
//           },
//         },
//         LOCK_NOTE: {
//           actions: ({ context, event }) => {
//             context.notesRef.send(event);
//             console.log('LOCK_NOTE event sent', event);
//           },
//         },
//         GENERATE_INVOICE: {
//           actions: ({ context, event }) => {
//             context.billingRef.send(event);
//             console.log('GENERATE_INVOICE event sent', event);
//           },
//         },
//         PROCESS_PAYMENT: {
//           actions: ({ context, event }) => {
//             context.billingRef.send(event);
//             console.log('PROCESS_PAYMENT event sent', event);
//           },
//         },
//         SCHEDULE: {
//           actions: [
//             ({ context, event }) => {
//               context.appointmentsRef.send(event);
//               console.log('SCHEDULE event sent', event);
//             },
//             assign({
//               modal: () => ({
//                 isOpen: true,
//                 content: 'patientDetails' as const, // Ensure literal type
//               }),
//             }),
//           ],
//         },
//         RESCHEDULE: {
//           actions: ({ context, event }) => {
//             context.appointmentsRef.send(event);
//             console.log('RESCHEDULE event sent', event);
//           },
//         },
//         CANCEL: {
//           actions: ({ context, event }) => {
//             context.appointmentsRef.send(event);
//             console.log('CANCEL event sent', event);
//           },
//         },
//         OPEN_MODAL: {
//           actions: assign({
//             modal: (_, event) => {
//               const openEvent = event as unknown as Extract<PracticeEvent, { type: 'OPEN_MODAL' }>; // Corrected syntax
//               console.log('OPEN_MODAL event sent', event);
//               return {
//                 isOpen: true,
//                 content: openEvent.content ?? 'patientDetails' as const,
//               };
//             },
//           }),
//         },
//         CLOSE_MODAL: {
//           actions: assign({
//             modal: () => {
//               console.log('CLOSE_MODAL event sent');
//               return { isOpen: false, content: null };
//             },
//           }),
//         },
//       },
//     },
//   },
// });


// import { createMachine, createActor, assign, sendParent } from 'xstate';
// import { createBrowserInspector } from '@statelyai/inspect';
// import { patientMachine } from './patient';
// import { notesMachine } from './notes';
// import { billingMachine } from './billing';
// import { appointmentsMachine } from './appointments';
// import { Patient } from '../types/patient';
// import { PracticeEvent } from '../types/events';
// import { ActorRefFrom } from 'xstate';

// // Inspector (dev-only)
// const inspector = process.env.NODE_ENV === 'development' ? createBrowserInspector() : null;

// // Pre-create actors
// const patientActor = createActor(patientMachine, { inspect: inspector?.inspect });
// const notesActor = createActor(notesMachine, { inspect: inspector?.inspect });
// const billingActor = createActor(billingMachine, { inspect: inspector?.inspect });
// const appointmentsActor = createActor(appointmentsMachine, { inspect: inspector?.inspect });

// interface PracticeContext {
//   patientRef: ActorRefFrom<typeof patientMachine>;
//   notesRef: ActorRefFrom<typeof notesMachine>;
//   billingRef: ActorRefFrom<typeof billingMachine>;
//   appointmentsRef: ActorRefFrom<typeof appointmentsMachine>;
//   activePatient: Patient | null;
//   modal: {
//     isOpen: boolean;
//     content: 'patientDetails' | null;
//   };
//   isLoading: boolean; // Add loading state
// }

// export const practiceMachine = createMachine({
//   id: 'practiceManagement',
//   initial: 'loading',
//   context: {
//     patientRef: patientActor,
//     notesRef: notesActor,
//     billingRef: billingActor,
//     appointmentsRef: appointmentsActor,
//     activePatient: null,
//     modal: {
//       isOpen: false,
//       content: null,
//     },
//     isLoading: true,
//   } satisfies PracticeContext,
//   types: {} as { context: PracticeContext; events: PracticeEvent },
//   states: {
//     loading: {
//       entry: () => {
//         fetch('http://localhost:3000/api/data')
//           .then((response) => response.json())
//           .then((data) => {
//             patientActor.send({ type: 'INITIALIZE', data: data.patients });
//             notesActor.send({ type: 'INITIALIZE', data: data.notes });
//             billingActor.send({ type: 'INITIALIZE', data: data.invoices });
//             appointmentsActor.send({ type: 'INITIALIZE', data: data.appointments });
//             sendParent({ type: 'LOADED' });
//           })
//           .catch((error) => {
//             console.error('Failed to load data:', error);
//             sendParent({ type: 'LOADED' }); // Proceed even on error for now
//           });
//       },
//       on: {
//         LOADED: {
//           target: 'running',
//           actions: assign({ isLoading: false }),
//         },
//       },
//     },
//     running: {
//       entry: () => {
//         console.log('Starting all actors');
//         patientActor.start();
//         notesActor.start();
//         billingActor.start();
//         appointmentsActor.start();
//       },
//       on: {
//         EDIT_PATIENT: {
//           actions: ({ context, event }) => {
//             context.patientRef.send(event);
//             console.log('EDIT_PATIENT event sent', event);
//           },
//         },
//         SAVE_DRAFT: {
//           actions: [
//             ({ context, event }) => {
//               context.notesRef.send(event);
//               console.log('SAVE_DRAFT event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'SAVE_DRAFT', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Save draft response:', data))
//                 .catch((error) => console.error('Save draft failed:', error));
//             },
//           ],
//         },
//         LOCK_NOTE: {
//           actions: [
//             ({ context, event }) => {
//               context.notesRef.send(event);
//               console.log('LOCK_NOTE event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'LOCK_NOTE', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Lock note response:', data))
//                 .catch((error) => console.error('Lock note failed:', error));
//             },
//           ],
//         },
//         GENERATE_INVOICE: {
//           actions: [
//             ({ context, event }) => {
//               context.billingRef.send(event);
//               console.log('GENERATE_INVOICE event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'GENERATE_INVOICE', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Generate invoice response:', data))
//                 .catch((error) => console.error('Generate invoice failed:', error));
//             },
//           ],
//         },
//         PROCESS_PAYMENT: {
//           actions: [
//             ({ context, event }) => {
//               context.billingRef.send(event);
//               console.log('PROCESS_PAYMENT event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'PROCESS_PAYMENT', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Process payment response:', data))
//                 .catch((error) => console.error('Process payment failed:', error));
//             },
//           ],
//         },
//         SCHEDULE: {
//           actions: [
//             ({ context, event }) => {
//               context.appointmentsRef.send(event);
//               console.log('SCHEDULE event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'SCHEDULE', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Schedule response:', data))
//                 .catch((error) => console.error('Schedule failed:', error));
//             },
//             assign({
//               modal: () => ({
//                 isOpen: true,
//                 content: 'patientDetails' as const,
//               }),
//             }),
//           ],
//         },
//         RESCHEDULE: {
//           actions: [
//             ({ context, event }) => {
//               context.appointmentsRef.send(event);
//               console.log('RESCHEDULE event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'RESCHEDULE', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Reschedule response:', data))
//                 .catch((error) => console.error('Reschedule failed:', error));
//             },
//           ],
//         },
//         CANCEL: {
//           actions: [
//             ({ context, event }) => {
//               context.appointmentsRef.send(event);
//               console.log('CANCEL event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'CANCEL', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Cancel response:', data))
//                 .catch((error) => console.error('Cancel failed:', error));
//             },
//           ],
//         },
//         OPEN_MODAL: {
//           actions: assign({
//             modal: (_, event) => {
//               const openEvent = event as unknown as Extract<PracticeEvent, { type: 'OPEN_MODAL' }>;
//               console.log('OPEN_MODAL event sent', event);
//               return {
//                 isOpen: true,
//                 content: openEvent.content ?? 'patientDetails' as const,
//               };
//             },
//           }),
//         },
//         CLOSE_MODAL: {
//           actions: assign({
//             modal: () => {
//               console.log('CLOSE_MODAL event sent');
//               return { isOpen: false, content: null };
//             },
//           }),
//         },
//         INITIALIZE: { actions: () => {} }, // Handle initial load event
//       },
//     },
//   },
// });






// import { createMachine, createActor, assign, fromPromise } from 'xstate';
// import { createBrowserInspector } from '@statelyai/inspect';
// import { patientMachine } from './patient';
// import { notesMachine } from './notes';
// import { billingMachine } from './billing';
// import { appointmentsMachine } from './appointments';
// import { Patient } from '../types/patient';
// import { PracticeEvent } from '../types/events';
// import { ActorRefFrom } from 'xstate';
// import { Appointment, Invoice, Note } from '~/types';

// // Inspector (dev-only)
// const inspector = process.env.NODE_ENV === 'development' ? createBrowserInspector() : null;

// // Pre-create actors
// const patientActor = createActor(patientMachine, { inspect: inspector?.inspect });
// const notesActor = createActor(notesMachine, { inspect: inspector?.inspect });
// const billingActor = createActor(billingMachine, { inspect: inspector?.inspect });
// const appointmentsActor = createActor(appointmentsMachine, { inspect: inspector?.inspect });

// interface PracticeContext {
//   patientRef: ActorRefFrom<typeof patientMachine>;
//   notesRef: ActorRefFrom<typeof notesMachine>;
//   billingRef: ActorRefFrom<typeof billingMachine>;
//   appointmentsRef: ActorRefFrom<typeof appointmentsMachine>;
//   activePatient: Patient | null;
//   modal: {
//     isOpen: boolean;
//     content: 'patientDetails' | null;
//   };
//   isLoading: boolean;
//   error?: string;
// }

// export const practiceMachine = createMachine({
//   id: 'practiceManagement',
//   initial: 'loading',
//   context: {
//     patientRef: patientActor,
//     notesRef: notesActor,
//     billingRef: billingActor,
//     appointmentsRef: appointmentsActor,
//     activePatient: null,
//     modal: {
//       isOpen: false,
//       content: null,
//     },
//     isLoading: true,
//     error: undefined,
//   } satisfies PracticeContext,
//   types: {} as { context: PracticeContext; events: PracticeEvent },
//   states: {
//     loading: {
//       invoke: {
//         src: fromPromise(async () => {
//           console.log('Starting fetch from http://localhost:3000/api/data');
//           const controller = new AbortController();
//           const timeout = setTimeout(() => {
//             controller.abort();
//             console.log('Fetch timed out after 5 seconds');
//           }, 5000);

//           try {
//             const response = await fetch('http://localhost:3000/api/data', {
//               signal: controller.signal,
//             });
//             clearTimeout(timeout);
//             if (!response.ok) {
//               throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             const data = await response.json();
//             console.log('Fetch succeeded, data:', data);
//             return data;
//           } catch (error) {
//             clearTimeout(timeout);
//             console.error('Fetch failed:', error);
//             throw error;
//           }
//         }),
//         onDone: {
//           target: 'running',
//           actions: [
//             assign({ isLoading: false }),
//             ({ context, event }) => {
//               const data = event.output as { patients: Patient[]; notes: Note; invoices: Invoice; appointments: Appointment };
//               console.log('Sending INITIALIZE events with data:', data);
//               context.patientRef.send({ type: 'INITIALIZE', data: data.patients });
//               context.notesRef.send({ type: 'INITIALIZE', data: data.notes });
//               context.billingRef.send({ type: 'INITIALIZE', data: data.invoices });
//               context.appointmentsRef.send({ type: 'INITIALIZE', data: data.appointments });
//             },
//           ],
//           guard: ({ event }) => {
//             console.log('Guard check for onDone:', event);
//             return event.output !== null && event.output !== undefined;
//           },
//         },
//         onError: {
//           target: 'running',
//           actions: [
//             assign({
//               isLoading: false,
//               error: ({ event }) => {
//                 const errorData = event.data as unknown; // Type assertion to handle any error
//                 const errorMessage = errorData instanceof Error ? errorData.message : String(errorData) || 'Unknown error';
//                 console.error('onError triggered:', errorMessage);
//                 return errorMessage;
//               },
//             }),
//           ],
//         },
//       },
//     },
//     running: {
//       entry: () => {
//         console.log('Starting all actors');
//         patientActor.start();
//         notesActor.start();
//         billingActor.start();
//         appointmentsActor.start();
//       },
//       on: {
//         EDIT_PATIENT: {
//           actions: ({ context, event }) => {
//             context.patientRef.send(event);
//             console.log('EDIT_PATIENT event sent', event);
//           },
//         },
//         SAVE_DRAFT: {
//           actions: [
//             ({ context, event }) => {
//               context.notesRef.send(event);
//               console.log('SAVE_DRAFT event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'SAVE_DRAFT', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Save draft response:', data))
//                 .catch((error) => console.error('Save draft failed:', error));
//             },
//           ],
//         },
//         LOCK_NOTE: {
//           actions: [
//             ({ context, event }) => {
//               context.notesRef.send(event);
//               console.log('LOCK_NOTE event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'LOCK_NOTE', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Lock note response:', data))
//                 .catch((error) => console.error('Lock note failed:', error));
//             },
//           ],
//         },
//         GENERATE_INVOICE: {
//           actions: [
//             ({ context, event }) => {
//               context.billingRef.send(event);
//               console.log('GENERATE_INVOICE event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'GENERATE_INVOICE', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Generate invoice response:', data))
//                 .catch((error) => console.error('Generate invoice failed:', error));
//             },
//           ],
//         },
//         PROCESS_PAYMENT: {
//           actions: [
//             ({ context, event }) => {
//               context.billingRef.send(event);
//               console.log('PROCESS_PAYMENT event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'PROCESS_PAYMENT', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Process payment response:', data))
//                 .catch((error) => console.error('Process payment failed:', error));
//             },
//           ],
//         },
//         SCHEDULE: {
//           actions: [
//             ({ context, event }) => {
//               context.appointmentsRef.send(event);
//               console.log('SCHEDULE event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'SCHEDULE', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Schedule response:', data))
//                 .catch((error) => console.error('Schedule failed:', error));
//             },
//             assign({
//               modal: () => ({
//                 isOpen: true,
//                 content: 'patientDetails' as const,
//               }),
//             }),
//           ],
//         },
//         RESCHEDULE: {
//           actions: [
//             ({ context, event }) => {
//               context.appointmentsRef.send(event);
//               console.log('RESCHEDULE event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'RESCHEDULE', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Reschedule response:', data))
//                 .catch((error) => console.error('Reschedule failed:', error));
//             },
//           ],
//         },
//         CANCEL: {
//           actions: [
//             ({ context, event }) => {
//               context.appointmentsRef.send(event);
//               console.log('CANCEL event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'CANCEL', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Cancel response:', data))
//                 .catch((error) => console.error('Cancel failed:', error));
//             },
//           ],
//         },
//         OPEN_MODAL: {
//           actions: assign({
//             modal: (_, event) => {
//               const openEvent = event as unknown as Extract<PracticeEvent, { type: 'OPEN_MODAL' }>;
//               console.log('OPEN_MODAL event sent', event);
//               return {
//                 isOpen: true,
//                 content: openEvent.content ?? 'patientDetails' as const,
//               };
//             },
//           }),
//         },
//         CLOSE_MODAL: {
//           actions: assign({
//             modal: () => {
//               console.log('CLOSE_MODAL event sent');
//               return { isOpen: false, content: null };
//             },
//           }),
//         },
//         INITIALIZE: { actions: () => {} },
//         LOADED: { actions: assign({ isLoading: false }) },
//       },
//     },
//   },
// });


import { createMachine, createActor, assign, fromPromise } from 'xstate';
import { createBrowserInspector } from '@statelyai/inspect';
import { patientMachine } from './patient';
import { notesMachine } from './notes';
import { billingMachine } from './billing';
import { appointmentsMachine } from './appointments';
import { Patient } from '../types/patient';
import { PracticeEvent } from '../types/events';
import { ActorRefFrom } from 'xstate';
import { Note } from '../types/notes';
import { Invoice } from '../types/billing';
import { Appointment } from '../types/appointments';

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
  isLoading: boolean;
  error?: string;
}

export const practiceMachine = createMachine({
  id: 'practiceManagement',
  initial: 'loading',
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
    isLoading: true,
    error: undefined,
  } satisfies PracticeContext,
  types: {} as { context: PracticeContext; events: PracticeEvent },
  states: {
    loading: {
      invoke: {
        src: fromPromise(async () => {
          console.log('Starting fetch from http://localhost:3000/api/data');
          const controller = new AbortController();
          const timeout = setTimeout(() => {
            controller.abort();
            console.log('Fetch timed out after 5 seconds');
          }, 5000);

          try {
            const response = await fetch('http://localhost:3000/api/data', {
              signal: controller.signal,
            });
            clearTimeout(timeout);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetch succeeded, data:', data);
            return data;
          } catch (error) {
            clearTimeout(timeout);
            console.error('Fetch failed:', error);
            throw error;
          }
        }),
        onDone: {
          target: 'running',
          actions: [
            assign({ isLoading: false }),
            ({ context, event }: { context: PracticeContext; event: any }) => {
              const data = event.output as { patients: Patient[]; notes: Record<string, Note[]>; invoices: Invoice[]; appointments: Appointment[] };
              console.log('Sending INITIALIZE events with data:', data);
              context.patientRef.send({ type: 'INITIALIZE', data: data.patients });
              context.notesRef.send({ type: 'INITIALIZE', data: data.notes });
              context.billingRef.send({ type: 'INITIALIZE', data: data.invoices });
              context.appointmentsRef.send({ type: 'INITIALIZE', data: data.appointments });
            },
          ],
          guard: ({ event }: { event: any }) => {
            console.log('Guard check for onDone:', event);
            return event.output !== null && event.output !== undefined;
          },
        },
        onError: {
          target: 'running',
          actions: [
            assign({
              isLoading: false,
              error: ({ event }: { event: any }) => {
                const errorMessage = event.error instanceof Error ? event.error.message : String(event.error) || 'Unknown error';
                console.error('onError triggered:', errorMessage);
                return errorMessage;
              },
            }),
          ],
        },
      },
    },
    running: {
      entry: () => {
        console.log('Starting all actors');
        patientActor.start();
        notesActor.start();
        billingActor.start();
        appointmentsActor.start();
      },
      on: {
        CREATE_PATIENT: {
          actions: [
            ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
              context.patientRef.send(event);
              console.log('CREATE_PATIENT event sent', event);
              fetch('http://localhost:3000/api/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'CREATE_PATIENT', payload: event }),
              })
                .then((response) => response.json())
                .then((data) => console.log('Create patient response:', data))
                .catch((error) => console.error('Create patient failed:', error));
            },
          ],
        },
        EDIT_PATIENT: {
          actions: [
            ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
              context.patientRef.send(event);
              console.log('EDIT_PATIENT event sent', event);
            },
            assign({
              activePatient: ({ event }: { event: PracticeEvent }) => {
                const editEvent = event as Extract<PracticeEvent, { type: 'EDIT_PATIENT' }>;
                return editEvent.data as Patient;
              },
            }),
          ],
        },
        SAVE_DRAFT: {
          actions: [
            ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
              context.notesRef.send(event);
              console.log('SAVE_DRAFT event sent', event);
              fetch('http://localhost:3000/api/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'SAVE_DRAFT', payload: event }),
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log('Save draft response:', data);
                  if (data.success && data.note) {
                    context.notesRef.send({
                      type: 'ADD_NOTE',
                      note: data.note,
                    });
                    // Clear currentNote after adding the note
                    context.notesRef.send({
                      type: 'CLEAR_CURRENT_NOTE',
                    });
                  } else {
                    console.error('Failed to save draft:', data.error);
                  }
                })
                .catch((error) => console.error('Save draft failed:', error));
            },
          ],
        },
        LOCK_NOTE: {
          actions: [
            ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
              context.notesRef.send(event);
              console.log('LOCK_NOTE event sent', event);
              fetch('http://localhost:3000/api/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'LOCK_NOTE', payload: event }),
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log('Lock note response:', data);
                  if (data.success && data.note) {
                    context.notesRef.send({
                      type: 'ADD_NOTE',
                      note: data.note,
                    });
                    // Clear currentNote after adding the note
                    context.notesRef.send({
                      type: 'CLEAR_CURRENT_NOTE',
                    });
                  } else {
                    console.error('Failed to lock note:', data.error);
                  }
                })
                .catch((error) => console.error('Lock note failed:', error));
            },
          ],
        },
        LOCK_EXISTING_NOTE: {
          actions: [
            ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
              context.notesRef.send(event);
              console.log('LOCK_EXISTING_NOTE event sent', event);
              fetch('http://localhost:3000/api/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'LOCK_EXISTING_NOTE', payload: event }),
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log('Lock existing note response:', data);
                  if (data.success && data.note) {
                    context.notesRef.send({
                      type: 'UPDATE_NOTE',
                      note: data.note,
                    });
                  } else {
                    console.error('Failed to lock existing note:', data.error);
                  }
                })
                .catch((error) => console.error('Lock existing note failed:', error));
            },
          ],
        },
        UPDATE_NOTE: {
          actions: [
            ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
              context.notesRef.send(event);
              console.log('UPDATE_NOTE event sent', event);
              fetch('http://localhost:3000/api/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'UPDATE_NOTE', payload: event }),
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log('Update note response:', data);
                  if (data.success && data.note) {
                    context.notesRef.send({
                      type: 'UPDATE_NOTE',
                      note: data.note,
                    });
                  } else {
                    console.error('Failed to update note:', data.error);
                  }
                })
                .catch((error) => console.error('Update note failed:', error));
            },
          ],
        },
        GENERATE_INVOICE: {
          actions: [
            ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
              context.billingRef.send(event);
              console.log('GENERATE_INVOICE event sent', event);
              fetch('http://localhost:3000/api/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'GENERATE_INVOICE', payload: event }),
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log('Generate invoice response:', data);
                  if (data.success && data.invoice) {
                    context.billingRef.send({
                      type: 'ADD_INVOICE',
                      invoice: data.invoice,
                    });
                  } else {
                    console.error('Failed to generate invoice:', data.error);
                  }
                })
                .catch((error) => console.error('Generate invoice failed:', error));
            },
          ],
        },
        PROCESS_PAYMENT: {
          actions: [
            ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
              context.billingRef.send(event);
              console.log('PROCESS_PAYMENT event sent', event);
              fetch('http://localhost:3000/api/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'PROCESS_PAYMENT', payload: event }),
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log('Process payment response:', data);
                  if (data.success && data.invoiceId) {
                    context.billingRef.send({
                      type: 'UPDATE_INVOICE',
                      invoiceId: data.invoiceId,
                      status: 'paid',
                    });
                  } else {
                    console.error('Failed to process payment:', data.error);
                  }
                })
                .catch((error) => console.error('Process payment failed:', error));
            },
          ],
        },
        SCHEDULE: {
          actions: [
            ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
              context.appointmentsRef.send(event);
              console.log('SCHEDULE event sent', event);
              fetch('http://localhost:3000/api/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'SCHEDULE', payload: event }),
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log('Schedule response:', data);
                  if (data.success && data.appointment) {
                    context.appointmentsRef.send({
                      type: 'ADD_APPOINTMENT', // Use ADD_APPOINTMENT for new appointments
                      appointment: data.appointment,
                    });
                  } else {
                    console.error('Failed to schedule appointment:', data.error);
                  }
                })
                .catch((error) => console.error('Schedule failed:', error));
            },
            assign({
              modal: () => ({
                isOpen: true,
                content: 'patientDetails' as const,
              }),
            }),
          ],
        },
        RESCHEDULE: {
          actions: [
            ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
              context.appointmentsRef.send(event);
              console.log('RESCHEDULE event sent', event);
              fetch('http://localhost:3000/api/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'RESCHEDULE', payload: event }),
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log('Reschedule response:', data);
                  if (data.success && data.appointment) {
                    context.appointmentsRef.send({
                      type: 'UPDATE_APPOINTMENT',
                      appointment: data.appointment,
                    });
                  } else {
                    console.error('Failed to reschedule appointment:', data.error);
                  }
                })
                .catch((error) => console.error('Reschedule failed:', error));
            },
          ],
        },
        CANCEL: {
          actions: [
            ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
              context.appointmentsRef.send(event);
              console.log('CANCEL event sent', event);
              fetch('http://localhost:3000/api/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'CANCEL', payload: event }),
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log('Cancel response:', data);
                  if (data.success && data.appointment) {
                    context.appointmentsRef.send({
                      type: 'UPDATE_APPOINTMENT',
                      appointment: data.appointment,
                    });
                  } else {
                    console.error('Failed to cancel appointment:', data.error);
                  }
                })
                .catch((error) => console.error('Cancel failed:', error));
            },
          ],
        },
        OPEN_MODAL: {
          actions: assign({
            modal: ({ event }: { event: PracticeEvent }) => {
              const openEvent = event as Extract<PracticeEvent, { type: 'OPEN_MODAL' }>;
              console.log('OPEN_MODAL event sent', event);
              return {
                isOpen: true,
                content: openEvent.content as 'patientDetails',
              } as const;
            },
          }),
        },
        CLOSE_MODAL: {
          actions: assign({
            modal: () => {
              console.log('CLOSE_MODAL event sent');
              return { isOpen: false, content: null };
            },
          }),
        },
        INITIALIZE: { actions: () => {} },
        LOADED: { actions: assign({ isLoading: false }) },
      },
    },
  },
});


// export const practiceMachine = createMachine({
//   id: 'practiceManagement',
//   initial: 'loading',
//   context: {
//     patientRef: patientActor,
//     notesRef: notesActor,
//     billingRef: billingActor,
//     appointmentsRef: appointmentsActor,
//     activePatient: null,
//     modal: {
//       isOpen: false,
//       content: null,
//     },
//     isLoading: true,
//     error: undefined,
//   } satisfies PracticeContext,
//   types: {} as { context: PracticeContext; events: PracticeEvent },
//   states: {
//     loading: {
//       invoke: {
//         src: fromPromise(async () => {
//           console.log('Starting fetch from http://localhost:3000/api/data');
//           const controller = new AbortController();
//           const timeout = setTimeout(() => {
//             controller.abort();
//             console.log('Fetch timed out after 5 seconds');
//           }, 5000);

//           try {
//             const response = await fetch('http://localhost:3000/api/data', {
//               signal: controller.signal,
//             });
//             clearTimeout(timeout);
//             if (!response.ok) {
//               throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             const data = await response.json();
//             console.log('Fetch succeeded, data:', data);
//             return data;
//           } catch (error) {
//             clearTimeout(timeout);
//             console.error('Fetch failed:', error);
//             throw error;
//           }
//         }),
//         onDone: {
//           target: 'running',
//           actions: [
//             assign({ isLoading: false }),
//             ({ context, event }: { context: PracticeContext; event: any }) => {
//               const data = event.output as { patients: Patient[]; notes: Record<string, Note[]>; invoices: Invoice[]; appointments: Appointment[] };
//               console.log('Sending INITIALIZE events with data:', data);
//               context.patientRef.send({ type: 'INITIALIZE', data: data.patients });
//               context.notesRef.send({ type: 'INITIALIZE', data: data.notes });
//               context.billingRef.send({ type: 'INITIALIZE', data: data.invoices });
//               context.appointmentsRef.send({ type: 'INITIALIZE', data: data.appointments });
//             },
//           ],
//           guard: ({ event }: { event: any }) => {
//             console.log('Guard check for onDone:', event);
//             return event.output !== null && event.output !== undefined;
//           },
//         },
//         onError: {
//           target: 'running',
//           actions: [
//             assign({
//               isLoading: false,
//               error: ({ event }: { event: any }) => {
//                 const errorMessage = event.error instanceof Error ? event.error.message : String(event.error) || 'Unknown error';
//                 console.error('onError triggered:', errorMessage);
//                 return errorMessage;
//               },
//             }),
//           ],
//         },
//       },
//     },
//     running: {
//       entry: () => {
//         console.log('Starting all actors');
//         patientActor.start();
//         notesActor.start();
//         billingActor.start();
//         appointmentsActor.start();
//       },
//       on: {
//         CREATE_PATIENT: {
//           actions: [
//             ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
//               context.patientRef.send(event);
//               console.log('CREATE_PATIENT event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'CREATE_PATIENT', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Create patient response:', data))
//                 .catch((error) => console.error('Create patient failed:', error));
//             },
//           ],
//         },
//         EDIT_PATIENT: {
//           actions: [
//             ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
//               context.patientRef.send(event);
//               console.log('EDIT_PATIENT event sent', event);
//             },
//             assign({
//               activePatient: ({ event }: { event: PracticeEvent }) => {
//                 const editEvent = event as Extract<PracticeEvent, { type: 'EDIT_PATIENT' }>;
//                 return editEvent.data as Patient;
//               },
//             }),
//           ],
//         },
//         SAVE_DRAFT: {
//           actions: [
//             ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
//               context.notesRef.send(event);
//               console.log('SAVE_DRAFT event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'SAVE_DRAFT', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => {
//                   console.log('Save draft response:', data);
//                   if (data.success && data.note) {
//                     context.notesRef.send({
//                       type: 'ADD_NOTE',
//                       note: data.note,
//                     });
//                     // Clear currentNote after adding the note
//                     context.notesRef.send({
//                       type: 'CLEAR_CURRENT_NOTE',
//                     });
//                   } else {
//                     console.error('Failed to save draft:', data.error);
//                   }
//                 })
//                 .catch((error) => console.error('Save draft failed:', error));
//             },
//           ],
//         },
//         LOCK_NOTE: {
//           actions: [
//             ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
//               context.notesRef.send(event);
//               console.log('LOCK_NOTE event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'LOCK_NOTE', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => {
//                   console.log('Lock note response:', data);
//                   if (data.success && data.note) {
//                     context.notesRef.send({
//                       type: 'ADD_NOTE',
//                       note: data.note,
//                     });
//                     // Clear currentNote after adding the note
//                     context.notesRef.send({
//                       type: 'CLEAR_CURRENT_NOTE',
//                     });
//                   } else {
//                     console.error('Failed to lock note:', data.error);
//                   }
//                 })
//                 .catch((error) => console.error('Lock note failed:', error));
//             },
//           ],
//         },
//         LOCK_EXISTING_NOTE: {
//           actions: [
//             ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
//               context.notesRef.send(event);
//               console.log('LOCK_EXISTING_NOTE event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'LOCK_EXISTING_NOTE', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => {
//                   console.log('Lock existing note response:', data);
//                   if (data.success && data.note) {
//                     context.notesRef.send({
//                       type: 'UPDATE_NOTE',
//                       note: data.note,
//                     });
//                   } else {
//                     console.error('Failed to lock existing note:', data.error);
//                   }
//                 })
//                 .catch((error) => console.error('Lock existing note failed:', error));
//             },
//           ],
//         },
//         UPDATE_NOTE: {
//           actions: [
//             ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
//               context.notesRef.send(event);
//               console.log('UPDATE_NOTE event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'UPDATE_NOTE', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => {
//                   console.log('Update note response:', data);
//                   if (data.success && data.note) {
//                     context.notesRef.send({
//                       type: 'UPDATE_NOTE',
//                       note: data.note,
//                     });
//                   } else {
//                     console.error('Failed to update note:', data.error);
//                   }
//                 })
//                 .catch((error) => console.error('Update note failed:', error));
//             },
//           ],
//         },
//         GENERATE_INVOICE: {
//           actions: [
//             ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
//               context.billingRef.send(event);
//               console.log('GENERATE_INVOICE event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'GENERATE_INVOICE', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Generate invoice response:', data))
//                 .catch((error) => console.error('Generate invoice failed:', error));
//             },
//           ],
//         },
//         PROCESS_PAYMENT: {
//           actions: [
//             ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
//               context.billingRef.send(event);
//               console.log('PROCESS_PAYMENT event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'PROCESS_PAYMENT', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Process payment response:', data))
//                 .catch((error) => console.error('Process payment failed:', error));
//             },
//           ],
//         },
//         SCHEDULE: {
//           actions: [
//             ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
//               context.appointmentsRef.send(event);
//               console.log('SCHEDULE event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'SCHEDULE', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Schedule response:', data))
//                 .catch((error) => console.error('Schedule failed:', error));
//             },
//             assign({
//               modal: () => ({
//                 isOpen: true,
//                 content: 'patientDetails' as const,
//               }),
//             }),
//           ],
//         },
//         RESCHEDULE: {
//           actions: [
//             ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
//               context.appointmentsRef.send(event);
//               console.log('RESCHEDULE event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'RESCHEDULE', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Reschedule response:', data))
//                 .catch((error) => console.error('Reschedule failed:', error));
//             },
//           ],
//         },
//         CANCEL: {
//           actions: [
//             ({ context, event }: { context: PracticeContext; event: PracticeEvent }) => {
//               context.appointmentsRef.send(event);
//               console.log('CANCEL event sent', event);
//               fetch('http://localhost:3000/api/update', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'CANCEL', payload: event }),
//               })
//                 .then((response) => response.json())
//                 .then((data) => console.log('Cancel response:', data))
//                 .catch((error) => console.error('Cancel failed:', error));
//             },
//           ],
//         },
//         OPEN_MODAL: {
//           actions: assign({
//             modal: ({ event }: { event: PracticeEvent }) => {
//               const openEvent = event as Extract<PracticeEvent, { type: 'OPEN_MODAL' }>;
//               console.log('OPEN_MODAL event sent', event);
//               return {
//                 isOpen: true,
//                 content: openEvent.content as 'patientDetails',
//               } as const;
//             },
//           }),
//         },
//         CLOSE_MODAL: {
//           actions: assign({
//             modal: () => {
//               console.log('CLOSE_MODAL event sent');
//               return { isOpen: false, content: null };
//             },
//           }),
//         },
//         INITIALIZE: { actions: () => {} },
//         LOADED: { actions: assign({ isLoading: false }) },
//       },
//     },
//   },
// });
