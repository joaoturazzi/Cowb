
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface TaskListAuthProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
  onLogin: () => void;
}

const TaskListAuth: React.FC<TaskListAuthProps> = ({ 
  isAuthenticated, 
  children, 
  onLogin 
}) => {
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center rounded-lg border border-dashed border-muted-foreground/20 bg-muted/5">
        <div className="p-3 rounded-full bg-muted/30 mb-4">
          <LogIn className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground mb-6">Faça login para visualizar e gerenciar suas tarefas</p>
        <Button 
          onClick={onLogin}
          className="transition-all hover:scale-105"
          aria-label="Fazer login para acessar suas tarefas"
        >
          Fazer Login
        </Button>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default TaskListAuth;
