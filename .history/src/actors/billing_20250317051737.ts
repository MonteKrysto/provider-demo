import { createMachine, assign } from 'xstate';
import { Invoice } from '../types/billing';
import { PracticeEvent } from '../types/events';

interface BillingContext {
  invoices: Invoice[];
}

export const billingMachine = createMachine({
  id: 'billing',
  initial: 'idle',
  context: {
    invoices: [],
  } satisfies BillingContext,
  types: {} as { context: BillingContext; events: PracticeEvent },
  states: {
    idle: {
      on: {
        GENERATE_INVOICE: {
          target: 'generating',
        },
        PROCESS_PAYMENT: {
          target: 'processing',
        },
        // Explicitly handle other PracticeEvent types to satisfy TypeScript
        EDIT_PATIENT: { actions: [] },
        PRESCRIBE: { actions: [] },
        SAVE_DRAFT: { actions: [] },
        LOCK_NOTE: { actions: [] },
        SCHEDULE: { actions: [] },
        RESCHEDULE: { actions: [] },
        CANCEL: { actions: [] },
        REMOTE_UPDATE: { actions: [] },
        CONNECTION_LOST: { actions: [] },
        CONNECTION_RESTORED: { actions: [] },
        OPEN_MODAL: { actions: [] },
        CLOSE_MODAL: { actions: [] },
        SAVE: { actions: [] },
      },
    },
    generating: {
      entry: assign({
        invoices: ({ context, event }) => {
          const generateEvent = event as Extract<PracticeEvent, { type: 'GENERATE_INVOICE' }>;
          const newInvoice: Invoice = {
            id: crypto.randomUUID(),
            patientId: generateEvent.patientId,
            amount: generateEvent.amount || 100.0,
            status: 'pending',
          };
          return [...context.invoices, newInvoice];
        },
      }),
      always: 'idle',
    },
    processing: {
      invoke: {
        src: 'processPayment',
        data: (_, event) => ({ invoiceId: (event as Extract<PracticeEvent, { type: 'PROCESS_PAYMENT' }>).invoiceId }),
        onDone: {
          target: 'idle',
          actions: assign({
            invoices: ({ context, event }) => {
              const doneData = event.data as { invoiceId: string };
              return context.invoices.map((inv) =>
                inv.id === doneData.invoiceId ? { ...inv, status: 'paid' } : inv
              );
            },
          }),
        },
        onError: {
          target: 'disputed',
          actions: assign({
            invoices: ({ context, event }) => {
              const errorData = event.data as { invoiceId: string };
              return context.invoices.map((inv) =>
                inv.id === errorData.invoiceId ? { ...inv, status: 'disputed' } : inv
              );
            },
          }),
        },
      },
    },
    disputed: {
      on: {
        PROCESS_PAYMENT: {
          target: 'processing',
        },
      },
    },
  },
}, {
  services: {
    processPayment: (_context: BillingContext, event: Extract<PracticeEvent, { type: 'PROCESS_PAYMENT' }>) => {
      return new Promise<{ invoiceId: string }>((resolve, reject) =>
        setTimeout(() => {
          const result = { invoiceId: event.invoiceId };
          Math.random() > 0.2 ? resolve(result) : reject(result);
        }, 1000)
      );
    },
  },
});
