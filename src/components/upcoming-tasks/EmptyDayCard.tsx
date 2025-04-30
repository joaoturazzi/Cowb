
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
    <div className="text-center py-14 px-4 bg-muted/5 rounded-lg border border-muted/30">
      <div className="bg-muted/20 rounded-full w-20 h-20 mb-5 flex items-center justify-center mx-auto">
        <Calendar className="h-10 w-10 text-muted-foreground/70" />
      </div>
      <p className="text-muted-foreground mb-6 text-lg">Você não tem tarefas para este dia</p>
      <Button 
        variant="default" 
        className="mt-2 bg-primary hover:bg-primary/90 px-6 py-5 text-base"
        onClick={() => onAddTask(formattedDate)}
      >
        Adicionar Tarefa <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
};

export default EmptyDayCard;
