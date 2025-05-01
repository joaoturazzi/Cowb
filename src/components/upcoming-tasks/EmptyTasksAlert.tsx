
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyTasksAlertProps {
  onAddTask?: () => void;
}

const EmptyTasksAlert: React.FC<EmptyTasksAlertProps> = ({ onAddTask }) => {
  return (
    <Alert className="bg-muted/20 border-muted shadow-sm animate-fade-in">
      <div className="flex items-start">
        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div className="ml-2 flex-1">
          <AlertTitle className="text-base">Nenhuma tarefa</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Você não tem tarefas para este dia. Adicione uma nova tarefa para começar.
          </AlertDescription>
        </div>
      </div>
      
      {onAddTask && (
        <div className="mt-3">
          <Button 
            onClick={onAddTask} 
            variant="outline" 
            size="sm" 
            className="w-full border-dashed border-muted-foreground/50 hover:border-primary/50 group"
          >
            <Plus className="h-4 w-4 mr-1 transition-transform group-hover:scale-110" />
            <span>Adicionar nova tarefa</span>
          </Button>
        </div>
      )}
    </Alert>
  );
};

export default EmptyTasksAlert;
