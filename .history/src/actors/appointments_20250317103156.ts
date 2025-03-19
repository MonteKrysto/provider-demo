// import { createMachine, assign, fromPromise } from 'xstate';
// import { Appointment } from '../types/appointments';
// import { PracticeEvent } from '../types/events';

// interface AppointmentsContext {
//   appointments: Appointment[];
// }

// interface CancelInput {
//   appointmentId: string;
// }

// interface CancelResult {
//   appointmentId: string;
// }

// export const appointmentsMachine = createMachine({
//   id: 'appointments',
//   initial: 'idle',
//   context: {
//     appointments: [],
//   } satisfies AppointmentsContext,
//   types: {} as { context: AppointmentsContext; events: PracticeEvent },
//   states: {
//     idle: {
//       on: {
//         SCHEDULE: {
//           target: 'scheduling',
//         },
//         RESCHEDULE: {
//           target: 'rescheduling',
//         },
//         CANCEL: {
//           target: 'canceling',
//         },
//       },
//     },
//     scheduling: {
//       entry: assign({
//         appointments: ({ context, event }) => {
//           const scheduleEvent = event as Extract<PracticeEvent, { type: 'SCHEDULE' }>;
//           const newAppointment: Appointment = {
//             id: crypto.randomUUID(),
//             patientId: scheduleEvent.appointment.patientId,
//             time: scheduleEvent.appointment.time,
//             status: 'scheduled',
//           };
//           return [...context.appointments, newAppointment];
//         },
//       }),
//       always: 'idle',
//     },
//     rescheduling: {
//       entry: assign({
//         appointments: ({ context, event }) => {
//           const rescheduleEvent = event as Extract<PracticeEvent, { type: 'RESCHEDULE' }>;
//           return context.appointments.map((appt) =>
//             appt.id === rescheduleEvent.appointment.id
//               ? { ...appt, time: rescheduleEvent.appointment.time }
//               : appt
//           );
//         },
//       }),
//       always: 'idle',
//     },
//     canceling: {
//       invoke: {
//         src: fromPromise(
//           async ({ input }: { input: CancelInput }): Promise<CancelResult> => {
//             return new Promise((resolve, reject) => {
//               setTimeout(() => {
//                 const result: CancelResult = { appointmentId: input.appointmentId };
//                 if (Math.random() > 0.1) {
//                   resolve(result);
//                 } else {
//                   reject(result);
//                 }
//               }, 1000);
//             });
//           }
//         ),
//         input: (_context: AppointmentsContext, event: Extract<PracticeEvent, { type: 'CANCEL' }>) => ({
//           appointmentId: event.appointment.id,
//         }),
//         onDone: {
//           target: 'idle',
//           actions: assign({
//             appointments: ({ context, event }) => {
//               const doneEvent = event as unknown as { data: CancelResult };
//               return context.appointments.map((appt) =>
//                 appt.id === doneEvent.data.appointmentId ? { ...appt, status: 'canceled' as const } : appt
//               );
//             },
//           }),
//         },
//         onError: {
//           target: 'idle',
//           actions: assign({
//             appointments: ({ context, event }) => {
//               const errorEvent = event as unknown as { data: CancelResult };
//               // Optionally mark as 'scheduled' or log failure; here we just return unchanged
//               return context.appointments.map((appt) =>
//                 appt.id === errorEvent.data.appointmentId
//                   ? { ...appt, status: 'scheduled' as const } // Revert to scheduled on failure
//                   : appt
//               );
//             },
//           }),
//         },
//       },
//     },
//   },
// });


import { createMachine, assign, fromPromise } from 'xstate';
import { Appointment } from '../types/appointments';
import { PracticeEvent } from '../types/events';

interface AppointmentsContext {
  appointments: Appointment[];
}

interface CancelInput {
  appointmentId: string;
}

interface CancelResult {
  appointmentId: string;
}

export const appointmentsMachine = createMachine({
  id: 'appointments',
  initial: 'idle',
  context: {
    appointments: [],
  } satisfies AppointmentsContext,
  types: {} as { context: AppointmentsContext; events: PracticeEvent },
  states: {
    idle: {
      on: {
        SCHEDULE: {
          target: 'scheduling',
        },
        RESCHEDULE: {
          target: 'rescheduling',
        },
        CANCEL: {
          target: 'canceling',
        },
        INITIALIZE: {
          actions: assign({
            appointments: (_, event) => (event as any).data || [],
          }),
        },
      },
    },
    scheduling: {
      entry: assign({
        appointments: ({ context, event }) => {
          const scheduleEvent = event as Extract<PracticeEvent, { type: 'SCHEDULE' }>;
          const newAppointment: Appointment = {
            id: crypto.randomUUID(),
            patientId: scheduleEvent.appointment.patientId,
            time: scheduleEvent.appointment.time,
            status: 'scheduled',
          };
          return [...context.appointments, newAppointment];
        },
      }),
      always: 'idle',
    },
    rescheduling: {
      entry: assign({
        appointments: ({ context, event }) => {
          const rescheduleEvent = event as Extract<PracticeEvent, { type: 'RESCHEDULE' }>;
          return context.appointments.map((appt) =>
            appt.id === rescheduleEvent.appointment.id
              ? { ...appt, time: rescheduleEvent.appointment.time }
              : appt
          );
        },
      }),
      always: 'idle',
    },
    canceling: {
      invoke: {
        src: fromPromise(
          async ({ input }: { input: CancelInput }): Promise<CancelResult> => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                const result: CancelResult = { appointmentId: input.appointmentId };
                if (Math.random() > 0.1) {
                  resolve(result);
                } else {
                  reject(result);
                }
              }, 1000);
            });
          }
        ),
        input: (_context: AppointmentsContext, event: Extract<PracticeEvent, { type: 'CANCEL' }>) => ({
          appointmentId: event.appointment.id,
        }),
        onDone: {
          target: 'idle',
          actions: assign({
            appointments: ({ context, event }) => {
              const doneEvent = event as unknown as { data: CancelResult };
              return context.appointments.map((appt) =>
                appt.id === doneEvent.data.appointmentId ? { ...appt, status: 'canceled' as const } : appt
              );
            },
          }),
        },
        onError: {
          target: 'idle',
          actions: assign({
            appointments: ({ context, event }) => {
              const errorEvent = event as unknown as { data: CancelResult };
              return context.appointments.map((appt) =>
                appt.id === errorEvent.data.appointmentId
                  ? { ...appt, status: 'scheduled' as const }
                  : appt
              );
            },
          }),
        },
      },
    },
  },
});