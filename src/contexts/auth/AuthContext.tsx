
import { createContext } from 'react';
import { User } from '@supabase/supabase-js';

export interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: User | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
}

// Create a default context to prevent null access issues
export const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  signOut: async () => {},
  isLoading: true,
  refreshSession: async () => {},
};

// Create the context with default values to prevent null issues
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);
