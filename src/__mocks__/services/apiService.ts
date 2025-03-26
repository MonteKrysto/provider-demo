export const apiService = {
  fetchInitialData: jest.fn().mockResolvedValue({
    patients: [
      { id: 'p1', name: 'John Doe', diagnosis: ['Anxiety'], medications: [] },
    ],
    notes: {
      p1: [
        { id: 'n1', patientId: 'p1', content: 'Initial note', status: 'draft', timestamp: '2025-03-21T10:00:00Z', version: 1 },
      ],
    },
    invoices: [
      { id: 'i1', patientId: 'p1', amount: 100, status: 'pending' },
    ],
    appointments: [
      { id: 'a1', patientId: 'p1', time: '2025-03-21T10:00:00Z', status: 'scheduled' },
    ],
  }),
  createPatient: jest.fn().mockResolvedValue({
    success: true,
    data: { patient: { id: 'p2', name: 'Jane Doe', diagnosis: ['Depression'], medications: [] } },
  }),
  saveDraft: jest.fn().mockResolvedValue({
    success: true,
    data: { note: { id: 'n2', patientId: 'p1', content: 'Test note', status: 'draft', timestamp: '2025-03-21T10:01:00Z', version: 1 } },
  }),
  lockNote: jest.fn().mockResolvedValue({
    success: true,
    data: { note: { id: 'n2', patientId: 'p1', content: 'Test note', status: 'locked', timestamp: '2025-03-21T10:01:00Z', version: 1 } },
  }),
  lockExistingNote: jest.fn().mockResolvedValue({
    success: true,
    data: { note: { id: 'n1', patientId: 'p1', content: 'Initial note', status: 'locked', timestamp: '2025-03-21T10:00:00Z', version: 1 } },
  }),
  updateNote: jest.fn().mockResolvedValue({
    success: true,
    data: { note: { id: 'n1', patientId: 'p1', content: 'Updated note', status: 'draft', timestamp: '2025-03-21T10:00:00Z', version: 1 } },
  }),
  generateInvoice: jest.fn().mockResolvedValue({
    success: true,
    data: { invoice: { id: 'i2', patientId: 'p1', amount: 200, status: 'pending' } },
  }),
  processPayment: jest.fn().mockResolvedValue({
    success: true,
    data: { invoiceId: 'i1' },
  }),
  scheduleAppointment: jest.fn().mockResolvedValue({
    success: true,
    data: { appointment: { id: 'a2', patientId: 'p1', time: '2025-03-21T11:00:00Z', status: 'scheduled' } },
  }),
  rescheduleAppointment: jest.fn().mockResolvedValue({
    success: true,
    data: { appointment: { id: 'a1', patientId: 'p1', time: '2025-03-21T12:00:00Z', status: 'scheduled' } },
  }),
  cancelAppointment: jest.fn().mockResolvedValue({
    success: true,
    data: { appointment: { id: 'a1', patientId: 'p1', time: '2025-03-21T12:00:00Z', status: 'canceled' } },
  }),
};
