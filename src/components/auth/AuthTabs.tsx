
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { sonnerToast as toast } from '@/components/ui';
import { motion } from 'framer-motion';

// Add defensive check for React
if (typeof React === 'undefined' || typeof React.useState !== 'function') {
  console.error('React is not defined or React.useState is not a function in AuthTabs');
}

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const AuthTabs: React.FC = () => {
  // Double-check React availability
  if (typeof React === 'undefined' || typeof React.useState !== 'function') {
    console.error('React is not properly loaded in AuthTabs');
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 font-bold mb-2">Erro ao carregar componente</div>
        <p className="text-sm">Não foi possível inicializar o React. Por favor, recarregue a página.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Recarregar
        </button>
      </div>
    );
  }

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
      <TabsList className="grid grid-cols-2 w-full mb-6">
        <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Login</TabsTrigger>
        <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Cadastro</TabsTrigger>
      </TabsList>
      
      <motion.div
        key={activeTab}
        initial="hidden"
        animate="visible"
        variants={tabVariants}
      >
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignupForm />
        </TabsContent>
      </motion.div>
    </Tabs>
  );
};

export default AuthTabs;
