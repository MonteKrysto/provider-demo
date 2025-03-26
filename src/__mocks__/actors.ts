// Mock practiceActor
export const mockPracticeActor = {
  getSnapshot: jest.fn(() => ({
    context: {
      isLoading: false,
      error: undefined,
      modal: { isOpen: false, content: null },
      activePatient: null,
      patientRef: { send: jest.fn() },
      notesRef: { send: jest.fn() },
      billingRef: { send: jest.fn() },
      appointmentsRef: { send: jest.fn() },
    },
    value: { running: 'idle' },
    matches: jest.fn((state) => state === 'running'),
  })),
  send: jest.fn(),
  subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })),
};

// Mock patientMachine
export const mockPatientActor = {
  getSnapshot: jest.fn(() => ({
    context: {
      patients: [
        { id: 'p1', name: 'John Doe', diagnosis: ['Anxiety'], medications: [] },
      ],
    },
    value: 'idle',
    matches: jest.fn(),
  })),
  send: jest.fn(),
};

// Mock notesMachine
export const mockNotesActor = {
  getSnapshot: jest.fn(() => ({
    context: {
      notes: {
        p1: [
          { id: 'n1', patientId: 'p1', content: 'Initial note', status: 'draft', timestamp: '2025-03-21T10:00:00Z', version: 1 },
        ],
      },
      currentNote: null,
    },
    value: 'draft',
    matches: jest.fn(),
  })),
  send: jest.fn(),
  subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })),
};

// Mock billingMachine
export const mockBillingActor = {
  getSnapshot: jest.fn(() => ({
    context: {
      invoices: [
        { id: 'i1', patientId: 'p1', amount: 100, status: 'pending' },
      ],
    },
    value: 'idle',
    matches: jest.fn(),
  })),
  send: jest.fn(),
};

// Mock appointmentsMachine
export const mockAppointmentsActor = {
  getSnapshot: jest.fn(() => ({
    context: {
      appointments: [
        { id: 'a1', patientId: 'p1', time: '2025-03-21T10:00:00Z', status: 'scheduled' },
      ],
    },
    value: 'idle',
    matches: jest.fn(),
  })),
  send: jest.fn(),
};
