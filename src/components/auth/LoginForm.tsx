
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { sonnerToast as toast } from '@/components/ui';
import { useAuth } from '../../contexts';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      try {
        toast.success("Login bem-sucedido", {
          description: "Você foi autenticado com sucesso!"
        });
      } catch (toastError) {
        console.error("Toast error:", toastError);
      }
      
      setIsAuthenticated(true);
      navigate('/app');
    } catch (error: any) {
      try {
        toast.error("Erro ao fazer login", {
          description: error.message || "Não foi possível fazer login. Verifique suas credenciais."
        });
      } catch (toastError) {
        console.error("Toast error:", toastError);
        // Fallback to alert if toast fails
        alert(`Erro ao fazer login: ${error.message || "Verifique suas credenciais."}`);
      }
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </CardFooter>
    </form>
  );
};

export default LoginForm;
