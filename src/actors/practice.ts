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
import { apiService } from '../services/apiService';

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
        src: fromPromise(() => apiService.fetchInitialData()),
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
      initial: 'idle',
      entry: () => {
        console.log('Starting all actors');
        patientActor.start();
        notesActor.start();
        billingActor.start();
        appointmentsActor.start();
      },
      on: {
        CREATE_PATIENT: {
          target: '.creatingPatient',
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
          target: '.savingDraft',
        },
        LOCK_NOTE: {
          target: '.lockingNote',
        },
        LOCK_EXISTING_NOTE: {
          target: '.lockingExistingNote',
        },
        UPDATE_NOTE: {
          target: '.updatingNote',
        },
        GENERATE_INVOICE: {
          target: '.generatingInvoice',
        },
        PROCESS_PAYMENT: {
          target: '.processingPayment',
        },
        SCHEDULE: {
          target: '.schedulingAppointment',
          actions: ({ event }: { event: PracticeEvent }) => {
            console.log('SCHEDULE event in running state:', event);
          },
        },
        RESCHEDULE: {
          target: '.reschedulingAppointment',
        },
        CANCEL: {
          target: '.cancelingAppointment',
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
      states: {
        idle: {},
        creatingPatient: {
          invoke: {
            src: fromPromise(({ input }: { input: PracticeEvent }) =>
              apiService.createPatient(input as Extract<PracticeEvent, { type: 'CREATE_PATIENT' }>)
            ),
            input: ({ event }: { event: PracticeEvent }) => event,
            onDone: {
              target: 'idle',
              actions: [
                ({ context, event }: { context: PracticeContext; event: any }) => {
                  const { success, data, error } = event.output;
                  if (success && data?.patient) {
                    context.patientRef.send({ type: 'CREATE_PATIENT', patient: data.patient });
                    console.log('Create patient response:', data);
                  } else {
                    console.error('Failed to create patient:', error);
                  }
                },
              ],
            },
            onError: {
              target: 'idle',
              actions: ({ event }: { event: any }) => {
                console.error('Create patient failed:', event.error);
              },
            },
          },
        },
        savingDraft: {
          invoke: {
            src: fromPromise(({ input }: { input: PracticeEvent }) =>
              apiService.saveDraft(input as Extract<PracticeEvent, { type: 'SAVE_DRAFT' }>)
            ),
            input: ({ event }: { event: PracticeEvent }) => {
              console.log('savingDraft input:', event);
              return event;
            },
            onDone: {
              target: 'idle',
              actions: [
                ({ context, event }: { context: PracticeContext; event: any }) => {
                  const { success, data, error } = event.output;
                  if (success && data?.note) {
                    context.notesRef.send({ type: 'ADD_NOTE', note: data.note });
                    context.notesRef.send({ type: 'CLEAR_CURRENT_NOTE' });
                    console.log('Save draft response:', data);
                  } else {
                    console.error('Failed to save draft:', error);
                  }
                },
              ],
            },
            onError: {
              target: 'idle',
              actions: ({ event }: { event: any }) => {
                console.error('Save draft failed:', event.error);
              },
            },
          },
        },
        lockingNote: {
          invoke: {
            src: fromPromise(({ input }: { input: PracticeEvent }) =>
              apiService.lockNote(input as Extract<PracticeEvent, { type: 'LOCK_NOTE' }>)
            ),
            input: ({ event }: { event: PracticeEvent }) => {
              console.log('lockingNote input:', event);
              return event;
            },
            onDone: {
              target: 'idle',
              actions: [
                ({ context, event }: { context: PracticeContext; event: any }) => {
                  const { success, data, error } = event.output;
                  if (success && data?.note) {
                    context.notesRef.send({ type: 'ADD_NOTE', note: data.note });
                    context.notesRef.send({ type: 'CLEAR_CURRENT_NOTE' });
                    console.log('Lock note response:', data);
                  } else {
                    console.error('Failed to lock note:', error);
                  }
                },
              ],
            },
            onError: {
              target: 'idle',
              actions: ({ event }: { event: any }) => {
                console.error('Lock note failed:', event.error);
              },
            },
          },
        },
        lockingExistingNote: {
          invoke: {
            src: fromPromise(({ input }: { input: PracticeEvent }) =>
              apiService.lockExistingNote(input as Extract<PracticeEvent, { type: 'LOCK_EXISTING_NOTE' }>)
            ),
            input: ({ event }: { event: PracticeEvent }) => event,
            onDone: {
              target: 'idle',
              actions: [
                ({ context, event }: { context: PracticeContext; event: any }) => {
                  const { success, data, error } = event.output;
                  if (success && data?.note) {
                    context.notesRef.send({ type: 'UPDATE_NOTE_WITH_RESPONSE', note: data.note });
                    console.log('Lock existing note response:', data);
                  } else {
                    console.error('Failed to lock existing note:', error);
                  }
                },
              ],
            },
            onError: {
              target: 'idle',
              actions: ({ event }: { event: any }) => {
                console.error('Lock existing note failed:', event.error);
              },
            },
          },
        },
        updatingNote: {
          invoke: {
            src: fromPromise(({ input }: { input: PracticeEvent }) =>
              apiService.updateNote(input as Extract<PracticeEvent, { type: 'UPDATE_NOTE' }>)
            ),
            input: ({ event }: { event: PracticeEvent }) => event,
            onDone: {
              target: 'idle',
              actions: [
                ({ context, event }: { context: PracticeContext; event: any }) => {
                  const { success, data, error } = event.output;
                  if (success && data?.note) {
                    context.notesRef.send({ type: 'UPDATE_NOTE_WITH_RESPONSE', note: data.note });
                    console.log('Update note response:', data);
                  } else {
                    console.error('Failed to update note:', error);
                  }
                },
              ],
            },
            onError: {
              target: 'idle',
              actions: ({ event }: { event: any }) => {
                console.error('Update note failed:', event.error);
              },
            },
          },
        },
        generatingInvoice: {
          invoke: {
            src: fromPromise(({ input }: { input: PracticeEvent }) =>
              apiService.generateInvoice(input as Extract<PracticeEvent, { type: 'GENERATE_INVOICE' }>)
            ),
            input: ({ event }: { event: PracticeEvent }) => event,
            onDone: {
              target: 'idle',
              actions: [
                ({ context, event }: { context: PracticeContext; event: any }) => {
                  const { success, data, error } = event.output;
                  if (success && data?.invoice) {
                    context.billingRef.send({ type: 'ADD_INVOICE', invoice: data.invoice });
                    console.log('Generate invoice response:', data);
                  } else {
                    console.error('Failed to generate invoice:', error);
                  }
                },
              ],
            },
            onError: {
              target: 'idle',
              actions: ({ event }: { event: any }) => {
                console.error('Generate invoice failed:', event.error);
              },
            },
          },
        },
        processingPayment: {
          invoke: {
            src: fromPromise(({ input }: { input: PracticeEvent }) =>
              apiService.processPayment(input as Extract<PracticeEvent, { type: 'PROCESS_PAYMENT' }>)
            ),
            input: ({ event }: { event: PracticeEvent }) => event,
            onDone: {
              target: 'idle',
              actions: [
                ({ context, event }: { context: PracticeContext; event: any }) => {
                  const { success, data, error } = event.output;
                  if (success && data?.invoiceId) {
                    context.billingRef.send({ type: 'UPDATE_INVOICE', invoiceId: data.invoiceId, status: 'paid' });
                    console.log('Process payment response:', data);
                  } else {
                    console.error('Failed to process payment:', error);
                  }
                },
              ],
            },
            onError: {
              target: 'idle',
              actions: ({ event }: { event: any }) => {
                console.error('Process payment failed:', event.error);
              },
            },
          },
        },
        schedulingAppointment: {
          invoke: {
            src: fromPromise(({ input }: { input: PracticeEvent }) =>
              apiService.scheduleAppointment(input as Extract<PracticeEvent, { type: 'SCHEDULE' }>)
            ),
            input: ({ event }: { event: PracticeEvent }) => {
              console.log('schedulingAppointment input (explicit):', event);
              return event;
            },
            onDone: {
              target: 'idle',
              actions: [
                ({ context, event }: { context: PracticeContext; event: any }) => {
                  const { success, data, error } = event.output;
                  if (success && data?.appointment) {
                    context.appointmentsRef.send({ type: 'ADD_APPOINTMENT', appointment: data.appointment });
                    // Only open the modal if the API call succeeds
                    context.modal = {
                      isOpen: true,
                      content: 'patientDetails' as const,
                    };
                    console.log('Schedule response:', data);
                  } else {
                    console.error('Failed to schedule appointment:', error);
                  }
                },
              ],
            },
            onError: {
              target: 'idle',
              actions: ({ event }: { event: any }) => {
                console.error('Schedule failed:', event.error);
              },
            },
          },
        },
        reschedulingAppointment: {
          invoke: {
            src: fromPromise(({ input }: { input: PracticeEvent }) =>
              apiService.rescheduleAppointment(input as Extract<PracticeEvent, { type: 'RESCHEDULE' }>)
            ),
            input: ({ event }: { event: PracticeEvent }) => event,
            onDone: {
              target: 'idle',
              actions: [
                ({ context, event }: { context: PracticeContext; event: any }) => {
                  const { success, data, error } = event.output;
                  if (success && data?.appointment) {
                    context.appointmentsRef.send({ type: 'UPDATE_APPOINTMENT', appointment: data.appointment });
                    console.log('Reschedule response:', data);
                  } else {
                    console.error('Failed to reschedule appointment:', error);
                  }
                },
              ],
            },
            onError: {
              target: 'idle',
              actions: ({ event }: { event: any }) => {
                console.error('Reschedule failed:', event.error);
              },
            },
          },
        },
        cancelingAppointment: {
          invoke: {
            src: fromPromise(({ input }: { input: PracticeEvent }) =>
              apiService.cancelAppointment(input as Extract<PracticeEvent, { type: 'CANCEL' }>)
            ),
            input: ({ event }: { event: PracticeEvent }) => event,
            onDone: {
              target: 'idle',
              actions: [
                ({ context, event }: { context: PracticeContext; event: any }) => {
                  const { success, data, error } = event.output;
                  if (success && data?.appointment) {
                    console.log('Sending UPDATE_APPOINTMENT with ID:', data.appointment.id);
                    context.appointmentsRef.send({ type: 'UPDATE_APPOINTMENT', appointment: data.appointment });
                    console.log('Cancel response:', data);
                  } else {
                    console.error('Failed to cancel appointment:', error);
                  }
                },
              ],
            },
            onError: {
              target: 'idle',
              actions: ({ event }: { event: any }) => {
                console.error('Cancel failed:', event.error);
              },
            },
          },
        },
      },
    },
  },
});

export const practiceActor = createActor(practiceMachine, { inspect: inspector?.inspect });
