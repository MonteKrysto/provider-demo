import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PracticeDashboard } from "../src/components/PracticeDashboard/PracticeDashboard";
import {
  usePractice,
  usePatient,
  useNotes,
  useBilling,
  useAppointments,
} from "../src/contexts";
import {
  mockPracticeActor,
  mockPatientActor,
  mockNotesActor,
  mockBillingActor,
  mockAppointmentsActor,
} from "../src/__mocks__/actors";
import "@testing-library/jest-dom";

// Mock the context hooks
jest.mock("../../context");
jest.mock("../../services/apiService");

describe("PracticeDashboard", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock context hooks
    (usePractice as jest.Mock).mockReturnValue({
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

    (usePatient as jest.Mock).mockReturnValue({
      patients: mockPatientActor.getSnapshot().context.patients,
      createPatient: jest.fn(),
    });

    (useNotes as jest.Mock).mockReturnValue({
      notes: mockNotesActor.getSnapshot().context.notes,
      currentNote: null,
      saveDraft: jest.fn(),
      lockNote: jest.fn(),
      updateNote: jest.fn(),
      setSelectedNote: jest.fn(),
    });

    (useBilling as jest.Mock).mockReturnValue({
      invoices: mockBillingActor.getSnapshot().context.invoices,
      selectedInvoiceId: null,
      setSelectedInvoiceId: jest.fn(),
      generateInvoice: jest.fn(),
      processPayment: jest.fn(),
    });

    (useAppointments as jest.Mock).mockReturnValue({
      appointments: mockAppointmentsActor.getSnapshot().context.appointments,
      selectedAppointmentId: null,
      setSelectedAppointmentId: jest.fn(),
      scheduleAppointment: jest.fn(),
      rescheduleAppointment: jest.fn(),
      cancelAppointment: jest.fn(),
    });

    (usePractice as jest.Mock).mockReturnValue({
      newPatientName: "",
      setNewPatientName: jest.fn(),
      newPatientDiagnosis: "",
      setNewPatientDiagnosis: jest.fn(),
      isAddPatientModalOpen: false,
      setIsAddPatientModalOpen: jest.fn(),
      handleAddPatient: jest.fn(),
      patients: mockPatientActor.getSnapshot().context.patients,
      activePatient: null,
      setActivePatient: jest.fn(),
    });
  });

  test("renders PracticeDashboard without crashing", () => {
    render(<PracticeDashboard />);
    expect(screen.getByText("Practice Dashboard")).toBeInTheDocument();
    expect(screen.getByText("No patient selected")).toBeInTheDocument();
  });

  test("displays loading state", () => {
    (usePractice as jest.Mock).mockReturnValue({
      ...usePractice(),
      isLoading: true,
    });
    render(<PracticeDashboard />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays error state", () => {
    (usePractice as jest.Mock).mockReturnValue({
      ...usePractice(),
      error: "Failed to load data",
    });
    render(<PracticeDashboard />);
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Failed to load data")).toBeInTheDocument();
  });

  test("adds a new patient", async () => {
    const setNewPatientName = jest.fn();
    const setNewPatientDiagnosis = jest.fn();
    const setIsAddPatientModalOpen = jest.fn();
    const handleAddPatient = jest.fn();
    const setActivePatient = jest.fn();

    (usePractice as jest.Mock).mockReturnValue({
      ...usePractice(),
      newPatientName: "Jane Doe",
      setNewPatientName,
      newPatientDiagnosis: "Depression",
      setNewPatientDiagnosis,
      isAddPatientModalOpen: true,
      setIsAddPatientModalOpen,
      handleAddPatient,
      setActivePatient,
    });

    render(<PracticeDashboard />);

    // Open the add patient modal
    fireEvent.click(screen.getByText("Add New Patient"));

    // Fill in the form
    const nameInput = screen.getByPlaceholderText("Enter patient name");
    const diagnosisInput = screen.getByPlaceholderText(
      "e.g., Anxiety, Depression"
    );
    await userEvent.type(nameInput, "Jane Doe");
    await userEvent.type(diagnosisInput, "Depression");
    expect(setNewPatientName).toHaveBeenCalledWith("Jane Doe");
    expect(setNewPatientDiagnosis).toHaveBeenCalledWith("Depression");

    // Submit the form
    fireEvent.click(screen.getByText("Add Patient"));
    expect(handleAddPatient).toHaveBeenCalled();
    expect(setActivePatient).toHaveBeenCalledWith({
      id: expect.any(String),
      name: "Jane Doe",
      diagnosis: ["Depression"],
      medications: [],
    });
  });

  test("selects a patient", () => {
    const setActivePatient = jest.fn();
    (usePractice as jest.Mock).mockReturnValue({
      ...usePractice(),
      setActivePatient,
    });

    render(<PracticeDashboard />);

    // Select a patient
    fireEvent.click(screen.getByText("John Doe"));
    expect(setActivePatient).toHaveBeenCalledWith({
      id: "p1",
      name: "John Doe",
      diagnosis: ["Anxiety"],
      medications: [],
    });

    // Verify the selected patient is displayed
    expect(screen.getByText("Selected Patient: John Doe")).toBeInTheDocument();
  });

  test("saves a draft note", async () => {
    const saveDraft = jest.fn();
    (usePractice as jest.Mock).mockReturnValue({
      ...usePractice(),
      activePatient: {
        id: "p1",
        name: "John Doe",
        diagnosis: ["Anxiety"],
        medications: [],
      },
    });
    (useNotes as jest.Mock).mockReturnValue({
      ...useNotes(),
      saveDraft,
    });

    render(<PracticeDashboard />);

    // Type a note
    const textarea = screen.getByPlaceholderText("Enter note content...");
    await userEvent.type(textarea, "Test note");

    // Save the draft
    fireEvent.click(screen.getByText("Save Draft"));
    expect(saveDraft).toHaveBeenCalledWith("Test note", {
      id: "p1",
      name: "John Doe",
      diagnosis: ["Anxiety"],
      medications: [],
    });

    // Mock the updated notes state
    (useNotes as jest.Mock).mockReturnValue({
      ...useNotes(),
      notes: {
        p1: [
          {
            id: "n1",
            patientId: "p1",
            content: "Initial note",
            status: "draft",
            timestamp: "2025-03-21T10:00:00Z",
            version: 1,
          },
          {
            id: "n2",
            patientId: "p1",
            content: "Test note",
            status: "draft",
            timestamp: "2025-03-21T10:01:00Z",
            version: 1,
          },
        ],
      },
    });

    // Re-render to reflect the updated notes
    render(<PracticeDashboard />);

    // Verify the note appears in the list
    await waitFor(() => {
      expect(screen.getByText("Test note")).toBeInTheDocument();
      expect(screen.getByText("draft")).toBeInTheDocument();
    });
  });

  test("locks a note", async () => {
    const lockNote = jest.fn();
    (usePractice as jest.Mock).mockReturnValue({
      ...usePractice(),
      activePatient: {
        id: "p1",
        name: "John Doe",
        diagnosis: ["Anxiety"],
        medications: [],
      },
    });
    (useNotes as jest.Mock).mockReturnValue({
      ...useNotes(),
      lockNote,
    });

    render(<PracticeDashboard />);

    // Click the "Lock" button on the note
    fireEvent.click(screen.getByText("Lock"));
    expect(lockNote).toHaveBeenCalledWith("n1");

    // Mock the updated notes state
    (useNotes as jest.Mock).mockReturnValue({
      ...useNotes(),
      notes: {
        p1: [
          {
            id: "n1",
            patientId: "p1",
            content: "Initial note",
            status: "locked",
            timestamp: "2025-03-21T10:00:00Z",
            version: 1,
          },
        ],
      },
    });

    // Re-render to reflect the updated notes
    render(<PracticeDashboard />);

    // Verify the note's status updates to "locked"
    await waitFor(() => {
      expect(screen.getByText("locked")).toBeInTheDocument();
      expect(screen.queryByText("Lock")).not.toBeInTheDocument();
    });
  });

  test("generates an invoice", async () => {
    const generateInvoice = jest.fn();
    (usePractice as jest.Mock).mockReturnValue({
      ...usePractice(),
      activePatient: {
        id: "p1",
        name: "John Doe",
        diagnosis: ["Anxiety"],
        medications: [],
      },
    });
    (useBilling as jest.Mock).mockReturnValue({
      ...useBilling(),
      generateInvoice,
    });

    render(<PracticeDashboard />);

    // Click the "Generate Invoice" button
    fireEvent.click(screen.getByText("Generate Invoice"));
    expect(generateInvoice).toHaveBeenCalledWith("p1", 100);

    // Mock the updated invoices state
    (useBilling as jest.Mock).mockReturnValue({
      ...useBilling(),
      invoices: [
        { id: "i1", patientId: "p1", amount: 100, status: "pending" },
        { id: "i2", patientId: "p1", amount: 200, status: "pending" },
      ],
    });

    // Re-render to reflect the updated invoices
    render(<PracticeDashboard />);

    // Verify the new invoice appears in the list
    await waitFor(() => {
      expect(screen.getByText("200")).toBeInTheDocument();
      expect(screen.getByText("pending")).toBeInTheDocument();
    });
  });

  test("processes a payment", async () => {
    const setSelectedInvoiceId = jest.fn();
    const processPayment = jest.fn();
    (usePractice as jest.Mock).mockReturnValue({
      ...usePractice(),
      activePatient: {
        id: "p1",
        name: "John Doe",
        diagnosis: ["Anxiety"],
        medications: [],
      },
    });
    (useBilling as jest.Mock).mockReturnValue({
      ...useBilling(),
      selectedInvoiceId: "i1",
      setSelectedInvoiceId,
      processPayment,
    });

    render(<PracticeDashboard />);

    // Click the "Process Payment" button
    fireEvent.click(screen.getByText("Process Payment"));
    expect(processPayment).toHaveBeenCalledWith("i1");
    expect(setSelectedInvoiceId).toHaveBeenCalledWith(null);

    // Mock the updated invoices state
    (useBilling as jest.Mock).mockReturnValue({
      ...useBilling(),
      invoices: [{ id: "i1", patientId: "p1", amount: 100, status: "paid" }],
    });

    // Re-render to reflect the updated invoices
    render(<PracticeDashboard />);

    // Verify the invoice status updates to "paid"
    await waitFor(() => {
      expect(screen.getByText("paid")).toBeInTheDocument();
    });
  });

  test("schedules an appointment", async () => {
    const scheduleAppointment = jest.fn();
    (usePractice as jest.Mock).mockReturnValue({
      ...usePractice(),
      activePatient: {
        id: "p1",
        name: "John Doe",
        diagnosis: ["Anxiety"],
        medications: [],
      },
    });
    (useAppointments as jest.Mock).mockReturnValue({
      ...useAppointments(),
      scheduleAppointment,
    });

    render(<PracticeDashboard />);

    // Click the "Schedule Appointment" button
    fireEvent.click(screen.getByText("Schedule Appointment"));
    expect(scheduleAppointment).toHaveBeenCalledWith({
      id: expect.any(String),
      patientId: "p1",
      time: expect.any(String),
      status: "scheduled",
    });

    // Mock the updated appointments state
    (useAppointments as jest.Mock).mockReturnValue({
      ...useAppointments(),
      appointments: [
        {
          id: "a1",
          patientId: "p1",
          time: "2025-03-21T10:00:00Z",
          status: "scheduled",
        },
        {
          id: "a2",
          patientId: "p1",
          time: "2025-03-21T11:00:00Z",
          status: "scheduled",
        },
      ],
    });

    // Re-render to reflect the updated appointments
    render(<PracticeDashboard />);

    // Verify the new appointment appears in the list
    await waitFor(() => {
      expect(screen.getByText("2025-03-21T11:00:00Z")).toBeInTheDocument();
    });
  });

  test("reschedules an appointment", async () => {
    const setSelectedAppointmentId = jest.fn();
    const rescheduleAppointment = jest.fn();
    (usePractice as jest.Mock).mockReturnValue({
      ...usePractice(),
      activePatient: {
        id: "p1",
        name: "John Doe",
        diagnosis: ["Anxiety"],
        medications: [],
      },
    });
    (useAppointments as jest.Mock).mockReturnValue({
      ...useAppointments(),
      selectedAppointmentId: "a1",
      setSelectedAppointmentId,
      rescheduleAppointment,
    });

    render(<PracticeDashboard />);

    // Click the "Reschedule" button
    fireEvent.click(screen.getByText("Reschedule"));
    expect(rescheduleAppointment).toHaveBeenCalledWith({
      id: "a1",
      patientId: "p1",
      time: expect.any(String),
      status: "scheduled",
    });

    // Mock the updated appointments state
    (useAppointments as jest.Mock).mockReturnValue({
      ...useAppointments(),
      appointments: [
        {
          id: "a1",
          patientId: "p1",
          time: "2025-03-21T12:00:00Z",
          status: "scheduled",
        },
      ],
    });

    // Re-render to reflect the updated appointments
    render(<PracticeDashboard />);

    // Verify the appointment time updates
    await waitFor(() => {
      expect(screen.getByText("2025-03-21T12:00:00Z")).toBeInTheDocument();
    });
  });

  test("cancels an appointment", async () => {
    const setSelectedAppointmentId = jest.fn();
    const cancelAppointment = jest.fn();
    (usePractice as jest.Mock).mockReturnValue({
      ...usePractice(),
      activePatient: {
        id: "p1",
        name: "John Doe",
        diagnosis: ["Anxiety"],
        medications: [],
      },
    });
    (useAppointments as jest.Mock).mockReturnValue({
      ...useAppointments(),
      selectedAppointmentId: "a1",
      setSelectedAppointmentId,
      cancelAppointment,
    });

    render(<PracticeDashboard />);

    // Click the "Cancel" button
    fireEvent.click(screen.getByText("Cancel"));
    expect(cancelAppointment).toHaveBeenCalledWith({
      id: "a1",
      patientId: "p1",
      time: "2025-03-21T10:00:00Z",
      status: "canceled",
    });

    // Mock the updated appointments state
    (useAppointments as jest.Mock).mockReturnValue({
      ...useAppointments(),
      appointments: [
        {
          id: "a1",
          patientId: "p1",
          time: "2025-03-21T10:00:00Z",
          status: "canceled",
        },
      ],
    });

    // Re-render to reflect the updated appointments
    render(<PracticeDashboard />);

    // Verify the appointment status updates to "canceled"
    await waitFor(() => {
      expect(screen.getByText("canceled")).toBeInTheDocument();
    });
  });

  test("opens and closes the patient details modal", async () => {
    const openModal = jest.fn();
    const closeModal = jest.fn();
    (usePractice as jest.Mock).mockReturnValue({
      ...usePractice(),
      activePatient: {
        id: "p1",
        name: "John Doe",
        diagnosis: ["Anxiety"],
        medications: [],
      },
    });
    (usePractice as jest.Mock).mockReturnValue({
      ...usePractice(),
      openModal,
      closeModal,
      modal: { isOpen: false, content: null },
    });

    render(<PracticeDashboard />);

    // Open the modal
    fireEvent.click(screen.getByText("View Patient Details"));
    expect(openModal).toHaveBeenCalledWith("patientDetails");

    // Update the modal state to simulate it being open
    (usePractice as jest.Mock).mockReturnValue({
      ...usePractice(),
      modal: { isOpen: true, content: "patientDetails" },
    });

    // Re-render to reflect the updated modal state
    render(<PracticeDashboard />);

    // Verify the modal is open
    expect(screen.getByText("Patient Details")).toBeInTheDocument();
    expect(
      screen.getByText("Name: John Doe, Diagnosis: Anxiety")
    ).toBeInTheDocument();

    // Close the modal
    fireEvent.click(screen.getByText("Close"));
    expect(closeModal).toHaveBeenCalled();
  });
});
