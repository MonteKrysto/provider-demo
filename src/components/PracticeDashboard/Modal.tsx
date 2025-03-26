import { Button, Modal as ChakraModal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { usePracticeDashboard } from './PracticeDashboardContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  openModal: (content: 'patientDetails') => void;
}

export function Modal({ isOpen, onClose, openModal }: ModalProps) {
  const { activePatient } = usePracticeDashboard();

  return (
    <>
      <Button
        onClick={() => openModal('patientDetails')}
        isDisabled={!activePatient}
        colorScheme="blue"
        w="full"
        mt={4}
      >
        View Patient Details
      </Button>
      <ChakraModal isOpen={isOpen} onClose={onClose}>
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
            <Button variant="outline" onClick={onClose} colorScheme="gray">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </ChakraModal>
    </>
  );
}
