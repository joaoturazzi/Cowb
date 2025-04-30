
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

interface UpcomingTasksHeaderProps {
  onAddTask: (date: string) => void;
  selectedDay: string;
}

const UpcomingTasksHeader: React.FC<UpcomingTasksHeaderProps> = ({ onAddTask, selectedDay }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 animate-fade-in gap-4">
      <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-primary">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <span>Tarefas dos Próximos Dias</span>
      </h2>
      <Button 
        onClick={() => onAddTask(selectedDay)}
        size="sm"
        className="transition-all duration-300 hover:scale-105 bg-primary hover:bg-primary/90 text-white px-6"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nova Tarefa
      </Button>
    </div>
  );
};

export default UpcomingTasksHeader;
