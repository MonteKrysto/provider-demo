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
        GENERATE_INVOICE: 'generating',
        PROCESS_PAYMENT: 'processing',
      },
    },
    generating: {
      entry: assign({
        invoices: ({ context, event }) => {
          const newInvoice: Invoice = {
            id: crypto.randomUUID(),
            patientId: (event as any).patientId, // From parent context or event
            amount: (event as any).amount || 100.0, // Default amount
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
            invoices: ({ context, event }) =>
              context.invoices.map((inv) =>
                inv.id === (event as any).data.invoiceId ? { ...inv, status: 'paid' } : inv
              ),
          }),
        },
        onError: {
          target: 'disputed',
          actions: assign({
            invoices: ({ context, event }) =>
              context.invoices.map((inv) =>
                inv.id === (event as any).data.invoiceId ? { ...inv, status: 'disputed' } : inv
              ),
          }),
        },
      },
    },
    disputed: {
      on: {
        PROCESS_PAYMENT: 'processing', // Retry payment
      },
    },
  },
}, {
  services: {
    processPayment: (_, event) => {
      // Simulated async payment processing
      return new Promise((resolve, reject) =>
        setTimeout(() => (Math.random() > 0.2 ? resolve(event) : reject(event)), 1000)
      );
    },
  },
});
