
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Priority } from '@/contexts/task/taskTypes';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TaskPrioritySelector from './TaskPrioritySelector';
import TaskTimeSlider from './TaskTimeSlider';

// Create form schema
const formSchema = z.object({
  name: z.string().min(1, "Nome da tarefa é obrigatório"),
  estimatedTime: z.number().min(1, "Tempo estimado deve ser pelo menos 1 minuto"),
  priority: z.enum(['low', 'medium', 'high']),
});

export type TaskFormValues = z.infer<typeof formSchema>;

interface TaskEditFormProps {
  defaultValues: TaskFormValues;
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const TaskEditForm: React.FC<TaskEditFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Tarefa</FormLabel>
              <FormControl>
                <Input placeholder="Nome da tarefa" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <TaskTimeSlider 
          value={form.watch('estimatedTime')}
          onChange={(value) => form.setValue('estimatedTime', value)}
        />
        
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <TaskPrioritySelector 
              value={field.value} 
              onChange={(priority) => form.setValue('priority', priority)} 
            />
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskEditForm;
