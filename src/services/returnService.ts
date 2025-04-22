
import { Return } from '@/lib/supabase';

// Mock returns data
const mockReturns: Return[] = [
  {
    id: 1,
    order_id: 1,
    customer_id: 'user123',
    reason: 'Product arrived damaged',
    items_count: 1,
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
    reason: 'Wrong product received',
    items_count: 2,
    status: 'approved',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    customer_name: 'Jane Smith',
    order_reference: 'ORD-002'
  },
  {
    id: 3,
    order_id: 3,
    customer_id: 'user789',
    reason: 'Not as described',
    items_count: 1,
    status: 'rejected',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    updated_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
    customer_name: 'David Johnson',
    order_reference: 'ORD-003'
  }
];

// Helper function to get the next available ID
const getNextReturnId = (): number => {
  return Math.max(...mockReturns.map(r => r.id)) + 1;
};

// Fetch all returns
export async function fetchReturns(): Promise<Return[]> {
  try {
    return [...mockReturns];
  } catch (error) {
    console.error('Error fetching returns:', error);
    throw error;
  }
}

// Fetch returns by customer ID
export async function fetchReturnsByCustomer(customerId: string): Promise<Return[]> {
  try {
    return mockReturns.filter(returnItem => returnItem.customer_id === customerId);
  } catch (error) {
    console.error(`Error fetching returns for customer ${customerId}:`, error);
    throw error;
  }
}

// Fetch a single return by ID
export async function fetchReturnById(id: number): Promise<Return | null> {
  try {
    return mockReturns.find(returnItem => returnItem.id === id) || null;
  } catch (error) {
    console.error(`Error fetching return with id ${id}:`, error);
    throw error;
  }
}

// Create a new return
export async function createReturn(
  returnData: Omit<Return, 'id' | 'created_at' | 'updated_at' | 'customer_name' | 'order_reference'>
): Promise<Return> {
  try {
    // In a real implementation, we would look up customer name and order reference
    const newReturn: Return = {
      id: getNextReturnId(),
      ...returnData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer_name: 'New Customer', // This would come from a lookup in a real implementation
      order_reference: `ORD-${returnData.order_id.toString().padStart(3, '0')}` // This would come from a lookup in a real implementation
    };
    
    mockReturns.push(newReturn);
    
    console.log('Creating return:', newReturn);
    return newReturn;
  } catch (error) {
    console.error('Error creating return:', error);
    throw error;
  }
}

// Update a return
export async function updateReturn(
  id: number, 
  updates: Partial<Omit<Return, 'id' | 'created_at' | 'customer_name' | 'order_reference'>>
): Promise<Return> {
  try {
    const returnIndex = mockReturns.findIndex(returnItem => returnItem.id === id);
    
    if (returnIndex === -1) {
      throw new Error(`Return with id ${id} not found`);
    }
    
    const returnItem = mockReturns[returnIndex];
    const updatedReturn: Return = {
      ...returnItem,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    mockReturns[returnIndex] = updatedReturn;
    
    console.log('Updating return:', updatedReturn);
    return updatedReturn;
  } catch (error) {
    console.error(`Error updating return with id ${id}:`, error);
    throw error;
  }
}

// Delete a return
export async function deleteReturn(id: number): Promise<boolean> {
  try {
    const initialLength = mockReturns.length;
    const returnIndex = mockReturns.findIndex(returnItem => returnItem.id === id);
    
    if (returnIndex === -1) {
      throw new Error(`Return with id ${id} not found`);
    }
    
    // Remove the return
    mockReturns.splice(returnIndex, 1);
    
    console.log('Deleting return with id:', id);
    return mockReturns.length < initialLength;
  } catch (error) {
    console.error(`Error deleting return with id ${id}:`, error);
    throw error;
  }
}

// Update return status
export async function updateReturnStatus(
  id: number, 
  status: 'pending' | 'approved' | 'rejected'
): Promise<Return> {
  try {
    return updateReturn(id, { status });
  } catch (error) {
    console.error(`Error updating return status for id ${id}:`, error);
    throw error;
  }
}
