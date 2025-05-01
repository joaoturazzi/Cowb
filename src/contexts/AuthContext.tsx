
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: User | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast: uiToast } = useToast();

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
          setSession(changedSession);
          setUser(changedSession?.user ?? null);
          setIsAuthenticated(!!changedSession);
          
          if (event === 'SIGNED_IN') {
            toast.success('Login realizado com sucesso');
          } else if (event === 'SIGNED_OUT') {
            toast.info('Sessão encerrada');
          }
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
        uiToast({
          title: "Erro ao atualizar sessão",
          description: "Sua sessão expirou. Por favor, faça login novamente.",
          variant: "destructive"
        });
        
        // Force signout on refresh error
        await signOut();
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
  }, [uiToast]);

  // Improved sign out function with better error handling
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        uiToast({
          title: "Erro ao sair",
          description: error.message || "Não foi possível encerrar a sessão",
          variant: "destructive"
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
