import { PracticeEvent } from '../types/events';
import { Patient } from '../types/patient';
import { Note } from '../types/notes';
import { Invoice } from '../types/billing';
import { Appointment } from '../types/appointments';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const apiService = {
  async fetchInitialData(): Promise<{
    patients: Patient[];
    notes: Record<string, Note[]>;
    invoices: Invoice[];
    appointments: Appointment[];
  }> {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      console.log('Fetch timed out after 5 seconds');
    }, 5000);

    try {
      const response = await fetch('http://localhost:3000/api/data', {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  },

  async createPatient(event: Extract<PracticeEvent, { type: 'CREATE_PATIENT' }>): Promise<ApiResponse<{ patient: Patient }>> {
    const response = await fetch('http://localhost:3000/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'CREATE_PATIENT', payload: { patient: event.patient } }),
    });
    const data = await response.json();
    return { success: data.success, data: data.success ? { patient: data.patient } : undefined, error: data.error };
  },

  async saveDraft(event: Extract<PracticeEvent, { type: 'SAVE_DRAFT' }>): Promise<ApiResponse<{ note: Note }>> {
    const response = await fetch('http://localhost:3000/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'SAVE_DRAFT', payload: { content: event.content, activePatient: event.activePatient } }),
    });
    const data = await response.json();
    return { success: data.success, data: data.success ? { note: data.note } : undefined, error: data.error };
  },

  async lockNote(event: Extract<PracticeEvent, { type: 'LOCK_NOTE' }>): Promise<ApiResponse<{ note: Note }>> {
    const response = await fetch('http://localhost:3000/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'LOCK_NOTE', payload: { activePatient: event.activePatient } }),
    });
    const data = await response.json();
    return { success: data.success, data: data.success ? { note: data.note } : undefined, error: data.error };
  },

  async lockExistingNote(event: Extract<PracticeEvent, { type: 'LOCK_EXISTING_NOTE' }>): Promise<ApiResponse<{ note: Note }>> {
    const response = await fetch('http://localhost:3000/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'LOCK_EXISTING_NOTE', payload: { noteId: event.noteId, activePatient: event.activePatient } }),
    });
    const data = await response.json();
    return { success: data.success, data: data.success ? { note: data.note } : undefined, error: data.error };
  },

  async updateNote(event: Extract<PracticeEvent, { type: 'UPDATE_NOTE' }>): Promise<ApiResponse<{ note: Note }>> {
    const response = await fetch('http://localhost:3000/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'UPDATE_NOTE', payload: { noteId: event.noteId, content: event.content, activePatient: event.activePatient } }),
    });
    const data = await response.json();
    return { success: data.success, data: data.success ? { note: data.note } : undefined, error: data.error };
  },

  async generateInvoice(event: Extract<PracticeEvent, { type: 'GENERATE_INVOICE' }>): Promise<ApiResponse<{ invoice: Invoice }>> {
    const response = await fetch('http://localhost:3000/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'GENERATE_INVOICE', payload: { patientId: event.patientId, amount: event.amount } }),
    });
    const data = await response.json();
    return { success: data.success, data: data.success ? { invoice: data.invoice } : undefined, error: data.error };
  },

  async processPayment(event: Extract<PracticeEvent, { type: 'PROCESS_PAYMENT' }>): Promise<ApiResponse<{ invoiceId: string }>> {
    const response = await fetch('http://localhost:3000/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'PROCESS_PAYMENT', payload: { invoiceId: event.invoiceId } }),
    });
    const data = await response.json();
    return { success: data.success, data: data.success ? { invoiceId: data.invoiceId } : undefined, error: data.error };
  },

  async scheduleAppointment(event: Extract<PracticeEvent, { type: 'SCHEDULE' }>): Promise<ApiResponse<{ appointment: Appointment }>> {
    console.log('scheduleAppointment event:', event); // Debug log
    const response = await fetch('http://localhost:3000/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'SCHEDULE', payload: { appointment: event.appointment } }),
    });
    const data = await response.json();
    return { success: data.success, data: data.success ? { appointment: data.appointment } : undefined, error: data.error };
  },

  async rescheduleAppointment(event: Extract<PracticeEvent, { type: 'RESCHEDULE' }>): Promise<ApiResponse<{ appointment: Appointment }>> {
    const response = await fetch('http://localhost:3000/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'RESCHEDULE', payload: { appointment: event.appointment } }),
    });
    const data = await response.json();
    return { success: data.success, data: data.success ? { appointment: data.appointment } : undefined, error: data.error };
  },

  async cancelAppointment(event: Extract<PracticeEvent, { type: 'CANCEL' }>): Promise<ApiResponse<{ appointment: Appointment }>> {
    const response = await fetch('http://localhost:3000/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'CANCEL', payload: { appointment: event.appointment } }),
    });
    const data = await response.json();
    return { success: data.success, data: data.success ? { appointment: data.appointment } : undefined, error: data.error };
  },
};
