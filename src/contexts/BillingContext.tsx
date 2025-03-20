import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePractice } from './PracticeContext';
import { Invoice } from '../types/billing';

interface BillingContextType {
  invoices: Invoice[];
  selectedInvoiceId: string | null;
  setSelectedInvoiceId: (invoiceId: string | null) => void;
  generateInvoice: (patientId: string, amount: number) => void;
  processPayment: (invoiceId: string) => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export function BillingProvider({ children }: { children: ReactNode }) {
  const { state, send } = usePractice();
  const [invoices, setInvoices] = useState(state.context.billingRef.getSnapshot().context.invoices);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

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

  const generateInvoice = (patientId: string, amount: number) => {
    send({ type: 'GENERATE_INVOICE', patientId, amount });
  };

  const processPayment = (invoiceId: string) => {
    send({ type: 'PROCESS_PAYMENT', invoiceId });
    setSelectedInvoiceId(null); // Clear selection after processing
  };

  const value: BillingContextType = {
    invoices,
    selectedInvoiceId,
    setSelectedInvoiceId,
    generateInvoice,
    processPayment,
  };

  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
}

export function useBilling() {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
}
