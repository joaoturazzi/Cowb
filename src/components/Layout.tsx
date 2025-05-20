
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Clock, Home, Calendar, LogOut, CheckCircle2, Settings, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, useTheme } from '../contexts';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { isAuthenticated, signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isPageChanging, setIsPageChanging] = useState(false);
  
  // Handle page transition effects
  useEffect(() => {
    setIsPageChanging(true);
    const timer = setTimeout(() => {
      setIsPageChanging(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      setIsPageChanging(true);
      await signOut();
      navigate('/landing');
    } catch (error) {
      console.error('Error signing out:', error);
      setIsPageChanging(false);
    }
  };
  
  // Get user's first name for greeting
  const getUserFirstName = () => {
    if (!user?.email) return '';
    
    // First try to get name before @ in email
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };

  return (
    <div className="min-h-screen bg-background pb-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <header className="sticky top-0 z-10 p-4 flex justify-between items-center backdrop-blur-md bg-background/80 border-b border-border/40">
        <div className="flex items-center">
          <img 
            src="https://i.postimg.cc/K8MMNVLZ/Mazul-1.png" 
            alt="Cowb Logo" 
            className="h-8 mr-2"
            onClick={() => navigate('/app')}
            style={{ cursor: 'pointer' }}
          />
          
          {isAuthenticated && user && (
            <div className="ml-2 hidden sm:block">
              <span className="text-sm text-muted-foreground">Olá, {getUserFirstName()}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/settings')} 
                className="rounded-full h-8 w-8"
                title="Configurações"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut} 
                className="text-muted-foreground h-8 hidden sm:flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" /> Sair
              </Button>
            </>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode} 
            className="rounded-full h-8 w-8"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>
      
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="container max-w-md px-4 py-4"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {isAuthenticated && (
        <nav className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border/40 py-2 px-4 z-10">
          <div className="container max-w-md mx-auto">
            <div className="flex justify-around">
              <Button 
                variant={location.pathname === '/app' ? "default" : "ghost"} 
                size="icon"
                className={cn(
                  "flex flex-col items-center h-auto py-1.5 w-16 rounded-lg",
                  location.pathname === '/app' && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                )}
                onClick={() => navigate('/app')}
              >
                <Home className="h-5 w-5 mb-1" />
                <span className="text-xs">Início</span>
              </Button>
              
              <Button 
                variant={location.pathname === '/dashboard' ? "default" : "ghost"} 
                size="icon"
                className={cn(
                  "flex flex-col items-center h-auto py-1.5 w-16 rounded-lg",
                  location.pathname === '/dashboard' && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                )}
                onClick={() => navigate('/dashboard')}
              >
                <LayoutDashboard className="h-5 w-5 mb-1" />
                <span className="text-xs">Dashboard</span>
              </Button>
              
              <Button 
                variant={location.pathname === '/habits' ? "default" : "ghost"} 
                size="icon"
                className={cn(
                  "flex flex-col items-center h-auto py-1.5 w-16 rounded-lg",
                  location.pathname === '/habits' && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                )}
                onClick={() => navigate('/habits')}
              >
                <CheckCircle2 className="h-5 w-5 mb-1" />
                <span className="text-xs">Hábitos</span>
              </Button>
              
              <Button 
                variant={location.pathname === '/upcoming' ? "default" : "ghost"} 
                size="icon"
                className={cn(
                  "flex flex-col items-center h-auto py-1.5 w-16 rounded-lg",
                  location.pathname === '/upcoming' && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                )}
                onClick={() => navigate('/upcoming')}
              >
                <Calendar className="h-5 w-5 mb-1" />
                <span className="text-xs">Tarefas</span>
              </Button>
              
              <Button 
                variant={location.pathname === '/summary' ? "default" : "ghost"} 
                size="icon"
                className={cn(
                  "flex flex-col items-center h-auto py-1.5 w-16 rounded-lg",
                  location.pathname === '/summary' && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                )}
                onClick={() => navigate('/summary')}
              >
                <Clock className="h-5 w-5 mb-1" />
                <span className="text-xs">Resumo</span>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
