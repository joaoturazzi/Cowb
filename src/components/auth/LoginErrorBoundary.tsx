
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class LoginErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error in LoginErrorBoundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
    
    try {
      toast.error("Erro na tela de login", {
        description: "Ocorreu um erro ao carregar a página de login."
      });
    } catch (toastError) {
      console.error("Failed to display toast:", toastError);
    }
  }

  handleReload = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Erro na tela de Login</CardTitle>
              <CardDescription>
                Ocorreu um erro ao carregar a tela de login. Por favor, tente novamente.
                {this.state.error && (
                  <p className="text-xs text-red-500 mt-2">
                    {this.state.error.toString()}
                  </p>
                )}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={this.handleReload}
              >
                Recarregar página
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default LoginErrorBoundary;
