
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { sonnerToast as toast } from '@/components/ui';

const AuthTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("login");

  // Safely handle tab changes
  const handleTabChange = (value: string) => {
    try {
      setActiveTab(value);
    } catch (error) {
      console.error('Error changing auth tabs:', error);
      toast.error('Erro ao mudar de aba', {
        description: 'Ocorreu um erro ao trocar entre login e cadastro.'
      });
    }
  };

  return (
    <Tabs 
      defaultValue="login" 
      value={activeTab} 
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Cadastro</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>
      
      <TabsContent value="signup">
        <SignupForm />
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;
