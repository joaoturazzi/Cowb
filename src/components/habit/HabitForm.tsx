
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
  FormDescription,
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
import { CheckCircle, Calendar, Flame } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

// Define the form schema with zod
const habitFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').nullable(),
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
  
  const colorOptions = [
    { value: '#9b87f5', label: 'Roxo' },
    { value: '#f87171', label: 'Vermelho' },
    { value: '#facc15', label: 'Amarelo' },
    { value: '#4ade80', label: 'Verde' },
    { value: '#60a5fa', label: 'Azul' },
    { value: '#e879f9', label: 'Rosa' },
    { value: '#f97316', label: 'Laranja' },
    { value: '#14b8a6', label: 'Turquesa' },
    { value: '#8b5cf6', label: 'Violeta' },
  ];

  const weekDays = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda' },
    { value: 2, label: 'Terça' },
    { value: 3, label: 'Quarta' },
    { value: 4, label: 'Quinta' },
    { value: 5, label: 'Sexta' },
    { value: 6, label: 'Sábado' },
  ];

  const watchFrequencyType = form.watch('frequency_type');
  const watchFrequencyDays = form.watch('frequency_days');
  
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
        
        <Tabs defaultValue="color" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="color">Cor</TabsTrigger>
            <TabsTrigger value="frequency">Frequência</TabsTrigger>
          </TabsList>
          <TabsContent value="color" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escolha uma cor</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(color => (
                      <div
                        key={color.value}
                        className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition-all ${
                          field.value === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
                        }`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => form.setValue('color', color.value)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Selecionar cor ${color.label}`}
                      >
                        {field.value === color.value && (
                          <CheckCircle className="h-5 w-5 text-white" />
                        )}
                      </div>
                    ))}
                  </div>
                  <FormDescription>
                    Esta cor será usada para identificar seu hábito
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="frequency" className="space-y-4 pt-4">
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
                  <FormDescription>
                    {watchFrequencyType === 'daily' && (
                      <div className="flex items-center gap-1 text-sm">
                        <Flame className="h-4 w-4 text-orange-500" /> 
                        <span>Hábitos diários acumulam sequências mais rapidamente</span>
                      </div>
                    )}
                    {watchFrequencyType === 'weekly' && "Você precisa completar este hábito uma vez por semana"}
                    {watchFrequencyType === 'specific_days' && "Selecione os dias específicos abaixo"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {watchFrequencyType === 'specific_days' && (
              <FormField
                control={form.control}
                name="frequency_days"
                render={() => (
                  <FormItem>
                    <FormLabel>Selecione os dias</FormLabel>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {weekDays.map((day) => (
                        <div key={day.value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`day-${day.value}`}
                            checked={watchFrequencyDays.includes(day.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                form.setValue('frequency_days', [...watchFrequencyDays, day.value].sort());
                              } else {
                                form.setValue('frequency_days', watchFrequencyDays.filter(d => d !== day.value));
                              }
                            }}
                          />
                          <label 
                            htmlFor={`day-${day.value}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {day.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormDescription>
                      Seu hábito será rastreado apenas nos dias selecionados
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </TabsContent>
        </Tabs>
        
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
