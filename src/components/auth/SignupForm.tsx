
import React, { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { sonnerToast as toast } from '@/components/ui';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      try {
        toast.success("Cadastro realizado", {
          description: "Sua conta foi criada com sucesso! Agora você pode fazer login."
        });
      } catch (toastError) {
        console.error("Toast error:", toastError);
        // Fallback to alert if toast fails
        alert("Cadastro realizado com sucesso! Agora você pode fazer login.");
      }
      
    } catch (error: any) {
      try {
        toast.error("Erro ao criar conta", {
          description: error.message || "Não foi possível criar sua conta. Tente novamente."
        });
      } catch (toastError) {
        console.error("Toast error:", toastError);
        // Fallback to alert if toast fails
        alert(`Erro ao criar conta: ${error.message || "Tente novamente."}`);
      }
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-password">Senha</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="Escolha uma senha"
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
          {loading ? 'Cadastrando...' : 'Criar Conta'}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignupForm;
