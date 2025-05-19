
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useTask } from '@/contexts';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TaskNameField from './TaskNameField';
import TaskDateField from './TaskDateField';
import TaskTimeField from './TaskTimeField';
import TaskPriorityField from './TaskPriorityField';

interface TaskFormProps {
  selectedDate?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ selectedDate }) => {
  const { addTask } = useTask();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('25');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [targetDate, setTargetDate] = useState<Date>(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe um nome para a tarefa",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await addTask({
        name: name.trim(),
        estimatedTime: parseInt(estimatedTime, 10),
        priority,
        target_date: format(targetDate, 'yyyy-MM-dd')
      });
      
      toast({
        title: "Tarefa adicionada",
        description: "A tarefa foi adicionada com sucesso",
      });
      
      // Go back to the previous screen
      navigate(-1);
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Erro ao adicionar tarefa",
        description: "Não foi possível adicionar a tarefa",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TaskNameField name={name} setName={setName} />
      <TaskDateField targetDate={targetDate} setTargetDate={setTargetDate} />
      <TaskTimeField estimatedTime={estimatedTime} setEstimatedTime={setEstimatedTime} />
      <TaskPriorityField priority={priority} setPriority={setPriority} />
      
      <Button type="submit" className="w-full" size="lg">
        <Plus className="h-4 w-4 mr-2" /> Adicionar tarefa
      </Button>
    </form>
  );
};

export default TaskForm;
