
import { useContext } from 'react';
import { AuthContext, defaultAuthContext } from './AuthContext';

/**
 * Hook to access auth context with improved error handling
 * @returns AuthContextType with auth state and methods
 */
export const useAuth = () => {
  // Protect against React not being available
  if (!useContext) {
    console.error('React useContext is not available');
    return defaultAuthContext;
  }
  
  try {
    const context = useContext(AuthContext);
    
    // Always return a valid context object, never null
    return context || defaultAuthContext;
  } catch (error) {
    console.error('Error in useAuth:', error);
    // Return default context to prevent null reference errors
    return defaultAuthContext;
  }
};
