
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { sonnerToast as toast } from '@/components/ui';
import { useAuth } from '../../contexts';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// Schema for login validation
const loginSchema = z.object({
  email: z.string()
    .email('Por favor, insira um email válido')
    .min(5, 'Email muito curto')
    .max(255, 'Email muito longo'),
  password: z.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(72, 'A senha é muito longa'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Safely access the auth context
  const auth = useAuth();
  const setIsAuthenticated = auth?.setIsAuthenticated || (() => {});

  // Initialize form with validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
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
      
      // Get the redirect path from hash or default to home
      const hashPath = window.location.hash.substring(1) || '/';
      navigate(hashPath, { replace: true });
    } catch (error: any) {
      try {
        const errorMessage = error.message || "Não foi possível fazer login. Verifique suas credenciais.";
        
        // More user-friendly error messages
        let friendlyMessage = errorMessage;
        if (errorMessage.includes("Invalid login")) {
          friendlyMessage = "Email ou senha incorretos. Por favor, tente novamente.";
        } else if (errorMessage.includes("Email not confirmed")) {
          friendlyMessage = "Por favor, confirme seu email antes de fazer login.";
        }
        
        toast.error("Erro ao fazer login", {
          description: friendlyMessage
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)}>
        <CardContent className="space-y-4 pt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Sua senha"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
    </Form>
  );
};

export default LoginForm;
