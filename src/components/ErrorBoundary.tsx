
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log detailed error info
    console.error("Uncaught error:", error);
    console.error("Component stack:", errorInfo.componentStack);
    
    this.setState({
      errorInfo: errorInfo
    });
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
          <Alert variant="destructive" className="mb-4 max-w-lg">
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
          
          <Button 
            onClick={this.resetError}
            className="mt-4"
          >
            Tentar novamente
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="mt-2"
          >
            Voltar para a página inicial
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
