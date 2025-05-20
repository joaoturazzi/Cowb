
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/components/ui';
import { useAuth } from '../../contexts';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Github, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Schema for login validation
const loginSchema = z.object({
  email: z.string()
    .email('Por favor, insira um email válido')
    .min(5, 'Email muito curto')
    .max(255, 'Email muito longo'),
  password: z.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(72, 'A senha é muito longa'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
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
      rememberMe: false,
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
      navigate('/app');
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

  const handleResetPassword = async (email: string) => {
    if (!email || loading) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/#/reset-password',
      });
      
      if (error) throw error;
      
      toast.success("Email enviado", {
        description: "Verifique sua caixa de entrada para redefinir sua senha."
      });
      
      setForgotPassword(false);
    } catch (error: any) {
      toast.error("Erro ao enviar email", {
        description: error.message || "Não foi possível enviar o email de redefinição."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/#/app',
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      toast.error("Erro ao fazer login social", {
        description: error.message || "Não foi possível autenticar com provedor social."
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)}>
        <CardContent className="space-y-4 pt-4">
          {forgotPassword ? (
            <>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Recuperar senha</h3>
                <p className="text-sm text-muted-foreground">
                  Digite seu email para receber instruções de recuperação de senha.
                </p>
              </div>
              
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
              
              <div className="flex justify-between pt-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setForgotPassword(false)}
                >
                  Voltar para login
                </Button>
                <Button 
                  type="button" 
                  onClick={() => handleResetPassword(form.getValues('email'))}
                  disabled={loading || !form.getValues('email')}
                >
                  {loading ? 'Enviando...' : 'Enviar'}
                </Button>
              </div>
            </>
          ) : (
            <>
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
                        className="h-10"
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
                    <div className="flex justify-between items-center">
                      <FormLabel>Senha</FormLabel>
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-xs font-normal"
                        onClick={() => setForgotPassword(true)}
                      >
                        Esqueceu a senha?
                      </Button>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Sua senha"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      Lembrar-me
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full h-10" 
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-2 text-xs text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10"
                  onClick={() => handleSocialLogin('google')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Google
                </Button>
                
                <Button
                  type="button" 
                  variant="outline"
                  className="h-10"
                  onClick={() => handleSocialLogin('github')}
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </form>
    </Form>
  );
};

export default LoginForm;
