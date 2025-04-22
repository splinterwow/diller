
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/contexts/AuthContext';
import { User } from '@/lib/supabase';

// Fetch all users
export async function fetchUsers(): Promise<User[]> {
  try {
    // Use the mock implementation without directly accessing 'data' and 'error'
    const response = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .range(0, 100);
    
    if (response.error) {
      console.error('Error fetching users:', response.error);
      throw response.error;
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Fetch a single user by ID
export async function fetchUserById(id: string): Promise<User | null> {
  try {
    const response = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (response.error) {
      console.error(`Error fetching user with id ${id}:`, response.error);
      throw response.error;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    return null;
  }
}

// Create a new user (used by admins to create users)
export async function createUser(user: Partial<User>): Promise<User> {
  try {
    const response = await supabase
      .from('profiles')
      .insert([user])
      .select()
      .single();

    if (response.error) {
      console.error('Error creating user:', response.error);
      throw response.error;
    }

    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Update a user
export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  try {
    const response = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (response.error) {
      console.error(`Error updating user with id ${id}:`, response.error);
      throw response.error;
    }

    return response.data;
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw error;
  }
}

// Register a new dealer (creates both auth user and dealer profile)
export async function registerDealer(email: string, password: string, name: string, region: string, phone: string): Promise<boolean> {
  try {
    // 1. Create auth user with dealer role
    const authResponse = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'dealer',
        },
      }
    });

    if (authResponse.error) {
      console.error('Error registering dealer auth:', authResponse.error);
      throw authResponse.error;
    }

    if (!authResponse.data.user) {
      throw new Error('Failed to create dealer account');
    }

    // 2. Create the dealer entry in dealers table
    const dealerResponse = await supabase
      .from('dealers')
      .insert([
        {
          id: authResponse.data.user.id,
          region,
          phone,
          status: 'pending',
          stores_count: 0,
          created_at: new Date().toISOString()
        }
      ]);

    if (dealerResponse.error) {
      console.error('Error creating dealer profile:', dealerResponse.error);
      throw dealerResponse.error;
    }

    return true;
  } catch (error) {
    console.error('Error registering dealer:', error);
    return false;
  }
}

// Activate or deactivate a user
export async function updateUserStatus(id: string, status: 'active' | 'inactive' | 'pending'): Promise<boolean> {
  try {
    const response = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', id);

    if (response.error) {
      throw response.error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating user status:`, error);
    return false;
  }
}

// Fetch users by role
export async function fetchUsersByRole(role: UserRole): Promise<User[]> {
  try {
    const response = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });

    if (response.error) {
      console.error(`Error fetching ${role} users:`, response.error);
      throw response.error;
    }

    return response.data || [];
  } catch (error) {
    console.error(`Error fetching ${role} users:`, error);
    return [];
  }
}
