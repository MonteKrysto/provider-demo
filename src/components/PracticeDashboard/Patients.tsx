import { Box, Button, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, VStack } from '@chakra-ui/react';
import { PatientList } from '../PatientList';
import { usePracticeDashboard } from './PracticeDashboardContext';

export function Patients() {
  const {
    newPatientName,
    setNewPatientName,
    newPatientDiagnosis,
    setNewPatientDiagnosis,
    isAddPatientModalOpen,
    setIsAddPatientModalOpen,
    handleAddPatient,
    setActivePatient,
  } = usePracticeDashboard();

  return (
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
  );
}
