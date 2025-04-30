
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpcomingTasksHeaderProps {
  onAddTask: (date: string) => void;
  selectedDay: string;
}

const UpcomingTasksHeader: React.FC<UpcomingTasksHeaderProps> = ({ onAddTask, selectedDay }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-4 sm:mb-0">
        <div className="bg-primary/10 p-3 rounded-xl shadow-sm">
          <Calendar className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">
            Tarefas dos Próximos Dias
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Visualize e gerencie suas tarefas para os próximos dias
          </p>
        </div>
      </div>
      <Button 
        onClick={() => onAddTask(selectedDay)}
        size="default"
        className="transition-all duration-300 hover:scale-105 bg-primary hover:bg-primary/90 text-white px-6 shadow-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nova Tarefa
      </Button>
    </div>
  );
};

export default UpcomingTasksHeader;
