import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotesEditor } from "../src/components/NotesEditor";
import { useNotes } from "../src/contexts";
import { Patient } from "../src/types";

jest.mock("../context");

describe("NotesEditor", () => {
  const mockPatient: Patient = {
    id: "p1",
    name: "John Doe",
    diagnosis: ["Anxiety"],
    medications: [],
  };

  beforeEach(() => {
    (useNotes as jest.Mock).mockReturnValue({
      saveDraft: jest.fn(),
      lockNote: jest.fn(),
      updateNote: jest.fn(),
    });
  });

  test("renders NotesEditor component", () => {
    render(<NotesEditor activePatient={mockPatient} />);
    expect(
      screen.getByPlaceholderText("Enter note content...")
    ).toBeInTheDocument();
    expect(screen.getByText("Save Draft")).toBeInTheDocument();
    expect(screen.getByText("Lock Note")).toBeInTheDocument();
  });

  test("disables buttons when textarea is empty", () => {
    render(<NotesEditor activePatient={mockPatient} />);
    expect(screen.getByText("Save Draft")).toBeDisabled();
    expect(screen.getByText("Lock Note")).toBeDisabled();
  });

  test("enables buttons when textarea has content", async () => {
    render(<NotesEditor activePatient={mockPatient} />);
    const textarea = screen.getByPlaceholderText("Enter note content...");
    await userEvent.type(textarea, "Test note");
    expect(screen.getByText("Save Draft")).not.toBeDisabled();
    expect(screen.getByText("Lock Note")).not.toBeDisabled();
  });

  test("saves a draft note", async () => {
    const saveDraft = jest.fn();
    (useNotes as jest.Mock).mockReturnValue({
      ...useNotes(),
      saveDraft,
    });

    render(<NotesEditor activePatient={mockPatient} />);
    const textarea = screen.getByPlaceholderText("Enter note content...");
    await userEvent.type(textarea, "Test note");
    fireEvent.click(screen.getByText("Save Draft"));
    expect(saveDraft).toHaveBeenCalledWith("Test note", mockPatient);
  });

  test("locks a new note", async () => {
    const lockNote = jest.fn();
    (useNotes as jest.Mock).mockReturnValue({
      ...useNotes(),
      lockNote,
    });

    render(<NotesEditor activePatient={mockPatient} />);
    const textarea = screen.getByPlaceholderText("Enter note content...");
    await userEvent.type(textarea, "Test note");
    fireEvent.click(screen.getByText("Lock Note"));
    expect(lockNote).toHaveBeenCalledWith({
      content: "Test note",
      activePatient: mockPatient,
    });
  });
});
