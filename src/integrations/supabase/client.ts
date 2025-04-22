
// This file now provides a mock Supabase client for compatibility with our local implementation

// Mock data
import { User, Store, Dealer, Product, Order, OrderItem, Return, Invoice } from '@/lib/supabase';

// Define a mock client that returns mock data
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    signInWithPassword: ({ email, password }) => {
      // Mock successful login for specific credentials
      if (email === 'admin@example.com' && password === 'password') {
        return Promise.resolve({ 
          data: { 
            user: { 
              id: 'admin-123', 
              email: 'admin@example.com',
              user_metadata: { 
                name: 'Admin User', 
                role: 'admin' 
              } 
            } 
          }, 
          error: null 
        });
      }
      // Superadmin login
      if (email === 'superadmin@example.com' && password === 'password') {
        return Promise.resolve({ 
          data: { 
            user: { 
              id: 'superadmin-123', 
              email: 'superadmin@example.com',
              user_metadata: { 
                name: 'Super Admin', 
                role: 'superadmin' 
              } 
            } 
          }, 
          error: null 
        });
      }
      // Warehouse login
      if (email === 'warehouse@example.com' && password === 'password') {
        return Promise.resolve({ 
          data: { 
            user: { 
              id: 'warehouse-123', 
              email: 'warehouse@example.com',
              user_metadata: { 
                name: 'Warehouse Manager', 
                role: 'warehouse' 
              } 
            } 
          }, 
          error: null 
        });
      }
      // Dealer login
      if (email === 'dealer@example.com' && password === 'password') {
        return Promise.resolve({ 
          data: { 
            user: { 
              id: 'dealer-123', 
              email: 'dealer@example.com',
              user_metadata: { 
                name: 'Dealer User', 
                role: 'dealer' 
              } 
            } 
          }, 
          error: null 
        });
      }
      // Store login
      if (email === 'store@example.com' && password === 'password') {
        return Promise.resolve({ 
          data: { 
            user: { 
              id: 'store-123', 
              email: 'store@example.com',
              user_metadata: { 
                name: 'Store Manager', 
                role: 'store' 
              } 
            } 
          }, 
          error: null 
        });
      }
      // Agent login
      if (email === 'agent@example.com' && password === 'password') {
        return Promise.resolve({ 
          data: { 
            user: { 
              id: 'agent-123', 
              email: 'agent@example.com',
              user_metadata: { 
                name: 'Agent User', 
                role: 'agent' 
              } 
            } 
          }, 
          error: null 
        });
      }
      
      // Default failed login
      return Promise.resolve({ 
        data: {}, 
        error: { message: 'Invalid login credentials' } 
      });
    },
    signUp: ({ email, password, options }) => {
      return Promise.resolve({ 
        data: { 
          user: { 
            id: 'new-user-' + Math.random().toString(36).substring(2, 9), 
            email,
            user_metadata: options?.data || {} 
          } 
        }, 
        error: null 
      });
    },
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: (callback) => {
      // Simulate no auth change
      callback('SIGNED_OUT', {});
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  from: (table) => {
    return {
      select: (columns) => {
        return {
          eq: (column, value) => {
            return {
              single: () => {
                // Mock implementation for specific tables
                if (table === 'profiles') {
                  // Find user by id
                  const user = mockUsers.find(u => u.id === value);
                  return Promise.resolve({ data: user || null, error: null });
                }
                if (table === 'stores' && column === 'id') {
                  // Find store by id
                  const store = mockStores.find(s => s.id === value);
                  return Promise.resolve({ data: store || null, error: null });
                }
                // Default response
                return Promise.resolve({ data: null, error: null });
              },
              maybeSingle: () => Promise.resolve({ data: null, error: null }),
              order: (column, options) => {
                // Mock implementation
                return Promise.resolve({ data: [], error: null });
              }
            };
          },
          order: (column, options) => {
            // Important: Added data and error properties here
            const result = {
              data: null,
              error: null,
              range: (from, to) => {
                // Mock implementation for specific tables
                if (table === 'profiles') {
                  return Promise.resolve({ data: mockUsers, error: null });
                }
                if (table === 'stores') {
                  return Promise.resolve({ data: mockStores, error: null });
                }
                if (table === 'dealers') {
                  return Promise.resolve({ data: mockDealers, error: null });
                }
                // Default response
                return Promise.resolve({ data: [], error: null });
              },
              eq: (column, value) => {
                // Filter mock data based on table and value
                if (table === 'stores' && column === 'dealer_id') {
                  const filteredStores = mockStores.filter(store => store.dealer_id === value);
                  return Promise.resolve({ data: filteredStores, error: null });
                }
                if (table === 'profiles' && column === 'role') {
                  const filteredUsers = mockUsers.filter(user => user.role === value);
                  return Promise.resolve({ data: filteredUsers, error: null });
                }
                return Promise.resolve({ data: [], error: null });
              }
            };
            return result;
          }
        };
      },
      insert: (rows) => {
        return {
          select: () => {
            return {
              single: () => {
                // Mock implementation for inserting new records
                if (table === 'profiles') {
                  const newUser = { ...rows[0], id: rows[0].id || `user-${Date.now()}` };
                  mockUsers.push(newUser);
                  return Promise.resolve({ data: newUser, error: null });
                }
                if (table === 'stores') {
                  const newStore = { 
                    ...rows[0], 
                    id: mockStores.length + 1,
                    created_at: new Date().toISOString(),
                    orders_count: 0
                  };
                  mockStores.push(newStore);
                  return Promise.resolve({ data: newStore, error: null });
                }
                if (table === 'dealers') {
                  const newDealer = { 
                    ...rows[0], 
                    created_at: new Date().toISOString()
                  };
                  mockDealers.push(newDealer);
                  return Promise.resolve({ data: newDealer, error: null });
                }
                // Default response
                return Promise.resolve({ data: rows[0], error: null });
              }
            };
          },
          // Add error property directly to the insert method
          error: null
        };
      },
      update: (updates) => {
        return {
          eq: (column, value) => {
            return {
              select: () => {
                return {
                  single: () => {
                    // Mock implementation for updating records
                    if (table === 'profiles') {
                      const index = mockUsers.findIndex(u => u.id === value);
                      if (index !== -1) {
                        mockUsers[index] = { ...mockUsers[index], ...updates };
                        return Promise.resolve({ data: mockUsers[index], error: null });
                      }
                    }
                    if (table === 'stores' && column === 'id') {
                      const index = mockStores.findIndex(s => s.id === value);
                      if (index !== -1) {
                        mockStores[index] = { ...mockStores[index], ...updates };
                        return Promise.resolve({ data: mockStores[index], error: null });
                      }
                    }
                    // Default response
                    return Promise.resolve({ data: null, error: null });
                  }
                };
              },
              // Add error property directly to the eq method
              error: null
            };
          },
          // Add error property directly to the update method
          error: null
        };
      },
      delete: () => {
        return {
          eq: (column, value) => {
            // Mock implementation for deleting records
            if (table === 'stores' && column === 'id') {
              const index = mockStores.findIndex(s => s.id === value);
              if (index !== -1) {
                mockStores.splice(index, 1);
              }
            }
            return Promise.resolve({ error: null });
          },
          // Add error property directly to the delete method
          error: null
        };
      },
      // Add error property directly to the from method
      error: null
    };
  }
};

// Mock data for our local implementation
const mockUsers: User[] = [
  {
    id: 'superadmin-123',
    name: 'Super Admin',
    email: 'superadmin@example.com',
    role: 'superadmin',
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    avatar_url: null,
    phone: '+1234567890',
    address: '123 Admin St, City'
  },
  {
    id: 'admin-123',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z',
    avatar_url: null,
    phone: '+1234567891',
    address: '124 Admin St, City'
  },
  {
    id: 'warehouse-123',
    name: 'Warehouse Manager',
    email: 'warehouse@example.com',
    role: 'warehouse',
    status: 'active',
    created_at: '2023-01-03T00:00:00Z',
    updated_at: '2023-01-03T00:00:00Z',
    avatar_url: null,
    phone: '+1234567892',
    address: '125 Warehouse St, City'
  },
  {
    id: 'dealer-123',
    name: 'Dealer User',
    email: 'dealer@example.com',
    role: 'dealer',
    status: 'active',
    created_at: '2023-01-04T00:00:00Z',
    updated_at: '2023-01-04T00:00:00Z',
    avatar_url: null,
    phone: '+1234567893',
    address: '126 Dealer St, City'
  },
  {
    id: 'store-123',
    name: 'Store Manager',
    email: 'store@example.com',
    role: 'store',
    status: 'active',
    created_at: '2023-01-05T00:00:00Z',
    updated_at: '2023-01-05T00:00:00Z',
    avatar_url: null,
    phone: '+1234567894',
    address: '127 Store St, City'
  },
  {
    id: 'agent-123',
    name: 'Agent User',
    email: 'agent@example.com',
    role: 'agent',
    status: 'active',
    created_at: '2023-01-06T00:00:00Z',
    updated_at: '2023-01-06T00:00:00Z',
    avatar_url: null,
    phone: '+1234567895',
    address: '128 Agent St, City'
  }
];

const mockStores: Store[] = [
  {
    id: 1,
    name: 'Main Store',
    address: '123 Main St, City',
    dealer_id: 'dealer-123',
    status: 'active',
    orders_count: 5,
    created_at: '2023-01-10T00:00:00Z',
    dealer_name: 'Dealer User'
  },
  {
    id: 2,
    name: 'Branch Store',
    address: '456 Branch St, City',
    dealer_id: 'dealer-123',
    status: 'active',
    orders_count: 3,
    created_at: '2023-01-11T00:00:00Z',
    dealer_name: 'Dealer User'
  },
  {
    id: 3,
    name: 'Mall Store',
    address: '789 Mall St, City',
    dealer_id: 'dealer-456',
    status: 'inactive',
    orders_count: 0,
    created_at: '2023-01-12T00:00:00Z',
    dealer_name: 'Another Dealer'
  }
];

const mockDealers: Dealer[] = [
  {
    id: 'dealer-123',
    name: 'Dealer User',
    email: 'dealer@example.com',
    region: 'Central',
    phone: '+1234567893',
    status: 'active',
    stores_count: 2,
    created_at: '2023-01-04T00:00:00Z'
  },
  {
    id: 'dealer-456',
    name: 'Another Dealer',
    email: 'another.dealer@example.com',
    region: 'East',
    phone: '+1234567896',
    status: 'active',
    stores_count: 1,
    created_at: '2023-01-07T00:00:00Z'
  }
];

// Mock database types - for backward compatibility
export type Database = any;
