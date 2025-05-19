
import React, { Suspense, useEffect, useState } from 'react';
import { AuthProvider } from './AuthContext';
import { TaskProvider } from './task/TaskContext';
import { TimerProvider } from './TimerContext';
import { ThemeProvider } from './ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary';

// Global check for React availability
const isReactAvailable = typeof React !== 'undefined' && typeof React.useState === 'function';

// Componente de fallback para carregamento
const ContextLoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Componente de erro
const ContextErrorFallback = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-xl font-bold mb-4">Erro ao carregar a aplicação</h1>
    <p className="mb-4">Ocorreu um erro ao inicializar o contexto da aplicação.</p>
    <button 
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Tentar novamente
    </button>
  </div>
);

// This is a combined provider that wraps all our context providers
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Verify React is available before using any hooks
  if (!isReactAvailable) {
    console.error('React is not defined in AppProvider');
    return <ContextErrorFallback />;
  }
  
  // Only use hooks if React is available
  const [isInitialized, setIsInitialized] = useState(false);
  const [reactLoaded, setReactLoaded] = useState(false);
  
  // Check if React is properly loaded
  useEffect(() => {
    try {
      // Double check React is available inside the effect
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
