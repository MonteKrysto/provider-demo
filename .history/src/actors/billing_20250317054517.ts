// import { createMachine, assign } from 'xstate';
// import { Invoice } from '../types/billing';
// import { PracticeEvent } from '../types/events';

// interface BillingContext {
//   invoices: Invoice[];
// }

// interface PaymentResult {
//   invoiceId: string;
// }

// export const billingMachine = createMachine(
//   {
//     id: 'billing',
//     initial: 'idle',
//     context: {
//       invoices: [],
//     } satisfies BillingContext,
//     types: {} as { context: BillingContext; events: PracticeEvent },
//     states: {
//       idle: {
//         on: {
//           GENERATE_INVOICE: {
//             target: 'generating',
//           },
//           PROCESS_PAYMENT: {
//             target: 'processing',
//           },
//         },
//       },
//       generating: {
//         entry: assign({
//           invoices: ({ context, event }) => {
//             const generateEvent = event as Extract<PracticeEvent, { type: 'GENERATE_INVOICE' }>;
//             const newInvoice: Invoice = {
//               id: crypto.randomUUID(),
//               patientId: generateEvent.patientId,
//               amount: generateEvent.amount || 100.0,
//               status: 'pending',
//             };
//             return [...context.invoices, newInvoice];
//           },
//         }),
//         always: 'idle',
//       },
//       processing: {
//         invoke: {
//           src: 'processPayment',
//           input: (_: BillingContext, event: Extract<PracticeEvent, { type: 'PROCESS_PAYMENT' }>) => ({
//             invoiceId: event.invoiceId,
//           }),
//           onDone: {
//             target: 'idle',
//             actions: assign({
//               invoices: ({ context, event }) => {
//                 const doneEvent = event as unknown as { data: PaymentResult };
//                 return context.invoices.map((inv) =>
//                   inv.id === doneEvent.data.invoiceId ? { ...inv, status: 'paid' as const } : inv
//                 );
//               },
//             }),
//           },
//           onError: {
//             target: 'disputed',
//             actions: assign({
//               invoices: ({ context, event }) => {
//                 const errorEvent = event as unknown as { data: PaymentResult };
//                 return context.invoices.map((inv) =>
//                   inv.id === errorEvent.data.invoiceId ? { ...inv, status: 'disputed' as const } : inv
//                 );
//               },
//             }),
//           },
//         },
//       },
//       disputed: {
//         on: {
//           PROCESS_PAYMENT: {
//             target: 'processing',
//           },
//         },
//       },
//     },
//   });

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
//         src: fromPromise(({ input }: { input: PaymentInput }): Promise<PaymentResult> =>
//           new Promise((resolve, reject) => {
//             setTimeout(() => {
//               const result: PaymentResult = { invoiceId: input.invoiceId };
//               if (Math.random() > 0.2) {
//                 resolve(result);
//               } else {
//                 reject(result);
//               }
//             }, 1000);
//           })
//         ),
//         input: (_context: BillingContext, event: Extract<PracticeEvent, { type: 'PROCESS_PAYMENT' }>) => ({
//           invoiceId: event.invoiceId,
//         }),
//         onDone: {
//           target: 'idle',
//           actions: assign({
//             invoices: ({ context, event }) => {
//               if ('data' in event) {
//                 const paymentResult = event.data as PaymentResult;
//                 return context.invoices.map((inv) =>
//                   inv.id === paymentResult.invoiceId ? { ...inv, status: 'paid' as const } : inv
//                 );
//               }
//               return context.invoices; // Return the original invoices if the event doesn't have data
//             },
//           }),
//         },
//         onError: {
//           target: 'disputed',
//           actions: assign({
//             invoices: ({ context, event }) => {
//               if ('data' in event) {
//                 const paymentResult = event.data as PaymentResult;
//                 return context.invoices.map((inv) =>
//                   inv.id === paymentResult.invoiceId ? { ...inv, status: 'disputed' as const } : inv
//                 );
//               }
//               return context.invoices; // Return the original invoices if the event doesn't have data
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
