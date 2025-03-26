import { render, screen, fireEvent } from "@testing-library/react";
import { Appointments } from "../src/components/PracticeDashboard/Appointments";
import { usePracticeDashboard } from "../src/components/PracticeDashboard/PracticeDashboardContext";
import { useAppointments } from "../src/contexts";
import { Patient } from "../src/types/patient";
import "@testing-library/jest-dom";

jest.mock("./PracticeDashboardContext");
jest.mock("../../context");

describe("Appointments", () => {
  const mockPatient: Patient = {
    id: "p1",
    name: "John Doe",
    diagnosis: ["Anxiety"],
    medications: [],
  };

  beforeEach(() => {
    (usePracticeDashboard as jest.Mock).mockReturnValue({
      activePatient: mockPatient,
    });
    (useAppointments as jest.Mock).mockReturnValue({
      appointments: [
        {
          id: "a1",
          patientId: "p1",
          time: "2025-03-21T10:00:00Z",
          status: "scheduled",
        },
      ],
      selectedAppointmentId: null,
      setSelectedAppointmentId: jest.fn(),
      scheduleAppointment: jest.fn(),
      rescheduleAppointment: jest.fn(),
      cancelAppointment: jest.fn(),
    });
  });

  test("renders Appointments component", () => {
    render(<Appointments canModifyAppointment={false} />);
    expect(screen.getByText("Appointments")).toBeInTheDocument();
    expect(screen.getByText("Schedule Appointment")).toBeInTheDocument();
  });

  test("schedules an appointment", () => {
    const scheduleAppointment = jest.fn();
    (useAppointments as jest.Mock).mockReturnValue({
      ...useAppointments(),
      scheduleAppointment,
    });

    render(<Appointments canModifyAppointment={false} />);
    fireEvent.click(screen.getByText("Schedule Appointment"));
    expect(scheduleAppointment).toHaveBeenCalledWith({
      id: expect.any(String),
      patientId: "p1",
      time: expect.any(String),
      status: "scheduled",
    });
  });

  test("reschedules an appointment", () => {
    const setSelectedAppointmentId = jest.fn();
    const rescheduleAppointment = jest.fn();
    (useAppointments as jest.Mock).mockReturnValue({
      ...useAppointments(),
      selectedAppointmentId: "a1",
      setSelectedAppointmentId,
      rescheduleAppointment,
    });

    render(<Appointments canModifyAppointment={true} />);
    fireEvent.click(screen.getByText("Reschedule"));
    expect(rescheduleAppointment).toHaveBeenCalledWith({
      id: "a1",
      patientId: "p1",
      time: expect.any(String),
      status: "scheduled",
    });
  });

  test("cancels an appointment", () => {
    const setSelectedAppointmentId = jest.fn();
    const cancelAppointment = jest.fn();
    (useAppointments as jest.Mock).mockReturnValue({
      ...useAppointments(),
      selectedAppointmentId: "a1",
      setSelectedAppointmentId,
      cancelAppointment,
    });

    render(<Appointments canModifyAppointment={true} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(cancelAppointment).toHaveBeenCalledWith({
      id: "a1",
      patientId: "p1",
      time: "2025-03-21T10:00:00Z",
      status: "canceled",
    });
  });
});
