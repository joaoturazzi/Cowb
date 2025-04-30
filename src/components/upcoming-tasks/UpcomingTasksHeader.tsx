
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

interface UpcomingTasksHeaderProps {
  onAddTask: (date: string) => void;
  selectedDay: string;
}

const UpcomingTasksHeader: React.FC<UpcomingTasksHeaderProps> = ({ onAddTask, selectedDay }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-0 group">
        <div className="bg-primary/10 p-3 rounded-xl transition-all group-hover:bg-primary/20 duration-300">
          <Calendar className="h-7 w-7 text-primary transition-transform group-hover:scale-110 duration-300" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Próximos Dias
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Visualize e organize suas tarefas futuras
          </p>
        </div>
      </div>
      <Button 
        onClick={() => onAddTask(selectedDay)}
        size="default"
        className="bg-primary hover:bg-primary/90 text-white px-6 transition-all duration-300 hover:translate-y-[-2px] shadow-sm hover:shadow"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nova Tarefa
      </Button>
    </div>
  );
};

export default UpcomingTasksHeader;
