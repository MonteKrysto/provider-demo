import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import { Patient } from '../types';
import { useBilling } from '../contexts';

interface BillingStatusProps {
  activePatient: Patient;
  patients: Patient[];
}

export function BillingStatus({ activePatient, patients }: BillingStatusProps) {
  const { invoices, selectedInvoiceId, setSelectedInvoiceId } = useBilling();

  // Filter invoices for the selected patient
  const patientInvoices = activePatient ? invoices.filter((invoice) => invoice.patientId === activePatient.id) : [];

  // Function to get patient name by ID
  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  // Handle row click to select an invoice
  const handleRowClick = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
  };

  console.log('BillingStatus invoices:', invoices);
  console.log('BillingStatus patientInvoices:', patientInvoices);

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Invoice ID</Th>
            <Th>Patient Name</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {patientInvoices.length > 0 ? (
            patientInvoices.map((invoice) => (
              <Tr
                key={invoice.id}
                onClick={() => handleRowClick(invoice.id)}
                bg={selectedInvoiceId === invoice.id ? 'blue.50' : 'white'}
                cursor="pointer"
                _hover={{ bg: 'gray.50' }}
              >
                <Td>{invoice.id}</Td>
                <Td>{getPatientName(invoice.patientId)}</Td>
                <Td>{invoice.amount}</Td>
                <Td>
                  <Text
                    as="span"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="medium"
                    bg={
                      invoice.status === 'pending'
                        ? 'yellow.100'
                        : invoice.status === 'paid'
                        ? 'green.100'
                        : 'red.100'
                    }
                    color={
                      invoice.status === 'pending'
                        ? 'yellow.800'
                        : invoice.status === 'paid'
                        ? 'green.800'
                        : 'red.800'
                    }
                  >
                    {invoice.status}
                  </Text>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={4} textAlign="center" color="gray.500">
                No invoices found.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
}
