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
        onDone: {
          target: 'idle',
          actions: assign({
            invoices: ({ context, event }) => {
              const doneEvent = event as { data: Extract<PracticeEvent, { type: 'PROCESS_PAYMENT' }> };
              return context.invoices.map((inv) =>
                inv.id === doneEvent.data.invoiceId ? { ...inv, status: 'paid' } : inv
              );
            },
          }),
        },
        onError: {
          target: 'disputed',
          actions: assign({
            invoices: ({ context, event }) => {
              const errorEvent = event as { data: Extract<PracticeEvent, { type: 'PROCESS_PAYMENT' }> };
              return context.invoices.map((inv) =>
                inv.id === errorEvent.data.invoiceId ? { ...inv, status: 'disputed' } : inv
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
      return new Promise((resolve, reject) =>
        setTimeout(() => (Math.random() > 0.2 ? resolve(event) : reject(event)), 1000)
      );
    },
  },
});
