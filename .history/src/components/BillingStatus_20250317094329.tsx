import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Invoice } from '../types/billing';

interface BillingStatusProps {
  invoices: Invoice[];
}

export function BillingStatus({ invoices }: BillingStatusProps) {
  console.log('BillingStatus invoices:', invoices);

  return (
    <div className="overflow-x-auto mt-4">
      <h2 className="text-lg font-semibold mb-2">Billing Status</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Patient ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.patientId}</TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : invoice.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : invoice.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {invoice.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-500">
                No invoices found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}