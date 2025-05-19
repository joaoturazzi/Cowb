
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardDescription } from '@/components/ui/card';
import { useAuth } from '../contexts';
import { LoginErrorBoundary, AuthTabs } from '../components/auth';

const Login: React.FC = () => {
  // Guard against React not being available
  if (!React || typeof React.useState !== 'function') {
    console.error('React is not available');
    return <div>Error loading the login page. Please refresh.</div>;
  }
  
  const navigate = useNavigate();
  
  // Get auth context with defensive coding
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated || false;

  useEffect(() => {
    try {
      // Check if user is already authenticated
      if (isAuthenticated) {
        navigate('/app');
      }
    } catch (error) {
      console.error('Error in authentication check:', error);
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
            />
          </div>
          <CardDescription>O Pomodoro simples feito para mentes criativas</CardDescription>
        </CardHeader>
        
        <AuthTabs />
      </Card>
    </div>
  );
};

// Wrap the Login component with the error boundary
const LoginWithErrorBoundary: React.FC = () => {
  return (
    <LoginErrorBoundary>
      <Login />
    </LoginErrorBoundary>
  );
};

export default LoginWithErrorBoundary;
