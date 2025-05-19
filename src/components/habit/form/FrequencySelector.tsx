
import React from 'react';
import { Calendar, Flame } from 'lucide-react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { HabitFormData } from './HabitFormTypes';

interface FrequencySelectorProps {
  form: UseFormReturn<HabitFormData>;
}

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({ form }) => {
  const watchFrequencyType = form.watch('frequency_type');

  return (
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
  );
};

export default FrequencySelector;
