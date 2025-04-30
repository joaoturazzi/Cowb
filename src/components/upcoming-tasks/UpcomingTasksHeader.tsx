
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

interface UpcomingTasksHeaderProps {
  onAddTask: (date: string) => void;
  selectedDay: string;
}

const UpcomingTasksHeader: React.FC<UpcomingTasksHeaderProps> = ({ onAddTask, selectedDay }) => {
  return (
    <div className="flex justify-between items-center mb-6 animate-fade-in">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Calendar className="h-6 w-6 text-primary" />
        <span>Tarefas dos Próximos Dias</span>
      </h2>
      <Button 
        onClick={() => onAddTask(selectedDay)}
        size="sm"
        className="transition-transform hover:scale-105"
      >
        <Plus className="h-4 w-4 mr-1" />
        Nova Tarefa
      </Button>
    </div>
  );
};

export default UpcomingTasksHeader;
