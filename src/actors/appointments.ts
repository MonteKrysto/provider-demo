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
        SCHEDULE: {
          actions: [
            // No immediate action needed; handled by practiceMachine
          ],
        },
        RESCHEDULE: {
          actions: [
            // No immediate action needed; handled by practiceMachine
          ],
        },
        CANCEL: {
          actions: [
            // No immediate action needed; handled by practiceMachine
          ],
        },
        ADD_APPOINTMENT: {
          actions: assign({
            appointments: ({ context, event }) => {
              const addEvent = event as Extract<PracticeEvent, { type: 'ADD_APPOINTMENT' }>;
              console.log('Adding appointment to appointmentsMachine:', addEvent.appointment);
              return [...context.appointments, addEvent.appointment];
            },
          }),
        },
        UPDATE_APPOINTMENT: {
          actions: assign({
            appointments: ({ context, event }) => {
              const updateEvent = event as Extract<PracticeEvent, { type: 'UPDATE_APPOINTMENT' }>;
              console.log('Updating appointment in appointmentsMachine:', updateEvent.appointment);
              return context.appointments.map((appt) =>
                appt.id === updateEvent.appointment.id ? updateEvent.appointment : appt
              );
            },
          }),
        },
        INITIALIZE: {
          actions: assign({
            appointments: ({ context, event }) => {
              console.log('INITIALIZE event in appointmentsMachine:', event);
              if ('data' in event && event.data) {
                return event.data as Appointment[] || [];
              }
              return context.appointments; // Fallback to current state
            },
          }),
        },
      },
    },
  },
});
