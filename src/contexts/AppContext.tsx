
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
  // Add defensive checks for React
  if (!React) {
    console.error('React is not defined in AppProvider');
    return <div>Error loading application. Please refresh the page.</div>;
  }
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [reactLoaded, setReactLoaded] = useState(false);
  
  // Check if React is properly loaded
  useEffect(() => {
    if (React && typeof React.useState === 'function') {
      setReactLoaded(true);
    } else {
      console.error('React is not properly loaded');
    }
  }, []);
  
  // Ensure contexts are properly initialized
  useEffect(() => {
    if (reactLoaded) {
      // Make sure to set initialization state after the browser has had time to hydrate
      const timer = setTimeout(() => {
        setIsInitialized(true);
        console.log('App context initialized');
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [reactLoaded]);
  
  if (!reactLoaded || !isInitialized) {
    return <ContextLoadingFallback />;
  }
  
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <TaskProvider>
            <TimerProvider>
              {children}
            </TimerProvider>
          </TaskProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
