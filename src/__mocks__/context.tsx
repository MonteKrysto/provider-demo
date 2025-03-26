import { mockPracticeActor, mockPatientActor, mockNotesActor, mockBillingActor, mockAppointmentsActor } from './actors';

export const usePractice = jest.fn().mockReturnValue({
  isLoading: false,
  error: undefined,
  modal: { isOpen: false, content: null },
  activePatient: null,
  setActivePatient: jest.fn(),
  openModal: jest.fn(),
  closeModal: jest.fn(),
  state: mockPracticeActor.getSnapshot(),
  send: mockPracticeActor.send,
});

export const usePatient = jest.fn().mockReturnValue({
  patients: mockPatientActor.getSnapshot().context.patients,
  createPatient: jest.fn(),
});

export const useNotes = jest.fn().mockReturnValue({
  notes: mockNotesActor.getSnapshot().context.notes,
  currentNote: null,
  saveDraft: jest.fn(),
  lockNote: jest.fn(),
  updateNote: jest.fn(),
  setSelectedNote: jest.fn(),
});

export const useBilling = jest.fn().mockReturnValue({
  invoices: mockBillingActor.getSnapshot().context.invoices,
  selectedInvoiceId: null,
  setSelectedInvoiceId: jest.fn(),
  generateInvoice: jest.fn(),
  processPayment: jest.fn(),
});

export const useAppointments = jest.fn().mockReturnValue({
  appointments: mockAppointmentsActor.getSnapshot().context.appointments,
  selectedAppointmentId: null,
  setSelectedAppointmentId: jest.fn(),
  scheduleAppointment: jest.fn(),
  rescheduleAppointment: jest.fn(),
  cancelAppointment: jest.fn(),
});
