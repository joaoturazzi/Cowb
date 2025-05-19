
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyTasksAlertProps {
  onAddTask?: () => void;
}

const EmptyTasksAlert: React.FC<EmptyTasksAlertProps> = ({ onAddTask }) => {
  return (
    <Alert className="bg-muted/10 border-muted/30 shadow-sm animate-fade-in">
      <div className="flex items-start">
        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
        <div className="ml-2 flex-1">
          <AlertTitle className="text-sm font-medium">Sem tarefas</AlertTitle>
          <AlertDescription className="text-muted-foreground text-xs mt-1">
            Você não tem nenhuma tarefa para este dia.
          </AlertDescription>
        </div>
      </div>
      
      {onAddTask && (
        <div className="mt-3">
          <Button 
            onClick={onAddTask} 
            variant="outline" 
            size="sm" 
            className="w-full border-dashed border-muted-foreground/40 hover:border-primary/50 group"
          >
            <Plus className="h-3 w-3 mr-1 transition-transform group-hover:scale-110" />
            <span className="text-xs">Adicionar tarefa</span>
          </Button>
        </div>
      )}
    </Alert>
  );
};

export default EmptyTasksAlert;
