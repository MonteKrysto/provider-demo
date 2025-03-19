// import { createMachine, assign, fromPromise } from 'xstate';
// import { Invoice } from '../types/billing';
// import { PracticeEvent } from '../types/events';

// interface BillingContext {
//   invoices: Invoice[];
// }

// interface PaymentInput {
//   invoiceId: string;
// }

// interface PaymentResult {
//   invoiceId: string;
// }

// export const billingMachine = createMachine({
//   id: 'billing',
//   initial: 'idle',
//   context: {
//     invoices: [],
//   } satisfies BillingContext,
//   types: {} as { context: BillingContext; events: PracticeEvent },
//   states: {
//     idle: {
//       on: {
//         GENERATE_INVOICE: {
//           target: 'generating',
//         },
//         PROCESS_PAYMENT: {
//           target: 'processing',
//         },
//       },
//     },
//     generating: {
//       entry: assign({
//         invoices: ({ context, event }) => {
//           const generateEvent = event as Extract<PracticeEvent, { type: 'GENERATE_INVOICE' }>;
//           const newInvoice: Invoice = {
//             id: crypto.randomUUID(),
//             patientId: generateEvent.patientId,
//             amount: generateEvent.amount || 100.0,
//             status: 'pending',
//           };
//           return [...context.invoices, newInvoice];
//         },
//       }),
//       always: 'idle',
//     },
//     processing: {
//       invoke: {
//         src: fromPromise(
//           async ({ input }: { input: PaymentInput }): Promise<PaymentResult> => {
//             return new Promise((resolve, reject) => {
//               setTimeout(() => {
//                 const result: PaymentResult = { invoiceId: input.invoiceId };
//                 if (Math.random() > 0.2) {
//                   resolve(result);
//                 } else {
//                   reject(result);
//                 }
//               }, 1000);
//             });
//           }
//         ),
//         input: (_context: BillingContext, event: Extract<PracticeEvent, { type: 'PROCESS_PAYMENT' }>) => ({
//           invoiceId: event.invoiceId,
//         }),
//         onDone: {
//           target: 'idle',
//           actions: assign({
//             invoices: ({ context, event }) => {
//               const paymentResult = (event as unknown as { data: PaymentResult }).data;
//               return context.invoices.map((inv) =>
//                 inv.id === paymentResult.invoiceId ? { ...inv, status: 'paid' as const } : inv
//               );
//             },
//           }),
//         },
//         onError: {
//           target: 'disputed',
//           actions: assign({
//             invoices: ({ context, event }) => {
//               const paymentResult = (event as unknown as { data: PaymentResult }).data;
//               return context.invoices.map((inv) =>
//                 inv.id === paymentResult.invoiceId ? { ...inv, status: 'disputed' as const } : inv
//               );
//             },
//           }),
//         },
//       },
//     },
//     disputed: {
//       on: {
//         PROCESS_PAYMENT: {
//           target: 'processing',
//         },
//       },
//     },
//   },
// });
