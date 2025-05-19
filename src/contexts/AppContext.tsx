
import React, { Suspense } from 'react';
import { AuthProvider } from './AuthContext';
import { TaskProvider } from './task/TaskContext';
import { TimerProvider } from './TimerContext';
import { ThemeProvider } from './ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary';

// Simplified loading fallback component
const ContextLoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// This is a combined provider that wraps all our context providers
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <TaskProvider>
            <TimerProvider>
              <Suspense fallback={<ContextLoadingFallback />}>
                {children}
              </Suspense>
            </TimerProvider>
          </TaskProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
