
import React from 'react';
import { Button } from '@/components/ui/button';

interface TaskListAuthProps {
  isAuthenticated: boolean;
  onLogin: () => void;
}

const TaskListAuth: React.FC<TaskListAuthProps> = ({ isAuthenticated, onLogin, children }) => {
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground mb-4">Faça login para visualizar e gerenciar suas tarefas</p>
        <Button onClick={onLogin}>Fazer Login</Button>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default TaskListAuth;
