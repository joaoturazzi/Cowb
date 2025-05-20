
import React from 'react';
import { Priority } from '@/contexts/task/taskTypes';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

interface TaskPrioritySelectorProps {
  value: Priority;
  onChange: (priority: Priority) => void;
}

const TaskPrioritySelector: React.FC<TaskPrioritySelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <FormItem>
      <FormLabel>Prioridade</FormLabel>
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant={value === 'low' ? 'default' : 'outline'}
          className={value === 'low' ? 'bg-green-600 hover:bg-green-700' : ''}
          onClick={() => onChange('low')}
        >
          Baixa
        </Button>
        <Button
          type="button"
          variant={value === 'medium' ? 'default' : 'outline'}
          className={value === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
          onClick={() => onChange('medium')}
        >
          Média
        </Button>
        <Button
          type="button"
          variant={value === 'high' ? 'default' : 'outline'}
          className={value === 'high' ? 'bg-red-600 hover:bg-red-700' : ''}
          onClick={() => onChange('high')}
        >
          Alta
        </Button>
      </div>
    </FormItem>
  );
};

export default TaskPrioritySelector;
