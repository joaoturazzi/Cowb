
import React, { Suspense, useEffect, useState } from 'react';
import { AuthProvider } from './AuthContext';
import { TaskProvider } from './task/TaskContext';
import { TimerProvider } from './TimerContext';
import { ThemeProvider } from './ThemeContext';

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
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isInitialized) {
    return <ContextLoadingFallback />;
  }
  
  return (
    <Suspense fallback={<ContextLoadingFallback />}>
      <ErrorBoundaryWrapper>
        <AuthProvider>
          <ThemeProvider>
            <TaskProvider>
              <TimerProvider>
                {children}
              </TimerProvider>
            </TaskProvider>
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundaryWrapper>
    </Suspense>
  );
};

// Simple error boundary for context initialization
const ErrorBoundaryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Error in context initialization:", error);
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <h1 className="text-xl font-bold mb-4">Ocorreu um erro ao inicializar o aplicativo</h1>
        <p className="mb-4 text-gray-600">Por favor, recarregue a página e tente novamente.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Recarregar
        </button>
      </div>
    );
  }
};
