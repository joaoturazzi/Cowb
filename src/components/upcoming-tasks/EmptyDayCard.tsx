
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
    <div className="text-center py-10 px-3 bg-muted/5 rounded-lg border border-muted/20">
      <div className="bg-muted/15 rounded-full w-16 h-16 mb-4 flex items-center justify-center mx-auto">
        <Calendar className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <p className="text-muted-foreground mb-4 text-base">Não há tarefas para este dia</p>
      <Button 
        variant="default" 
        className="mt-1 bg-primary/80 hover:bg-primary px-5 py-2 text-sm"
        onClick={() => onAddTask(formattedDate)}
      >
        Adicionar Tarefa <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
};

export default EmptyDayCard;
