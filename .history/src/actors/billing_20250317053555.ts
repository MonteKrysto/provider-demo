import { createMachine, assign } from 'xstate';
import { Invoice } from '../types/billing';
import { PracticeEvent } from '../types/events';

interface BillingContext {
  invoices: Invoice[];
}

interface PaymentResult {
  invoiceId: string;
}

export const billingMachine = createMachine(
  {
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
          input: (_: BillingContext, event: Extract<PracticeEvent, { type: 'PROCESS_PAYMENT' }>) => ({
            invoiceId: event.invoiceId,
          }),
          onDone: {
            target: 'idle',
            actions: assign({
              invoices: ({ context, event }) => {
                const doneEvent = event as unknown as { data: PaymentResult };
                return context.invoices.map((inv) =>
                  inv.id === doneEvent.data.invoiceId ? { ...inv, status: 'paid' as const } : inv
                );
              },
            }),
          },
          onError: {
            target: 'disputed',
            actions: assign({
              invoices: ({ context, event }) => {
                const errorEvent = event as unknown as { data: PaymentResult };
                return context.invoices.map((inv) =>
                  inv.id === errorEvent.data.invoiceId ? { ...inv, status: 'disputed' as const } : inv
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
  });
