import { render, screen, fireEvent } from "@testing-library/react";
import { Billing } from "../src/components/PracticeDashboard/Billing";
import { usePracticeDashboard } from "../src/components/PracticeDashboard/PracticeDashboardContext";
import { useBilling } from "../src/contexts";
import { Patient } from "../src/types/patient";

jest.mock("./PracticeDashboardContext");
jest.mock("../../context");

describe("Billing", () => {
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
    (useBilling as jest.Mock).mockReturnValue({
      invoices: [{ id: "i1", patientId: "p1", amount: 100, status: "pending" }],
      selectedInvoiceId: null,
      setSelectedInvoiceId: jest.fn(),
      generateInvoice: jest.fn(),
      processPayment: jest.fn(),
    });
  });

  test("renders Billing component", () => {
    render(<Billing canProcessPayment={false} />);
    expect(screen.getByText("Billing")).toBeInTheDocument();
    expect(screen.getByText("Generate Invoice")).toBeInTheDocument();
  });

  test("generates an invoice", () => {
    const generateInvoice = jest.fn();
    (useBilling as jest.Mock).mockReturnValue({
      ...useBilling(),
      generateInvoice,
    });

    render(<Billing canProcessPayment={false} />);
    fireEvent.click(screen.getByText("Generate Invoice"));
    expect(generateInvoice).toHaveBeenCalledWith("p1", 100);
  });

  test("processes a payment", () => {
    const setSelectedInvoiceId = jest.fn();
    const processPayment = jest.fn();
    (useBilling as jest.Mock).mockReturnValue({
      ...useBilling(),
      selectedInvoiceId: "i1",
      setSelectedInvoiceId,
      processPayment,
    });

    render(<Billing canProcessPayment={true} />);
    fireEvent.click(screen.getByText("Process Payment"));
    expect(processPayment).toHaveBeenCalledWith("i1");
    expect(setSelectedInvoiceId).toHaveBeenCalledWith(null);
  });
});
