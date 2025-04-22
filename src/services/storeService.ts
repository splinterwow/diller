
import { supabase } from '@/integrations/supabase/client';
import { Store } from '@/lib/supabase';

// Fetch all stores
export async function fetchStores(): Promise<Store[]> {
  try {
    const response = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false })
      .range(0, 100);

    if (response.error) {
      console.error('Error fetching stores:', response.error);
      throw response.error;
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
}

// Fetch stores by dealer ID
export async function fetchStoresByDealer(dealerId: string): Promise<Store[]> {
  try {
    const response = await supabase
      .from('stores')
      .select('*')
      .eq('dealer_id', dealerId)
      .order('created_at', { ascending: false });

    if (response.error) {
      console.error(`Error fetching stores for dealer ${dealerId}:`, response.error);
      throw response.error;
    }

    return response.data || [];
  } catch (error) {
    console.error(`Error fetching stores for dealer ${dealerId}:`, error);
    return [];
  }
}

// Fetch a single store by ID
export async function fetchStoreById(id: number): Promise<Store | null> {
  try {
    const response = await supabase
      .from('stores')
      .select('*')
      .eq('id', id)
      .single();

    if (response.error) {
      console.error(`Error fetching store with id ${id}:`, response.error);
      throw response.error;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching store with id ${id}:`, error);
    return null;
  }
}

// Create a new store
export async function createStore(store: Omit<Store, 'id' | 'created_at' | 'dealer_name'>): Promise<Store> {
  try {
    const response = await supabase
      .from('stores')
      .insert([store])
      .select()
      .single();

    if (response.error) {
      console.error('Error creating store:', response.error);
      throw response.error;
    }

    return response.data;
  } catch (error) {
    console.error('Error creating store:', error);
    throw error;
  }
}

// Update a store
export async function updateStore(id: number, updates: Partial<Store>): Promise<Store> {
  try {
    const response = await supabase
      .from('stores')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (response.error) {
      console.error(`Error updating store with id ${id}:`, response.error);
      throw response.error;
    }

    return response.data;
  } catch (error) {
    console.error(`Error updating store with id ${id}:`, error);
    throw error;
  }
}

// Delete a store
export async function deleteStore(id: number): Promise<void> {
  try {
    const response = await supabase
      .from('stores')
      .delete()
      .eq('id', id);

    if (response.error) {
      console.error(`Error deleting store with id ${id}:`, response.error);
      throw response.error;
    }
  } catch (error) {
    console.error(`Error deleting store with id ${id}:`, error);
    throw error;
  }
}

// Update store status
export async function updateStoreStatus(id: number, status: 'active' | 'inactive' | 'pending'): Promise<boolean> {
  try {
    const response = await supabase
      .from('stores')
      .update({ status })
      .eq('id', id);

    if (response.error) {
      throw response.error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating store status:`, error);
    return false;
  }
}

// Create store user account
export async function createStoreUser(
  email: string, 
  password: string, 
  name: string, 
  storeId: number
): Promise<boolean> {
  try {
    // 1. Get store info to link
    const storeResponse = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single();
      
    if (storeResponse.error) {
      console.error(`Error getting store info for id ${storeId}:`, storeResponse.error);
      throw storeResponse.error;
    }
    
    // 2. Create auth user with store role
    const authResponse = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'store',
        }
      }
    });

    if (authResponse.error) {
      console.error('Error creating store user auth:', authResponse.error);
      throw authResponse.error;
    }

    if (!authResponse.data.user) {
      throw new Error('Failed to create store user account');
    }

    // 3. Create/update profile entry
    const profileResponse = await supabase
      .from('profiles')
      .insert([
        { 
          id: authResponse.data.user.id,
          name, 
          email,
          role: 'store',
          status: 'active',
          address: storeResponse.data.address,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

    if (profileResponse.error) {
      console.error('Error creating store user profile:', profileResponse.error);
      // Continue anyway as the profile might have been created by the trigger
    }

    return true;
  } catch (error) {
    console.error('Error creating store user:', error);
    throw error;
  }
}
