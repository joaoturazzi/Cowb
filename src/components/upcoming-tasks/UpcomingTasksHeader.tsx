
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
        <div className="bg-primary/10 p-2.5 rounded-lg transition-all group-hover:bg-primary/15">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Próximas Tarefas
          </h2>
          <p className="text-muted-foreground text-sm">
            Organize sua agenda para os próximos dias
          </p>
        </div>
      </div>
      <Button 
        onClick={() => onAddTask(selectedDay)}
        size="sm"
        className="bg-primary hover:bg-primary/90 text-white shadow-sm"
      >
        <Plus className="h-4 w-4 mr-1.5" />
        Nova Tarefa
      </Button>
    </div>
  );
};

export default UpcomingTasksHeader;
