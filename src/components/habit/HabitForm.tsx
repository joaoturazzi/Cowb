
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Habit } from '@/contexts/habit/habitTypes';
import { useHabit } from '@/contexts/habit/HabitContext';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { habitFormSchema, HabitFormData } from './form/HabitFormTypes';
import BasicHabitFields from './form/BasicHabitFields';
import HabitFormTabs from './form/HabitFormTabs';

interface HabitFormProps {
  onSuccess?: () => void;
  initialData?: Habit;
}

const HabitForm: React.FC<HabitFormProps> = ({ onSuccess, initialData }) => {
  const { createHabit, updateHabit } = useHabit();
  const { toast } = useToast();
  const isEditing = !!initialData;
  
  const form = useForm<HabitFormData>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description || null,
      color: initialData.color,
      frequency_type: initialData.frequency_type,
      frequency_days: initialData.frequency_days,
    } : {
      name: '',
      description: null,
      color: '#9b87f5',
      frequency_type: 'daily',
      frequency_days: [0, 1, 2, 3, 4, 5, 6],
    }
  });
  
  const onSubmit = async (data: HabitFormData) => {
    try {
      // Ensure we're passing the required properties with their correct types
      const habitData: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'active'> = {
        name: data.name,
        description: data.description,
        color: data.color,
        frequency_type: data.frequency_type,
        frequency_days: data.frequency_days,
      };
      
      if (isEditing && initialData) {
        await updateHabit(initialData.id, habitData);
        toast({
          title: "Hábito atualizado",
          description: "O hábito foi atualizado com sucesso",
          variant: "success",
        });
      } else {
        await createHabit(habitData);
        toast({
          title: "Hábito criado",
          description: "O novo hábito foi criado com sucesso",
          variant: "success",
        });
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error saving habit:', error);
      toast({
        title: "Erro ao salvar hábito",
        description: "Não foi possível salvar o hábito",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicHabitFields form={form} />
        <HabitFormTabs form={form} />
        
        <div className="flex justify-end">
          <Button type="submit" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            {isEditing ? 'Salvar alterações' : 'Criar hábito'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HabitForm;
