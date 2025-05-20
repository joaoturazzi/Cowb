
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <header className="py-4 px-6 flex justify-between items-center max-w-7xl mx-auto">
      <div className="flex items-center">
        <img 
          src="https://i.postimg.cc/K8MMNVLZ/Mazul-1.png" 
          alt="Mazul Logo" 
          className="h-10"
        />
      </div>
      <div className="flex gap-4">
        {isAuthenticated ? (
          <Button onClick={() => navigate('/')} variant="default">
            Ir para o App
          </Button>
        ) : (
          <>
            <Button onClick={() => navigate('/login')} variant="ghost">
              Entrar
            </Button>
            <Button onClick={() => navigate('/login')} variant="default">
              Começar agora
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
