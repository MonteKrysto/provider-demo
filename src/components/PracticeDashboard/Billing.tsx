import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { BillingStatus } from '../BillingStatus';
import { useBilling } from '../../contexts';
import { usePracticeDashboard } from './PracticeDashboardContext';

interface BillingProps {
  canProcessPayment: boolean;
}

export function Billing({ canProcessPayment }: BillingProps) {
  const { patients, activePatient } = usePracticeDashboard();
  const { selectedInvoiceId, generateInvoice, processPayment } = useBilling();

  return (
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
  );
}