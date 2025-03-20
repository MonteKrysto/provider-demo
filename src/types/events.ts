import { Patient } from './patient';
import { Medication } from './patient';
import { Appointment } from './appointments';
import { Invoice, Note } from 'types';

export type PracticeEvent =
  | { type: 'CREATE_PATIENT'; patient: Patient }
  | { type: 'EDIT_PATIENT'; data: Patient }
  | { type: 'SAVE_DRAFT'; content: string; activePatient: Patient }
  | { type: 'LOCK_NOTE'; activePatient: Patient }
  | { type: 'LOCK_EXISTING_NOTE'; noteId: string; activePatient: Patient }
  | { type: 'UPDATE_NOTE'; noteId: string; content: string; activePatient: Patient } // For practiceMachine
  | { type: 'UPDATE_NOTE_WITH_RESPONSE'; note: Note } // For notesMachine
  | { type: 'ADD_NOTE'; note: Note }
  | { type: 'CLEAR_CURRENT_NOTE' }
  | { type: 'GENERATE_INVOICE'; patientId: string; amount: number }
  | { type: 'PROCESS_PAYMENT'; invoiceId: string }
  | { type: 'ADD_INVOICE'; invoice: Invoice }
  | { type: 'UPDATE_INVOICE'; invoiceId: string; status: Invoice['status'] } //| { type: 'UPDATE_INVOICE'; invoiceId: string; status: string }
  | { type: 'SCHEDULE'; appointment: Appointment }
  | { type: 'RESCHEDULE'; appointment: { id: string; time: string } }
  | { type: 'CANCEL'; appointment: { id: string } }
  | { type: 'ADD_APPOINTMENT'; appointment: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; appointment: Appointment }
  | { type: 'OPEN_MODAL'; content: 'patientDetails' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'INITIALIZE'; data?: any }
  | { type: 'LOADED' };

// export type PracticeEvent =
//   | { type: 'EDIT_PATIENT'; data: Partial<Patient> }
//   | { type: 'PRESCRIBE'; med: Medication }
//   | { type: 'SAVE_DRAFT'; content: string; activePatient?: Patient | null }
//   | { type: 'LOCK_NOTE'; activePatient?: Patient | null }
//   | { type: 'LOCK_EXISTING_NOTE'; noteId: string; activePatient: Patient }
//   | { type: 'SCHEDULE'; appointment: Appointment }
//   | { type: 'RESCHEDULE'; appointment: { id: string; time: string } }
//   | { type: 'CANCEL'; appointment: { id: string } }
//   | { type: 'GENERATE_INVOICE'; patientId: string; amount?: number }
//   | { type: 'PROCESS_PAYMENT'; invoiceId: string }
//   | { type: 'REMOTE_UPDATE'; data: any }
//   | { type: 'CONNECTION_LOST' }
//   | { type: 'CONNECTION_RESTORED' }
//   | { type: 'OPEN_MODAL'; content: 'patientDetails' }
//   | { type: 'CLOSE_MODAL' }
//   | { type: 'SAVE' }
//   | { type: 'INITIALIZE'; data: any }
//   | { type: 'LOADED' }
//   | { type: 'CREATE_PATIENT'; patient: Patient }
//   | { type: 'UPDATE_NOTE'; note: Note }
//   | { type: 'ADD_NOTE'; note: Note }
//   | { type: 'CLEAR_CURRENT_NOTE' }
//   | { type: 'UPDATING_INVOICE' }
//   | { type: 'UPDATE_INVOICE'; invoiceId: string, status: string }
//   | { type: 'ADD_INVOICE'; invoice: Invoice }
//   | { type: 'UPDATE_APPOINTMENT'; appointment: Appointment }
//   | { type: 'ADD_APPOINTMENT'; appointment: Appointment };