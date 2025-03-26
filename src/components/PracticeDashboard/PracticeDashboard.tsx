import { useState } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Text,
  Button,
} from '@chakra-ui/react';
import { usePractice, usePatient, useBilling, useAppointments } from '../../contexts';
import { PracticeDashboardProvider } from './PracticeDashboardContext';
import { Patients } from './Patients';
import { Notes } from './Notes';
import { Billing } from './Billing';
import { Appointments } from './Appointments';
import { Modal } from './Modal';

/**
 * PracticeDashboard is the main component for the practice dashboard.
 * It displays the practice dashboard with the patients, notes, billing, and appointments.
 * It also has a modal for adding a new patient.
 * 
 * @returns {React.ReactNode} The practice dashboard component.
 */
export function PracticeDashboard() {
  const { isLoading, error, modal, openModal, closeModal, activePatient, setActivePatient } = usePractice();
  const { patients, createPatient } = usePatient();
  const { invoices, selectedInvoiceId } = useBilling();
  const { appointments, selectedAppointmentId } = useAppointments();

  // Form state for adding a new patient
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientDiagnosis, setNewPatientDiagnosis] = useState('');
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

  const handleAddPatient = () => {
    if (newPatientName.trim()) {
      const newPatient = {
        id: crypto.randomUUID(),
        name: newPatientName,
        diagnosis: newPatientDiagnosis.split(',').map((d) => d.trim()).filter(Boolean),
        medications: [],
      };
      console.log('New patient being created:', newPatient);
      createPatient(newPatient);
      setActivePatient(newPatient); 
      setNewPatientName('');
      setNewPatientDiagnosis('');
      setIsAddPatientModalOpen(false);
    }
  };

  // Check if the selected invoice is pending, ensure boolean type
  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId);
  const canProcessPayment = Boolean(selectedInvoiceId && selectedInvoice?.status === 'pending');

  // Check if the selected appointment is scheduled, ensure boolean type
  const selectedAppointment = appointments.find((appt) => appt.id === selectedAppointmentId);
  const canModifyAppointment = Boolean(selectedAppointmentId && selectedAppointment?.status === 'scheduled');

  if (isLoading) {
    return (
      <Flex align="center" justify="center" h="100vh" bg="gray.50">
        <Text fontSize="xl" color="gray.600">Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Box p={4} minH="100vh" bg="gray.50">
        <Card maxW="lg" mx="auto" shadow="md" borderRadius="md">
          <CardHeader>
            <Heading size="md" color="red.700">Error</Heading>
          </CardHeader>
          <CardBody>
            <Text color="red.600" mb={4}>{error}</Text>
            <Button onClick={() => window.location.reload()} colorScheme="red" w={{ base: 'full', sm: 'auto' }}>
              Retry
            </Button>
          </CardBody>
        </Card>
      </Box>
    );
  }

  const contextValue = {
    newPatientName,
    setNewPatientName,
    newPatientDiagnosis,
    setNewPatientDiagnosis,
    isAddPatientModalOpen,
    setIsAddPatientModalOpen,
    handleAddPatient,
    patients,
    activePatient,
    setActivePatient,
  };

  return (
    <PracticeDashboardProvider value={contextValue}>
      <Box minH="100vh" p={{ base: 4, sm: 6 }} bg="gray.50">
        <Box maxW="2xl" mx="auto">
          <Card shadow="lg" borderRadius="md" border="1px solid" borderColor="gray.200">
            <CardHeader>
              <Heading size="lg" color="gray.800">Practice Dashboard</Heading>
              <Text mt={2} fontSize="md" color="gray.600">
                {activePatient ? `Selected Patient: ${activePatient.name}` : 'No patient selected'}
              </Text>
              <Divider mt={4} borderColor="gray.200" />
            </CardHeader>
            <CardBody>
              <PracticeDashboard.Patients />
              <PracticeDashboard.Notes />
              <PracticeDashboard.Billing canProcessPayment={canProcessPayment} />
              <PracticeDashboard.Appointments canModifyAppointment={canModifyAppointment} />
              <PracticeDashboard.Modal isOpen={modal.isOpen} onClose={closeModal} openModal={openModal} />
            </CardBody>
          </Card>
        </Box>
      </Box>
    </PracticeDashboardProvider>
  );
}

PracticeDashboard.Patients = Patients;
PracticeDashboard.Notes = Notes;
PracticeDashboard.Billing = Billing;
PracticeDashboard.Appointments = Appointments;
PracticeDashboard.Modal = Modal;
