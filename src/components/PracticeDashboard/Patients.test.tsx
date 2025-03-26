import { render, screen, fireEvent } from '@testing-library/react';
import { Patients } from './Patients';
import { usePracticeDashboard } from './PracticeDashboardContext';
import { Patient } from '../../types/patient';

jest.mock('./PracticeDashboardContext');

describe('Patients', () => {
  const mockPatients: Patient[] = [
    { id: 'p1', name: 'John Doe', diagnosis: ['Anxiety'], medications: [] },
    { id: 'p2', name: 'Jane Doe', diagnosis: ['Depression'], medications: [] },
  ];

  beforeEach(() => {
    (usePracticeDashboard as jest.Mock).mockReturnValue({
      patients: mockPatients,
      isAddPatientModalOpen: false,
      setIsAddPatientModalOpen: jest.fn(),
      newPatientName: '',
      setNewPatientName: jest.fn(),
      newPatientDiagnosis: '',
      setNewPatientDiagnosis: jest.fn(),
      handleAddPatient: jest.fn(),
      activePatient: null,
      setActivePatient: jest.fn(),
    });
  });

  test('renders Patients component', () => {
    render(<Patients />);
    expect(screen.getByText('Patients')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  test('opens the add patient modal', () => {
    const setIsAddPatientModalOpen = jest.fn();
    (usePracticeDashboard as jest.Mock).mockReturnValue({
      ...usePracticeDashboard(),
      setIsAddPatientModalOpen,
    });

    render(<Patients />);
    fireEvent.click(screen.getByText('Add New Patient'));
    expect(setIsAddPatientModalOpen).toHaveBeenCalledWith(true);
  });

  test('displays the patient list', () => {
    render(<Patients />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Anxiety')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Depression')).toBeInTheDocument();
  });
});
