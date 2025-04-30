
import React from 'react';
import { Button } from '@/components/ui/button';

interface UpcomingTasksHeaderProps {
  onAddTask: (date: string) => void;
  selectedDay: string;
}

const UpcomingTasksHeader: React.FC<UpcomingTasksHeaderProps> = ({ onAddTask, selectedDay }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Tarefas dos Próximos Dias</h2>
      <Button 
        onClick={() => onAddTask(selectedDay)}
        size="sm"
      >
        Nova Tarefa
      </Button>
    </div>
  );
};

export default UpcomingTasksHeader;
