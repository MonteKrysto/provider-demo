import { Patient } from './patient';
import { Medication } from './patient';
import { Appointment } from './appointments';
import { Note } from './notes'; // Assuming this exists

export type PracticeEvent =
  | { type: 'EDIT_PATIENT'; data: Partial<Patient> }
  | { type: 'PRESCRIBE'; med: Medication }
  | { type: 'SAVE_DRAFT'; content: string; activePatient?: Patient | null } // Add activePatient as optional
  | { type: 'LOCK_NOTE'; activePatient?: Patient | null } // Add activePatient as optional
  | { type: 'SCHEDULE'; appointment: Appointment }
  | { type: 'PROCESS_PAYMENT'; invoiceId: string }
  | { type: 'REMOTE_UPDATE'; data: any }
  | { type: 'CONNECTION_LOST' }
  | { type: 'CONNECTION_RESTORED' }
  | { type: 'OPEN_MODAL'; content?: 'patientDetails' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SAVE' }; // Added for patientMachine