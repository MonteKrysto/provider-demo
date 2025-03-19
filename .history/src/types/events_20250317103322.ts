import { Patient } from './patient';
import { Medication } from './patient';
import { Appointment } from './appointments';

export type PracticeEvent =
  | { type: 'EDIT_PATIENT'; data: Partial<Patient> }
  | { type: 'PRESCRIBE'; med: Medication }
  | { type: 'SAVE_DRAFT'; content: string; activePatient?: Patient | null }
  | { type: 'LOCK_NOTE'; activePatient?: Patient | null }
  | { type: 'SCHEDULE'; appointment: Appointment }
  | { type: 'RESCHEDULE'; appointment: { id: string; time: string } }
  | { type: 'CANCEL'; appointment: { id: string } }
  | { type: 'GENERATE_INVOICE'; patientId: string; amount?: number }
  | { type: 'PROCESS_PAYMENT'; invoiceId: string }
  | { type: 'REMOTE_UPDATE'; data: any }
  | { type: 'CONNECTION_LOST' }
  | { type: 'CONNECTION_RESTORED' }
  | { type: 'OPEN_MODAL'; content?: 'patientDetails' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SAVE' }
  | { type: ''}