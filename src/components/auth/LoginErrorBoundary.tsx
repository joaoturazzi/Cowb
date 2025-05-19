
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LoginErrorBoundaryProps {
  children: React.ReactNode;
}

const LoginErrorBoundary: React.FC<LoginErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Reset error state on mount
    setHasError(false);
  }, []);
  
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Erro na tela de Login</CardTitle>
            <CardDescription>
              Ocorreu um erro ao carregar a tela de login. Por favor, tente novamente.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => window.location.reload()}
            >
              Recarregar página
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Error in LoginErrorBoundary:', error);
    setHasError(true);
    return null;
  }
};

export default LoginErrorBoundary;
