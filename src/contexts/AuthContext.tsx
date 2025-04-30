
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: User | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Check for existing session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        setIsLoading(false);
        return;
      }
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        setIsAuthenticated(true);
      }

      // Subscribe to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, changedSession) => {
        setSession(changedSession);
        setUser(changedSession?.user ?? null);
        setIsAuthenticated(!!changedSession);
      });
      
      setIsLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      toast({
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
  };

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    user,
    signOut,
    isLoading
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
