import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "../src/components/PracticeDashboard/Modal";
import { usePracticeDashboard } from "../src/components/PracticeDashboard/PracticeDashboardContext";

jest.mock("./PracticeDashboardContext");

describe("Modal", () => {
  const mockPatient = {
    id: "p1",
    name: "John Doe",
    diagnosis: ["Anxiety"],
    medications: [],
  };

  beforeEach(() => {
    (usePracticeDashboard as jest.Mock).mockReturnValue({
      activePatient: mockPatient,
    });
  });

  test("renders Modal component", () => {
    const openModal = jest.fn();
    const onClose = jest.fn();
    render(<Modal isOpen={false} onClose={onClose} openModal={openModal} />);
    expect(screen.getByText("View Patient Details")).toBeInTheDocument();
  });

  test("opens the modal", () => {
    const openModal = jest.fn();
    const onClose = jest.fn();
    render(<Modal isOpen={false} onClose={onClose} openModal={openModal} />);
    fireEvent.click(screen.getByText("View Patient Details"));
    expect(openModal).toHaveBeenCalledWith("patientDetails");
  });

  test("displays patient details when modal is open", () => {
    const openModal = jest.fn();
    const onClose = jest.fn();
    render(<Modal isOpen={true} onClose={onClose} openModal={openModal} />);
    expect(screen.getByText("Patient Details")).toBeInTheDocument();
    expect(
      screen.getByText("Name: John Doe, Diagnosis: Anxiety")
    ).toBeInTheDocument();
  });

  test("closes the modal", () => {
    const openModal = jest.fn();
    const onClose = jest.fn();
    render(<Modal isOpen={true} onClose={onClose} openModal={openModal} />);
    fireEvent.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalled();
  });
});
