import { useActor } from '@xstate/react';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { practiceMachine } from '../actors/practice';
import { PatientList } from './PatientList';
import { NotesEditor } from './NotesEditor';
import { BillingStatus } from './BillingStatus';
import { Calendar } from './Calendar';
import { Patient } from '../types/patient';

export function PracticeDashboard() {
  const [state, send] = useActor(practiceMachine);
  const patientState = state.context.patientRef.getSnapshot();

  // Use local state to store the active patient, initially null
  const [activePatient, setActivePatient] = useState<Patient | null>(null);

  // Use local state to store the notes state
  const [notes, setNotes] = useState(state.context.notesRef.getSnapshot().context.notes);

  // Use local state to store the invoices state
  const [invoices, setInvoices] = useState(state.context.billingRef.getSnapshot().context.invoices);

  // Use local state to store the appointments state
  const [appointments, setAppointments] = useState(state.context.appointmentsRef.getSnapshot().context.appointments);

  // Use local state to store the selected invoice ID
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  // Use local state to store the selected appointment ID
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  // Subscribe to notesMachine state changes
  useEffect(() => {
    const subscription = state.context.notesRef.subscribe((newState) => {
      console.log('Notes state updated:', newState.context.notes);
      setNotes(newState.context.notes);
    });

    return () => subscription.unsubscribe();
  }, [state.context.notesRef]);

  // Subscribe to billingMachine state changes
  useEffect(() => {
    const subscription = state.context.billingRef.subscribe((newState) => {
      console.log('Invoices state updated:', newState.context.invoices);
      setInvoices(newState.context.invoices);
      // Clear selection if the selected invoice is no longer in the list
      if (selectedInvoiceId && !newState.context.invoices.some((invoice) => invoice.id === selectedInvoiceId)) {
        setSelectedInvoiceId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [state.context.billingRef, selectedInvoiceId]);

  // Subscribe to appointmentsMachine state changes
  useEffect(() => {
    const subscription = state.context.appointmentsRef.subscribe((newState) => {
      console.log('Appointments state updated:', newState.context.appointments);
      setAppointments(newState.context.appointments);
      // Clear selection if the selected appointment is no longer in the list
      if (selectedAppointmentId && !newState.context.appointments.some((appt) => appt.id === selectedAppointmentId)) {
        console.log('Clearing selected appointment ID because it was not found in the updated list');
        setSelectedAppointmentId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [state.context.appointmentsRef, selectedAppointmentId]);

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
      send({ type: 'CREATE_PATIENT', patient: newPatient });
      setNewPatientName('');
      setNewPatientDiagnosis('');
      setIsAddPatientModalOpen(false);
    }
  };

  // Handle invoice selection
  const handleSelectInvoice = (invoiceId: string) => {
    console.log('Selected invoice ID:', invoiceId);
    setSelectedInvoiceId(invoiceId);
  };

  // Handle payment processing
  const handleProcessPayment = () => {
    if (selectedInvoiceId) {
      send({ type: 'PROCESS_PAYMENT', invoiceId: selectedInvoiceId });
      setSelectedInvoiceId(null); // Clear selection after processing
    }
  };

  // Handle appointment selection
  const handleSelectAppointment = (appointmentId: string) => {
    console.log('Selected appointment ID:', appointmentId);
    setSelectedAppointmentId(appointmentId);
  };

  // Check if the selected invoice is pending
  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId);
  const canProcessPayment = selectedInvoiceId && selectedInvoice?.status === 'pending';

  // Check if the selected appointment is scheduled
  const selectedAppointment = appointments.find((appt) => appt.id === selectedAppointmentId);
  const canModifyAppointment = selectedAppointmentId && selectedAppointment?.status === 'scheduled';

  if (state.context.isLoading) {
    return (
      <Flex align="center" justify="center" h="100vh" bg="gray.50">
        <Text fontSize="xl" color="gray.600">Loading...</Text>
      </Flex>
    );
  }

  if (state.context.error) {
    return (
      <Box p={4} minH="100vh" bg="gray.50">
        <Card maxW="lg" mx="auto" shadow="md" borderRadius="md">
          <CardHeader>
            <Heading size="md" color="red.700">Error</Heading>
          </CardHeader>
          <CardBody>
            <Text color="red.600" mb={4}>{state.context.error}</Text>
            <Button onClick={() => window.location.reload()} colorScheme="red" w={{ base: 'full', sm: 'auto' }}>
              Retry
            </Button>
          </CardBody>
        </Card>
      </Box>
    );
  }

  return (
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
            {/* Patient List Section */}
            <Box mb={8} bg="gray.50" p={4} borderRadius="md" shadow="sm">
              <Heading size="md" mb={4} color="gray.700">Patients</Heading>
              <PatientList
                patients={patientState.context.patients}
                onSelect={(patient: Patient) => {
                  setActivePatient(patient);
                  send({ type: 'EDIT_PATIENT', data: patient });
                  setSelectedInvoiceId(null); // Clear invoice selection when changing patient
                  setSelectedAppointmentId(null); // Clear appointment selection when changing patient
                }}
              />
              <Button
                mt={4}
                w={{ base: 'full', sm: 'auto' }}
                colorScheme="blue"
                onClick={() => setIsAddPatientModalOpen(true)}
              >
                Add New Patient
              </Button>
              <Modal isOpen={isAddPatientModalOpen} onClose={() => setIsAddPatientModalOpen(false)}>
                <ModalOverlay />
                <ModalContent maxW="md">
                  <ModalHeader color="gray.800">Add New Patient</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <VStack spacing={4}>
                      <Box w="full">
                        <Text mb={1} fontSize="sm" fontWeight="medium" color="gray.700">Name</Text>
                        <Input
                          value={newPatientName}
                          onChange={(e) => setNewPatientName(e.target.value)}
                          placeholder="Enter patient name"
                          borderColor="gray.300"
                          focusBorderColor="blue.500"
                          borderRadius="md"
                        />
                      </Box>
                      <Box w="full">
                        <Text mb={1} fontSize="sm" fontWeight="medium" color="gray.700">Diagnosis (comma-separated)</Text>
                        <Input
                          value={newPatientDiagnosis}
                          onChange={(e) => setNewPatientDiagnosis(e.target.value)}
                          placeholder="e.g., Anxiety, Depression"
                          borderColor="gray.300"
                          focusBorderColor="blue.500"
                          borderRadius="md"
                        />
                      </Box>
                    </VStack>
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="outline" mr={2} onClick={() => setIsAddPatientModalOpen(false)} colorScheme="gray">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddPatient}
                      isDisabled={!newPatientName.trim()}
                      colorScheme="blue"
                      w={{ base: 'full', sm: 'auto' }}
                    >
                      Add Patient
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Box>

            {/* Notes Section */}
            <Box mb={8} bg="gray.50" p={4} borderRadius="md" shadow="sm" opacity={activePatient ? 1 : 0.5} pointerEvents={activePatient ? 'auto' : 'none'}>
              <Heading size="md" mb={4} color="gray.700">Notes</Heading>
              {activePatient ? (
                <NotesEditor
                  note={state.context.notesRef.getSnapshot().context.currentNote}
                  notes={notes}
                  onSave={(content) => send({ type: 'SAVE_DRAFT', content, activePatient })}
                  onLock={() => send({ type: 'LOCK_NOTE', activePatient })}
                  onLockExisting={(noteId) => send({ type: 'LOCK_EXISTING_NOTE', noteId, activePatient })}
                  onUpdate={(noteId, content) => send({ type: 'UPDATE_NOTE', noteId, content, activePatient })}
                  activePatient={activePatient}
                />
              ) : (
                <Text color="gray.500">Please select a patient to view or add notes.</Text>
              )}
            </Box>

            {/* Billing Status Section */}
            <Box mb={8} bg="gray.50" p={4} borderRadius="md" shadow="sm" opacity={activePatient ? 1 : 0.5} pointerEvents={activePatient ? 'auto' : 'none'}>
              <Heading size="md" mb={4} color="gray.700">Billing Status</Heading>
              {activePatient ? (
                <>
                  <BillingStatus
                    invoices={invoices}
                    activePatient={activePatient}
                    patients={patientState.context.patients}
                    selectedInvoiceId={selectedInvoiceId}
                    onSelectInvoice={handleSelectInvoice}
                  />
                  <Flex gap={3} mt={4} direction={{ base: 'column', sm: 'row' }}>
                    <Button
                      onClick={() => send({ type: 'GENERATE_INVOICE', patientId: activePatient.id, amount: 150 })}
                      colorScheme="blue"
                      w={{ base: 'full', sm: 'auto' }}
                    >
                      Generate Invoice
                    </Button>
                    <Button
                      onClick={handleProcessPayment}
                      isDisabled={!canProcessPayment}
                      colorScheme="blue"
                      w={{ base: 'full', sm: 'auto' }}
                    >
                      Process Payment
                    </Button>
                  </Flex>
                </>
              ) : (
                <Text color="gray.500">Please select a patient to view billing status.</Text>
              )}
            </Box>

            {/* Calendar Section */}
            <Box mb={8} bg="gray.50" p={4} borderRadius="md" shadow="sm" opacity={activePatient ? 1 : 0.5} pointerEvents={activePatient ? 'auto' : 'none'}>
              <Heading size="md" mb={4} color="gray.700">Appointments</Heading>
              {activePatient ? (
                <>
                  <Calendar
                    appointments={appointments}
                    activePatient={activePatient}
                    selectedAppointmentId={selectedAppointmentId}
                    onSelectAppointment={handleSelectAppointment}
                  />
                  <Flex gap={3} mt={4} direction={{ base: 'column', sm: 'row' }}>
                    <Button
                      onClick={() =>
                        send({
                          type: 'SCHEDULE',
                          appointment: {
                            patientId: activePatient.id,
                            time: '2025-03-20T10:00:00Z',
                            id: crypto.randomUUID(),
                            status: 'scheduled',
                          },
                        })
                      }
                      colorScheme="blue"
                      w={{ base: 'full', sm: 'auto' }}
                    >
                      Schedule Appointment
                    </Button>
                    <Button
                      onClick={() =>
                        selectedAppointmentId &&
                        send({
                          type: 'RESCHEDULE',
                          appointment: {
                            id: selectedAppointmentId,
                            time: '2025-03-20T11:00:00Z',
                          },
                        })
                      }
                      isDisabled={!canModifyAppointment}
                      colorScheme="blue"
                      w={{ base: 'full', sm: 'auto' }}
                    >
                      Reschedule Appointment
                    </Button>
                    <Button
                      onClick={() =>
                        selectedAppointmentId &&
                        send({
                          type: 'CANCEL',
                          appointment: { id: selectedAppointmentId },
                        })
                      }
                      isDisabled={!canModifyAppointment}
                      colorScheme="blue"
                      w={{ base: 'full', sm: 'auto' }}
                    >
                      Cancel Appointment
                    </Button>
                  </Flex>
                </>
              ) : (
                <Text color="gray.500">Please select a patient to view appointments.</Text>
              )}
            </Box>

            <Button
              onClick={() => send({ type: 'OPEN_MODAL', content: 'patientDetails' })}
              isDisabled={!activePatient || !patientState.matches('idle')}
              colorScheme="blue"
              w="full"
              mt={4}
            >
              View Patient Details
            </Button>
          </CardBody>
        </Card>
      </Box>

      <Modal isOpen={state.context.modal.isOpen} onClose={() => send({ type: 'CLOSE_MODAL' })}>
        <ModalOverlay />
        <ModalContent maxW="md">
          <ModalHeader color="gray.800">Patient Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="gray.600">
              {activePatient
                ? `Name: ${activePatient.name}, Diagnosis: ${activePatient.diagnosis.join(', ')}`
                : 'No patient selected.'}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => send({ type: 'CLOSE_MODAL' })} colorScheme="gray">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
