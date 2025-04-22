
import { Dealer, Store } from '@/lib/supabase';

// Mock dealers data
const mockDealers: Dealer[] = [
  {
    id: 'dealer1',
    name: 'Tashkent Distributors',
    email: 'tashkent@distributor.com',
    region: 'Tashkent',
    phone: '+998 90 123 4567',
    status: 'active',
    stores_count: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'dealer2',
    name: 'Samarkand Traders',
    email: 'samarkand@traders.com',
    region: 'Samarkand',
    phone: '+998 90 234 5678',
    status: 'active',
    stores_count: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'dealer3',
    name: 'Bukhara Merchants',
    email: 'bukhara@merchants.com',
    region: 'Bukhara',
    phone: '+998 90 345 6789',
    status: 'active',
    stores_count: 1,
    created_at: new Date().toISOString(),
  }
];

// Mock stores data
const mockStores: Store[] = [
  {
    id: 1,
    name: 'Tashkent Central',
    address: '123 Central St, Tashkent',
    dealer_id: 'dealer1',
    status: 'active',
    orders_count: 24,
    created_at: new Date().toISOString(),
    dealer_name: 'Tashkent Distributors'
  },
  {
    id: 2,
    name: 'Tashkent North',
    address: '456 North Ave, Tashkent',
    dealer_id: 'dealer1',
    status: 'active',
    orders_count: 15,
    created_at: new Date().toISOString(),
    dealer_name: 'Tashkent Distributors'
  },
  {
    id: 3,
    name: 'Tashkent East',
    address: '789 East Blvd, Tashkent',
    dealer_id: 'dealer1',
    status: 'active',
    orders_count: 10,
    created_at: new Date().toISOString(),
    dealer_name: 'Tashkent Distributors'
  },
  {
    id: 4,
    name: 'Samarkand Central',
    address: '101 Main St, Samarkand',
    dealer_id: 'dealer2',
    status: 'active',
    orders_count: 18,
    created_at: new Date().toISOString(),
    dealer_name: 'Samarkand Traders'
  },
  {
    id: 5,
    name: 'Samarkand West',
    address: '202 West Rd, Samarkand',
    dealer_id: 'dealer2',
    status: 'active',
    orders_count: 12,
    created_at: new Date().toISOString(),
    dealer_name: 'Samarkand Traders'
  },
  {
    id: 6,
    name: 'Bukhara Central',
    address: '303 Historic St, Bukhara',
    dealer_id: 'dealer3',
    status: 'active',
    orders_count: 9,
    created_at: new Date().toISOString(),
    dealer_name: 'Bukhara Merchants'
  }
];

// Helper functions to get the next available IDs
const getNextDealerId = (): string => {
  return `dealer${mockDealers.length + 1}`;
};

const getNextStoreId = (): number => {
  return Math.max(...mockStores.map(s => s.id)) + 1;
};

// Fetch all dealers
export async function fetchDealers(): Promise<Dealer[]> {
  try {
    return [...mockDealers];
  } catch (error) {
    console.error('Error fetching dealers:', error);
    throw error;
  }
}

// Fetch a single dealer by ID
export async function fetchDealerById(id: string): Promise<Dealer | null> {
  try {
    return mockDealers.find(dealer => dealer.id === id) || null;
  } catch (error) {
    console.error(`Error fetching dealer with id ${id}:`, error);
    throw error;
  }
}

// Create a new dealer
export async function createDealer(dealer: Omit<Dealer, 'id' | 'created_at' | 'stores_count'>): Promise<Dealer> {
  try {
    const newDealer: Dealer = {
      id: getNextDealerId(),
      ...dealer,
      stores_count: 0,
      created_at: new Date().toISOString(),
    };
    
    mockDealers.push(newDealer);
    
    console.log('Creating dealer:', newDealer);
    return newDealer;
  } catch (error) {
    console.error('Error creating dealer:', error);
    throw error;
  }
}

// Update a dealer
export async function updateDealer(
  id: string, 
  updates: Partial<Omit<Dealer, 'id' | 'created_at' | 'stores_count'>>
): Promise<Dealer> {
  try {
    const dealerIndex = mockDealers.findIndex(dealer => dealer.id === id);
    
    if (dealerIndex === -1) {
      throw new Error(`Dealer with id ${id} not found`);
    }
    
    const dealer = mockDealers[dealerIndex];
    const updatedDealer: Dealer = {
      ...dealer,
      ...updates,
    };
    
    mockDealers[dealerIndex] = updatedDealer;
    
    console.log('Updating dealer:', updatedDealer);
    return updatedDealer;
  } catch (error) {
    console.error(`Error updating dealer with id ${id}:`, error);
    throw error;
  }
}

// Delete a dealer
export async function deleteDealer(id: string): Promise<boolean> {
  try {
    const initialLength = mockDealers.length;
    const dealerIndex = mockDealers.findIndex(dealer => dealer.id === id);
    
    if (dealerIndex === -1) {
      throw new Error(`Dealer with id ${id} not found`);
    }
    
    // Remove the dealer
    mockDealers.splice(dealerIndex, 1);
    
    // Remove any stores associated with this dealer
    const storesToRemove = mockStores.filter(store => store.dealer_id === id);
    storesToRemove.forEach(store => {
      const storeIndex = mockStores.findIndex(s => s.id === store.id);
      if (storeIndex !== -1) {
        mockStores.splice(storeIndex, 1);
      }
    });
    
    console.log('Deleting dealer with id:', id);
    return mockDealers.length < initialLength;
  } catch (error) {
    console.error(`Error deleting dealer with id ${id}:`, error);
    throw error;
  }
}

// Update dealer status
export async function updateDealerStatus(
  id: string, 
  status: 'active' | 'inactive' | 'pending'
): Promise<Dealer> {
  try {
    return updateDealer(id, { status });
  } catch (error) {
    console.error(`Error updating dealer status for id ${id}:`, error);
    throw error;
  }
}

// Fetch stores by dealer ID
export async function fetchStoresByDealer(dealerId: string): Promise<Store[]> {
  try {
    return mockStores.filter(store => store.dealer_id === dealerId);
  } catch (error) {
    console.error(`Error fetching stores for dealer ${dealerId}:`, error);
    throw error;
  }
}

// Fetch all stores
export async function fetchStores(): Promise<Store[]> {
  try {
    return [...mockStores];
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
}

// Fetch a single store by ID
export async function fetchStoreById(id: number): Promise<Store | null> {
  try {
    return mockStores.find(store => store.id === id) || null;
  } catch (error) {
    console.error(`Error fetching store with id ${id}:`, error);
    throw error;
  }
}

// Create a new store
export async function createStore(store: Omit<Store, 'id' | 'created_at' | 'orders_count' | 'dealer_name'>): Promise<Store> {
  try {
    // Find the dealer to get the name
    const dealer = mockDealers.find(d => d.id === store.dealer_id);
    if (!dealer) {
      throw new Error(`Dealer with id ${store.dealer_id} not found`);
    }
    
    const newStore: Store = {
      id: getNextStoreId(),
      ...store,
      orders_count: 0,
      created_at: new Date().toISOString(),
      dealer_name: dealer.name
    };
    
    mockStores.push(newStore);
    
    // Update the dealer's store count
    const dealerIndex = mockDealers.findIndex(d => d.id === store.dealer_id);
    if (dealerIndex !== -1) {
      mockDealers[dealerIndex].stores_count += 1;
    }
    
    console.log('Creating store:', newStore);
    return newStore;
  } catch (error) {
    console.error('Error creating store:', error);
    throw error;
  }
}

// Update a store
export async function updateStore(
  id: number, 
  updates: Partial<Omit<Store, 'id' | 'created_at' | 'orders_count' | 'dealer_name'>>
): Promise<Store> {
  try {
    const storeIndex = mockStores.findIndex(store => store.id === id);
    
    if (storeIndex === -1) {
      throw new Error(`Store with id ${id} not found`);
    }
    
    const store = mockStores[storeIndex];
    let dealer_name = store.dealer_name;
    
    // If dealer_id is being updated, update the dealer_name as well
    if (updates.dealer_id && updates.dealer_id !== store.dealer_id) {
      const newDealer = mockDealers.find(d => d.id === updates.dealer_id);
      if (newDealer) {
        dealer_name = newDealer.name;
        
        // Update the old dealer's store count
        const oldDealerIndex = mockDealers.findIndex(d => d.id === store.dealer_id);
        if (oldDealerIndex !== -1) {
          mockDealers[oldDealerIndex].stores_count -= 1;
        }
        
        // Update the new dealer's store count
        const newDealerIndex = mockDealers.findIndex(d => d.id === updates.dealer_id);
        if (newDealerIndex !== -1) {
          mockDealers[newDealerIndex].stores_count += 1;
        }
      }
    }
    
    const updatedStore: Store = {
      ...store,
      ...updates,
      dealer_name
    };
    
    mockStores[storeIndex] = updatedStore;
    
    console.log('Updating store:', updatedStore);
    return updatedStore;
  } catch (error) {
    console.error(`Error updating store with id ${id}:`, error);
    throw error;
  }
}

// Delete a store
export async function deleteStore(id: number): Promise<boolean> {
  try {
    const initialLength = mockStores.length;
    const storeIndex = mockStores.findIndex(store => store.id === id);
    
    if (storeIndex === -1) {
      throw new Error(`Store with id ${id} not found`);
    }
    
    const store = mockStores[storeIndex];
    
    // Update the dealer's store count
    const dealerIndex = mockDealers.findIndex(d => d.id === store.dealer_id);
    if (dealerIndex !== -1) {
      mockDealers[dealerIndex].stores_count -= 1;
    }
    
    // Remove the store
    mockStores.splice(storeIndex, 1);
    
    console.log('Deleting store with id:', id);
    return mockStores.length < initialLength;
  } catch (error) {
    console.error(`Error deleting store with id ${id}:`, error);
    throw error;
  }
}

// Update store status
export async function updateStoreStatus(
  id: number, 
  status: 'active' | 'inactive' | 'pending'
): Promise<Store> {
  try {
    return updateStore(id, { status });
  } catch (error) {
    console.error(`Error updating store status for id ${id}:`, error);
    throw error;
  }
}
