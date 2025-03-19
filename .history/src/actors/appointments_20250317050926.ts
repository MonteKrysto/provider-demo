import { createMachine, assign } from 'xstate';
import { Appointment } from '../types/appointments';
import { PracticeEvent } from '../types/events';

interface AppointmentsContext {
  appointments: Appointment[];
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
        SCHEDULE: 'scheduling',
        RESCHEDULE: 'rescheduling',
        CANCEL: 'canceling',
      },
    },
    scheduling: {
      entry: assign({
        appointments: ({ context, event }) => {
          const newAppointment: Appointment = {
            id: crypto.randomUUID(),
            patientId: (event as any).appointment.patientId,
            time: (event as any).appointment.time,
            status: 'scheduled',
          };
          return [...context.appointments, newAppointment];
        },
      }),
      always: 'idle',
    },
    rescheduling: {
      entry: assign({
        appointments: ({ context, event }) =>
          context.appointments.map((appt) =>
            appt.id === (event as any).appointment.id
              ? { ...appt, time: (event as any).appointment.time }
              : appt
          ),
      }),
      always: 'idle',
    },
    canceling: {
      entry: assign({
        appointments: ({ context, event }) =>
          context.appointments.map((appt) =>
            appt.id === (event as any).appointment.id ? { ...appt, status: 'canceled' } : appt
          ),
      }),
      always: 'idle',
    },
  },
});
