
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Calendar } from 'lucide-react';

const EmptyTasksAlert: React.FC = () => {
  return (
    <Alert className="bg-muted/20 border-muted">
      <Calendar className="h-4 w-4" />
      <AlertTitle>Nenhuma tarefa</AlertTitle>
      <AlertDescription>
        Você não tem tarefas para este dia. Adicione uma nova tarefa para começar.
      </AlertDescription>
    </Alert>
  );
};

export default EmptyTasksAlert;
