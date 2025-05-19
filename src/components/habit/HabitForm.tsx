
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Habit } from '@/contexts/habit/habitTypes';
import { useHabit } from '@/contexts/habit/HabitContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

// Define the form schema with zod
const habitFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor inválida').default('#9b87f5'),
  frequency_type: z.enum(['daily', 'weekly', 'specific_days']).default('daily'),
  frequency_days: z.array(z.number()).default([0, 1, 2, 3, 4, 5, 6]),
});

type HabitFormData = z.infer<typeof habitFormSchema>;

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
      description: initialData.description || '',
      color: initialData.color,
      frequency_type: initialData.frequency_type,
      frequency_days: initialData.frequency_days,
    } : {
      name: '',
      description: '',
      color: '#9b87f5',
      frequency_type: 'daily',
      frequency_days: [0, 1, 2, 3, 4, 5, 6],
    }
  });
  
  const onSubmit = async (data: HabitFormData) => {
    try {
      if (isEditing && initialData) {
        await updateHabit(initialData.id, data);
        toast({
          title: "Hábito atualizado",
          description: "O hábito foi atualizado com sucesso",
          variant: "success",
        });
      } else {
        await createHabit(data);
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
  
  const colorOptions = [
    { value: '#9b87f5', label: 'Roxo' },
    { value: '#f87171', label: 'Vermelho' },
    { value: '#facc15', label: 'Amarelo' },
    { value: '#4ade80', label: 'Verde' },
    { value: '#60a5fa', label: 'Azul' },
    { value: '#e879f9', label: 'Rosa' },
  ];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do hábito</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Beber água" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva seu hábito..."
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor</FormLabel>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(color => (
                  <div
                    key={color.value}
                    className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-all ${
                      field.value === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => form.setValue('color', color.value)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Selecionar cor ${color.label}`}
                  >
                    {field.value === color.value && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                ))}
                <FormControl>
                  <Input 
                    type="color" 
                    {...field} 
                    className="w-8 h-8 p-0 rounded-full overflow-hidden border-0"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="frequency_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequência</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="specific_days">Dias específicos</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit">
            {isEditing ? 'Salvar alterações' : 'Criar hábito'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HabitForm;
