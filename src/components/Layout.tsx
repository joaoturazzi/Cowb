
import React from 'react';
import { Moon, Sun, Clock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '../contexts/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode, toggleDarkMode } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-4 flex justify-end">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleDarkMode}
          className="rounded-full h-9 w-9"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </header>
      
      <main className="container max-w-md px-4">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 px-4">
        <div className="container max-w-md mx-auto flex justify-around">
          <Button 
            variant={location.pathname === '/' ? "default" : "ghost"} 
            className="flex-1 flex flex-col items-center py-1.5 h-auto"
            onClick={() => navigate('/')}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs">Início</span>
          </Button>
          <Button 
            variant={location.pathname === '/summary' ? "default" : "ghost"} 
            className="flex-1 flex flex-col items-center py-1.5 h-auto"
            onClick={() => navigate('/summary')}
          >
            <Clock className="h-5 w-5 mb-1" />
            <span className="text-xs">Resumo</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
