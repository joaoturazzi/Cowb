
import { supabase } from '../integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { sonnerToast as toast } from '@/components/ui';

/**
 * Signs out the current user
 * @returns Promise that resolves when sign out is complete
 */
export const signOutUser = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      toast.error("Erro ao sair", {
        description: error.message || "Não foi possível encerrar a sessão"
      });
      return Promise.reject(error);
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Unexpected error in signOut:', error);
    return Promise.reject(error);
  }
};

/**
 * Refreshes the user session
 * @returns Promise with the refreshed session data
 */
export const refreshUserSession = async (): Promise<{ 
  session: Session | null; 
  user: User | null;
  error?: Error;
}> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Error refreshing session:', error);
      
      // Only show toast if not a network error (to avoid spamming user)
      if (!error.message.toLowerCase().includes('network')) {
        toast.error("Erro ao atualizar sessão", {
          description: "Sua sessão expirou. Por favor, faça login novamente."
        });
      }
      
      return { session: null, user: null, error };
    }
    
    return { 
      session: data.session, 
      user: data.session?.user ?? null 
    };
  } catch (error) {
    console.error('Error in refresh session:', error);
    return { 
      session: null, 
      user: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
};

/**
 * Gets the current session
 * @returns Promise with the current session data
 */
export const getCurrentSession = async (): Promise<{
  session: Session | null;
  user: User | null;
}> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      toast.error('Erro ao verificar sessão', {
        description: 'Não foi possível verificar se você está logado'
      });
      return { session: null, user: null };
    }
    
    return { 
      session, 
      user: session?.user ?? null 
    };
  } catch (error) {
    console.error('Error getting current session:', error);
    return { session: null, user: null };
  }
};

/**
 * Sets up auth state change listener
 * @param callback Function to call when auth state changes
 * @returns Subscription that can be unsubscribed from
 */
export const subscribeToAuthChanges = (
  callback: (session: Session | null, user: User | null, event: string) => void
) => {
  try {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, changedSession) => {
      // Use setTimeout to prevent race conditions
      setTimeout(() => {
        callback(changedSession, changedSession?.user ?? null, event);
      }, 0);
    });
    
    return subscription;
  } catch (error) {
    console.error('Error subscribing to auth changes:', error);
    // Return a dummy subscription to prevent errors
    return {
      unsubscribe: () => {}
    };
  }
};
