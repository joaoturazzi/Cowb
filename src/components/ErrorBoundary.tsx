
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorCount: 0
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log detailed error info
    console.error("Uncaught error:", error);
    console.error("Component stack:", errorInfo.componentStack);
    
    this.setState(prevState => ({
      errorInfo: errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Only show toast if this is the first error
    if (this.state.errorCount === 0) {
      try {
        toast.error("Ocorreu um erro", {
          description: error.message || "Algo inesperado aconteceu.",
          duration: 5000
        });
      } catch (toastError) {
        console.error("Error showing toast:", toastError);
      }
    }
  }

  public resetError = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
          <Alert variant="destructive" className="mb-4 max-w-lg shadow-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ocorreu um erro</AlertTitle>
            <AlertDescription>
              <div className="space-y-2">
                <p>{this.state.error?.message || 'Algo inesperado aconteceu.'}</p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-sm cursor-pointer">Detalhes técnicos</summary>
                    <pre className="text-xs p-2 bg-black/10 rounded mt-2 overflow-auto max-h-60">
                      {this.state.error?.toString()}
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button 
              onClick={this.resetError}
              className="flex items-center gap-2"
              variant="default"
            >
              <RefreshCcw className="h-4 w-4" />
              Tentar novamente
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Voltar para a página inicial
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
