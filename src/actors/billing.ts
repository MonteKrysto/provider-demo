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
          actions: [
            // No immediate action needed; handled by practiceMachine
          ],
        },
        PROCESS_PAYMENT: {
          actions: [
            // No immediate action needed; handled by practiceMachine
          ],
        },
        ADD_INVOICE: {
          actions: assign({
            invoices: ({ context, event }) => {
              const addEvent = event as Extract<PracticeEvent, { type: 'ADD_INVOICE' }>;
              console.log('Adding invoice to billingMachine:', addEvent.invoice);
              return [...context.invoices, addEvent.invoice];
            },
          }),
        },
        UPDATE_INVOICE: {
          actions: assign({
            invoices: ({ context, event }) => {
              const updateEvent = event as Extract<PracticeEvent, { type: 'UPDATE_INVOICE' }>;
              console.log('Updating invoice in billingMachine:', updateEvent);
              return context.invoices.map((invoice) =>
                invoice.id === updateEvent.invoiceId ? { ...invoice, status: updateEvent.status } : invoice
              );
            },
          }),
        },
        INITIALIZE: {
          actions: assign({
            invoices: ({ context, event }) => {
              console.log('INITIALIZE event in billingMachine:', event);
              if ('data' in event && event.data) {
                return event.data as Invoice[] || [];
              }
              return context.invoices; // Fallback to current state
            },
          }),
        },
      },
    },
  },
});
