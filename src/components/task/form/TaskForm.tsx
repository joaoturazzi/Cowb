
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTask } from '@/contexts';
import TaskFormHeader from './TaskFormHeader';
import TaskNameField from './TaskNameField';
import TaskDateField from './TaskDateField';
import TaskTimeField from './TaskTimeField';
import TaskPriorityField from './TaskPriorityField';
import { Priority } from '@/contexts/task/taskTypes';
import RecurrenceSelector from '../recurrence';
import { RecurrenceOptions } from '../recurrence/types';
import { format } from '@/utils/dateUtils';

interface TaskFormProps {
  mode: 'create' | 'edit';
  taskId?: string;
  selectedDate?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ mode, taskId, selectedDate }) => {
  const navigate = useNavigate();
  const { addTask } = useTask();
  
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date>(() => {
    if (selectedDate) {
      return new Date(selectedDate);
    }
    return new Date();
  });
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [priority, setPriority] = useState<Priority>('medium');
  const [recurrenceOptions, setRecurrenceOptions] = useState<RecurrenceOptions>({
    enabled: false,
    type: 'daily',
    interval: 1,
    endDate: null
  });
  
  // Update date if selectedDate prop changes
  useEffect(() => {
    if (selectedDate) {
      setDate(new Date(selectedDate));
    }
  }, [selectedDate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!name.trim()) {
        return;
      }

      const formattedDate = format(date, 'yyyy-MM-dd');

      // Pass only the properties that match the expected type in addTask
      await addTask({
        name,
        target_date: formattedDate,
        estimatedTime,
        priority,
        recurrence_type: recurrenceOptions.enabled ? recurrenceOptions.type : null,
        recurrence_interval: recurrenceOptions.enabled ? recurrenceOptions.interval : null,
        recurrence_end_date: recurrenceOptions.endDate ? format(recurrenceOptions.endDate, 'yyyy-MM-dd') : null
      });

      navigate(-1);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  
  return (
    <div>
      <TaskFormHeader title={mode === 'create' ? 'Nova Tarefa' : 'Editar Tarefa'} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <TaskNameField name={name} setName={setName} />
        
        <TaskDateField date={date} setDate={setDate} />
        
        <TaskTimeField 
          estimatedTime={estimatedTime}
          setEstimatedTime={setEstimatedTime}
        />
        
        <TaskPriorityField 
          priority={priority}
          setPriority={setPriority}
        />
        
        <div className="pt-4">
          <RecurrenceSelector 
            value={recurrenceOptions}
            onChange={setRecurrenceOptions}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>
          <Button type="submit">
            {mode === 'create' ? 'Criar Tarefa' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
