import React, { useState, useEffect } from 'react';
import { useTasks, useAuth } from '../contexts';
import { Task, Priority } from '../contexts/task/taskTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { FormControl, FormField, FormItem, FormLabel, Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TagSelector from './tag/TagSelector';
import CreateTagDialog from './tag/CreateTagDialog';
import RecurrenceSelector from './task/recurrence';
import { fetchTags, createTag, getTaskTags, assignTagsToTask } from '@/contexts/task/services/tagService';
import { Tag } from '@/contexts/task/types/tagTypes';
import { Loader2 } from 'lucide-react';

interface EditTaskSheetProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

// Create form schema
const formSchema = z.object({
  name: z.string().min(1, "Nome da tarefa é obrigatório"),
  estimatedTime: z.number().min(1, "Tempo estimado deve ser pelo menos 1 minuto"),
  priority: z.enum(['low', 'medium', 'high']),
});

type FormValues = z.infer<typeof formSchema>;

const EditTaskSheet: React.FC<EditTaskSheetProps> = ({ task, isOpen, onClose }) => {
  const { updateTask } = useTasks();
  const { user } = useAuth();
  const [isTagLoading, setIsTagLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isShowingCreateTag, setIsShowingCreateTag] = useState(false);
  const [recurrenceOptions, setRecurrenceOptions] = useState({
    enabled: !!task.recurrence_type,
    type: task.recurrence_type as 'daily' | 'weekly' | 'monthly' || 'daily',
    interval: task.recurrence_interval || 1,
    endDate: task.recurrence_end_date ? new Date(task.recurrence_end_date) : null
  });
  
  const defaultValues: FormValues = {
    name: task.name,
    estimatedTime: task.estimatedTime,
    priority: task.priority,
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Carregar tags disponíveis
  useEffect(() => {
    if (isOpen && user) {
      const loadTags = async () => {
        setIsTagLoading(true);
        try {
          // Buscar todas as tags
          const tags = await fetchTags(user.id);
          setAvailableTags(tags);
          
          // Buscar tags da tarefa
          const taskTags = await getTaskTags(task.id);
          setSelectedTags(taskTags);
        } catch (error) {
          console.error('Erro ao carregar tags:', error);
        } finally {
          setIsTagLoading(false);
        }
      };
      
      loadTags();
    }
  }, [isOpen, user, task.id]);
  
  const handleCreateTag = async (name: string, color: string) => {
    if (!user) return;
    
    try {
      const newTag = await createTag({
        name,
        color,
        user_id: user.id
      });
      
      setAvailableTags([...availableTags, newTag]);
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      throw error;
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      // Atualizar a tarefa - FIXED: only pass one argument to updateTask
      const updatedTask = await updateTask({
        ...task,
        name: values.name,
        estimatedTime: values.estimatedTime,
        priority: values.priority,
      });
      
      // Salvar recorrência
      if (recurrenceOptions.enabled) {
        // FIXED: only pass one argument to updateTask
        await updateTask({
          ...task,
          name: values.name,
          estimatedTime: values.estimatedTime,
          priority: values.priority,
          recurrence_type: recurrenceOptions.type,
          recurrence_interval: recurrenceOptions.interval,
          recurrence_end_date: recurrenceOptions.endDate?.toISOString() || null
        });
      }
      
      // Salvar tags
      if (selectedTags.length > 0) {
        await assignTagsToTask(task.id, selectedTags.map(tag => tag.id));
      }
      
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const minuteValues = [5, 10, 15, 20, 25, 30, 45, 60, 90, 120];
  const [sliderValue, setSliderValue] = useState(
    minuteValues.indexOf(task.estimatedTime) !== -1 
      ? [minuteValues.indexOf(task.estimatedTime)] 
      : [minuteValues.findIndex(v => v >= task.estimatedTime) || 0]
  );

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    form.setValue('estimatedTime', minuteValues[value[0]]);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Editar Tarefa</SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-6">
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
              
              <FormItem>
                <FormLabel>Tempo Estimado: {minuteValues[sliderValue[0]]} minutos</FormLabel>
                <Slider
                  value={sliderValue}
                  max={minuteValues.length - 1}
                  step={1}
                  onValueChange={handleSliderChange}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5min</span>
                  <span>2h</span>
                </div>
              </FormItem>
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant={field.value === 'low' ? 'default' : 'outline'}
                        className={field.value === 'low' ? 'bg-green-600 hover:bg-green-700' : ''}
                        onClick={() => form.setValue('priority', 'low')}
                      >
                        Baixa
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === 'medium' ? 'default' : 'outline'}
                        className={field.value === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                        onClick={() => form.setValue('priority', 'medium')}
                      >
                        Média
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === 'high' ? 'default' : 'outline'}
                        className={field.value === 'high' ? 'bg-red-600 hover:bg-red-700' : ''}
                        onClick={() => form.setValue('priority', 'high')}
                      >
                        Alta
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
              
              {isTagLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <TagSelector
                  selectedTags={selectedTags}
                  availableTags={availableTags}
                  onTagsChange={setSelectedTags}
                  onCreateTagClick={() => setIsShowingCreateTag(true)}
                />
              )}
              
              <RecurrenceSelector 
                value={recurrenceOptions}
                onChange={setRecurrenceOptions}
              />
              
              <SheetFooter className="pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
      
      <CreateTagDialog 
        isOpen={isShowingCreateTag}
        onClose={() => setIsShowingCreateTag(false)}
        onCreateTag={handleCreateTag}
      />
    </>
  );
};

export default EditTaskSheet;
