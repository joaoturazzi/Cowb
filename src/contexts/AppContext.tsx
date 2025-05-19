
import React, { Suspense, useEffect, useState } from 'react';
import { AuthProvider } from './AuthContext';
import { TaskProvider } from './task/TaskContext';
import { TimerProvider } from './TimerContext';
import { ThemeProvider } from './ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary';

// Add better defensive checks for React availability
if (typeof React === 'undefined' || typeof React.useState !== 'function') {
  console.error('Critical error: React is not defined or React.useState is not a function in AppContext');
  throw new Error('React not available');
}

// Loading fallback component
const ContextLoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// This is a combined provider that wraps all our context providers
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Add defensive checks for React
  if (!React || typeof React.useState !== 'function') {
    console.error('React is not defined in AppProvider');
    return <div>Error loading application. Please refresh the page.</div>;
  }
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [reactLoaded, setReactLoaded] = useState(false);
  
  // Check if React is properly loaded
  useEffect(() => {
    try {
      if (React && typeof React.useState === 'function') {
        setReactLoaded(true);
        console.log('React successfully initialized in AppContext');
      } else {
        console.error('React is not properly loaded');
      }
    } catch (error) {
      console.error('Error checking React availability:', error);
    }
  }, []);
  
  // Ensure contexts are properly initialized
  useEffect(() => {
    if (reactLoaded) {
      try {
        // Make sure to set initialization state after the browser has had time to hydrate
        const timer = setTimeout(() => {
          setIsInitialized(true);
          console.log('App context initialized');
        }, 300);
        
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error initializing context:', error);
      }
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
