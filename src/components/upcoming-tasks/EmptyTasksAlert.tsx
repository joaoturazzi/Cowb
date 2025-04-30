
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Calendar } from 'lucide-react';

const EmptyTasksAlert: React.FC = () => {
  return (
    <Alert className="bg-muted/20 border-muted shadow-sm">
      <Calendar className="h-5 w-5 text-muted-foreground" />
      <AlertTitle className="text-base">Nenhuma tarefa</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        Você não tem tarefas para este dia. Adicione uma nova tarefa para começar.
      </AlertDescription>
    </Alert>
  );
};

export default EmptyTasksAlert;
