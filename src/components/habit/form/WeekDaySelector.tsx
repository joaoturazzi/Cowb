
import React from 'react';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { HabitFormData } from './HabitFormTypes';

interface WeekDaySelectorProps {
  form: UseFormReturn<HabitFormData>;
  visible: boolean;
}

const weekDays = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda' },
  { value: 2, label: 'Terça' },
  { value: 3, label: 'Quarta' },
  { value: 4, label: 'Quinta' },
  { value: 5, label: 'Sexta' },
  { value: 6, label: 'Sábado' },
];

export const WeekDaySelector: React.FC<WeekDaySelectorProps> = ({ form, visible }) => {
  if (!visible) return null;

  const watchFrequencyDays = form.watch('frequency_days');
  
  return (
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
  );
};

export default WeekDaySelector;
