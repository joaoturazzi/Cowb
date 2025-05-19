import React from 'react';
import { Moon, Sun, Clock, Home, Calendar, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, useTheme } from '../contexts';
import { useLocation, useNavigate } from 'react-router-dom';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const {
    isDarkMode,
    toggleDarkMode
  } = useTheme();
  const {
    isAuthenticated,
    signOut
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return <div className="min-h-screen bg-background pb-20">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="https://i.postimg.cc/K8MMNVLZ/Mazul-1.png" alt="Mazul Logo" className="h-8 mr-2" />
        </div>
        <div className="flex gap-2">
          {isAuthenticated && <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground flex items-center gap-1">
              <LogOut className="h-4 w-4" /> Sair
            </Button>}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full h-9 w-9">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>
      
      <main className="container max-w-md px-0">
        {children}
      </main>

      {isAuthenticated && <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 px-4">
          <div className="container max-w-md mx-auto flex justify-around">
            <Button variant={location.pathname === '/' ? "default" : "ghost"} className="flex-1 flex flex-col items-center py-1.5 h-auto" onClick={() => navigate('/')}>
              <Home className="h-5 w-5 mb-1" />
              <span className="text-xs">Início</span>
            </Button>
            <Button variant={location.pathname === '/upcoming' ? "default" : "ghost"} className="flex-1 flex flex-col items-center py-1.5 h-auto" onClick={() => navigate('/upcoming')}>
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-xs">Próximos</span>
            </Button>
            <Button variant={location.pathname === '/summary' ? "default" : "ghost"} className="flex-1 flex flex-col items-center py-1.5 h-auto" onClick={() => navigate('/summary')}>
              <Clock className="h-5 w-5 mb-1" />
              <span className="text-xs">Resumo</span>
            </Button>
          </div>
        </nav>}
    </div>;
};
export default Layout;