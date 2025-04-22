
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

// Define user roles
export type UserRole = 'superadmin' | 'admin' | 'warehouse' | 'dealer' | 'agent' | 'store';

// Define user status types
export type UserStatus = 'active' | 'inactive' | 'pending';

// User profile type
export type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  avatar_url?: string | null;
  phone?: string | null;
  address?: string | null;
  status: UserStatus;
  created_at: string;
  updated_at: string;
};

// Mock users for demo
const mockUsers = [
  {
    id: 'super1',
    name: 'Superadmin',
    email: 'superadmin@cddiller.com',
    password: 'superadmin123',
    role: 'superadmin' as UserRole,
    status: 'active' as UserStatus,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'admin1',
    name: 'Admin',
    email: 'admin@cddiller.com',
    password: 'admin123',
    role: 'admin' as UserRole,
    status: 'active' as UserStatus,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'warehouse1',
    name: 'Warehouse Manager',
    email: 'warehouse@cddiller.com',
    password: 'warehouse123',
    role: 'warehouse' as UserRole,
    status: 'active' as UserStatus,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'dealer1',
    name: 'Dealer',
    email: 'dealer@cddiller.com',
    password: 'dealer123',
    role: 'dealer' as UserRole,
    status: 'active' as UserStatus,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'agent1',
    name: 'Agent',
    email: 'agent@cddiller.com',
    password: 'agent123',
    role: 'agent' as UserRole,
    status: 'active' as UserStatus,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'store1',
    name: 'Store Manager',
    email: 'store@cddiller.com',
    password: 'store123',
    role: 'store' as UserRole,
    status: 'active' as UserStatus,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Authentication context type
interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: any | null;
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
  session: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        setSession(parsedSession);
        setUser(parsedSession.user);
      } catch (e) {
        console.error('Error parsing saved session:', e);
        localStorage.removeItem('session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Find user in mock data
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        toast({
          title: 'Login failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
        return false;
      }
      
      // Check if user is inactive
      if (foundUser.status === 'inactive') {
        toast({
          title: 'Account inactive',
          description: 'Your account has been deactivated. Please contact an administrator.',
          variant: 'destructive',
        });
        return false;
      }
      
      // Create user profile without password
      const userProfile: UserProfile = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        status: foundUser.status,
        created_at: foundUser.created_at,
        updated_at: foundUser.updated_at
      };
      
      // Create a mock session
      const newSession = {
        access_token: 'mock-token-' + Date.now(),
        user: userProfile
      };
      
      // Save to state and localStorage
      setUser(userProfile);
      setSession(newSession);
      localStorage.setItem('session', JSON.stringify(newSession));
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${userProfile.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'An error occurred during login. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        toast({
          title: 'Signup failed',
          description: 'A user with this email already exists.',
          variant: 'destructive',
        });
        return false;
      }
      
      // Create new user
      const newUser = {
        id: 'user' + Date.now(),
        name,
        email,
        password,
        role,
        status: 'pending' as UserStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to mock users (in a real app, this would persist to a database)
      mockUsers.push(newUser);
      
      toast({
        title: 'Signup successful',
        description: 'Your account has been created successfully. An administrator will review your account.',
      });
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: 'An error occurred during signup. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear user data from state and localStorage
      setUser(null);
      setSession(null);
      localStorage.removeItem('session');
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: 'An error occurred during logout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isLoading,
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
