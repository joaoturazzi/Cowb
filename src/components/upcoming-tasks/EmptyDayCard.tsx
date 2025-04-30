
import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EmptyDayCardProps {
  formattedDate: string;
  onAddTask: (date: string) => void;
}

const EmptyDayCard: React.FC<EmptyDayCardProps> = ({
  formattedDate,
  onAddTask
}) => {
  return (
    <div className="text-center py-12 px-4 bg-muted/10 rounded-lg">
      <div className="bg-muted/20 rounded-full w-16 h-16 mb-4 flex items-center justify-center mx-auto">
        <Calendar className="h-8 w-8 text-muted-foreground/70" />
      </div>
      <p className="text-muted-foreground mb-5">Você não tem tarefas para este dia</p>
      <Button 
        variant="default" 
        className="mt-2 bg-primary hover:bg-primary/90"
        onClick={() => onAddTask(formattedDate)}
      >
        Adicionar Tarefa <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
};

export default EmptyDayCard;
