import { useState } from 'react';
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
import { PatientList } from './PatientList';
import { NotesEditor } from './NotesEditor';
import { BillingStatus } from './BillingStatus';
import { Calendar } from './Calendar';
import { usePractice, usePatient, useBilling, useAppointments } from '../contexts';

export function PracticeDashboard() {
  const { isLoading, error, modal, openModal, closeModal, activePatient, setActivePatient } = usePractice();
  const { patients, createPatient } = usePatient(); // Add createPatient from PatientContext
  const { invoices, selectedInvoiceId, generateInvoice, processPayment } = useBilling();
  const { appointments, selectedAppointmentId, scheduleAppointment, rescheduleAppointment, cancelAppointment } = useAppointments();

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
      createPatient(newPatient); // Send CREATE_PATIENT event to persist the new patient
      setActivePatient(newPatient);
      setNewPatientName('');
      setNewPatientDiagnosis('');
      setIsAddPatientModalOpen(false);
    }
  };

  // Check if the selected invoice is pending
  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId);
  const canProcessPayment = selectedInvoiceId && selectedInvoice?.status === 'pending';

  // Check if the selected appointment is scheduled
  const selectedAppointment = appointments.find((appt) => appt.id === selectedAppointmentId);
  const canModifyAppointment = selectedAppointmentId && selectedAppointment?.status === 'scheduled';

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
              <PatientList onSelect={setActivePatient} />
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
                <NotesEditor activePatient={activePatient} />
              ) : (
                <Text color="gray.500">Please select a patient to view or add notes.</Text>
              )}
            </Box>

            {/* Billing Status Section */}
            <Box mb={8} bg="gray.50" p={4} borderRadius="md" shadow="sm" opacity={activePatient ? 1 : 0.5} pointerEvents={activePatient ? 'auto' : 'none'}>
              <Heading size="md" mb={4} color="gray.700">Billing Status</Heading>
              {activePatient ? (
                <>
                  <BillingStatus patients={patients} activePatient={activePatient} />
                  <Flex gap={3} mt={4} direction={{ base: 'column', sm: 'row' }}>
                    <Button
                      onClick={() => activePatient && generateInvoice(activePatient.id, 150)}
                      colorScheme="blue"
                      w={{ base: 'full', sm: 'auto' }}
                    >
                      Generate Invoice
                    </Button>
                    <Button
                      onClick={() => selectedInvoiceId && processPayment(selectedInvoiceId)}
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
                  <Calendar activePatient={activePatient} />
                  <Flex gap={3} mt={4} direction={{ base: 'column', sm: 'row' }}>
                    <Button
                      onClick={() =>
                        activePatient &&
                        scheduleAppointment({
                          patientId: activePatient.id,
                          time: '2025-03-20T10:00:00Z',
                          id: crypto.randomUUID(),
                          status: 'scheduled',
                        })
                      }
                      colorScheme="blue"
                      w={{ base: 'full', sm: 'auto' }}
                    >
                      Schedule Appointment
                    </Button>
                    <Button
                      onClick={() => selectedAppointmentId && rescheduleAppointment(selectedAppointmentId, '2025-03-20T11:00:00Z')}
                      isDisabled={!canModifyAppointment}
                      colorScheme="blue"
                      w={{ base: 'full', sm: 'auto' }}
                    >
                      Reschedule Appointment
                    </Button>
                    <Button
                      onClick={() => selectedAppointmentId && cancelAppointment(selectedAppointmentId)}
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
              onClick={() => openModal('patientDetails')}
              isDisabled={!activePatient}
              colorScheme="blue"
              w="full"
              mt={4}
            >
              View Patient Details
            </Button>
          </CardBody>
        </Card>
      </Box>

      <Modal isOpen={modal.isOpen} onClose={closeModal}>
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
            <Button variant="outline" onClick={closeModal} colorScheme="gray">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
