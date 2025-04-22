
import { Invoice } from '@/lib/supabase';

// Mock invoices data
const mockInvoices: Invoice[] = [
  {
    id: 1,
    order_id: 1,
    customer_id: 'user123',
    total: 150000,
    due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer_name: 'John Doe',
    order_reference: 'ORD-001'
  },
  {
    id: 2,
    order_id: 2,
    customer_id: 'user456',
    total: 85000,
    due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    status: 'paid',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    customer_name: 'Jane Smith',
    order_reference: 'ORD-002'
  },
  {
    id: 3,
    order_id: 3,
    customer_id: 'user789',
    total: 120000,
    due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: 'overdue',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    customer_name: 'David Johnson',
    order_reference: 'ORD-003'
  }
];

// Helper function to get the next available ID
const getNextInvoiceId = (): number => {
  return Math.max(...mockInvoices.map(i => i.id)) + 1;
};

// Fetch all invoices
export async function fetchInvoices(): Promise<Invoice[]> {
  try {
    return [...mockInvoices];
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
}

// Fetch invoices by customer ID
export async function fetchInvoicesByCustomer(customerId: string): Promise<Invoice[]> {
  try {
    return mockInvoices.filter(invoice => invoice.customer_id === customerId);
  } catch (error) {
    console.error(`Error fetching invoices for customer ${customerId}:`, error);
    throw error;
  }
}

// Fetch a single invoice by ID
export async function fetchInvoiceById(id: number): Promise<Invoice | null> {
  try {
    return mockInvoices.find(invoice => invoice.id === id) || null;
  } catch (error) {
    console.error(`Error fetching invoice with id ${id}:`, error);
    throw error;
  }
}

// Create a new invoice
export async function createInvoice(
  invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'customer_name' | 'order_reference'>
): Promise<Invoice> {
  try {
    // In a real implementation, we would look up customer name and order reference
    const newInvoice: Invoice = {
      id: getNextInvoiceId(),
      ...invoice,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer_name: 'New Customer', // This would come from a lookup in a real implementation
      order_reference: `ORD-${invoice.order_id.toString().padStart(3, '0')}` // This would come from a lookup in a real implementation
    };
    
    mockInvoices.push(newInvoice);
    
    console.log('Creating invoice:', newInvoice);
    return newInvoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}

// Update an invoice
export async function updateInvoice(
  id: number, 
  updates: Partial<Omit<Invoice, 'id' | 'created_at' | 'customer_name' | 'order_reference'>>
): Promise<Invoice> {
  try {
    const invoiceIndex = mockInvoices.findIndex(invoice => invoice.id === id);
    
    if (invoiceIndex === -1) {
      throw new Error(`Invoice with id ${id} not found`);
    }
    
    const invoice = mockInvoices[invoiceIndex];
    const updatedInvoice: Invoice = {
      ...invoice,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    mockInvoices[invoiceIndex] = updatedInvoice;
    
    console.log('Updating invoice:', updatedInvoice);
    return updatedInvoice;
  } catch (error) {
    console.error(`Error updating invoice with id ${id}:`, error);
    throw error;
  }
}

// Delete an invoice
export async function deleteInvoice(id: number): Promise<boolean> {
  try {
    const initialLength = mockInvoices.length;
    const invoiceIndex = mockInvoices.findIndex(invoice => invoice.id === id);
    
    if (invoiceIndex === -1) {
      throw new Error(`Invoice with id ${id} not found`);
    }
    
    // Remove the invoice
    mockInvoices.splice(invoiceIndex, 1);
    
    console.log('Deleting invoice with id:', id);
    return mockInvoices.length < initialLength;
  } catch (error) {
    console.error(`Error deleting invoice with id ${id}:`, error);
    throw error;
  }
}

// Update invoice status
export async function updateInvoiceStatus(
  id: number, 
  status: 'pending' | 'paid' | 'overdue'
): Promise<Invoice> {
  try {
    return updateInvoice(id, { status });
  } catch (error) {
    console.error(`Error updating invoice status for id ${id}:`, error);
    throw error;
  }
}
