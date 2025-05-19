
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { sonnerToast as toast } from '@/components/ui';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: User | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
}

// Create a default context to prevent null access issues
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  signOut: async () => {},
  isLoading: true,
  refreshSession: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Auto refresh token setup
  useEffect(() => {
    let refreshInterval: ReturnType<typeof setInterval>;
    
    try {
      if (session) {
        // Calculate time before token needs refresh (5 minutes before expiry)
        const expiresAt = (session.expires_at || 0) * 1000; // Convert to ms
        const timeUntilExpiry = expiresAt - Date.now();
        const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0); // 5 minutes before expiry
        
        if (refreshTime < 24 * 60 * 60 * 1000) { // Only if expires in less than 24 hours
          refreshInterval = setInterval(() => {
            refreshSession().catch(console.error);
          }, refreshTime);
        }
      }
    } catch (error) {
      console.error('Error setting up token refresh:', error);
    }
    
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [session]);

  // Initialize authentication state and set up listeners
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check for existing session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          toast.error('Erro ao verificar sessão', {
            description: 'Não foi possível verificar se você está logado'
          });
          return;
        }
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsAuthenticated(true);
        }
        
        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, changedSession) => {
          console.log('Auth state changed:', event);
          
          // Use setTimeout to prevent race conditions
          setTimeout(() => {
            try {
              setSession(changedSession);
              setUser(changedSession?.user ?? null);
              setIsAuthenticated(!!changedSession);
              
              if (event === 'SIGNED_IN') {
                toast.success('Login realizado com sucesso');
              } else if (event === 'SIGNED_OUT') {
                toast.info('Sessão encerrada');
              }
            } catch (error) {
              console.error('Error handling auth state change:', error);
            }
          }, 0);
        });
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Function to refresh the session
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        
        // Only show toast if not a network error (to avoid spamming user)
        if (!error.message.toLowerCase().includes('network')) {
          toast.error("Erro ao atualizar sessão", {
            description: "Sua sessão expirou. Por favor, faça login novamente."
          });
          
          // Force signout on refresh error
          await signOut();
        }
        return;
      }
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error in refresh session:', error);
    }
  }, []);

  // Improved sign out function with better error handling
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast.error("Erro ao sair", {
          description: error.message || "Não foi possível encerrar a sessão"
        });
        return Promise.reject(error);
      }
      
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Unexpected error in signOut:', error);
      return Promise.reject(error);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    setIsAuthenticated,
    user,
    signOut,
    isLoading,
    refreshSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Ensure useAuth is properly wrapped with error handling
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
