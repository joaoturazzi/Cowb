
import React, { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { sonnerToast as toast } from '@/components/ui';
import { AuthContext, AuthContextType } from './AuthContext';
import { 
  signOutUser, 
  refreshUserSession, 
  getCurrentSession,
  subscribeToAuthChanges
} from '@/services/authService';

/**
 * Auth provider component that manages authentication state
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Guard against React not being available
  if (!React || typeof React.useState !== 'function') {
    console.error('React is not available in AuthProvider');
    return <>{children}</>;
  }
  
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

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
        const { session: currentSession, user: currentUser } = await getCurrentSession();
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentUser);
          setIsAuthenticated(true);
        }
        
        // Subscribe to auth changes
        const subscription = subscribeToAuthChanges((changedSession, changedUser, event) => {
          console.log('Auth state changed:', event);
          
          try {
            setSession(changedSession);
            setUser(changedUser);
            setIsAuthenticated(!!changedSession);
            
            // Only show notifications if not the initial app load
            if (!isInitialLoad) {
              if (event === 'SIGNED_IN') {
                toast.success('Login realizado com sucesso');
              } else if (event === 'SIGNED_OUT') {
                toast.info('Sessão encerrada');
              }
            } else {
              setIsInitialLoad(false);
            }
          } catch (error) {
            console.error('Error handling auth state change:', error);
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
  }, [isInitialLoad]);

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      const { session: refreshedSession, user: refreshedUser, error } = await refreshUserSession();
      
      if (error) {
        // Force signout on refresh error
        await signOut();
        return;
      }
      
      if (refreshedSession) {
        setSession(refreshedSession);
        setUser(refreshedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error in refresh session:', error);
    }
  };

  // Improved sign out function with better error handling
  const signOut = async () => {
    try {
      await signOutUser();
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);
      
      return Promise.resolve();
    } catch (error) {
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
