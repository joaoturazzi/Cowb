
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardDescription } from '@/components/ui/card';
import { useAuth } from '../contexts';
import { LoginErrorBoundary, AuthTabs } from '../components/auth';

const Login: React.FC = () => {
  // Ensure React is available before using hooks
  if (typeof React === 'undefined' || typeof React.useState !== 'function') {
    console.error('React is not properly loaded in Login component');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="p-6 bg-white rounded shadow">
          <h1 className="text-xl font-bold">Erro ao carregar</h1>
          <p>Não foi possível inicializar a página de login. Por favor, atualize a página.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }
  
  const navigate = useNavigate();
  
  // Get auth context with enhanced defensive coding
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated || false;

  // Added error handling to useEffect
  useEffect(() => {
    // Wrap in try/catch to prevent unhandled exceptions
    try {
      // Check if user is already authenticated
      if (isAuthenticated) {
        navigate('/app');
      }
    } catch (error) {
      console.error('Error in authentication redirect:', error);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="https://i.postimg.cc/K8MMNVLZ/Mazul-1.png" 
              alt="Mazul Logo" 
              className="h-12"
              onError={(e) => {
                console.error('Failed to load logo image');
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <CardDescription>O Pomodoro simples feito para mentes criativas</CardDescription>
        </CardHeader>
        
        <AuthTabs />
      </Card>
    </div>
  );
};

// Wrap the Login component with the error boundary for better error handling
const LoginWithErrorBoundary: React.FC = () => {
  // Additional check for React availability
  if (typeof React === 'undefined') {
    console.error('React is not defined in LoginWithErrorBoundary');
    return <div>Erro ao carregar. Por favor, atualize a página.</div>;
  }

  return (
    <LoginErrorBoundary>
      <Login />
    </LoginErrorBoundary>
  );
};

export default LoginWithErrorBoundary;
