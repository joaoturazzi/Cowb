
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TaskListHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-medium">Tarefas de hoje</h2>
      <Button 
        onClick={() => navigate('/add-task')} 
        variant="ghost" 
        size="sm"
        className="flex items-center gap-1 hover:bg-secondary"
      >
        <Plus className="h-4 w-4" /> Nova
      </Button>
    </div>
  );
};

export default TaskListHeader;
