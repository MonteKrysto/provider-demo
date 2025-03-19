export type PracticeEvent =
  | { type: 'EDIT_PATIENT'; data: Partial<Patient> }
  | { type: 'PRESCRIBE'; med: Medication }
  | { type: 'SAVE_DRAFT'; content: string }
  | { type: 'LOCK_NOTE' }
  | { type: 'SCHEDULE'; appointment: Appointment }
  | { type: 'PROCESS_PAYMENT'; invoiceId: string }
  | { type: 'REMOTE_UPDATE'; data: any }
  | { type: 'CONNECTION_LOST' }
  | { type: 'CONNECTION_RESTORED' };