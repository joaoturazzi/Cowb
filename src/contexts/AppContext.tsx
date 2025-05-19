
import React, { Suspense, useEffect, useState } from 'react';
import { AuthProvider } from './AuthContext';
import { TaskProvider } from './task/TaskContext';
import { TimerProvider } from './TimerContext';
import { ThemeProvider } from './ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary';

// Loading fallback component
const ContextLoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// This is a combined provider that wraps all our context providers
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Ensure contexts are properly initialized
  useEffect(() => {
    // Simulate a delay to ensure all contexts are initialized
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 200); // Increased delay time slightly for better initialization
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isInitialized) {
    return <ContextLoadingFallback />;
  }
  
  return (
    <ErrorBoundary>
      <Suspense fallback={<ContextLoadingFallback />}>
        <AuthProvider>
          <ThemeProvider>
            <TaskProvider>
              <TimerProvider>
                {children}
              </TimerProvider>
            </TaskProvider>
          </ThemeProvider>
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  );
};
