
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardDescription } from '@/components/ui/card';
import { useAuth } from '../contexts';
import { LoginErrorBoundary, AuthTabs } from '../components/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get auth context
  const auth = useAuth();
  const { isAuthenticated, isLoading } = auth;

  useEffect(() => {
    // Only redirect if authenticated and not loading
    if (isAuthenticated && !isLoading) {
      // Extract the target path from the hash if it exists
      const hashPath = window.location.hash.substring(1) || '/';
      
      console.log("Authenticated user detected in Login. Redirecting to:", hashPath);
      
      // Redirect to the hash path or home using replace to avoid history stack issues
      navigate(hashPath, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

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
  return (
    <LoginErrorBoundary>
      <Login />
    </LoginErrorBoundary>
  );
};

export default LoginWithErrorBoundary;
