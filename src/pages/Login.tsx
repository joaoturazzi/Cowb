
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { useAuth } from '../contexts';
import { LoginErrorBoundary, AuthTabs } from '../components/auth';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Enhanced Login component with animations and improved UI
const Login: React.FC = () => {
  // Guard against React not being available
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
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated || false;

  // Redirect if already authenticated
  useEffect(() => {
    try {
      if (isAuthenticated) {
        navigate('/app');
      }
    } catch (error) {
      console.error('Error in authentication redirect:', error);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95 flex items-center justify-center p-4 relative">
      {/* Back to landing page button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/landing')}
        className="absolute top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        <span>Voltar</span>
      </Button>
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border border-border/50 shadow-lg backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center pb-2">
            <motion.div 
              className="flex justify-center mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img 
                src="https://i.postimg.cc/K8MMNVLZ/Mazul-1.png" 
                alt="Cowb Logo" 
                className="h-16"
                onError={(e) => {
                  console.error('Failed to load logo image');
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <CardDescription className="text-base">O Pomodoro simples feito para mentes criativas</CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent>
            <AuthTabs />
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Ao continuar, você concorda com nossos</p>
              <div className="mt-1">
                <Link to="/terms" className="text-primary hover:underline">Termos de Serviço</Link>
                <span className="mx-1">e</span>
                <Link to="/privacy" className="text-primary hover:underline">Política de Privacidade</Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// Wrap the Login component with the error boundary for better error handling
const LoginWithErrorBoundary: React.FC = () => {
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
